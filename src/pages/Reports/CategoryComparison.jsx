import { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
} from 'recharts';
import { COLORS, PIE_COLORS } from '../../theme';
import { fmt, fmtFull } from '../../utils/format';

const MAX_CATEGORIES = 8;

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{ bgcolor: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 2, px: 1.5, py: 1, maxWidth: 200 }}>
      <Typography variant="caption" sx={{ color: COLORS.textMuted, display: 'block', mb: 0.5 }}>{label}</Typography>
      {payload.filter((p) => p.value > 0).map((p, i) => (
        <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Typography variant="caption" sx={{ color: p.color }}>{p.dataKey}</Typography>
          <Typography variant="caption" fontWeight={600}>{fmtFull(p.value)}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default function CategoryComparison({ data }) {
  const { chartData, categories } = useMemo(() => {
    // Collect all expense categories across filtered months
    const catTotals = {};
    data.forEach((m) => {
      if (!m.expenses) return;
      Object.entries(m.expenses).forEach(([cat, val]) => {
        const v = parseFloat(val) || 0;
        if (v > 0) catTotals[cat] = (catTotals[cat] || 0) + v;
      });
    });

    // Sort by total and take top N
    const sorted = Object.entries(catTotals).sort((a, b) => b[1] - a[1]);
    const topCats = sorted.slice(0, MAX_CATEGORIES).map(([name]) => name);
    const hasOther = sorted.length > MAX_CATEGORIES;

    // Build chart data per month
    const cData = data.map((m) => {
      const row = { name: m.month };
      const expenses = m.expenses || {};
      topCats.forEach((cat) => {
        row[cat] = parseFloat(expenses[cat]) || 0;
      });
      if (hasOther) {
        row['Other'] = Object.entries(expenses)
          .filter(([cat]) => !topCats.includes(cat))
          .reduce((sum, [, v]) => sum + (parseFloat(v) || 0), 0);
      }
      return row;
    });

    const cats = hasOther ? [...topCats, 'Other'] : topCats;
    return { chartData: cData, categories: cats };
  }, [data]);

  if (chartData.length === 0 || categories.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="body2" color="text.secondary">No data for selected period</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        Category Comparison
      </Typography>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
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
          {categories.map((cat, i) => (
            <Bar
              key={cat}
              dataKey={cat}
              stackId="a"
              fill={PIE_COLORS[i % PIE_COLORS.length]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
