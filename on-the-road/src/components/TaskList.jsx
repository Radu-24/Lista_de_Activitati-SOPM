import { useContext, useMemo } from "react";
import { TasksContext } from "../context/TasksContext";
import TaskItem from "./TaskItem";

export default function TaskList({ tasks: tasksProp }) {
  const { tasks: contextTasks } = useContext(TasksContext);

  // dacă primim tasks ca prop → le folosim pe acelea
  // altfel → folosim contextul (comportamentul vechi)
  const tasks = tasksProp ?? contextTasks ?? [];

  const groups = useMemo(() => {
    const g = {
      overdue: [],
      upcoming: [],
      completed: [],
      canceled: [],
    };

    for (const t of tasks) {
      if (g[t.status]) {
        g[t.status].push(t);
      }
    }

    return g;
  }, [tasks]);

  const isEmpty =
    !tasks.length ||
    Object.values(groups).every((arr) => arr.length === 0);

  if (isEmpty) {
    return (
      <div className="task-empty-state">
        <div className="task-empty-icon">📋</div>
        <h3 className="task-empty-title">Nicio activitate</h3>
        <p className="task-empty-text">
          Nu există activități pentru selecția curentă.
        </p>
      </div>
    );
  }

  return (
    <div className="task-list-scroll">
      <TaskSection title="Restante" code="overdue" tasks={groups.overdue} />
      <TaskSection title="Urmează" code="upcoming" tasks={groups.upcoming} />
      <TaskSection title="Completate" code="completed" tasks={groups.completed} />
      <TaskSection title="Anulate" code="canceled" tasks={groups.canceled} />
    </div>
  );
}

function TaskSection({ title, code, tasks }) {
  if (!tasks.length) return null;

  return (
    <section className={`task-section task-section-${code}`}>
      <header className="task-section-header">
        <span className="task-section-title">{title}</span>
        <span className="task-section-count">{tasks.length}</span>
      </header>

      <div className="task-section-body">
        {tasks.map((t) => (
          <TaskItem key={t.id} task={t} />
        ))}
      </div>
    </section>
  );
}
