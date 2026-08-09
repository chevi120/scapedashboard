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
                    const positive = value >= 0;
                    return (
                      <text
                        x={positive ? x + width + 6 : x - 6}
                        y={y + height / 2}
                        dy={4}
                        textAnchor={positive ? 'start' : 'end'}
                        fontSize={11}
                        fontWeight={700}
                        fill={COLORS.ink}
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
