import { Link } from "react-router-dom";
import EventCard from "../components/EventCard";
import Template from "../widgets/TemplatePage";

const UnAuth = () => {
    return (
        <div className="unauth column">
            <h2 className={"h"}>👋 Welcome to UniBooking</h2>
            <p className="p">
                Unibooking is an app that allow users to make reservation request for venues within
                the university.
            </p>
            <p className="p">To start using the app, make sure to login first !</p>
            <Link to={"/login"} className="link-btn">
                Login
            </Link>
        </div>
    );
};

const Home = (props) => {
    return !props.user ? (
        <UnAuth />
    ) : (
        <Template
            user={props.user}
            setUser={props.setUser}
            child={
                <div className="home column">
                    <h2>Browse Events</h2>
                    {props.events
                        .filter((ev) => ev.date > new Date().getTime())
                        .sort((a, b) => a.date - b.date)
                        .map((ev) => {
                            return (
                                <EventCard
                                    user={props.user}
                                    venues={props.venues}
                                    ev={ev}
                                    key={ev.id}
                                />
                            );
                        })}
                </div>
            }
        />
    );
};

export default Home;
