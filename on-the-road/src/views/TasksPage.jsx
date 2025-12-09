import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

export default function TasksPage() {
  return (
    <div className="tasks-layout">
      {/* Coloana stânga – formular */}
      <section className="tasks-column tasks-column-left">
        <div className="page-card page-card-primary tasks-card">
          <div className="page-card-header">
            <h2>Adaugă activitate</h2>
            <p>Completează câmpurile necesare pentru o nouă activitate</p>
          </div>

          <TaskForm />
        </div>
      </section>

      {/* Coloana dreapta – listă activități */}
      <section className="tasks-column tasks-column-right">
        <div className="page-card page-card-secondary tasks-card tasks-list-card">
          <div className="page-card-header">
            <h2>Lista activităților</h2>
            <p>Gestionează activitățile deja create</p>
          </div>

          <TaskList />
        </div>
      </section>
    </div>
  );
}
