import { useMemo, useState } from 'react';
import { Header } from './components/Header.jsx';
import { Tabs } from './components/Tabs.jsx';
import { ViewToggle } from './components/ViewToggle.jsx';
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
import { buildMonthlyReports } from './lib/monthly.js';

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
  const [viewMode, setViewMode] = useState('weekly');
  const [selectedMonthId, setSelectedMonthId] = useState(null);

  const monthlyReports = useMemo(() => buildMonthlyReports(reports), [reports]);

  const isWeekly = viewMode === 'weekly';
  const effectiveMonthId = selectedMonthId || monthlyReports[monthlyReports.length - 1]?.id || null;
  const displayReports = isWeekly ? reports : monthlyReports;
  const displaySelectedId = isWeekly ? selectedId : effectiveMonthId;
  const displaySelectedReport = isWeekly
    ? selectedReport
    : monthlyReports.find((m) => m.id === displaySelectedId) || null;

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
        rangeLabel={displaySelectedReport ? displaySelectedReport.label : 'No reports yet'}
        onExportJson={() => exportJson(reports)}
        onExportPdf={() => window.print()}
        onNewReport={openNew}
      />

      <TrendSection reports={displayReports} selectedLabel={displaySelectedReport?.label} />

      <ViewToggle mode={viewMode} onChange={setViewMode} />

      <Tabs
        reports={displayReports}
        selectedId={displaySelectedId}
        onSelect={isWeekly ? setSelectedId : setSelectedMonthId}
        onEdit={openEdit}
        onDelete={deleteReport}
        grouped={isWeekly}
        readOnly={!isWeekly}
      />

      {!displaySelectedReport ? (
        <div className="empty-state">No reports saved yet. Use "+ New weekly report" to add the first one.</div>
      ) : (
        <>
          <MetricGrid kpis={displaySelectedReport.kpis} />

          <div className="grid-2">
            {displaySelectedReport.pipeline?.length > 0 && <PipelineChart pipeline={displaySelectedReport.pipeline} />}
            {displaySelectedReport.cities?.length > 0 && <CityChart cities={displaySelectedReport.cities} />}
          </div>
          <div style={{ height: 24 }} />

          {displaySelectedReport.channels?.length > 0 && <ChannelChart channels={displaySelectedReport.channels} />}
          {displaySelectedReport.properties?.length > 0 && <PropertiesTable properties={displaySelectedReport.properties} />}
          {displaySelectedReport.traffic?.length > 0 && <TrafficChart traffic={displaySelectedReport.traffic} />}
          {displaySelectedReport.insights?.length > 0 && <InsightsCard insights={displaySelectedReport.insights} />}
          {displaySelectedReport.notes?.length > 0 && <NotesCard notes={displaySelectedReport.notes} />}
        </>
      )}

      <ReportModal open={modalOpen} report={editingReport} onSave={handleSave} onClose={closeModal} />

      <footer className="app-footer">Weekly Performance Dashboard · reports are saved on this device</footer>
    </div>
  );
}
