import { CountBarChart } from './CountBarChart.jsx';
import { COLORS } from '../lib/colors.js';

// Some weeks' property breakdown is a flat opportunity-volume ranking with no
// won/lost/active split (unlike PropertiesTable's usual shape) - render it as
// its own magnitude chart rather than force it into columns we don't have data for.
export function PropertyVolumeChart({ properties }) {
  if (!properties?.length) return null;

  return (
    <section>
      <h2>Opportunities by property</h2>
      <div className="chart-card">
        <CountBarChart data={properties} valueKey="opportunities" color={COLORS.magnitudeBlue} labelWidth={190} />
      </div>
    </section>
  );
}
