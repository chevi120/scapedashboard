import { Bar, BarChart, Cell, LabelList, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartTooltip } from './ChartTooltip.jsx';
import { SectionHeader } from './SectionHeader.jsx';
import { COLORS } from '../lib/colors.js';

// Categorical hue order fixed by rank (highest opportunity share first) so
// the mix donut and its legend always line up the same way across weeks.
const MIX_HUES = [
  COLORS.magnitudeBlue,
  '#FA70AB',
  '#F58C34',
  '#00B7BD',
  '#814496',
  COLORS.statusGoodFill,
  '#A7A9B4',
];

export function ChannelChart({ channels }) {
  const data = [...channels].sort((a, b) => b.cvr - a.cvr);
  const height = Math.max(220, data.length * 38);
  const hasVolume = channels.every((c) => c.opportunities != null);
  const mix = hasVolume ? [...channels].sort((a, b) => b.opportunities - a.opportunities) : [];
  const totalOpps = mix.reduce((sum, c) => sum + c.opportunities, 0);

  return (
    <section>
      <SectionHeader eyebrow="Conversion" title="Conversion by channel" />
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

        {hasVolume && (
          <>
            <p className="card-subhead">Channel mix — share of opportunities</p>
            <div className="donut-wrap">
              <div className="donut-box">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mix}
                      dataKey="opportunities"
                      nameKey="name"
                      innerRadius="62%"
                      outerRadius="98%"
                      paddingAngle={1.5}
                      isAnimationActive={false}
                      stroke="none"
                    >
                      {mix.map((c, i) => (
                        <Cell key={c.name} fill={MIX_HUES[i % MIX_HUES.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={
                        <ChartTooltip
                          valueFormatter={(e) => `${e.value.toLocaleString('en-AU')} opportunities`}
                        />
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="donut-center">
                  <span className="total">{totalOpps.toLocaleString('en-AU')}</span>
                  <span className="caption">Opps</span>
                </div>
              </div>
              <div className="donut-legend">
                {mix.map((c, i) => (
                  <div className="donut-legend-row" key={c.name}>
                    <span className="dot" style={{ background: MIX_HUES[i % MIX_HUES.length] }} />
                    <span className="name">{c.name}</span>
                    <span className="val">{totalOpps ? Math.round((c.opportunities / totalOpps) * 100) : 0}%</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
