import { Link } from "react-router-dom";
import AuthLayout from "./AuthLayout.jsx";

export default function ChooseRegister() {
    return (
        <AuthLayout
            title="Join Food View"
            subtitle="Choose how you want to use the app"
            footer={
                <>
                    Already have an account? <Link to="/user/login">Login</Link>
                </>
            }
        >
            <div className="choose-grid">
                <Link className="btn btn-primary" to="/user/register">
                    Register as normal user
                </Link>
                <Link className="btn btn-outline" to="/food-partner/register">
                    Register as food partner
                </Link>
            </div>
        </AuthLayout>
    );
}
