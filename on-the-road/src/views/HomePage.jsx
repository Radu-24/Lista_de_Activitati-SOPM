export default function HomePage({ stats }) {
  return (
    <div className="page-grid">
      {/* ================= STATISTICI ================= */}
      <section className="page-card page-card-primary">
        <div className="page-card-header">
          <h2>Statistici rapide</h2>
          <p>Vezi cum stai cu activitățile tale</p>
        </div>

        <div className="home-stats-grid home-stats-grid-4plus1">
          <div className="home-stat-card home-stat-upcoming">
            <p className="home-stat-label">Urmează</p>
            <p className="home-stat-value">{stats.upcoming}</p>
          </div>

          <div className="home-stat-card home-stat-overdue">
            <p className="home-stat-label">Restante</p>
            <p className="home-stat-value">{stats.overdue}</p>
          </div>

          <div className="home-stat-card home-stat-completed">
            <p className="home-stat-label">Completate</p>
            <p className="home-stat-value">{stats.completed}</p>
          </div>

          <div className="home-stat-card home-stat-canceled">
            <p className="home-stat-label">Anulate</p>
            <p className="home-stat-value">{stats.canceled}</p>
          </div>

          {/* TOTAL – rând complet */}
          <div className="home-stat-card home-stat-total-wide">
            <p className="home-stat-label">Total</p>
            <p className="home-stat-value">{stats.total}</p>
          </div>
        </div>
      </section>

      {/* ================= ACTIVITĂȚI RECENTE ================= */}
      <section className="page-card page-card-secondary">
        <div className="page-card-header">
          <h2>Activități recente</h2>
          <p>Ultimele task-uri adăugate</p>
        </div>

        <div className="home-empty-block">
          În curând vei vedea aici o listă inteligentă a ultimelor activități.
        </div>
      </section>
    </div>
  );
}
