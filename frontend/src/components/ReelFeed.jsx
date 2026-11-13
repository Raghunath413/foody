import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import "../styles/reels.css";

/**
 * Instagram-reels jaisa vertical feed.
 * Jo video screen par 60%+ dikhe wahi play hoti hai, baaki pause.
 */
export default function ReelFeed({ items, setItems, emptyMessage = "No reels yet.", onUnsave }) {
    const videoRefs = useRef(new Map());
    const [muted, setMuted] = useState(true);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const video = entry.target;
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
                        video.play().catch(() => {});
                    } else {
                        video.pause();
                    }
                });
            },
            { threshold: [0, 0.6, 1] }
        );
        videoRefs.current.forEach((v) => v && observer.observe(v));
        return () => observer.disconnect();
    }, [items]);

    function setVideoRef(id) {
        return (el) => {
            if (el) videoRefs.current.set(id, el);
            else videoRefs.current.delete(id);
        };
    }

    function patch(id, changes) {
        setItems((prev) => prev.map((f) => (f._id === id ? { ...f, ...changes } : f)));
    }

    async function toggleLike(item) {
        // Optimistic update
        patch(item._id, { isLiked: !item.isLiked, likeCount: item.likeCount + (item.isLiked ? -1 : 1) });
        try {
            const { data } = await api.post("/food/like", { foodId: item._id });
            patch(item._id, { isLiked: data.liked, likeCount: data.likeCount });
        } catch {
            patch(item._id, { isLiked: item.isLiked, likeCount: item.likeCount });
        }
    }

    async function toggleSave(item) {
        patch(item._id, { isSaved: !item.isSaved, savesCount: item.savesCount + (item.isSaved ? -1 : 1) });
        try {
            const { data } = await api.post("/food/save", { foodId: item._id });
            patch(item._id, { isSaved: data.saved, savesCount: data.savesCount });
            if (!data.saved && onUnsave) onUnsave(item._id);
        } catch {
            patch(item._id, { isSaved: item.isSaved, savesCount: item.savesCount });
        }
    }

    if (!items.length) {
        return <div className="reels-empty">{emptyMessage}</div>;
    }

    return (
        <div className="reels-container">
            {items.map((item) => (
                <section key={item._id} className="reel">
                    <video
                        ref={setVideoRef(item._id)}
                        className="reel-video"
                        src={item.video}
                        muted={muted}
                        loop
                        playsInline
                        preload="metadata"
                        onClick={() => setMuted((m) => !m)}
                    />

                    <button className="reel-mute" onClick={() => setMuted((m) => !m)} aria-label="Toggle sound">
                        {muted ? "🔇" : "🔊"}
                    </button>

                    <div className="reel-actions">
                        <button className={`reel-action ${item.isLiked ? "active-like" : ""}`} onClick={() => toggleLike(item)}>
                            <span className="icon">{item.isLiked ? "❤️" : "🤍"}</span>
                            <span>{item.likeCount ?? 0}</span>
                        </button>
                        <button className={`reel-action ${item.isSaved ? "active-save" : ""}`} onClick={() => toggleSave(item)}>
                            <span className="icon">{item.isSaved ? "🔖" : "📑"}</span>
                            <span>{item.savesCount ?? 0}</span>
                        </button>
                    </div>

                    <div className="reel-overlay">
                        {item.foodPartner?.name && <p className="reel-partner">@{item.foodPartner.name}</p>}
                        <h3 className="reel-title">{item.name}</h3>
                        {item.description && <p className="reel-description">{item.description}</p>}
                        {item.foodPartner && (
                            <Link className="reel-btn" to={`/food-partner/${item.foodPartner._id || item.foodPartner}`}>
                                Visit store
                            </Link>
                        )}
                    </div>
                </section>
            ))}
        </div>
    );
}
