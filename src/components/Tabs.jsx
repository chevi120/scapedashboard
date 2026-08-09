export function Tabs({ reports, selectedId, onSelect, onEdit, onDelete }) {
  return (
    <div className="tabs">
      {reports.map((r) => (
        <div
          key={r.id}
          className={`tab ${r.id === selectedId ? 'active' : ''}`}
          onClick={() => onSelect(r.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onSelect(r.id)}
        >
          <span>{r.label}</span>
          <span
            className="icon-btn edit"
            title="Edit report"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(r);
            }}
          >
            ✎
          </span>
          <span
            className="icon-btn del"
            title="Delete report"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`Delete report "${r.label}"? This cannot be undone.`)) onDelete(r.id);
            }}
          >
            ✕
          </span>
        </div>
      ))}
    </div>
  );
}
