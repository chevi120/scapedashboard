import { deltaTone, formatDelta } from '../lib/format.js';

export function StatMini({ label, value, sub, delta }) {
  const deltaText = delta != null ? formatDelta(delta) : null;
  return (
    <div className="mini-stat">
      <p className="label">{label}</p>
      <p className="value">{value}</p>
      {sub && <p className="sub">{sub}</p>}
      {deltaText && <p className={`sub delta-chip ${deltaTone(delta)}`}>{deltaText}</p>}
    </div>
  );
}
