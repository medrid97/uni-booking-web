import { Link, useNavigate } from "react-router-dom";

const SideBar = (props) => {
    const nav = useNavigate();

    function logOut() {
        nav("/login");
        props.setUser(null);
    }

    return (
        <div className="side-bar column">
            <h2 className="side-title">UniBooking</h2>
            <div className="column nav-section">
                <h3 className="nav-dash">My Space</h3>
                <Link to={"/"} className={"nav-item"}>
                    Home
                </Link>
                <Link to={"/request"} className={"nav-item"}>
                    Make a request
                </Link>
                <Link to={"/my-requests"} className={"nav-item"}>
                    My requests
                </Link>
                <Link to={"/my-participation"} className={"nav-item"}>
                    My participations
                </Link>
            </div>
            {props.user && props.user.isSuper && (
                <div className="column nav-section">
                    <h3 className="nav-dash">Manage</h3>
                    <Link to={"/dashboard-venues"} className={"nav-item"}>
                        Venues
                    </Link>
                    <Link to={"/dashboard-requests"} className={"nav-item"}>
                        Requests
                    </Link>
                </div>
            )}
            <p className="nav-item disconnect" onClick={logOut}>
                Log out
            </p>
        </div>
    );
};

export default SideBar;
