import { extractMetric } from './metrics.js';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function monthKey(dateStr) {
  return dateStr.slice(0, 7); // YYYY-MM
}

export function monthLabel(dateStr) {
  const [y, m] = dateStr.split('-').map(Number);
  return `${MONTH_NAMES[m - 1]} ${y}`;
}

export function groupReportsByMonth(reports) {
  const groups = new Map();
  for (const r of reports) {
    const key = monthKey(r.date);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(r);
  }
  return [...groups.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, weeks]) => ({ key, weeks: [...weeks].sort((a, b) => a.date.localeCompare(b.date)) }));
}

function weekTotalOpportunities(week) {
  return (week.pipeline || []).reduce((sum, s) => sum + (s.count || 0), 0);
}

function stageCount(week, stage) {
  return week.pipeline?.find((s) => s.stage === stage)?.count || 0;
}

function sumPipeline(weeks) {
  const totals = {};
  for (const w of weeks) {
    for (const s of w.pipeline || []) totals[s.stage] = (totals[s.stage] || 0) + (s.count || 0);
  }
  return Object.entries(totals).map(([stage, count]) => ({ stage, count }));
}

function sumChannels(weeks) {
  const agg = {};
  for (const w of weeks) {
    for (const c of w.channels || []) {
      if (!agg[c.name]) agg[c.name] = { name: c.name, opportunities: 0, weightedCvr: 0 };
      agg[c.name].opportunities += c.opportunities || 0;
      agg[c.name].weightedCvr += (c.cvr || 0) * (c.opportunities || 0);
    }
  }
  return Object.values(agg)
    .map((c) => ({
      name: c.name,
      opportunities: c.opportunities,
      cvr: c.opportunities ? Math.round((c.weightedCvr / c.opportunities) * 10) / 10 : 0,
    }))
    .sort((a, b) => b.opportunities - a.opportunities);
}

// Each week's city % is relative to that week's own opportunity count, so a
// straight average would misweight a light week the same as a heavy one.
// Converting back to counts, summing, then renormalizing to the month total
// keeps the rollup consistent with the underlying weekly volumes.
function sumCities(weeks) {
  const agg = {};
  let grandTotal = 0;
  for (const w of weeks) {
    const weekTotal = weekTotalOpportunities(w);
    for (const c of w.cities || []) agg[c.name] = (agg[c.name] || 0) + (c.pct / 100) * weekTotal;
    grandTotal += weekTotal;
  }
  if (!grandTotal) return [];
  return Object.entries(agg)
    .map(([name, count]) => ({ name, pct: Math.round((count / grandTotal) * 1000) / 10 }))
    .sort((a, b) => b.pct - a.pct);
}

function sumProperties(weeks) {
  const agg = {};
  for (const w of weeks) {
    for (const p of w.properties || []) {
      if (!agg[p.name]) agg[p.name] = { name: p.name, active: null, won: null, lost: null };
      for (const key of ['active', 'won', 'lost']) {
        if (p[key] != null) agg[p.name][key] = (agg[p.name][key] || 0) + p[key];
      }
    }
  }
  return Object.values(agg).sort((a, b) => (b.won || 0) - (a.won || 0));
}

export function buildMonthlyReport(key, weeks) {
  const wonTotal = weeks.reduce((s, w) => s + stageCount(w, 'Closed Won'), 0);
  const lostTotal = weeks.reduce((s, w) => s + stageCount(w, 'Closed Lost'), 0);
  const winRate = wonTotal + lostTotal ? Math.round((wonTotal / (wonTotal + lostTotal)) * 1000) / 10 : null;

  const sessions = weeks.reduce((s, w) => s + (extractMetric(w, 'sessions') || 0), 0);
  const leadsValues = weeks.map((w) => extractMetric(w, 'leads'));
  const leadsKnown = leadsValues.some((v) => v != null);
  const leads = leadsKnown ? leadsValues.reduce((s, v) => s + (v || 0), 0) : null;
  const bookings = weeks.reduce((s, w) => s + (extractMetric(w, 'bookings') || 0), 0);
  const opportunities = weeks.reduce((s, w) => s + weekTotalOpportunities(w), 0);

  const kpis = [
    { label: 'Website sessions', value: sessions.toLocaleString('en-AU'), wow: null, yoy: null },
    leadsKnown && { label: 'Total leads', value: leads.toLocaleString('en-AU'), wow: null, yoy: null },
    { label: 'Total bookings', value: bookings.toLocaleString('en-AU'), wow: null, yoy: null },
    { label: 'Opportunities created', value: opportunities.toLocaleString('en-AU'), wow: null, yoy: null },
    { label: 'Closed Won', value: wonTotal.toLocaleString('en-AU'), wow: null, yoy: null },
    { label: 'Closed Lost', value: lostTotal.toLocaleString('en-AU'), wow: null, yoy: null },
    winRate != null && { label: 'Win rate', value: `${winRate}%`, wow: null, yoy: null },
  ].filter(Boolean);

  const notes = [
    `Monthly rollup of ${weeks.length} weekly report${weeks.length > 1 ? 's' : ''}: ${weeks.map((w) => w.label).join(', ')}.`,
    'Channel and city figures are summed weekly volumes (channel CVR is opportunity-weighted, city % is recomputed against the month total). Traffic WoW% and week-specific insights/notes aren\'t rolled up — see individual weeks for that detail.',
  ];
  if (!leadsKnown) {
    notes.push('No comparable Leads figure was available for any week this month, so the Total leads KPI is omitted.');
  } else if (leadsValues.some((v) => v == null)) {
    notes.push('At least one week this month has no comparable Leads figure — the monthly total may understate true volume.');
  }

  return {
    id: `month-${key}`,
    label: monthLabel(weeks[0].date),
    date: `${key}-01`,
    kpis,
    pipeline: sumPipeline(weeks),
    channels: sumChannels(weeks),
    cities: sumCities(weeks),
    traffic: [],
    properties: sumProperties(weeks),
    insights: [],
    notes,
  };
}

export function buildMonthlyReports(reports) {
  return groupReportsByMonth(reports).map(({ key, weeks }) => buildMonthlyReport(key, weeks));
}
