import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartTooltip } from './ChartTooltip.jsx';
import { COLORS, sortByStageOrder, stageColor } from '../lib/colors.js';

const LEGEND = [
  { label: 'Early → late funnel', color: COLORS.ordinal2, gradient: true },
  { label: 'Waitlist (parked)', color: COLORS.statusNeutralFill },
  { label: 'Closed Won', color: COLORS.statusGoodFill },
  { label: 'Closed Lost', color: COLORS.statusCriticalFill },
];

export function PipelineChart({ pipeline }) {
  const data = sortByStageOrder(pipeline);

  return (
    <section style={{ marginBottom: 0 }}>
      <h2>Pipeline by stage</h2>
      <div className="chart-card">
        <div className="chart-box">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 16, right: 8, bottom: 0, left: -12 }}>
              <XAxis
                dataKey="stage"
                tick={{ fontSize: 10, fill: COLORS.inkSecondary }}
                axisLine={{ stroke: COLORS.gridline }}
                tickLine={false}
                interval={0}
                angle={-12}
                textAnchor="end"
                height={40}
              />
              <YAxis tick={{ fontSize: 11, fill: COLORS.inkMuted }} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: 'rgba(36,42,86,0.05)' }}
                content={<ChartTooltip valueFormatter={(e) => `${e.value} opportunities`} />}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={34} minPointSize={2} isAnimationActive={false}>
                {data.map((d) => (
                  <Cell key={d.stage} fill={stageColor(d.stage)} />
                ))}
                <LabelList
                  dataKey="count"
                  content={({ x, y, width, value }) => (
                    <text x={x + width / 2} y={y - 6} textAnchor="middle" fontSize={11} fontWeight={700} fill={COLORS.ink}>
                      {value}
                    </text>
                  )}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-legend">
          {LEGEND.map((l) => (
            <span className="swatch" key={l.label}>
              <span
                className="dot"
                style={{
                  background: l.gradient
                    ? `linear-gradient(90deg, ${COLORS.ordinal1}, ${COLORS.ordinal3})`
                    : l.color,
                }}
              />
              {l.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
