import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";

// Logged-in food partner ko uski apni profile page par bhej deta hai
export default function Dashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        api.get("/auth/me")
            .then(({ data }) => {
                if (data.role === "foodPartner") navigate(`/food-partner/${data.foodPartner._id}`, { replace: true });
                else navigate("/food-partner/login", { replace: true });
            })
            .catch(() => navigate("/food-partner/login", { replace: true }));
    }, [navigate]);

    return <div className="reels-empty">Loading dashboard...</div>;
}
