import { WowBarChart } from './WowBarChart.jsx';

export function TrafficChart({ traffic }) {
  return (
    <section>
      <h2>Traffic by channel (WoW %)</h2>
      <div className="chart-card">
        <WowBarChart data={traffic} />
      </div>
    </section>
  );
}
