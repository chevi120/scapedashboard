import { SectionHeader } from './SectionHeader.jsx';

function Cell({ value, cls }) {
  if (value === null || value === undefined) return <td className="num dash">—</td>;
  return <td className={`num ${cls || ''}`}>{value}</td>;
}

export function PropertiesTable({ properties }) {
  return (
    <section>
      <SectionHeader eyebrow="Properties" title="Top properties" />
      <div className="card table-scroll">
        <table className="ptable">
          <thead>
            <tr>
              <th>Property</th>
              <th style={{ textAlign: 'right' }}>Active pipeline</th>
              <th style={{ textAlign: 'right' }}>Closed Won</th>
              <th style={{ textAlign: 'right' }}>Closed Lost</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p.name}>
                <td>{p.name}</td>
                <Cell value={p.active} />
                <Cell value={p.won} cls="won" />
                <Cell value={p.lost} cls="lost" />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
