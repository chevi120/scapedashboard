import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartTooltip } from './ChartTooltip.jsx';
import { COLORS } from '../lib/colors.js';

const LEGEND = [
  { label: 'Delivered → opened → clicked (unique)', color: COLORS.ordinal2, gradient: true },
  { label: 'Unsubscribed', color: COLORS.statusCriticalFill },
];

// Engagement funnel for one send: delivered/opened/clicked narrow in a fixed
// order (ordinal, one-hue ramp), with unsubscribes shown as a reserved
// status-critical outcome rather than a fourth funnel step.
export function EmailFunnelChart({ delivered, uniqueOpens, uniqueClicks, unsubscribes }) {
  const data = [
    { stage: 'Delivered', count: delivered, fill: COLORS.ordinal1 },
    { stage: 'Opened (unique)', count: uniqueOpens, fill: COLORS.ordinal2 },
    { stage: 'Clicked (unique)', count: uniqueClicks, fill: COLORS.ordinal3 },
    { stage: 'Unsubscribed', count: unsubscribes, fill: COLORS.statusCriticalFill },
  ];

  return (
    <>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 16, right: 8, bottom: 0, left: -12 }}>
            <XAxis
              dataKey="stage"
              tick={{ fontSize: 11, fill: COLORS.inkSecondary }}
              axisLine={{ stroke: COLORS.gridline }}
              tickLine={false}
            />
            <YAxis tick={{ fontSize: 11, fill: COLORS.inkMuted }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: 'rgba(36,42,86,0.05)' }}
              content={<ChartTooltip valueFormatter={(e) => e.value.toLocaleString('en-AU')} />}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={48} minPointSize={2} isAnimationActive={false}>
              {data.map((d) => (
                <Cell key={d.stage} fill={d.fill} />
              ))}
              <LabelList
                dataKey="count"
                content={({ x, y, width, value }) => (
                  <text x={x + width / 2} y={y - 6} textAnchor="middle" fontSize={11} fontWeight={700} fill={COLORS.ink}>
                    {value.toLocaleString('en-AU')}
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
    </>
  );
}
