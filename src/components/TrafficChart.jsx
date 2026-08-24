import { Bar, BarChart, Cell, LabelList, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartTooltip } from './ChartTooltip.jsx';
import { COLORS } from '../lib/colors.js';

export function TrafficChart({ traffic }) {
  const data = [...traffic].sort((a, b) => b.wow - a.wow);
  const height = Math.max(220, data.length * 30);

  return (
    <section>
      <h2>Traffic by channel (WoW %)</h2>
      <div className="chart-card">
        <div className="chart-box" style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 4, right: 44, bottom: 4, left: 8 }}>
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: COLORS.inkMuted }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={120}
                tick={{ fontSize: 12, fill: COLORS.inkSecondary }}
                axisLine={false}
                tickLine={false}
              />
              <ReferenceLine x={0} stroke={COLORS.gridline} />
              <Tooltip
                cursor={{ fill: 'rgba(36,42,86,0.05)' }}
                content={<ChartTooltip valueFormatter={(e) => `${e.value > 0 ? '+' : ''}${e.value}% WoW`} />}
              />
              <Bar dataKey="wow" radius={4} barSize={16} minPointSize={2} isAnimationActive={false}>
                {data.map((d) => (
                  <Cell key={d.name} fill={d.wow >= 0 ? COLORS.statusGoodFill : COLORS.statusCriticalFill} />
                ))}
                <LabelList
                  dataKey="wow"
                  content={({ x, y, width, height, value }) => {
                    // Recharts anchors x at the zero baseline for every bar and signs the
                    // width, so the bar's true far edge (away from zero) is x + width.
                    const positive = value >= 0;
                    const farEdge = x + width;
                    // A short bar has no room for an outside label without crowding the
                    // axis (small bars) or the category labels (very large bars run past
                    // the plot edge) - flip inside the fill once the bar is wide enough.
                    const inside = Math.abs(width) > 46;
                    const labelX = inside
                      ? farEdge + (positive ? -6 : 6)
                      : farEdge + (positive ? 6 : -6);
                    const anchor = inside
                      ? (positive ? 'end' : 'start')
                      : (positive ? 'start' : 'end');
                    return (
                      <text
                        x={labelX}
                        y={y + height / 2}
                        dy={4}
                        textAnchor={anchor}
                        fontSize={11}
                        fontWeight={700}
                        fill={inside ? '#ffffff' : COLORS.ink}
                      >
                        {positive ? '+' : ''}{value}%
                      </text>
                    );
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
