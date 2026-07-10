import { useState } from "react";
import "../styles/EmployeeStatCard.css";
import EmployeeDetailModal from "./EmployeeDetailModal";

const MINI_STATS = [
  { key: "todo", label: "To Do", color: "todo" },
  { key: "in-progress", label: "In Progress", color: "progress" },
  { key: "hold", label: "On Hold", color: "hold" },
  { key: "delivered", label: "Delivered", color: "delivered" },
  { key: "cancelled", label: "Cancelled", color: "cancelled" },
];

export default function EmployeeStatCard({ employee }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="employee-card" onClick={() => setOpen(true)}>
        {/* HEADER */}
        <div className="employee-header">
          <div className="employee-info">
            <div className="employee-name">{employee.name}</div>
            <div className="employee-email mono">{employee.email}</div>
            {employee.department && (
              <div className="employee-dept">{employee.department}</div>
            )}
          </div>

          <div className="employee-projects">
            <div className="project-count mono">{employee.projects}</div>
            <div className="project-label">Projects</div>
          </div>
        </div>

        {/* MINI STATS */}
        <div className="employee-stats">
          {MINI_STATS.map((s) => (
            <div key={s.key} className={`mini-stat ${s.color}`}>
              <div className="mini-stat-bar" />
              <div className="mini-stat-value mono">
                {employee[s.key] ?? 0}
              </div>
              <div className="mini-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="employee-footer">
          <span className="mono">{employee.total}</span>{" "}
          task{employee.total === 1 ? "" : "s"} total
        </div>
      </div>

      {open && (
          <EmployeeDetailModal
            employee={employee}
            onClose={() => setOpen(false)}
          />
      )}
    </>
  );
}