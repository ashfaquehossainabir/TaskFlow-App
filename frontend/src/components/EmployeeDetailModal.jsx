import EmployeeTaskChart from "./EmployeeTaskChart";
import "../styles/EmployeeDetailModal.css";

const MINI_STATS = [
  { key: "todo", label: "To Do", color: "todo" },
  { key: "in-progress", label: "In Progress", color: "progress" },
  { key: "hold", label: "On Hold", color: "hold" },
  { key: "delivered", label: "Delivered", color: "delivered" },
  { key: "cancelled", label: "Cancelled", color: "cancelled" },
];

export default function EmployeeDetailModal({ employee, onClose }) {
  return (
    <>
      {/* Overlay */}
      <div className="employee-modal-overlay" onClick={onClose} />

      {/* Modal */}
      <div className="employee-modal">
        {/* Header */}
        <div className="employee-modal-header">
          <div>
            <div className="employee-name">{employee.name}</div>
            <div className="employee-email mono">{employee.email}</div>
            {employee.department && (
              <div className="employee-dept">{employee.department}</div>
            )}
          </div>

          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Project summary */}
        <div className="employee-modal-projects">
          <div className="project-count mono">{employee.projects}</div>
          <div className="project-label">Projects</div>
        </div>

        {/* Stats */}
        <div className="employee-stats modal-stats">
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

        <EmployeeTaskChart employee={employee} />

        {/* Footer */}
        <div className="employee-footer">
          <span className="mono">{employee.total}</span>{" "}
          task{employee.total === 1 ? "" : "s"} total
        </div>
      </div>
    </>
  );
}