import { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { COLORS, PIE_COLORS } from '../../theme';
import { fmt, fmtFull, MONTHS } from '../../utils/format';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 2, px: 1.5, py: 1 }}>
      <Typography variant="caption" sx={{ color: COLORS.textMuted, display: 'block', mb: 0.5 }}>{label}</Typography>
      {payload.filter((p) => p.value != null).map((p, i) => (
        <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Typography variant="caption" sx={{ color: p.color }}>{p.name}</Typography>
          <Typography variant="caption" fontWeight={600}>{fmtFull(p.value)}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default function YearOverYear({ data, calcExpenses }) {
  const { chartData, years } = useMemo(() => {
    // Parse each month entry to extract month name and year
    const yearSet = new Set();
    const byMonthYear = {};

    data.forEach((m) => {
      const parts = m.month.split(' ');
      const monthName = parts[0]; // e.g. "Jan"
      const year = parts[1];      // e.g. "2025"
      yearSet.add(year);

      if (!byMonthYear[monthName]) byMonthYear[monthName] = {};
      byMonthYear[monthName][year] = calcExpenses(m);
    });

    const sortedYears = Array.from(yearSet).sort();

    // Build chart data with Jan-Dec order
    const cData = MONTHS.map((monthName) => {
      const row = { name: monthName };
      sortedYears.forEach((yr) => {
        if (byMonthYear[monthName]?.[yr] != null) {
          row[yr] = byMonthYear[monthName][yr];
        }
      });
      return row;
    }).filter((row) => Object.keys(row).length > 1); // Only months with data

    return { chartData: cData, years: sortedYears };
  }, [data, calcExpenses]);

  if (chartData.length === 0 || years.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="body2" color="text.secondary">No data for selected period</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        Year-over-Year Comparison
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
          {years.map((yr, i) => (
            <Line
              key={yr}
              type="monotone"
              dataKey={yr}
              name={yr}
              stroke={PIE_COLORS[i % PIE_COLORS.length]}
              strokeWidth={2}
              dot={{ fill: PIE_COLORS[i % PIE_COLORS.length], r: 3 }}
              activeDot={{ r: 5 }}
              connectNulls={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
