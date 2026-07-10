import { useState } from "react";
import Sidebar from "./Sidebar";
import "../styles/PageShell.css";

export default function PageShell({ title, subtitle, actions, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="page-shell">
      {/* SIDEBAR */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* MAIN */}
      <main className="page-main">
        {/* MOBILE HEADER */}
        <div className="mobile-header">
          <button
            className="hamburger"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
        </div>

        {/* PAGE HEADER */}
        <div className="page-header">
          <div className="page-title">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>

          {actions && <div className="page-actions">{actions}</div>}
        </div>

        {children}
      </main>
    </div>
  );
}