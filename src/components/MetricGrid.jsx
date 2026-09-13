import { deltaTone } from '../lib/format.js';

function DeltaChip({ value, tag }) {
  if (value === null || value === undefined || value === '') return null;
  const num = Number(value);
  if (Number.isNaN(num)) return null;
  const tri = num > 0 ? '▲' : num < 0 ? '▼' : '●';
  const sign = num > 0 ? '+' : '';
  return (
    <span className={`delta-chip ${deltaTone(value)}`}>
      <span className="tri">{tri}</span> {sign}{num}% <span className="tag">{tag}</span>
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
