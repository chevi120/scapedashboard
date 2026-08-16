export function Header({ rangeLabel, onExportJson, onExportPdf, onNewReport }) {
  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">Scape · Leasing &amp; Marketing</p>
        <h1>Weekly Performance Dashboard</h1>
        <p className="range-label">{rangeLabel}</p>
      </div>
      <div className="header-actions">
        <button className="btn btn-secondary" onClick={onExportJson}>Export JSON</button>
        <button className="btn btn-secondary" onClick={onExportPdf}>Export PDF</button>
        <button className="btn btn-primary" onClick={onNewReport}>+ New weekly report</button>
      </div>
    </header>
  );
}
