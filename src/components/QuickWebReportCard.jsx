import { StatMini } from './StatMini.jsx';
import { CountBarChart } from './CountBarChart.jsx';
import { WowBarChart } from './WowBarChart.jsx';
import { SectionHeader } from './SectionHeader.jsx';
import { COLORS } from '../lib/colors.js';

export function QuickWebReportCard({ report }) {
  if (!report) return null;

  // Some cycles' quick report only supplies a WoW% per lead-origin category
  // with no underlying count — a magnitude bar would have to invent a volume
  // that isn't there, so that shape gets the diverging WoW chart instead.
  const hasOriginCounts = report.leadOrigins?.length > 0;
  const hasOriginWow = report.leadOriginsWow?.length > 0;

  return (
    <section>
      <SectionHeader eyebrow="Web report" title={`Quick web report (${report.periodLabel})`} />
      <div className="card warn">
        <p className="card-meta">
          A shorter, separately-supplied web-report summary (WoW vs {report.comparedTo}) — several figures here
          don't reconcile with the detailed GA4/Leads report above for the same week; see the notes for the
          reconciliation gap.
        </p>

        <div className="mini-stats">
          <StatMini label="Total sessions" value={report.totalSessions.toLocaleString('en-AU')} delta={report.sessionsWow} />
          <StatMini label="Web purchases" value={report.purchases} delta={report.purchasesWow} />
          <StatMini label="Revenue" value={`$${report.revenue.toLocaleString('en-AU')}`} delta={report.revenueWow} />
          <StatMini label="Total leads" value={report.totalLeads.toLocaleString('en-AU')} delta={report.leadsWow} />
        </div>

        {hasOriginCounts && (
          <>
            <p className="card-subhead">Lead origin</p>
            <CountBarChart data={report.leadOrigins} color={COLORS.magnitudeTeal} labelWidth={130} />
          </>
        )}
        {!hasOriginCounts && hasOriginWow && (
          <>
            <p className="card-subhead">Lead origin (WoW %) — no volume/count supplied this cycle</p>
            <WowBarChart data={report.leadOriginsWow} />
          </>
        )}

        {report.topProperties?.length > 0 && (
          <>
            <p className="card-subhead">Top properties — page views</p>
            <CountBarChart data={report.topProperties} nameKey="path" valueKey="views" color={COLORS.magnitudeBlue} labelWidth={230} />
          </>
        )}
      </div>
    </section>
  );
}
