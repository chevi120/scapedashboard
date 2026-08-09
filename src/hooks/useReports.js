import { useCallback, useMemo, useState } from 'react';
import { seedReports } from '../data/seedReports.js';
import { loadStoredReports, persistReports } from '../lib/storage.js';

function mergeWithSeeds(stored) {
  const seeds = seedReports();
  const seedMap = new Map(seeds.map((s) => [s.id, s]));
  const seenIds = new Set();
  const out = [];

  for (const report of stored) {
    const seed = seedMap.get(report.id);
    seenIds.add(report.id);
    // A newer seed version replaces a managed report (W29-W31) without touching
    // reports the user added or edited by hand (those never carry a `version`
    // that's behind the current seed).
    if (seed && (Number(seed.version) || 0) > (Number(report.version) || 0)) {
      out.push(seed);
    } else {
      out.push(report);
    }
  }

  for (const seed of seeds) {
    if (!seenIds.has(seed.id)) out.push(seed);
  }

  return out.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
}

export function useReports() {
  const [reports, setReports] = useState(() => {
    const stored = loadStoredReports();
    const merged = mergeWithSeeds(stored || []);
    if (!stored) persistReports(merged);
    return merged;
  });

  const [selectedId, setSelectedId] = useState(() =>
    reports.length ? reports[reports.length - 1].id : null,
  );

  const saveReport = useCallback((report) => {
    setReports((prev) => {
      const idx = prev.findIndex((r) => r.id === report.id);
      const next = idx === -1 ? [...prev, report] : prev.map((r, i) => (i === idx ? report : r));
      next.sort((a, b) => (a.date || '').localeCompare(b.date || ''));
      persistReports(next);
      return next;
    });
    setSelectedId(report.id);
  }, []);

  const deleteReport = useCallback((id) => {
    setReports((prev) => {
      const next = prev.filter((r) => r.id !== id);
      persistReports(next);
      setSelectedId((current) => {
        if (current !== id) return current;
        return next.length ? next[next.length - 1].id : null;
      });
      return next;
    });
  }, []);

  const selectedReport = useMemo(
    () => reports.find((r) => r.id === selectedId) || null,
    [reports, selectedId],
  );

  return { reports, selectedId, setSelectedId, selectedReport, saveReport, deleteReport };
}
