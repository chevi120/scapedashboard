import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartTooltip } from './ChartTooltip.jsx';
import { COLORS } from '../lib/colors.js';

export function ChannelChart({ channels }) {
  const data = [...channels].sort((a, b) => b.cvr - a.cvr);
  const height = Math.max(220, data.length * 38);

  return (
    <section>
      <h2>Conversion by channel</h2>
      <div className="chart-card">
        <div className="chart-box tall" style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 4, right: 36, bottom: 4, left: 8 }}>
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: COLORS.inkMuted }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={188}
                tick={{ fontSize: 12, fill: COLORS.inkSecondary }}
                axisLine={false}
                tickLine={false}
                interval={0}
              />
              <Tooltip
                cursor={{ fill: 'rgba(36,42,86,0.05)' }}
                content={<ChartTooltip valueFormatter={(e) => `${e.payload.opportunities} opportunities · ${e.value}% CVR`} />}
              />
              <Bar dataKey="cvr" fill={COLORS.magnitudeTeal} radius={[0, 4, 4, 0]} barSize={16} minPointSize={2} isAnimationActive={false}>
                <LabelList
                  dataKey="cvr"
                  position="right"
                  formatter={(v) => `${v}%`}
                  style={{ fontSize: 11, fontWeight: 700, fill: COLORS.ink }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
