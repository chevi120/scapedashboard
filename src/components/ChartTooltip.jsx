export function ChartTooltip({ active, payload, label, valueFormatter }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="viz-tooltip">
      <div className="t-label">{label}</div>
      {payload.map((entry, i) => (
        <div key={i}>{valueFormatter ? valueFormatter(entry) : entry.value}</div>
      ))}
    </div>
  );
}
