import { groupReportsByMonth, monthLabel } from '../lib/monthly.js';

function Tab({ report, selectedId, onSelect, onEdit, onDelete, readOnly }) {
  return (
    <div
      className={`tab ${report.id === selectedId ? 'active' : ''}`}
      onClick={() => onSelect(report.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(report.id)}
    >
      <span>{report.label}</span>
      {!readOnly && (
        <>
          <span
            className="icon-btn edit"
            title="Edit report"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(report);
            }}
          >
            ✎
          </span>
          <span
            className="icon-btn del"
            title="Delete report"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm(`Delete report "${report.label}"? This cannot be undone.`)) onDelete(report.id);
            }}
          >
            ✕
          </span>
        </>
      )}
    </div>
  );
}

export function Tabs({ reports, selectedId, onSelect, onEdit, onDelete, grouped, readOnly }) {
  const rows = grouped ? groupReportsByMonth(reports) : [{ key: null, weeks: reports }];

  return (
    <div className="tabs-wrap">
      {rows.map(({ key, weeks }) => (
        <div className="tab-row" key={key ?? 'flat'}>
          {key && <span className="tab-row-label">{monthLabel(weeks[0].date)}</span>}
          <div className="tab-row-items">
            {weeks.map((r) => (
              <Tab
                key={r.id}
                report={r}
                selectedId={selectedId}
                onSelect={onSelect}
                onEdit={onEdit}
                onDelete={onDelete}
                readOnly={readOnly}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
