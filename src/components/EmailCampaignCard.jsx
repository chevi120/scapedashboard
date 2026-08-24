import { StatMini } from './StatMini.jsx';

export function EmailCampaignCard({ campaign }) {
  if (!campaign) return null;

  return (
    <section>
      <h2>Email campaign — {campaign.name}</h2>
      <div className="card">
        <p className="card-meta">
          Job ID {campaign.jobId} · Subject "{campaign.subject}" · Sent {campaign.sentAt} to {campaign.audience}
        </p>

        <div className="mini-stats">
          <StatMini label="Sent" value={campaign.sent.toLocaleString('en-AU')} />
          <StatMini
            label="Delivered"
            value={campaign.delivered.toLocaleString('en-AU')}
            sub={`${campaign.deliveryRate}% delivery rate`}
          />
          <StatMini
            label="Opens"
            value={`${campaign.opens.toLocaleString('en-AU')} / ${campaign.uniqueOpens.toLocaleString('en-AU')} unique`}
            sub={`${campaign.openRate}% open rate`}
          />
          <StatMini
            label="Clicks"
            value={`${campaign.clicks.toLocaleString('en-AU')} / ${campaign.uniqueClicks.toLocaleString('en-AU')} unique`}
            sub={`${campaign.clickToOpenRate}% of unique opens`}
          />
          <StatMini
            label="Unsubscribes"
            value={String(campaign.unsubscribes)}
            sub={`${campaign.unsubscribeRate}% of delivered`}
          />
        </div>

        <div className="grid-2">
          <div>
            <p className="card-subhead">Not sent ({campaign.notSent} of {campaign.sent.toLocaleString('en-AU')})</p>
            <table className="ptable compact">
              <tbody>
                {campaign.notSentBreakdown.map((r) => (
                  <tr key={r.label}>
                    <td>{r.label}</td>
                    <td className="num">{r.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <p className="card-subhead">Bounces ({campaign.bounces} total)</p>
            <table className="ptable compact">
              <tbody>
                {campaign.bounceBreakdown.map((r) => (
                  <tr key={r.label}>
                    <td>{r.label}</td>
                    <td className="num">{r.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
