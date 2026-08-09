export function deltaTone(value) {
  if (value === null || value === undefined || value === '') return 'neutral';
  const num = Number(value);
  if (Number.isNaN(num)) return 'neutral';
  return num > 0 ? 'up' : num < 0 ? 'down' : 'neutral';
}

export function formatDelta(value) {
  if (value === null || value === undefined || value === '') return null;
  const num = Number(value);
  if (Number.isNaN(num)) return null;
  const arrow = num > 0 ? '↑' : num < 0 ? '↓' : '→';
  const sign = num > 0 ? '+' : '';
  return `${arrow} ${sign}${num}%`;
}

export function formatPercent(value, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
  return `${Number(value).toFixed(digits)}%`;
}

export function formatNumber(value) {
  if (value === null || value === undefined) return '—';
  const num = Number(value);
  return Number.isNaN(num) ? String(value) : num.toLocaleString('en-AU');
}
