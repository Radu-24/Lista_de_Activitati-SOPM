import { useContext, useMemo } from "react";
import { TasksContext } from "../context/TasksContext";

export default function TaskItem({ task }) {
  const { deleteTask, updateStatus } = useContext(TasksContext);

  const statusLabel = useMemo(() => {
    switch (task.status) {
      case "overdue":
        return "Restant";
      case "upcoming":
        return "Urmează";
      case "completed":
        return "Complet";
      case "canceled":
        return "Anulat";
      default:
        return task.status;
    }
  }, [task.status]);

  const priorityLabel = useMemo(() => {
    switch (task.priority) {
      case 1:
        return "Importantă";
      case 3:
        return "Scăzută";
      default:
        return "Mediu";
    }
  }, [task.priority]);

  const formattedDate = useMemo(() => {
    if (!task.date) return "";
    const d = new Date(task.date);
    if (Number.isNaN(d.getTime())) return task.date;
    return d.toLocaleString("ro-RO", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [task.date]);

  return (
    <article className={`task-card task-card-${task.status}`}>
      <div className="task-card-accent" aria-hidden="true" />

      <header className="task-card-header">
        <div className="task-card-title-group">
          <span className="task-card-dot" />
          <div>
            <h3 className="task-card-title">{task.title}</h3>
            <div className="task-card-subrow">
              <span className="task-status-badge">{statusLabel}</span>
              <span
                className={`task-priority-chip task-priority-${task.priority}`}
              >
                {priorityLabel}
              </span>
            </div>
          </div>
        </div>
      </header>

      {task.description && (
        <p className="task-card-description">{task.description}</p>
      )}

      <div className="task-card-meta">
        <div className="task-card-meta-item">
          <span className="task-card-meta-label">Data</span>
          <span className="task-card-meta-value">{formattedDate}</span>
        </div>
        <div className="task-card-meta-item">
          <span className="task-card-meta-label">Prioritate</span>
          <span className="task-card-meta-value">#{task.priority}</span>
        </div>
      </div>

      <footer className="task-card-footer">
        <div className="task-card-status">
          <span className="task-card-meta-label">Status</span>
          <div className="task-card-select-wrapper">
            <select
              className="task-card-select"
              value={task.status}
              onChange={(e) => updateStatus(task.id, e.target.value)}
            >
              <option value="overdue">Restant</option>
              <option value="upcoming">Urmează</option>
              <option value="completed">Complet</option>
              <option value="canceled">Anulat</option>
            </select>
            <span className="task-card-select-indicator">▾</span>
          </div>
        </div>

        <button
          type="button"
          className="pill-button pill-button-danger-light"
          onClick={() => deleteTask(task.id)}
        >
          Șterge
        </button>
      </footer>
    </article>
  );
}
