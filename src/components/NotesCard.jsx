export function NotesCard({ notes }) {
  return (
    <section>
      <h2>Notes, gaps &amp; decisions</h2>
      <div className="card warn">
        <ul>
          {notes.map((text, i) => (
            <li key={i}>{text}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
