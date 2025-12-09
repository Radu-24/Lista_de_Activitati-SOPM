import { useContext, useState } from "react";
import { TasksContext } from "../context/TasksContext";

export default function CalendarPage() {
  const { tasks } = useContext(TasksContext);

  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const daysInMonth = lastDay.getDate();
  const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

  const emptyDays = [...Array(startOffset)].map(() => "");
  const days = [...Array(daysInMonth)].map((_, i) => i + 1);
  const all = [...emptyDays, ...days];

  return (
    <div className="page-card page-card-calendar">
      <div className="page-card-header">
        <h2>Calendar</h2>
        <p>Vizualizează activități după dată</p>
      </div>

      <div className="calendar-header">
        <button
          className="calendar-nav-btn"
          onClick={() => setMonth((m) => (m === 0 ? 11 : m - 1))}
        >
          ‹
        </button>

        <div className="calendar-nav-title">
          {new Date(year, month).toLocaleString("ro-RO", {
            month: "long",
            year: "numeric",
          })}
        </div>

        <button
          className="calendar-nav-btn"
          onClick={() => setMonth((m) => (m === 11 ? 0 : m + 1))}
        >
          ›
        </button>
      </div>

      <div className="calendar-grid">
        {["L", "Ma", "Mi", "J", "V", "S", "D"].map((d) => (
          <div key={d} className="calendar-day-name">
            {d}
          </div>
        ))}

        {all.map((day, i) => {
          const isOut = day === "";
          const isToday =
            !isOut &&
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

          const events =
            !isOut &&
            tasks.filter((t) =>
              t.date.startsWith(
                `${year}-${String(month + 1).padStart(2, "0")}-${String(
                  day
                ).padStart(2, "0")}`
              )
            );

          return (
            <div
              key={i}
              className={`calendar-cell ${isOut ? "calendar-cell-out" : ""} ${
                isToday ? "calendar-cell-today" : ""
              }`}
            >
              <div className="calendar-cell-inner">
                {!isOut && <div className="calendar-cell-number">{day}</div>}

                {events && events.length > 0 && (
                  <div className="calendar-dots">
                    {events.slice(0, 3).map((ev) => (
                      <span
                        key={ev.id}
                        className={`calendar-dot calendar-dot-${ev.status}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="calendar-legend">
        <span className="calendar-legend-item">
          <span className="calendar-dot calendar-dot-upcoming" />
          Urmează
        </span>
        <span className="calendar-legend-item">
          <span className="calendar-dot calendar-dot-overdue" />
          Restant
        </span>
        <span className="calendar-legend-item">
          <span className="calendar-dot calendar-dot-completed" />
          Complet
        </span>
      </div>
    </div>
  );
}
