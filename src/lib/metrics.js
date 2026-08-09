const METRIC_MATCHERS = {
  sessions: (label) => /session/i.test(label),
  leads: (label) => /lead/i.test(label),
  bookings: (label) => /booking/i.test(label),
  winrate: (label) => /win rate/i.test(label) && !/adjusted/i.test(label),
};

const PREFERRED = {
  leads: (label) => /lead/i.test(label) && /total/i.test(label),
  bookings: (label) => /booking/i.test(label) && /total/i.test(label),
  winrate: (label) => /^win rate$/i.test(label.trim()),
};

export function extractMetric(report, type) {
  if (!report.kpis?.length) return null;
  const preferred = PREFERRED[type];
  let candidates = preferred ? report.kpis.filter((k) => preferred(k.label)) : [];
  if (!candidates.length) candidates = report.kpis.filter((k) => METRIC_MATCHERS[type](k.label));
  if (!candidates.length) return null;
  const num = parseFloat(String(candidates[0].value).replace(/[^0-9.-]/g, ''));
  return Number.isNaN(num) ? null : num;
}

export function buildTrendSeries(reports) {
  return {
    sessions: reports.map((r) => extractMetric(r, 'sessions')),
    leads: reports.map((r) => extractMetric(r, 'leads')),
    bookings: reports.map((r) => extractMetric(r, 'bookings')),
    winrate: reports.map((r) => extractMetric(r, 'winrate')),
  };
}
