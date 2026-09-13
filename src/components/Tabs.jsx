import { useEffect, useMemo, useState } from 'react';
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
  const rows = useMemo(() => (grouped ? groupReportsByMonth(reports) : [{ key: null, weeks: reports }]), [grouped, reports]);

  const selectedMonthKey = useMemo(() => {
    const match = rows.find((row) => row.weeks.some((r) => r.id === selectedId));
    return match ? match.key : rows[rows.length - 1]?.key ?? null;
  }, [rows, selectedId]);

  const [openMonth, setOpenMonth] = useState(selectedMonthKey);

  // Follow the selection to whichever month it lives in (e.g. jumping from
  // the trend chart or after editing a report's date) rather than leaving
  // the accordion open on a now-unrelated month.
  useEffect(() => {
    setOpenMonth(selectedMonthKey);
  }, [selectedMonthKey]);

  if (!grouped) {
    return (
      <div className="tabs-wrap">
        <div className="tab-row-items">
          {reports.map((r) => (
            <Tab key={r.id} report={r} selectedId={selectedId} onSelect={onSelect} onEdit={onEdit} onDelete={onDelete} readOnly={readOnly} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="month-accordion">
      {rows.map(({ key, weeks }) => {
        const isOpen = key === openMonth;
        const hasSelected = weeks.some((r) => r.id === selectedId);
        return (
          <div className={`month-group ${isOpen ? 'open' : ''}`} key={key}>
            <button
              type="button"
              className={`month-header ${hasSelected ? 'has-selected' : ''}`}
              onClick={() => setOpenMonth(isOpen ? null : key)}
              aria-expanded={isOpen}
            >
              <span className="chevron">{isOpen ? '▾' : '▸'}</span>
              <span className="month-name">{monthLabel(weeks[0].date)}</span>
              <span className="week-count">{weeks.length} week{weeks.length !== 1 ? 's' : ''}</span>
            </button>
            {isOpen && (
              <div className="tab-row-items month-weeks">
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
            )}
          </div>
        );
      })}
    </div>
  );
}
