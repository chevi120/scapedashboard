import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartTooltip } from './ChartTooltip.jsx';
import { COLORS } from '../lib/colors.js';

// A reusable horizontal magnitude bar chart (one hue, nominal categories) —
// used anywhere we just need "how much per category" without a CVR/WoW job.
export function CountBarChart({ data, nameKey = 'name', valueKey = 'count', color = COLORS.magnitudeTeal, labelWidth = 150 }) {
  const sorted = [...data].sort((a, b) => b[valueKey] - a[valueKey]);
  const height = Math.max(160, sorted.length * 34);

  return (
    <div className="chart-box" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sorted} layout="vertical" margin={{ top: 4, right: 44, bottom: 4, left: 8 }}>
          <XAxis type="number" tick={{ fontSize: 11, fill: COLORS.inkMuted }} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey={nameKey}
            width={labelWidth}
            tick={{ fontSize: 12, fill: COLORS.inkSecondary }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(36,42,86,0.05)' }}
            content={<ChartTooltip valueFormatter={(e) => e.value.toLocaleString('en-AU')} />}
          />
          <Bar dataKey={valueKey} fill={color} radius={[0, 4, 4, 0]} barSize={16} minPointSize={2} isAnimationActive={false}>
            <LabelList
              dataKey={valueKey}
              position="right"
              formatter={(v) => v.toLocaleString('en-AU')}
              style={{ fontSize: 11, fontWeight: 700, fill: COLORS.ink }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
