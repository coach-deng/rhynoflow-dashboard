import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-100 rounded-xl shadow-lg px-4 py-3">
      <p className="text-xs font-bold text-slate-400 uppercase mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-sm font-bold" style={{ color: entry.color }}>
          {entry.name === 'revenue' ? 'Actual' : 'Goal'}: {entry.value.toLocaleString()} kr
        </p>
      ))}
    </div>
  );
};

const RevenueChart = ({ data, goal }) => (
  <div className="rhyno-card mt-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h3 className="font-bold text-lg text-slate-900">Revenue Progress</h3>
        <p className="text-xs text-slate-400 font-medium mt-0.5">Monthly vs {goal?.toLocaleString()} kr goal</p>
      </div>
      <div className="flex items-center gap-4 text-xs font-bold">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-brand-green inline-block" /> Actual
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-slate-200 inline-block" /> Goal
        </span>
      </div>
    </div>
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00c853" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#00c853" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => v === 0 ? '' : `${(v / 1000).toFixed(0)}k`}
          width={32}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine
          y={goal}
          stroke="#e2e8f0"
          strokeDasharray="6 3"
          label={{ value: 'Goal', position: 'insideTopRight', fontSize: 10, fill: '#94a3b8', fontWeight: 700 }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#00c853"
          strokeWidth={2.5}
          fill="url(#revenueGradient)"
          dot={{ fill: '#00c853', r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#00c853', strokeWidth: 2, stroke: '#fff' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default RevenueChart;
