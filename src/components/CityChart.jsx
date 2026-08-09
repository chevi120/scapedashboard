import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartTooltip } from './ChartTooltip.jsx';
import { COLORS } from '../lib/colors.js';

export function CityChart({ cities }) {
  return (
    <section style={{ marginBottom: 0 }}>
      <h2>Demand by city</h2>
      <div className="chart-card">
        <div className="chart-box">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cities} margin={{ top: 16, right: 8, bottom: 0, left: -12 }}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: COLORS.inkSecondary }}
                axisLine={{ stroke: COLORS.gridline }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: COLORS.inkMuted }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip cursor={{ fill: 'rgba(36,42,86,0.05)' }} content={<ChartTooltip valueFormatter={(e) => `${e.value}%`} />} />
              <Bar dataKey="pct" fill={COLORS.magnitudeBlue} radius={[4, 4, 0, 0]} barSize={40} minPointSize={2} isAnimationActive={false}>
                <LabelList
                  dataKey="pct"
                  content={({ x, y, width, value }) => (
                    <text x={x + width / 2} y={y - 6} textAnchor="middle" fontSize={11} fontWeight={700} fill={COLORS.ink}>
                      {value}%
                    </text>
                  )}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
