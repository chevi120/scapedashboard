export function InsightsCard({ insights }) {
  return (
    <section>
      <h2>Key insights</h2>
      <div className="card">
        <ol>
          {insights.map((text, i) => (
            <li key={i}>{text}</li>
          ))}
        </ol>
      </div>
    </section>
  );
}
