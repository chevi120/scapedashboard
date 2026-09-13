import { SectionHeader } from './SectionHeader.jsx';

export function NotesCard({ notes }) {
  if (!notes?.length) return null;
  return (
    <section>
      <SectionHeader eyebrow="Data integrity" title="Notes, gaps & decisions" />
      <div className="card warn">
        <ul className="notes-list">
          {notes.map((text, i) => (
            <li key={i}>
              <span className="bang">!</span>
              {text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
