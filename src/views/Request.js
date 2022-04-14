import { useState } from "react";
import Template from "../widgets/TemplatePage";
import { v4 } from "uuid";
import { submitEventRequest } from "../services/Firebase";
import { useNavigate } from "react-router-dom";

const Request = (props) => {
    const [name, setName] = useState("");
    const [activity, setActivity] = useState("");
    const [description, setDescription] = useState("");
    const [attendees, setAttendees] = useState(100);
    const [date, setDate] = useState("");
    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");
    const [venue, setVenue] = useState(props.venues.length != 0 ? props.venues[0].name : "");

    const [loading, setLoading] = useState(false);

    const history = useNavigate();

    function checkAndSubmit() {
        const req = { state: "PENDING" };

        if (name.trim().length < 4) {
            alert("Name is too short (Less than 4)");
            return;
        } else {
            req.name = name.trim();
        }

        if (activity.trim().length < 4) {
            alert("Activity is too short (Less than 4)");
            return;
        } else {
            req.activity = activity.trim();
        }

        if (description.length < 20) {
            alert("Description is too short (Less than 20)");
            return;
        } else {
            req.description = description.trim();
        }

        if (attendees < 5) {
            alert("Minimum number of attendees is 5");
            return;
        } else {
            req.maxAttendees = parseInt(attendees);
        }

        if (!date) {
            alert("Enter a valid date");
            return;
        } else {
            const adate = date.split("-");
            const ldate = new Date(adate[0], adate[1] - 1, adate[2]);

            if (ldate.getTime() < new Date().getTime() + 1000 * 3600 * 24 * 7.5) {
                alert("Event date should be 7 days or more later.");
                return;
            } else {
                req.date = ldate.getTime();
            }
        }

        if (!start) {
            alert("Enter start date !");
            return;
        } else {
            if (!end) {
                alert("Enter end date !");
                return;
            } else {
                const startHM = {
                    hour: parseInt(start.split(":")[0]),
                    minutes: parseInt(start.split(":")[1]),
                };
                const endHM = {
                    hour: parseInt(end.split(":")[0]),
                    minutes: parseInt(end.split(":")[1]),
                };

                if (startHM.hour > endHM.hour) {
                    alert("Invalid Start and End times !");
                    return;
                }

                if (startHM.hour == endHM.hour) {
                    if (startHM.minutes > endHM.minutes) {
                        alert("Invalid Start and End times !");
                        return;
                    }
                }
            }
        }

        const startHM = {
            hour: parseInt(start.split(":")[0]),
            minute: parseInt(start.split(":")[1]),
        };
        const endHM = {
            hour: parseInt(end.split(":")[0]),
            minute: parseInt(end.split(":")[1]),
        };

        req.start = startHM;
        req.end = endHM;
        req.uid = v4();

        req.venue = props.venues.find((v) => v.name == venue).id;
        req.user = props.user.uid;

        setLoading(true);

        submitEventRequest(req)
            .then(() => {
                history("/my-requests");
            })
            .catch(() => {
                setLoading(false);
            });
    }

    return (
        <Template
            user={props.user}
            setUser={props.setUser}
            redirect={true}
            child={
                <div className="column request">
                    <h2>Request an event</h2>
                    {props.venues.length == 0 ? (
                        <div className="input">
                            <h3>No Venues yet ❌ !</h3>
                            <p>
                                Come back later when at least on venue has been added to the
                                database !
                            </p>
                        </div>
                    ) : loading ? (
                        <div className="input">
                            <h3>Just a moment ⏳</h3>
                            <p>Your request is being submitted !</p>
                        </div>
                    ) : (
                        <div className="column">
                            <input
                                className="input"
                                placeholder="Name"
                                value={name}
                                onInput={(e) => {
                                    setName(e.target.value);
                                }}
                            />
                            <input
                                className="input"
                                placeholder="Activity"
                                value={activity}
                                onInput={(e) => {
                                    setActivity(e.target.value);
                                }}
                            />
                            <textarea
                                className="input textarea"
                                placeholder="Description"
                                value={description}
                                onInput={(e) => {
                                    setDescription(e.target.value);
                                }}
                            ></textarea>
                            <input
                                className="input"
                                placeholder="Max attendees"
                                type={"number"}
                                value={attendees}
                                onInput={(e) => {
                                    setAttendees(e.target.value);
                                }}
                            />
                            <div>
                                <label>Date</label>
                                <input
                                    className="input"
                                    type={"date"}
                                    onInput={(e) => {
                                        setDate(e.target.value);
                                    }}
                                />
                            </div>
                            <div>
                                <label>Start time</label>
                                <input
                                    className="input"
                                    type={"time"}
                                    onInput={(e) => {
                                        setStart(e.target.value);
                                    }}
                                />
                            </div>
                            <div>
                                <label>End time</label>
                                <input
                                    className="input"
                                    type={"time"}
                                    onInput={(e) => {
                                        setEnd(e.target.value);
                                    }}
                                />
                            </div>
                            <div>
                                <label>Venue</label>
                                <select
                                    className="input"
                                    onInput={(e) => {
                                        setVenue(e.target.value);
                                    }}
                                >
                                    {props.venues.map((i) => (
                                        <option
                                            key={i.id}
                                            selected={i.name == venue}
                                            value={i.name}
                                        >
                                            {i.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button className="event-btn" onClick={checkAndSubmit}>
                                Submit
                            </button>
                        </div>
                    )}
                </div>
            }
        />
    );
};

export default Request;
