import { useEffect, useState } from "react";
import PageShell from "../components/PageShell";
import TaskTable from "../components/TaskTable";
import TaskDetailModal from "../components/TaskDetailModal";
import api from "../api/axios";

export default function PendingTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailTaskId, setDetailTaskId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tasks");
      const pending = res.data.filter(
        (t) =>
          t.status !== "delivered" &&
          t.status !== "cancelled"
      );
      setTasks(pending);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <PageShell
      title="Pending Tasks"
      subtitle="All tasks that are currently in progress, on hold, or waiting to be started."
    >
      <TaskTable
        tasks={tasks}
        loading={loading}
        onRowClick={(task) => setDetailTaskId(task._id)}
        emptyLabel="No pending tasks 🎉"
      />

      {detailTaskId && (
        <TaskDetailModal
          taskId={detailTaskId}
          onClose={() => setDetailTaskId(null)}
        />
      )}
    </PageShell>
  );
}