import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { addVenue } from "../services/Firebase";
import Template from "../widgets/TemplatePage";

const Venues = (props) => {
    const [name, setName] = useState("");
    const [activity, setActivity] = useState("");
    const [capacity, setCapacity] = useState(30);
    const [surface, setSurface] = useState(20);

    const [loading, setLoading] = useState(false);

    const nav = useNavigate();

    function add() {
        const venue = { id: v4() };

        if (name.length < 4) {
            alert("Name is too short ! (Less than 4 names)");
            return;
        } else {
            venue.name = name;
        }

        if (activity.length < 4) {
            alert("Activity is too short ! (Less than 4 names)");
            return;
        } else {
            venue.activity = activity;
        }

        if (capacity < 10) {
            alert("Capacity is too low ! (Less than 10)");
            return;
        } else {
            venue.capacity = parseInt(capacity);
        }

        if (surface < 20) {
            alert("Surface is too low ! (Less than 20)");
            return;
        } else {
            venue.surface = parseInt(surface);
        }

        setLoading(true);

        addVenue(venue).then(() => {
            setActivity("");
            setCapacity(30);
            setSurface(20);
            setName("");
            setLoading(false);
        });
    }

    useEffect(() => {
        if (!props.user.isSuper) {
            nav("/");
        }
    });

    return (
        <Template
            user={props.user}
            redirect={true}
            child={
                <div className="request">
                    <h2>Manage Venues</h2>
                    <h3>Add Venue</h3>
                    {loading ? (
                        <button className="event-btn">Submitting ...</button>
                    ) : (
                        <div className="column input">
                            <input
                                className="input"
                                placeholder="name"
                                value={name}
                                onInput={(e) => {
                                    setName(e.target.value);
                                }}
                            ></input>
                            <input
                                className="input"
                                placeholder="activity"
                                value={activity}
                                onInput={(e) => {
                                    setActivity(e.target.value);
                                }}
                            ></input>
                            <input
                                className="input"
                                placeholder="capacity"
                                type={"number"}
                                value={capacity}
                                onInput={(e) => {
                                    setCapacity(e.target.value);
                                }}
                            ></input>
                            <input
                                className="input"
                                placeholder="surface"
                                type={"number"}
                                value={surface}
                                onInput={(e) => {
                                    setSurface(e.target.value);
                                }}
                            ></input>
                            <button className="event-btn" onClick={add}>
                                Add
                            </button>
                        </div>
                    )}
                    <div className="column">
                        <h3>List</h3>
                        {props.venues.map((v) => (
                            <div key={v.id} className={"input"}>
                                <h3 className="venue-name">{v.name}</h3>
                                <h5 className="event-nfos">Preferred activity: {v.activity}</h5>
                                <h5 className="event-nfos">
                                    Maximum Capacity: {v.capacity} persons
                                </h5>
                                <h5 className="event-nfos">Surface: {v.surface} m²</h5>
                            </div>
                        ))}
                    </div>
                </div>
            }
        />
    );
};

export default Venues;
