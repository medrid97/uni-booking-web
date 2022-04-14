import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { subscribeToMyRequests } from "../services/Firebase";
import Template from "../widgets/TemplatePage";

const MyRequests = (props) => {
    const user = props.user;

    const [req, setReq] = useState([]);
    const reqRef = useRef();

    reqRef.current = req;

    useEffect(() => {
        subscribeToMyRequests(
            user.uid,
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
                    <h2>My Requests</h2>
                    {req.length == 0 ? (
                        <div className="input">
                            <h3>You have no requests pending</h3>
                            <p>
                                <Link to={"/request"} className={""}>
                                    Make a request
                                </Link>
                            </p>
                        </div>
                    ) : (
                        <div>
                            {req.map((ev) => (
                                <div key={ev.id} className={"event-card"}>
                                    <h3 className="event-name">{ev.name}</h3>
                                    <p className="event-description">{ev.description}</p>
                                    <span className="event-nfos">Status : Pending...</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            }
        />
    );
};

export default MyRequests;
