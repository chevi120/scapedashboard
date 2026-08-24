import { StatMini } from './StatMini.jsx';
import { formatDelta } from '../lib/format.js';

export function QuickWebReportCard({ report }) {
  if (!report) return null;

  return (
    <section>
      <h2>Quick web report ({report.periodLabel})</h2>
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

        <p className="card-subhead">Traffic by channel</p>
        <div className="table-scroll">
          <table className="ptable">
            <thead>
              <tr>
                <th>Channel</th>
                <th style={{ textAlign: 'right' }}>Sessions</th>
                <th style={{ textAlign: 'right' }}>WoW %</th>
              </tr>
            </thead>
            <tbody>
              {report.channels.map((c) => (
                <tr key={c.name}>
                  <td>{c.name}</td>
                  <td className="num">{c.sessions.toLocaleString('en-AU')}</td>
                  <td className={`num ${c.wow >= 0 ? 'won' : 'lost'}`}>{formatDelta(c.wow)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="card-subhead">Lead origin</p>
        <div className="table-scroll">
          <table className="ptable">
            <thead>
              <tr>
                <th>Origin</th>
                <th style={{ textAlign: 'right' }}>Count</th>
                <th style={{ textAlign: 'right' }}>WoW %</th>
              </tr>
            </thead>
            <tbody>
              {report.leadOrigins.map((o) => (
                <tr key={o.name}>
                  <td>{o.name}</td>
                  <td className="num">{o.count}</td>
                  <td className={`num ${o.wow == null ? 'dash' : o.wow >= 0 ? 'won' : 'lost'}`}>
                    {o.wow == null ? '—' : formatDelta(o.wow)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {report.topProperties?.length > 0 && (
          <>
            <p className="card-subhead">Top properties — page views</p>
            <div className="table-scroll">
              <table className="ptable">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Page</th>
                    <th style={{ textAlign: 'right' }}>Views</th>
                  </tr>
                </thead>
                <tbody>
                  {report.topProperties.map((p) => (
                    <tr key={p.rank}>
                      <td className="num">{p.rank}</td>
                      <td>{p.path}</td>
                      <td className="num">{p.views.toLocaleString('en-AU')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
