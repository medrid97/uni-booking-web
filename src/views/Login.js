import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authUser } from "../services/Firebase";

const Login = (props) => {
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

    const onLogin = () => {
        setLoading(true);
        setAlert(true);
        authUser(email, password)
            .then((res) => {
                props.setUser(res.data());
                setLoading(false);
                nav("/", { replace: true });
            })
            .catch((e) => {
                setLoading(false);
                setAlert(e.message);
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
            <h2>Login</h2>
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
            <Link to={"/signup"}>No Account yet ?</Link>
            <button onClick={onLogin}>Login</button>
            {alert && <p className="alert">{alert}</p>}
        </form>
    );
};

export default Login;
