import { useEffect, useState } from "react";
import PageShell from "../components/PageShell";
import UserFormModal from "../components/UserFormModal";
import api from "../api/axios";
import "../styles/Users.css";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (form, userId) => {
    if (userId) {
      await api.put(`/users/${userId}`, form);
    } else {
      await api.post("/users", form);
    }
  };

  const handleDelete = async (u) => {
    if (!window.confirm(`Delete ${u.name}? This cannot be undone.`)) return;
    try {
      await api.delete(`/users/${u._id}`);
      setUsers((list) => list.filter((x) => x._id !== u._id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <PageShell
      title="Team & Access"
      subtitle="Create admin and employee accounts, and manage who can log in."
      actions={
        <button
          className="primary-btn"
          onClick={() => {
            setEditingUser(null);
            setShowForm(true);
          }}
        >
          + New user
        </button>
      }
    >
      <div className="users-panel">
        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                {["Name", "Email", "Role", "Department", "Status", ""].map(
                  (h) => (
                    <th key={h}>{h}</th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan={6} className="empty-state">
                    No users yet.
                  </td>
                </tr>
              )}

              {users.map((u) => (
                <tr key={u._id}>
                  <td data-label="Name">{u.name}</td>
                  <td data-label="Email" className="mono">
                    {u.email}
                  </td>
                  <td data-label="Role">
                    <span
                      className={`role ${
                        u.role === "admin" ? "admin" : ""
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td data-label="Department">
                    {u.department || "—"}
                  </td>
                  <td data-label="Status">
                    <span
                      className={`status ${
                        u.isActive ? "active" : "inactive"
                      }`}
                    >
                      {u.isActive ? "Active" : "Deactivated"}
                    </span>
                  </td>
                  <td data-label="Actions">
                    <div className="action-buttons">
                      <button
                        className="icon-btn"
                        onClick={() => {
                          setEditingUser(u);
                          setShowForm(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="icon-btn danger"
                        onClick={() => handleDelete(u)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <UserFormModal
          user={editingUser}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            load();
          }}
          onSubmit={handleSubmit}
        />
      )}
    </PageShell>
  );
}