import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { COLORS } from '../lib/colors.js';

// Win rate reads only from closed opportunities (Won + Lost) — pipeline still
// "in flight" (Discovery/Room Proposal/Tentative/Waitlist) has no bearing on
// a rate that's only meaningful once an outcome exists.
export function WinRateGauge({ pipeline }) {
  const won = pipeline.find((p) => p.stage.trim().toLowerCase() === 'closed won')?.count;
  const lost = pipeline.find((p) => p.stage.trim().toLowerCase() === 'closed lost')?.count;
  if (won == null || lost == null || won + lost === 0) return null;

  const rate = (won / (won + lost)) * 100;
  const gaugeData = [{ value: rate }, { value: 100 - rate }];

  return (
    <div className="gauge-card">
      <div className="gauge-box">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={gaugeData}
              dataKey="value"
              innerRadius="72%"
              outerRadius="98%"
              startAngle={90}
              endAngle={-270}
              isAnimationActive={false}
              stroke="none"
            >
              <Cell fill={COLORS.statusGoodFill} />
              <Cell fill="rgba(255,255,255,0.18)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="gauge-center">{rate.toFixed(0)}%</div>
      </div>
      <div className="gauge-info">
        <p className="gauge-label">Win rate</p>
        <p className="gauge-value">{rate.toFixed(1)}%</p>
        <p className="gauge-formula">
          Won {won} ÷ (Won {won} + Lost {lost})
        </p>
      </div>
    </div>
  );
}
