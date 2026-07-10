import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import "../styles/Sidebar.css";

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "admin";
  const { theme, toggleTheme } = useTheme();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setShowLogoutConfirm(false);
    };

    if (showLogoutConfirm) {
      window.addEventListener("keydown", onKey);
    }

    return () => window.removeEventListener("keydown", onKey);
  }, [showLogoutConfirm]);

  return (
    <>
      {/* MOBILE OVERLAY */}
      <div
        className={`sidebar-overlay ${open ? "show" : ""}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${open ? "open" : ""}`}>
        {/* HEADER */}
        <div className="sidebar-header">
          <div className="brand">
            <div className="brand-logo">T</div>
            <span className="brand-name">TaskFlow</span>
          </div>

          <button className="close-btn" onClick={onClose} aria-label="Close menu">
            ✕
          </button>
        </div>

        {/* NAV */}
        <nav className="sidebar-wrapper">
          <div className="sidebar-nav navlinks">
            <NavLink to="/" end className="nav-link">
              Overview
            </NavLink>

            <NavLink to="/tasks" className="nav-link">
              {isAdmin ? "All Tasks" : "My Tasks"}
            </NavLink>

            <NavLink to="/deadlines" className="nav-link">
              Deadline Watch
            </NavLink>

            <NavLink to="/pending" className="nav-link">
              Pending Tasks
            </NavLink>

            {isAdmin && (
              <NavLink to="/users" className="nav-link">
                Team &amp; Access
              </NavLink>
            )}

            {isAdmin && (
              <NavLink to="/employee-stats" className="nav-link">
                Employee Stats
              </NavLink>
            )}
          </div>

          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === "dark" ? "🌙 Dark mode" : "☀️ Light mode"}
          </button>
        </nav>

        {/* FOOTER */}
        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span
              className={`user-role ${
                user?.role === "admin" ? "admin" : ""
              }`}
            >
              {user?.role}
            </span>
          </div>

          <button
            className="logout-btn"
            onClick={() => setShowLogoutConfirm(true)}
          >
            Sign out
          </button>
        </div>
      </aside>

      {showLogoutConfirm && (
        <div
          className="modal-overlay"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <h3>Sign out?</h3>
            <p>
              Are you sure you want to sign out of your account?
            </p>

            <div className="modal-actions">
              <button
                className="modal-btn secondary"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>

              <button
                className="modal-btn danger"
                onClick={logout}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}