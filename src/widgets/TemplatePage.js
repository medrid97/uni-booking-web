import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "./SideBar";

const Template = (props) => {
    const history = useNavigate();

    useEffect(() => {
        if (props.redirect) {
            if (!["/login", "signup", "/"].includes(window.location.pathname) && !props.user) {
                history("/login");
            }
        }
    }, []);

    return (
        <div className="row content-wrapper">
            <SideBar user={props.user} setUser={props.setUser} />
            {props.child}
        </div>
    );
};

export default Template;
