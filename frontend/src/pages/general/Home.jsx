import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import ReelFeed from "../../components/ReelFeed.jsx";
import BottomNav from "../../components/BottomNav.jsx";

export default function Home() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/food")
            .then(({ data }) => setItems(data.foodItems))
            .catch((err) => {
                if (err?.response?.status === 401) {
                    // Food partner login hai to dashboard, warna user login
                    api.get("/auth/me").then(({ data }) =>
                        navigate(data.role === "foodPartner" ? "/food-partner/dashboard" : "/user/login")
                    );
                }
            })
            .finally(() => setLoading(false));
    }, [navigate]);

    return (
        <>
            {loading ? (
                <div className="reels-empty">Loading reels...</div>
            ) : (
                <ReelFeed items={items} setItems={setItems} emptyMessage="No food reels yet. Check back soon!" />
            )}
            <BottomNav />
        </>
    );
}
