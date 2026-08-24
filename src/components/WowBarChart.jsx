import { Bar, BarChart, Cell, LabelList, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartTooltip } from './ChartTooltip.jsx';
import { COLORS } from '../lib/colors.js';
import { useIsNarrow } from '../hooks/useIsNarrow.js';

// Diverging WoW% bar chart (status good/critical by sign) — the chart-box
// only, so callers control their own section/heading wrapper. Shared by the
// main Traffic-by-channel chart and the quick web report's channel chart.
export function WowBarChart({ data, nameKey = 'name', valueKey = 'wow', height, tooltipSuffix }) {
  const isNarrow = useIsNarrow();
  const sorted = [...data].sort((a, b) => b[valueKey] - a[valueKey]);
  const chartHeight = height || Math.max(220, sorted.length * 30);
  // A full-width desktop chart gives a bar ~46px before a label fits inside
  // it; that same 46px eats most of a mobile-width plot, so both the axis
  // gutter and the inside/outside label threshold need to shrink with it.
  const marginLeft = 8;
  const axisWidth = isNarrow ? 92 : 130;
  const gutterEdgeX = marginLeft + axisWidth;
  const insideThreshold = isNarrow ? 26 : 46;
  const labelFontSize = isNarrow ? 10 : 11;

  return (
    <div className="chart-box" style={{ height: chartHeight }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sorted} layout="vertical" margin={{ top: 4, right: 40, bottom: 4, left: 8 }}>
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: COLORS.inkMuted }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <YAxis
            type="category"
            dataKey={nameKey}
            width={axisWidth}
            tick={{ fontSize: isNarrow ? 11 : 12, fill: COLORS.inkSecondary }}
            axisLine={false}
            tickLine={false}
          />
          <ReferenceLine x={0} stroke={COLORS.gridline} />
          <Tooltip
            cursor={{ fill: 'rgba(36,42,86,0.05)' }}
            content={
              <ChartTooltip
                valueFormatter={(e) =>
                  `${e.value > 0 ? '+' : ''}${e.value}% WoW${tooltipSuffix ? tooltipSuffix(e.payload) : ''}`
                }
              />
            }
          />
          <Bar dataKey={valueKey} radius={4} barSize={16} minPointSize={2} isAnimationActive={false}>
            {sorted.map((d) => (
              <Cell key={d[nameKey]} fill={d[valueKey] >= 0 ? COLORS.statusGoodFill : COLORS.statusCriticalFill} />
            ))}
            <LabelList
              dataKey={valueKey}
              content={({ x, y, width, height: h, value }) => {
                // Recharts anchors x at the zero baseline for every bar and signs the
                // width, so the bar's true far edge (away from zero) is x + width.
                const positive = value >= 0;
                const farEdge = x + width;
                // A short bar has no room for an outside label without crowding the
                // axis (small bars) or the category labels (very large bars run past
                // the plot edge) - flip inside the fill once the bar is wide enough.
                const inside = Math.abs(width) > insideThreshold;
                const labelX = inside ? farEdge + (positive ? -6 : 6) : farEdge + (positive ? 6 : -6);
                const anchor = inside ? (positive ? 'end' : 'start') : (positive ? 'start' : 'end');
                const text = `${positive ? '+' : ''}${isNarrow ? Math.round(value) : value}%`;
                // A negative bar too short for an inside label can still run its
                // outside label into the category-name gutter on a narrow chart -
                // there's no safe spot left, so skip the label rather than overlap it.
                if (!inside && !positive) {
                  const approxTextWidth = text.length * (labelFontSize * 0.62);
                  if (labelX - approxTextWidth < gutterEdgeX + 4) return null;
                }
                return (
                  <text
                    x={labelX}
                    y={y + h / 2}
                    dy={4}
                    textAnchor={anchor}
                    fontSize={labelFontSize}
                    fontWeight={700}
                    fill={inside ? '#ffffff' : COLORS.ink}
                  >
                    {text}
                  </text>
                );
              }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
