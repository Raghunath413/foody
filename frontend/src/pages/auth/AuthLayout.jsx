import "../../styles/auth.css";

export default function AuthLayout({ title, subtitle, children, footer }) {
    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-brand">🍔 Food View</div>
                <h1 className="auth-title">{title}</h1>
                {subtitle && <p className="auth-subtitle">{subtitle}</p>}
                {children}
                {footer && <div className="auth-footer">{footer}</div>}
            </div>
        </div>
    );
}
