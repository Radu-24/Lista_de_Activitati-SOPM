export default function HomePage({ stats }) {
  return (
    <div className="page-grid">
      {/* Card statistici */}
      <section className="page-card page-card-primary">
        <div className="page-card-header">
          <h2>Statistici rapide</h2>
          <p>Vezi cum stai cu activitățile tale</p>
        </div>

        <div className="home-stats-grid">
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

          <div className="home-stat-card">
            <p className="home-stat-label">Total</p>
            <p className="home-stat-value">{stats.total}</p>
          </div>
        </div>
      </section>

      {/* Card listă scurtă */}
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
