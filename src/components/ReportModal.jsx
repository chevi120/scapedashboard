import { useEffect, useState } from 'react';

const NUMERIC_KEYS = new Set(['count', 'opportunities', 'wow', 'yoy', 'cvr', 'pct', 'active', 'won', 'lost']);

const FIELD_SETS = {
  kpis: [
    { key: 'label', placeholder: 'Label (e.g. Bookings)' },
    { key: 'value', placeholder: 'Value (e.g. 300)' },
    { key: 'wow', placeholder: 'WoW %' },
    { key: 'yoy', placeholder: 'YoY %' },
  ],
  pipeline: [
    { key: 'stage', placeholder: 'Stage' },
    { key: 'count', placeholder: 'Count' },
  ],
  channels: [
    { key: 'name', placeholder: 'Channel' },
    { key: 'opportunities', placeholder: 'Opportunities' },
    { key: 'cvr', placeholder: 'CVR %' },
  ],
  cities: [
    { key: 'name', placeholder: 'City' },
    { key: 'pct', placeholder: '% demand' },
  ],
  properties: [
    { key: 'name', placeholder: 'Property name' },
    { key: 'active', placeholder: 'Active pipeline' },
    { key: 'won', placeholder: 'Closed Won' },
    { key: 'lost', placeholder: 'Closed Lost' },
  ],
  traffic: [
    { key: 'name', placeholder: 'Traffic channel' },
    { key: 'wow', placeholder: 'WoW %' },
  ],
};

const SECTIONS = [
  { key: 'kpis', legend: 'Main KPIs', addLabel: '+ add KPI' },
  { key: 'pipeline', legend: 'Pipeline by stage', addLabel: '+ add stage' },
  { key: 'channels', legend: 'Channels (opportunities + CVR%)', addLabel: '+ add channel' },
  { key: 'cities', legend: 'Cities (% demand)', addLabel: '+ add city' },
  { key: 'properties', legend: 'Top properties (active / won / lost)', addLabel: '+ add property' },
  { key: 'traffic', legend: 'Traffic by channel (WoW %)', addLabel: '+ add traffic channel' },
];

function emptyRow(fields) {
  return Object.fromEntries(fields.map((f) => [f.key, '']));
}

function DynRows({ fields, rows, addLabel, onChange }) {
  const update = (idx, key, value) => {
    const next = rows.map((r, i) => (i === idx ? { ...r, [key]: value } : r));
    onChange(next);
  };
  const remove = (idx) => onChange(rows.filter((_, i) => i !== idx));
  const add = () => onChange([...rows, emptyRow(fields)]);

  return (
    <>
      <div className="dyn-list">
        {rows.map((row, idx) => (
          <div className="dyn-row" key={idx}>
            {fields.map((f) => (
              <input
                key={f.key}
                placeholder={f.placeholder}
                value={row[f.key] ?? ''}
                onChange={(e) => update(idx, f.key, e.target.value)}
              />
            ))}
            <button type="button" onClick={() => remove(idx)}>✕</button>
          </div>
        ))}
      </div>
      <button type="button" className="add-row-btn" onClick={add}>{addLabel}</button>
    </>
  );
}

function toFormRows(items, fields) {
  if (!items?.length) return [emptyRow(fields)];
  return items.map((item) => Object.fromEntries(fields.map((f) => [f.key, item[f.key] ?? ''])));
}

function readRows(rows, fields) {
  const out = [];
  for (const row of rows) {
    const obj = {};
    let hasValue = false;
    for (const f of fields) {
      const raw = String(row[f.key] ?? '').trim();
      if (raw !== '') hasValue = true;
      obj[f.key] = raw === '' ? (NUMERIC_KEYS.has(f.key) ? null : '') : NUMERIC_KEYS.has(f.key) ? Number(raw) : raw;
    }
    if (hasValue) out.push(obj);
  }
  return out;
}

const BLANK_FORM = {
  label: '',
  date: '',
  kpis: [emptyRow(FIELD_SETS.kpis)],
  pipeline: [emptyRow(FIELD_SETS.pipeline)],
  channels: [emptyRow(FIELD_SETS.channels)],
  cities: [emptyRow(FIELD_SETS.cities)],
  properties: [emptyRow(FIELD_SETS.properties)],
  traffic: [emptyRow(FIELD_SETS.traffic)],
  insightsText: '',
  notesText: '',
};

export function ReportModal({ open, report, onSave, onClose }) {
  const [form, setForm] = useState(BLANK_FORM);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [jsonText, setJsonText] = useState('');

  useEffect(() => {
    if (!open) return;
    setAdvancedMode(false);
    if (report) {
      setForm({
        label: report.label || '',
        date: report.date || '',
        kpis: toFormRows(report.kpis, FIELD_SETS.kpis),
        pipeline: toFormRows(report.pipeline, FIELD_SETS.pipeline),
        channels: toFormRows(report.channels, FIELD_SETS.channels),
        cities: toFormRows(report.cities, FIELD_SETS.cities),
        properties: toFormRows(report.properties, FIELD_SETS.properties),
        traffic: toFormRows(report.traffic, FIELD_SETS.traffic),
        insightsText: (report.insights || []).join('\n'),
        notesText: (report.notes || []).join('\n'),
      });
      setJsonText(JSON.stringify(report, null, 2));
    } else {
      setForm(BLANK_FORM);
      setJsonText('');
    }
  }, [open, report]);

  if (!open) return null;

  const setRows = (key, rows) => setForm((f) => ({ ...f, [key]: rows }));

  const handleSave = () => {
    let next;
    if (advancedMode) {
      try {
        next = JSON.parse(jsonText);
      } catch {
        alert('The JSON is not valid. Please check the format.');
        return;
      }
      next.id = report ? report.id : next.id || `report-${Date.now()}`;
    } else {
      if (!form.label.trim() || !form.date) {
        alert('Please fill in at least the week label and the date.');
        return;
      }
      next = {
        id: report ? report.id : `report-${Date.now()}`,
        label: form.label.trim(),
        date: form.date,
        kpis: readRows(form.kpis, FIELD_SETS.kpis),
        pipeline: readRows(form.pipeline, FIELD_SETS.pipeline),
        channels: readRows(form.channels, FIELD_SETS.channels),
        cities: readRows(form.cities, FIELD_SETS.cities),
        properties: readRows(form.properties, FIELD_SETS.properties),
        traffic: readRows(form.traffic, FIELD_SETS.traffic),
        insights: form.insightsText.split('\n').map((s) => s.trim()).filter(Boolean),
        notes: form.notesText.split('\n').map((s) => s.trim()).filter(Boolean),
      };
    }
    if (report?.version !== undefined && next.version === undefined) next.version = report.version;
    onSave(next);
  };

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <h3>{report ? 'Edit weekly report' : 'New weekly report'}</h3>
        <p className="sub">Fill in the key figures for the week. Any field you leave blank simply won't show up on the dashboard.</p>
        <button type="button" className="btn-ghost" onClick={() => setAdvancedMode((v) => !v)}>
          {advancedMode ? '← Simple mode (form)' : 'Advanced mode (paste JSON) →'}
        </button>

        {advancedMode ? (
          <div className="field">
            <label>Report JSON</label>
            <textarea
              style={{ minHeight: 320, fontFamily: 'monospace', fontSize: 12 }}
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
            />
          </div>
        ) : (
          <>
            <fieldset>
              <legend>Week</legend>
              <div className="field">
                <label>Label (e.g. "W31 (27 Jul - 2 Aug 2026)")</label>
                <input
                  value={form.label}
                  placeholder="W31 (27 Jul - 2 Aug 2026)"
                  onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                />
              </div>
              <div className="field">
                <label>Start date (used for sorting, format YYYY-MM-DD)</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                />
              </div>
            </fieldset>

            {SECTIONS.map((s) => (
              <fieldset key={s.key}>
                <legend>{s.legend}</legend>
                <DynRows
                  fields={FIELD_SETS[s.key]}
                  rows={form[s.key]}
                  addLabel={s.addLabel}
                  onChange={(rows) => setRows(s.key, rows)}
                />
              </fieldset>
            ))}

            <fieldset>
              <legend>Key insights</legend>
              <textarea
                placeholder="One insight per line"
                value={form.insightsText}
                onChange={(e) => setForm((f) => ({ ...f, insightsText: e.target.value }))}
              />
            </fieldset>

            <fieldset>
              <legend>Notes / gaps / decisions</legend>
              <textarea
                placeholder="One note per line"
                value={form.notesText}
                onChange={(e) => setForm((f) => ({ ...f, notesText: e.target.value }))}
              />
            </fieldset>
          </>
        )}

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>{report ? 'Save changes' : 'Save report'}</button>
        </div>
      </div>
    </div>
  );
}
