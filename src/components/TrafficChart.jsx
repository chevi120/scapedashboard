import { WowBarChart } from './WowBarChart.jsx';
import { SectionHeader } from './SectionHeader.jsx';

export function TrafficChart({ traffic }) {
  return (
    <section>
      <SectionHeader eyebrow="Traffic" title="Traffic by channel (WoW %)" />
      <div className="chart-card">
        <WowBarChart
          data={traffic}
          tooltipSuffix={(p) => (p.sessions ? ` · ${p.sessions.toLocaleString('en-AU')} sessions` : '')}
        />
      </div>
    </section>
  );
}
