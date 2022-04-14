import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUser } from "../services/Firebase";

const Signup = (props) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState("");

    const nav = useNavigate();

    useEffect(() => {
        if (props.user) {
            nav("/", { replace: true });
        }
    });

    const onSignup = () => {
        setLoading(true);
        setAlert(true);
        createUser(email.trim(), password.trim())
            .then(() => {
                setLoading(false);
                nav("/", { replace: true });
            })
            .catch((e) => {
                setAlert(e.message);
                setLoading(false);
            });
    };

    return loading ? (
        <div className="loading column">
            <div className="spinner"></div>
            <p>Processing your request...</p>
        </div>
    ) : (
        <form className="login column">
            <h1>UniBooking</h1>
            <h2>Sign up</h2>
            <input
                placeholder="Email"
                className="input"
                value={email}
                autoComplete={"user-email"}
                onInput={(e) => {
                    setEmail(e.target.value);
                }}
            />
            <input
                placeholder="Password"
                className="input"
                value={password}
                type={"password"}
                autoComplete={"current-password"}
                onInput={(e) => {
                    setPassword(e.target.value);
                }}
            />
            <Link to={"/login"}>Already have an account ?</Link>
            <button onClick={onSignup}>Sign up</button>
            {alert && <p className="alert">{alert}</p>}
        </form>
    );
};

export default Signup;
