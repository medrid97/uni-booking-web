import { useState } from "react";
import { joinEvent, leaveEvent } from "../services/Firebase";

const EventCard = (props) => {
    const ev = props.ev;
    const venues = props.venues;
    const user = props.user;

    const [loading, setLoading] = useState(false);

    return (
        <div className="event-card">
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
            <p className="event-joined">
                {ev.attendees.length}/{ev.maxAttendees}
            </p>
            {user.uid != ev.user && !loading && (
                <button
                    className="event-btn"
                    onClick={() => {
                        setLoading(true);

                        if (ev.attendees.includes(user.uid)) {
                            leaveEvent(user.uid, ev.id).then(() => {
                                setLoading(false);
                            });
                        } else {
                            joinEvent(user.uid, ev.id).then(() => {
                                setLoading(false);
                            });
                        }
                    }}
                >
                    {ev.attendees.includes(user.uid) ? "Leave" : "Join"}
                </button>
            )}

            {loading && <button className="event-btn">...</button>}
        </div>
    );
};

export default EventCard;
