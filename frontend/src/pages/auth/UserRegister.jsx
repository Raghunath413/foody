import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout.jsx";
import api, { errorMessage } from "../../api/axios.js";

export default function UserRegister() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        setError("");
        setLoading(true);
        try {
            await api.post("/auth/user/register", {
                fullName: `${form.get("firstName")} ${form.get("lastName")}`.trim(),
                email: form.get("email"),
                password: form.get("password"),
            });
            navigate("/");
        } catch (err) {
            setError(errorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthLayout
            title="Create your account"
            subtitle="Discover food reels near you"
            footer={
                <>
                    Already have an account? <Link to="/user/login">Sign in</Link>
                    <br />
                    Restaurant? <Link to="/food-partner/register">Register as food partner</Link>
                </>
            }
        >
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="two-col">
                    <label>
                        First name
                        <input name="firstName" placeholder="Amar" required />
                    </label>
                    <label>
                        Last name
                        <input name="lastName" placeholder="Gupta" />
                    </label>
                </div>
                <label>
                    Email
                    <input name="email" type="email" placeholder="you@example.com" required />
                </label>
                <label>
                    Password
                    <input name="password" type="password" placeholder="Min 6 characters" minLength={6} required />
                </label>
                {error && <p className="form-error">{error}</p>}
                <button className="btn btn-primary" disabled={loading}>
                    {loading ? "Creating..." : "Sign up"}
                </button>
            </form>
        </AuthLayout>
    );
}
