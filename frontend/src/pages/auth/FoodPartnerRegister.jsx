import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout.jsx";
import api, { errorMessage } from "../../api/axios.js";

export default function FoodPartnerRegister() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        const form = Object.fromEntries(new FormData(e.currentTarget));
        setError("");
        setLoading(true);
        try {
            await api.post("/auth/food-partner/register", form);
            navigate("/food-partner/dashboard");
        } catch (err) {
            setError(errorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout
            title="Partner sign up"
            subtitle="Grow your business with food reels"
            footer={
                <>
                    Already a partner? <Link to="/food-partner/login">Sign in</Link>
                    <br />
                    Just hungry? <Link to="/user/register">Register as user</Link>
                </>
            }
        >
            <form className="auth-form" onSubmit={handleSubmit}>
                <label>
                    Business name
                    <input name="name" placeholder="Tasty Bites" required />
                </label>
                <div className="two-col">
                    <label>
                        Contact name
                        <input name="contactName" placeholder="Amar Gupta" required />
                    </label>
                    <label>
                        Phone
                        <input name="phone" type="tel" placeholder="98765 43210" required />
                    </label>
                </div>
                <label>
                    Address
                    <input name="address" placeholder="Silchar, Assam" required />
                </label>
                <label>
                    Email
                    <input name="email" type="email" placeholder="business@example.com" required />
                </label>
                <label>
                    Password
                    <input name="password" type="password" placeholder="Min 6 characters" minLength={6} required />
                </label>
                {error && <p className="form-error">{error}</p>}
                <button className="btn btn-primary" disabled={loading}>
                    {loading ? "Creating..." : "Create partner account"}
                </button>
            </form>
        </AuthLayout>
    );
}
