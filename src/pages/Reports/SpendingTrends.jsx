import { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { COLORS } from '../../theme';
import { fmt, fmtFull } from '../../utils/format';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 2, px: 1.5, py: 1 }}>
      <Typography variant="caption" sx={{ color: COLORS.textMuted }}>{label}</Typography>
      <Typography variant="body2" fontWeight={600} sx={{ color: COLORS.red }}>
        {fmtFull(payload[0].value)}
      </Typography>
    </Box>
  );
};

export default function SpendingTrends({ data, calcExpenses }) {
  const chartData = useMemo(() =>
    data.map((m) => ({
      name: m.month,
      expenses: calcExpenses(m),
    })),
    [data, calcExpenses],
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
        Monthly Spending Trends
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
          <Line
            type="monotone"
            dataKey="expenses"
            stroke={COLORS.red}
            strokeWidth={2}
            dot={{ fill: COLORS.red, r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
