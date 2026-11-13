import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api, { errorMessage } from "../../api/axios.js";
import "../../styles/profile.css";

export default function Profile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [error, setError] = useState("");
    const [playing, setPlaying] = useState(null);

    useEffect(() => {
        Promise.all([api.get(`/food-partner/${id}`), api.get("/auth/me")])
            .then(([p, me]) => {
                setProfile(p.data.foodPartner);
                setIsOwner(me.data.role === "foodPartner" && me.data.foodPartner._id === id);
            })
            .catch((err) => {
                if (err?.response?.status === 401) navigate("/user/login");
                else setError(errorMessage(err));
            });
    }, [id, navigate]);

    async function deleteFood(foodId) {
        if (!window.confirm("Delete this reel?")) return;
        try {
            await api.delete(`/food/${foodId}`);
            setProfile((p) => ({
                ...p,
                foodItems: p.foodItems.filter((f) => f._id !== foodId),
                totalMeals: p.totalMeals - 1,
            }));
        } catch (err) {
            alert(errorMessage(err));
        }
    }

    async function logout() {
        await api.get("/auth/food-partner/logout").catch(() => {});
        navigate("/food-partner/login");
    }

    if (error) return <div className="reels-empty">{error}</div>;
    if (!profile) return <div className="reels-empty">Loading profile...</div>;

    return (
        <main className="profile-page">
            <section className="profile-header">
                <div className="profile-top">
                    {!isOwner && (
                        <button className="back-link" onClick={() => navigate(-1)}>←</button>
                    )}
                    <div className="profile-avatar">{profile.name?.[0]?.toUpperCase()}</div>
                    <div className="profile-info">
                        <h1 className="profile-name">{profile.name}</h1>
                        <p className="profile-address">📍 {profile.address}</p>
                        {isOwner && <p className="profile-contact">{profile.contactName} • {profile.phone}</p>}
                    </div>
                </div>

                <div className="profile-stats">
                    <div className="stat">
                        <span className="stat-value">{profile.totalMeals}</span>
                        <span className="stat-label">total meals</span>
                    </div>
                    <div className="stat">
                        <span className="stat-value">{profile.totalLikes}</span>
                        <span className="stat-label">total likes</span>
                    </div>
                </div>

                {isOwner && (
                    <div className="profile-owner-actions">
                        <Link to="/create-food" className="btn btn-primary">+ Add food reel</Link>
                        <button className="btn btn-outline" onClick={logout}>Logout</button>
                    </div>
                )}
            </section>

            <hr className="profile-sep" />

            {profile.foodItems.length === 0 ? (
                <p className="profile-empty">
                    {isOwner ? "You haven't uploaded any reels yet." : "No reels from this store yet."}
                </p>
            ) : (
                <section className="profile-grid">
                    {profile.foodItems.map((f) => (
                        <div key={f._id} className="profile-grid-item">
                            <video
                                className="profile-grid-video"
                                src={f.video}
                                muted
                                loop
                                playsInline
                                preload="metadata"
                                onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                                onMouseLeave={(e) => e.currentTarget.pause()}
                                onClick={() => setPlaying(f)}
                            />
                            <div className="grid-caption">
                                <span>{f.name}</span>
                                <span>❤️ {f.likeCount}</span>
                            </div>
                            {isOwner && (
                                <button className="grid-delete" onClick={() => deleteFood(f._id)} aria-label="Delete">
                                    🗑
                                </button>
                            )}
                        </div>
                    ))}
                </section>
            )}

            {playing && (
                <div className="video-modal" onClick={() => setPlaying(null)}>
                    <video src={playing.video} autoPlay controls playsInline onClick={(e) => e.stopPropagation()} />
                    <div className="video-modal-caption">
                        <h3>{playing.name}</h3>
                        {playing.description && <p>{playing.description}</p>}
                    </div>
                </div>
            )}
        </main>
    );
}
