import { deltaTone, formatDelta } from '../lib/format.js';

function DeltaChip({ value, tag }) {
  const text = formatDelta(value);
  if (!text) return null;
  return (
    <span className={`delta-chip ${deltaTone(value)}`}>
      {text} <span className="tag">{tag}</span>
    </span>
  );
}

export function MetricGrid({ kpis }) {
  if (!kpis?.length) return null;
  return (
    <div className="metrics">
      {kpis.map((k) => (
        <div className="metric-card" key={k.label}>
          <p className="label">{k.label}</p>
          <p className="value">{k.value}</p>
          {(k.wow != null || k.yoy != null) && (
            <div className="deltas">
              <DeltaChip value={k.wow} tag="WoW" />
              <DeltaChip value={k.yoy} tag="YoY" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
