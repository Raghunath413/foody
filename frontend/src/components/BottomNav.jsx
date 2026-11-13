import { NavLink, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import "../styles/reels.css";

export default function BottomNav() {
    const navigate = useNavigate();

    async function logout() {
        await api.get("/auth/user/logout").catch(() => {});
        navigate("/user/login");
    }

    return (
        <nav className="bottom-nav">
            <NavLink to="/" end className="bottom-nav-item">
                <span>🏠</span>
                <small>Home</small>
            </NavLink>
            <NavLink to="/saved" className="bottom-nav-item">
                <span>🔖</span>
                <small>Saved</small>
            </NavLink>
            <button className="bottom-nav-item" onClick={logout}>
                <span>🚪</span>
                <small>Logout</small>
            </button>
        </nav>
    );
}
