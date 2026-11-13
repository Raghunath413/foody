import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import ReelFeed from "../../components/ReelFeed.jsx";
import BottomNav from "../../components/BottomNav.jsx";

export default function Saved() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/food/save")
            .then(({ data }) => setItems(data.savedFoods))
            .catch((err) => {
                if (err?.response?.status === 401) navigate("/user/login");
            })
            .finally(() => setLoading(false));
    }, [navigate]);

    return (
        <>
            {loading ? (
                <div className="reels-empty">Loading saved reels...</div>
            ) : (
                <ReelFeed
                    items={items}
                    setItems={setItems}
                    emptyMessage="You haven't saved any reels yet."
                    onUnsave={(id) => setItems((prev) => prev.filter((f) => f._id !== id))}
                />
            )}
            <BottomNav />
        </>
    );
}
