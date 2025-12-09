import { useState, useMemo, useContext } from "react";
import { TasksContext } from "../../context/TasksContext";
import HomePage from "../../views/HomePage";
import TasksPage from "../../views/TasksPage";
import CalendarPage from "../../views/CalendarPage";

const PAGES = {
  HOME: "home",
  TASKS: "tasks",
  CALENDAR: "calendar",
};

export default function AppShell() {
  const [activePage, setActivePage] = useState(PAGES.HOME);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const { tasks } = useContext(TasksContext);

  const stats = useMemo(() => {
    const s = {
      total: tasks.length,
      upcoming: 0,
      overdue: 0,
      completed: 0,
      canceled: 0,
    };

    for (const t of tasks) {
      if (t.status === "upcoming") s.upcoming++;
      if (t.status === "overdue") s.overdue++;
      if (t.status === "completed") s.completed++;
      if (t.status === "canceled") s.canceled++;
    }
    return s;
  }, [tasks]);

  return (
    <div className="app-bg-animated">
      <div className="app-orbit-layer" />
      <div className="app-orbit-layer app-orbit-layer-2" />
      <div className="app-orbit-layer app-orbit-layer-3" />

      <div className="app-shell-root">
        {/* --- SIDEBAR --- */}
        <aside
          className={
            sidebarCollapsed
              ? "app-sidebar app-sidebar-collapsed"
              : "app-sidebar"
          }
        >
          <div className="sidebar-header">
            <button
              className="sidebar-logo-pill"
              onClick={() => setActivePage(PAGES.HOME)}
            >
              <span className="sidebar-logo-icon">🦺</span>
              {!sidebarCollapsed && (
                <span className="sidebar-logo-text">On The Road</span>
              )}
            </button>

            <button
              className="sidebar-toggle-pill"
              onClick={() => setSidebarCollapsed((v) => !v)}
            >
              {sidebarCollapsed ? "›" : "‹"}
            </button>
          </div>

          <nav className="sidebar-nav">
            <NavPill
              label="Acasă"
              icon="🏠"
              active={activePage === PAGES.HOME}
              onClick={() => setActivePage(PAGES.HOME)}
              collapsed={sidebarCollapsed}
            />

            <NavPill
              label="Task-uri"
              icon="📝"
              active={activePage === PAGES.TASKS}
              onClick={() => setActivePage(PAGES.TASKS)}
              collapsed={sidebarCollapsed}
              badge={stats.total}
            />

            <NavPill
              label="Calendar"
              icon="📅"
              active={activePage === PAGES.CALENDAR}
              onClick={() => setActivePage(PAGES.CALENDAR)}
              collapsed={sidebarCollapsed}
              badge={stats.upcoming}
            />
          </nav>

          {!sidebarCollapsed && (
            <div className="sidebar-footer">
              <p className="sidebar-footer-title">Status activități</p>

              <div className="sidebar-footer-row">
                <span>Urmează</span>
                <span className="sidebar-footer-pill sidebar-footer-pill-upcoming">
                  {stats.upcoming}
                </span>
              </div>

              <div className="sidebar-footer-row">
                <span>Restante</span>
                <span className="sidebar-footer-pill sidebar-footer-pill-overdue">
                  {stats.overdue}
                </span>
              </div>

              <div className="sidebar-footer-row">
                <span>Completate</span>
                <span className="sidebar-footer-pill sidebar-footer-pill-completed">
                  {stats.completed}
                </span>
              </div>
            </div>
          )}
        </aside>

        {/* --- MAIN CONTENT --- */}
        <div className="app-main-column">
          <header className="app-topbar">
            <div className="topbar-left">
              <h1 className="topbar-title">
                {activePage === PAGES.HOME && "Panou general"}
                {activePage === PAGES.TASKS && "Administrare activități"}
                {activePage === PAGES.CALENDAR && "Calendar activități"}
              </h1>
              <p className="topbar-subtitle">
                Interfață industrială hi-vis cu vizibilitate maximă.
              </p>
            </div>

            <div className="topbar-right">
              <div className="topbar-pill topbar-pill-soft">
                <span className="topbar-pill-dot" />
                {stats.total} activități
              </div>
            </div>
          </header>

          <main className="app-main-content">
            <PageTransition key={activePage}>
              {activePage === PAGES.HOME && <HomePage stats={stats} />}
              {activePage === PAGES.TASKS && <TasksPage />}
              {activePage === PAGES.CALENDAR && <CalendarPage />}
            </PageTransition>
          </main>
        </div>
      </div>
    </div>
  );
}

/* --- HELPER COMPONENTS --- */

function NavPill({ label, icon, active, onClick, collapsed, badge }) {
  return (
    <button
      className={active ? "nav-pill nav-pill-active" : "nav-pill"}
      onClick={onClick}
    >
      <span className="nav-pill-icon">{icon}</span>

      {!collapsed && (
        <>
          <span className="nav-pill-label">{label}</span>
          {badge > 0 && (
            <span className="nav-pill-badge">{badge}</span>
          )}
        </>
      )}
    </button>
  );
}

function PageTransition({ children }) {
  return <div className="page-transition">{children}</div>;
}
