import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout.jsx";
import api, { errorMessage } from "../../api/axios.js";

export default function FoodPartnerLogin() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        setError("");
        setLoading(true);
        try {
            await api.post("/auth/food-partner/login", {
                email: form.get("email"),
                password: form.get("password"),
            });
            navigate("/food-partner/dashboard");
        } catch (err) {
            setError(errorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout
            title="Partner login"
            subtitle="Manage your food reels"
            footer={
                <>
                    New partner? <Link to="/food-partner/register">Create account</Link>
                    <br />
                    Normal user? <Link to="/user/login">User login</Link>
                </>
            }
        >
            <form className="auth-form" onSubmit={handleSubmit}>
                <label>
                    Email
                    <input name="email" type="email" placeholder="business@example.com" required />
                </label>
                <label>
                    Password
                    <input name="password" type="password" placeholder="••••••" required />
                </label>
                {error && <p className="form-error">{error}</p>}
                <button className="btn btn-primary" disabled={loading}>
                    {loading ? "Signing in..." : "Sign in"}
                </button>
            </form>
        </AuthLayout>
    );
}
