import { StatMini } from './StatMini.jsx';
import { EmailFunnelChart } from './EmailFunnelChart.jsx';
import { CountBarChart } from './CountBarChart.jsx';
import { COLORS } from '../lib/colors.js';

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

        <p className="card-subhead">Engagement funnel</p>
        <EmailFunnelChart
          delivered={campaign.delivered}
          uniqueOpens={campaign.uniqueOpens}
          uniqueClicks={campaign.uniqueClicks}
          unsubscribes={campaign.unsubscribes}
        />

        <div className="grid-2">
          <div>
            <p className="card-subhead">Not sent ({campaign.notSent} of {campaign.sent.toLocaleString('en-AU')})</p>
            <CountBarChart data={campaign.notSentBreakdown} nameKey="label" color={COLORS.statusWarningFill} labelWidth={110} />
          </div>
          <div>
            <p className="card-subhead">Bounces ({campaign.bounces} total)</p>
            <CountBarChart data={campaign.bounceBreakdown} nameKey="label" color={COLORS.statusCriticalFill} labelWidth={110} />
          </div>
        </div>
      </div>
    </section>
  );
}
