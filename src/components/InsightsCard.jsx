import { SectionHeader } from './SectionHeader.jsx';

export function InsightsCard({ insights }) {
  if (!insights?.length) return null;
  const [headline, ...rest] = insights;

  return (
    <section>
      <SectionHeader eyebrow="Takeaways" title="Key insights" />
      <div className="card">
        <p className="callout-check">
          <span className="check">✓</span>
          {headline}
        </p>
        {rest.length > 0 && (
          <ul className="insight-list">
            {rest.map((text, i) => (
              <li key={i}>
                <span className="plus">+</span>
                {text}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
