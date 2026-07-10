import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import "../styles/Login.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { toggleTheme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      const dest = location.state?.from?.pathname || "/";
      navigate(dest, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to sign in. Check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      {/* LEFT PANEL */}
      <div className="login-left">
        <div className="login-bg" />

        <div className="brand">
          <div className="brand-logo">T</div>
          <span className="brand-name">TaskFlow</span>
        </div>

        <div className="left-content">
          <p className="subtitle">Ops console for shipping teams</p>

          <h1>Every task, every deadline, on one board.</h1>

          <p className="description">
            Admins assign work and track delivery across the team. Employees see
            exactly what's due, and what's about to run out of runway.
          </p>

          <div className="status-list">
            {[
              { label: "To Do", color: "todo" },
              { label: "In Progress", color: "progress" },
              { label: "On Hold", color: "hold" },
              { label: "Delivered", color: "delivered" },
              { label: "Cancelled", color: "cancelled" },
            ].map((s) => (
              <span key={s.label} className="status-item">
                <span className={`dot ${s.color}`} />
                {s.label}
              </span>
            ))}
          </div>

          <button className="login-theme-toggle" onClick={toggleTheme}>
            Toggle theme
          </button>
        </div>

        <div className="footer-text">
          Deadline Watch flags anything due in 3 days or less.
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="login-right">
        {/* MOBILE BRAND LOGO */}
        <div className="mobile-brand">
          <div className="brand-logo">T</div>
          <span className="brand-name">TaskFlow</span>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Sign in</h2>
          <p className="form-subtitle">
            Use the account provided by your admin.
          </p>

          {error && <div className="error-box">{error}</div>}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}