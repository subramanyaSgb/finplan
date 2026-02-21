import { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { COLORS } from '../../theme';
import { fmt, fmtFull } from '../../utils/format';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 2, px: 1.5, py: 1 }}>
      <Typography variant="caption" sx={{ color: COLORS.textMuted, display: 'block', mb: 0.5 }}>{label}</Typography>
      {payload.map((p, i) => (
        <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Typography variant="caption" sx={{ color: p.color }}>{p.name}</Typography>
          <Typography variant="caption" fontWeight={600}>{fmtFull(p.value)}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default function IncomeVsExpense({ data, calcIncome, calcExpenses, calcSavings }) {
  const chartData = useMemo(() =>
    data.map((m) => ({
      name: m.month,
      Income: calcIncome(m),
      Expenses: calcExpenses(m),
      Savings: calcSavings(m),
    })),
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
        Income vs Expenses vs Savings
      </Typography>
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
            tickFormatter={(v) => fmt(v)}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 11, color: COLORS.textMuted }}
            verticalAlign="bottom"
          />
          <Line
            type="monotone"
            dataKey="Income"
            stroke={COLORS.accent}
            strokeWidth={2}
            dot={{ fill: COLORS.accent, r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="Expenses"
            stroke={COLORS.red}
            strokeWidth={2}
            dot={{ fill: COLORS.red, r: 3 }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="Savings"
            stroke={COLORS.green}
            strokeWidth={2}
            dot={{ fill: COLORS.green, r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
