import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./views/Home";
import Login from "./views/Login";
import { useEffect, useRef, useState } from "react";
import Signup from "./views/Signup";
import { subscribeToAttendees, subscribeToEvents, subscribeToVenues } from "./services/Firebase";
import Request from "./views/Request";
import ProcessRequests from "./views/ProcessRequests";
import Venues from "./views/Venues";
import MyRequests from "./views/MyRequests";
import MyParticipations from "./views/Participations";

function App() {
    const [user, setUser] = useState(null);

    const [venues, setVenues] = useState([]);
    const [events, setEvents] = useState([]);

    const venRef = useRef();
    const evRef = useRef();

    venRef.current = venues;
    evRef.current = events;

    useEffect(() => {
        subscribeToEvents(
            (data) => {
                setEvents([...evRef.current, { ...data.data(), id: data.id, attendees: [] }]);
                subscribeToAttendees(
                    data.id,
                    (doc) => {
                        evRef.current.find((item) => item.id == data.id).attendees.push(doc.id);
                        setEvents(evRef.current);
                    },
                    (doc) => {
                        evRef.current.find((item) => item.id == data.id).attendees = evRef.current
                            .find((item) => item.id == data.id)
                            .attendees.filter((at) => at != doc.id);
                        setEvents(evRef.current);
                    }
                );
            },
            () => {},
            () => {}
        );

        subscribeToVenues(
            (data) => {
                setVenues([...venRef.current, { ...data.data(), id: data.id }]);
            },
            () => {},
            () => {}
        );
    }, []);

    return (
        <BrowserRouter>
            <div className="app-wrapper">
                <div className="content-wrapper">
                    <Routes>
                        <Route path="login" element={<Login setUser={setUser} />} />
                        <Route path="signup" element={<Signup user={user} />} setUser={setUser} />
                        <Route
                            path="/"
                            element={
                                <Home
                                    events={events}
                                    venues={venues}
                                    user={user}
                                    setUser={setUser}
                                />
                            }
                        />
                        <Route
                            path="request"
                            element={<Request venues={venues} user={user} setUser={setUser} />}
                        />
                        <Route
                            path="my-requests"
                            element={<MyRequests user={user} setUser={setUser} />}
                        />
                        <Route
                            path="my-participation"
                            element={
                                <MyParticipations user={user} venues={venues} setUser={setUser} />
                            }
                        />
                        <Route
                            path="dashboard-venues"
                            element={<Venues venues={venues} user={user} setUser={setUser} />}
                        />
                        <Route
                            path="dashboard-requests"
                            element={
                                <ProcessRequests
                                    venues={venues}
                                    user={user}
                                    events={events}
                                    setUser={setUser}
                                />
                            }
                        />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
}

export default App;
