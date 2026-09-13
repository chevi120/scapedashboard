export function SectionHeader({ eyebrow, title }) {
  return (
    <div className="section-header">
      {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
    </div>
  );
}
