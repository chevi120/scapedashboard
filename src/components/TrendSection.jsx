import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartTooltip } from './ChartTooltip.jsx';
import { COLORS } from '../lib/colors.js';
import { buildTrendSeries } from '../lib/metrics.js';

const METRICS = [
  { key: 'sessions', title: 'Website sessions', color: COLORS.magnitudeBlue, isPct: false },
  { key: 'leads', title: 'Total leads', color: COLORS.magnitudeTeal, isPct: false },
  { key: 'bookings', title: 'Bookings', color: COLORS.statusGoodFill, isPct: false },
  { key: 'winrate', title: 'Win rate %', color: '#FF007F', isPct: true },
];

function SelectedAwareTick({ x, y, payload, selectedShort }) {
  const isSelected = payload.value === selectedShort;
  return (
    <text
      x={x}
      y={y + 10}
      textAnchor="middle"
      fontSize={10}
      fontWeight={isSelected ? 700 : 400}
      fill={isSelected ? '#FF007F' : COLORS.inkMuted}
    >
      {payload.value}
    </text>
  );
}

function TrendMini({ title, color, isPct, data, selectedShort }) {
  return (
    <div className="trend-box">
      <p className="trend-title">{title}</p>
      <div className="chart-box short">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -22 }}>
            <XAxis
              dataKey="shortLabel"
              tick={<SelectedAwareTick selectedShort={selectedShort} />}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 10, fill: COLORS.inkMuted }}
              axisLine={false}
              tickLine={false}
              width={30}
              tickFormatter={(v) => (isPct ? `${v}%` : v)}
            />
            <Tooltip content={<ChartTooltip valueFormatter={(e) => `${e.payload.label}: ${e.value}${isPct ? '%' : ''}`} />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={(props) => {
                const isSelected = props.payload.shortLabel === selectedShort;
                return (
                  <circle
                    key={props.payload.label}
                    cx={props.cx}
                    cy={props.cy}
                    r={isSelected ? 6 : 3.5}
                    fill={color}
                    stroke="#fff"
                    strokeWidth={isSelected ? 2 : 1}
                  />
                );
              }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function TrendSection({ reports, selectedLabel }) {
  if (!reports || reports.length < 2) return null;
  const series = buildTrendSeries(reports);
  const points = reports.map((r) => ({ label: r.label, shortLabel: r.label.split(' ')[0] }));
  const selectedShort = points.find((p) => p.label === selectedLabel)?.shortLabel;

  return (
    <div className="trend-section">
      <h2>Trend across weeks</h2>
      <div className="trend-grid">
        {METRICS.map((m) => (
          <TrendMini
            key={m.key}
            title={m.title}
            color={m.color}
            isPct={m.isPct}
            selectedShort={selectedShort}
            data={points.map((p, i) => ({ ...p, value: series[m.key][i] }))}
          />
        ))}
      </div>
    </div>
  );
}
