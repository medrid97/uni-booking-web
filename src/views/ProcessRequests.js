import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import EventRequestCard from "../components/EventRequestCard";
import { subscribeToRequests } from "../services/Firebase";
import Template from "../widgets/TemplatePage";

const ProcessRequests = (props) => {
    const [events, setEvents] = useState([]);

    const evRef = useRef();
    evRef.current = events;

    const nav = useNavigate();

    useEffect(() => {
        if (!props.user.isSuper) {
            nav("/");
            return;
        }

        subscribeToRequests(
            (data) => {
                setEvents([...evRef.current, { ...data.data(), id: data.id, attendees: [] }]);
            },
            (data) => {
                setEvents(evRef.current.filter((item) => item.id != data.id));
            },
            () => {}
        );
    }, []);

    return (
        <Template
            user={props.user}
            setUser={props.setUser}
            redirect={true}
            child={
                <div className="request">
                    <h2>Manage Event Requests</h2>
                    {evRef.current.length == 0 ? (
                        <div className="input">
                            <h2>All good 👌!</h2>
                            <p>All requests have been managed !</p>
                        </div>
                    ) : (
                        evRef.current.map((ev) => (
                            <EventRequestCard
                                venues={props.venues}
                                ev={ev}
                                key={ev.id}
                                events={props.events}
                            />
                        ))
                    )}
                </div>
            }
        />
    );
};

export default ProcessRequests;
