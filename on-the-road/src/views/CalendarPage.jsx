import { useContext, useMemo, useState } from "react";
import { TasksContext } from "../context/TasksContext";
import TaskList from "../components/TaskList";

function isSameDay(dateA, dateB) {
  return (
    new Date(dateA).getFullYear() === dateB.getFullYear() &&
    new Date(dateA).getMonth() === dateB.getMonth() &&
    new Date(dateA).getDate() === dateB.getDate()
  );
}

export default function CalendarPage() {
  const { tasks } = useContext(TasksContext);

  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const daysInMonth = lastDay.getDate();
  const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

  const emptyDays = Array(startOffset).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const allDays = [...emptyDays, ...days];

  const tasksForSelectedDay = useMemo(() => {
    if (!selectedDate) return [];
    return tasks.filter((t) => isSameDay(t.date, selectedDate));
  }, [tasks, selectedDate]);

  return (
    <div className="page-card page-card-calendar">
      <div className="page-card-header">
        <h2>Calendar</h2>
        <p>Vizualizează activități după dată</p>
      </div>

      {/* HEADER */}
      <div className="calendar-header">
        <button
          className="calendar-nav-btn"
          onClick={() => {
            if (month === 0) {
              setMonth(11);
              setYear((y) => y - 1);
            } else {
              setMonth((m) => m - 1);
            }
          }}
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
          onClick={() => {
            if (month === 11) {
              setMonth(0);
              setYear((y) => y + 1);
            } else {
              setMonth((m) => m + 1);
            }
          }}
        >
          ›
        </button>
      </div>

      {/* GRID */}
      <div className="calendar-grid">
        {["L", "Ma", "Mi", "J", "V", "S", "D"].map((d) => (
          <div key={d} className="calendar-day-name">
            {d}
          </div>
        ))}

        {allDays.map((day, i) => {
          const isOut = day === null;
          const cellDate = !isOut ? new Date(year, month, day) : null;

          const isToday = cellDate && isSameDay(cellDate, today);
          const isSelected =
            cellDate && selectedDate && isSameDay(cellDate, selectedDate);

          const hasTasks =
            cellDate && tasks.some((t) => isSameDay(t.date, cellDate));

          return (
            <div
              key={i}
              className={`calendar-cell
                ${isOut ? "calendar-cell-out" : ""}
                ${isToday ? "calendar-cell-today" : ""}
                ${isSelected ? "calendar-cell-selected" : ""}
              `}
              onClick={() => {
                if (!isOut) setSelectedDate(cellDate);
              }}
            >
              {!isOut && (
                <div className="calendar-cell-inner">
                  <div className="calendar-cell-number">{day}</div>
                  {hasTasks && (
                    <span className="calendar-dot calendar-dot-upcoming" />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* TASKS FOR DAY */}
      {selectedDate && (
        <div className="calendar-day-tasks">
          <h3>
            Task-uri pentru{" "}
            {selectedDate.toLocaleDateString("ro-RO", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </h3>

          <div className="calendar-day-tasks-scroll">
            {tasksForSelectedDay.length === 0 ? (
              <p className="calendar-empty">
                Nu există task-uri în această zi.
              </p>
            ) : (
              <TaskList tasks={tasksForSelectedDay} />
            )}
          </div>
        </div>
      )}

      {/* LEGEND */}
      <div className="calendar-legend">
        <span className="calendar-legend-item">
          <span className="calendar-dot calendar-dot-upcoming" />
          Există task-uri
        </span>
      </div>
    </div>
  );
}
