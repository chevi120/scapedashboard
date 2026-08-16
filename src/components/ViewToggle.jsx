export function ViewToggle({ mode, onChange }) {
  return (
    <div className="view-toggle">
      <button
        className={`view-toggle-btn ${mode === 'weekly' ? 'active' : ''}`}
        onClick={() => onChange('weekly')}
      >
        Weekly
      </button>
      <button
        className={`view-toggle-btn ${mode === 'monthly' ? 'active' : ''}`}
        onClick={() => onChange('monthly')}
      >
        Monthly
      </button>
    </div>
  );
}
