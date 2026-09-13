import { WowBarChart } from './WowBarChart.jsx';

export function TrafficChart({ traffic }) {
  return (
    <section>
      <h2>Traffic by channel (WoW %)</h2>
      <div className="chart-card">
        <WowBarChart
          data={traffic}
          tooltipSuffix={(p) => (p.sessions ? ` · ${p.sessions.toLocaleString('en-AU')} sessions` : '')}
        />
      </div>
    </section>
  );
}
