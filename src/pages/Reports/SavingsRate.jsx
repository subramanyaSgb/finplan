import { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { COLORS } from '../../theme';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  const color = val >= 20 ? COLORS.green : val >= 10 ? COLORS.orange : COLORS.red;
  return (
    <Box sx={{ bgcolor: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 2, px: 1.5, py: 1 }}>
      <Typography variant="caption" sx={{ color: COLORS.textMuted }}>{label}</Typography>
      <Typography variant="body2" fontWeight={600} sx={{ color }}>
        {val.toFixed(1)}%
      </Typography>
    </Box>
  );
};

// Custom dot that changes color based on savings rate value
const CustomDot = (props) => {
  const { cx, cy, value } = props;
  if (cx == null || cy == null) return null;
  const color = value >= 20 ? COLORS.green : value >= 10 ? COLORS.orange : COLORS.red;
  return <circle cx={cx} cy={cy} r={4} fill={color} stroke={color} />;
};

export default function SavingsRate({ data, calcIncome, calcExpenses, calcSavings }) {
  const chartData = useMemo(() =>
    data.map((m) => {
      const income = calcIncome(m);
      // Savings rate = what's left after ALL outflows (expenses + savings/investments)
      // "left" is income - expenses - savings
      const left = m.left != null ? m.left : income - calcExpenses(m) - calcSavings(m);
      const rate = income > 0 ? (left / income) * 100 : 0;
      return {
        name: m.month,
        rate: Math.round(rate * 10) / 10,
      };
    }),
    [data, calcIncome, calcExpenses, calcSavings],
  );

  if (chartData.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="body2" color="text.secondary">No data for selected period</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        Savings Rate (% of Income Left)
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
        <Typography variant="caption" sx={{ color: COLORS.green }}>
          Good (&ge;20%)
        </Typography>
        <Typography variant="caption" sx={{ color: COLORS.orange }}>
          Fair (10-20%)
        </Typography>
        <Typography variant="caption" sx={{ color: COLORS.red }}>
          Low (&lt;10%)
        </Typography>
      </Box>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
          <XAxis
            dataKey="name"
            tick={{ fill: COLORS.textMuted, fontSize: 11 }}
            axisLine={{ stroke: COLORS.border }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: COLORS.textMuted, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
            domain={['auto', 'auto']}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={20} stroke={COLORS.green} strokeDasharray="3 3" strokeOpacity={0.5} />
          <ReferenceLine y={10} stroke={COLORS.orange} strokeDasharray="3 3" strokeOpacity={0.5} />
          <Line
            type="monotone"
            dataKey="rate"
            stroke={COLORS.accent}
            strokeWidth={2}
            dot={<CustomDot />}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
