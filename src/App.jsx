import { useState } from 'react';
import { Header } from './components/Header.jsx';
import { Tabs } from './components/Tabs.jsx';
import { TrendSection } from './components/TrendSection.jsx';
import { MetricGrid } from './components/MetricGrid.jsx';
import { PipelineChart } from './components/PipelineChart.jsx';
import { CityChart } from './components/CityChart.jsx';
import { ChannelChart } from './components/ChannelChart.jsx';
import { PropertiesTable } from './components/PropertiesTable.jsx';
import { TrafficChart } from './components/TrafficChart.jsx';
import { InsightsCard } from './components/InsightsCard.jsx';
import { NotesCard } from './components/NotesCard.jsx';
import { ReportModal } from './components/ReportModal.jsx';
import { useReports } from './hooks/useReports.js';

function exportJson(reports) {
  const blob = new Blob([JSON.stringify(reports, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'weekly_reports_export.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export default function App() {
  const { reports, selectedId, setSelectedId, selectedReport, saveReport, deleteReport } = useReports();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState(null);

  const openNew = () => {
    setEditingReport(null);
    setModalOpen(true);
  };
  const openEdit = (report) => {
    setEditingReport(report);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);
  const handleSave = (report) => {
    saveReport(report);
    setModalOpen(false);
  };

  return (
    <div className="app">
      <Header
        rangeLabel={selectedReport ? selectedReport.label : 'No reports yet'}
        onExportJson={() => exportJson(reports)}
        onExportPdf={() => window.print()}
        onNewReport={openNew}
      />

      <TrendSection reports={reports} selectedLabel={selectedReport?.label} />

      <Tabs
        reports={reports}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onEdit={openEdit}
        onDelete={deleteReport}
      />

      {!selectedReport ? (
        <div className="empty-state">No reports saved yet. Use "+ New weekly report" to add the first one.</div>
      ) : (
        <>
          <MetricGrid kpis={selectedReport.kpis} />

          <div className="grid-2">
            {selectedReport.pipeline?.length > 0 && <PipelineChart pipeline={selectedReport.pipeline} />}
            {selectedReport.cities?.length > 0 && <CityChart cities={selectedReport.cities} />}
          </div>
          <div style={{ height: 24 }} />

          {selectedReport.channels?.length > 0 && <ChannelChart channels={selectedReport.channels} />}
          {selectedReport.properties?.length > 0 && <PropertiesTable properties={selectedReport.properties} />}
          {selectedReport.traffic?.length > 0 && <TrafficChart traffic={selectedReport.traffic} />}
          {selectedReport.insights?.length > 0 && <InsightsCard insights={selectedReport.insights} />}
          {selectedReport.notes?.length > 0 && <NotesCard notes={selectedReport.notes} />}
        </>
      )}

      <ReportModal open={modalOpen} report={editingReport} onSave={handleSave} onClose={closeModal} />

      <footer className="app-footer">Weekly Performance Dashboard · reports are saved on this device</footer>
    </div>
  );
}
