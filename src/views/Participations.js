import { useEffect, useRef, useState } from "react";
import { subscribeToMyParticipations } from "../services/Firebase";
import Template from "../widgets/TemplatePage";
import ParticipationCard from "../components/ParticipationCard";
import { Link } from "react-router-dom";

const MyParticipations = (props) => {
    const [req, setReq] = useState([]);
    const reqRef = useRef();

    reqRef.current = req;

    useEffect(() => {
        subscribeToMyParticipations(
            props.user.uid,
            (data, id) => {
                setReq([...reqRef.current, { ...data, id: id }]);
            },
            (id) => {
                setReq(reqRef.current.filter((item) => item.id != id));
            }
        );
    }, []);

    return (
        <Template
            user={props.user}
            setUser={props.setUser}
            child={
                <div className="request">
                    <h2>My Participations</h2>
                    {req.length == 0 ? (
                        <div className="input">
                            <h3>You didn't join any event !</h3>
                            <p>
                                <Link to={"/"} className={""}>
                                    Join an Event
                                </Link>
                            </p>
                        </div>
                    ) : (
                        req.map((ev) => (
                            <ParticipationCard
                                ev={ev}
                                user={props.user}
                                venues={props.venues}
                                key={ev.id}
                            />
                        ))
                    )}
                </div>
            }
        />
    );
};

export default MyParticipations;
