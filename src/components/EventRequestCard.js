import { useState } from "react";
import { acceptEvent, refuseEvent } from "../services/Firebase";

const EventRequestCard = (props) => {
    const ev = props.ev;
    const venues = props.venues;

    const [loading, setLoading] = useState(false);

    function eventsInSameDay() {
        return props.events.filter(
            (item) => item.date == ev.date && item.venue == ev.venue && item.id != ev.id
        );
    }

    return (
        <div className={"event-card"}>
            <h3 className="event-name">{ev.name}</h3>
            <h4 className="event-nfos">
                {venues.find((v) => v.id == ev.venue)
                    ? venues.find((v) => v.id == ev.venue).name
                    : "Loading..."}
                <span> - </span>
                <span>{new Date(ev.date).toDateString()} </span>
                <span>
                    {ev.start.hour}:{ev.start.minute}
                </span>
            </h4>
            <p className="event-description">{ev.description}</p>
            {eventsInSameDay().length != 0 && (
                <div className="danger">
                    There are {eventsInSameDay().length} event(s) happening at the same day in the
                    same venue !
                </div>
            )}
            {loading ? (
                <button className="event-btn">...</button>
            ) : (
                <div className="row">
                    <button
                        className="event-btn"
                        onClick={() => {
                            setLoading(true);
                            acceptEvent(ev);
                        }}
                    >
                        Accept
                    </button>
                    <div style={{ width: "10px" }}></div>
                    <button
                        className="event-btn"
                        onClick={() => {
                            setLoading(true);
                            refuseEvent(ev);
                        }}
                    >
                        Refuse
                    </button>
                </div>
            )}
        </div>
    );
};

export default EventRequestCard;
