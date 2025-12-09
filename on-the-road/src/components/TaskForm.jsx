import { useState, useContext } from "react";
import { TasksContext } from "../context/TasksContext";

export default function TaskForm() {
  const { addTask } = useContext(TasksContext);

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    priority: "2",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    addTask({
      id: crypto.randomUUID(),
      title: form.title,
      description: form.description,
      date: form.date,
      status: "upcoming",
      priority: Number(form.priority),
    });

    setForm({ title: "", description: "", date: "", priority: "2" });
  };

  const priorityLabel =
    form.priority === "1"
      ? "Importantă"
      : form.priority === "3"
      ? "Scăzută"
      : "Mediu";

  return (
    <form className="tf-form tf-form-advanced" onSubmit={handleSubmit}>
      <div className="tf-form-header">
        <div className="tf-form-title-block">
          <span className="tf-form-icon">🦺</span>
          <div>
            <h3 className="tf-form-title">Configurare activitate</h3>
            <p className="tf-form-subtitle">
              Completează detaliile necesare pentru o activitate de drum.
            </p>
          </div>
        </div>
        <div className="tf-form-summary">
          <span className="tf-form-summary-label">Prioritate curentă</span>
          <span className={`tf-priority-chip tf-priority-${form.priority}`}>
            {priorityLabel}
          </span>
        </div>
      </div>

      <div className="tf-grid">
        <div className="tf-field tf-field-full">
          <label className="tf-label">
            Titlu activitate
            <span className="tf-label-pill">obligatoriu</span>
          </label>
          <input
            required
            className="tf-input"
            placeholder="Ex: Revizie mașină, schimb ulei, alimentare..."
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <p className="tf-help">
            Folosește un titlu scurt și clar — va apărea în listă și în calendar.
          </p>
        </div>

        <div className="tf-field tf-field-full">
          <label className="tf-label">Descriere</label>
          <textarea
            className="tf-textarea"
            placeholder="Detalii, locație, documente necesare, persoane de contact..."
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
          <p className="tf-help">
            Nu este obligatorie, dar ajută la briefing-ul din teren.
          </p>
        </div>

        <div className="tf-field">
          <label className="tf-label">Data & ora</label>
          <input
            type="datetime-local"
            required
            className="tf-input"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <p className="tf-help">Stabilește când ar trebui abordată activitatea.</p>
        </div>

        <div className="tf-field">
          <label className="tf-label">Prioritate</label>
          <div className="tf-select-wrapper">
            <select
              className="tf-select"
              value={form.priority}
              onChange={(e) =>
                setForm({ ...form, priority: e.target.value })
              }
            >
              <option value="1">Importantă</option>
              <option value="2">Mediu</option>
              <option value="3">Scăzută</option>
            </select>
            <span className="tf-select-indicator">▾</span>
          </div>
          <p className="tf-help">
            „Importantă” pentru aspecte critice (siguranță, legal etc.).
          </p>
        </div>
      </div>

      <div className="tf-footer tf-footer-split">
        <div className="tf-footer-note">
          <span className="tf-footer-dot" />
          Activitatea va apărea în tab-urile <strong>Tasks</strong> și{" "}
          <strong>Calendar</strong>.
        </div>

        <button type="submit" className="pill-button pill-button-primary">
          <span>Salvează activitatea</span>
        </button>
      </div>
    </form>
  );
}
