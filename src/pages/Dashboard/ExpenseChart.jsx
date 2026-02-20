import { Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useMonthlyData } from '../../hooks/useMonthlyData';
import { COLORS, PIE_COLORS } from '../../theme';
import { fmt, fmtFull } from '../../utils/format';

export default function ExpenseChart() {
  const { currentData, calcExpenses, calcSavings } = useMonthlyData();

  const expEntries = currentData.expenses
    ? Object.entries(currentData.expenses)
        .filter(([, v]) => v > 0)
        .sort((a, b) => b[1] - a[1])
    : [];

  const savEntries = currentData.savings
    ? Object.entries(currentData.savings)
        .filter(([, v]) => v > 0)
        .sort((a, b) => b[1] - a[1])
    : [];

  const cExpenses = calcExpenses(currentData);
  const cSavings = calcSavings(currentData);

  // Build combined pie data
  const allEntries = [
    ...expEntries.map(([n, v]) => ({ name: n, value: parseFloat(v), type: 'exp' })),
    ...savEntries.map(([n, v]) => ({ name: n, value: parseFloat(v), type: 'sav' })),
  ];

  if (allEntries.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Expenses
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.textDim }}>
            No expenses this month
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const pieData = allEntries.slice(0, 10).map((item) => ({
    name: item.name.length > 14 ? item.name.slice(0, 14) + '\u2026' : item.name,
    value: item.value,
    type: item.type,
  }));

  if (allEntries.length > 10) {
    pieData.push({
      name: 'Others',
      value: allEntries.slice(10).reduce((s, i) => s + i.value, 0),
      type: 'exp',
    });
  }

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <Box
        sx={{
          bgcolor: COLORS.bgCard,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 2,
          px: 1.5,
          py: 1,
        }}
      >
        <Typography variant="caption" sx={{ color: COLORS.textMuted }}>
          {payload[0].name}
        </Typography>
        <Typography variant="body2" fontWeight={600}>
          {fmtFull(payload[0].value)}
        </Typography>
      </Box>
    );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Full Breakdown
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Pie chart */}
          <Box sx={{ width: 140, height: 140, flexShrink: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={65}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Box>

          {/* Legend */}
          <Box sx={{ flex: 1, fontSize: 11 }}>
            {pieData.map((item, i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  mb: 0.5,
                }}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: 0.5,
                    bgcolor: PIE_COLORS[i % PIE_COLORS.length],
                    flexShrink: 0,
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    color: COLORS.textMuted,
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {item.name}
                  {item.type === 'sav' && (
                    <Typography
                      component="span"
                      variant="caption"
                      sx={{ color: COLORS.green, fontSize: 9, ml: 0.5 }}
                    >
                      INV
                    </Typography>
                  )}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    fontVariantNumeric: 'tabular-nums',
                    color: COLORS.text,
                  }}
                >
                  {fmt(item.value)}
                </Typography>
              </Box>
            ))}

            {/* Totals */}
            <Box sx={{ borderTop: `1px solid ${COLORS.border}`, mt: 0.75, pt: 0.75 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" fontWeight={600} sx={{ color: COLORS.red }}>
                  Expenses
                </Typography>
                <Typography variant="caption" fontWeight={600} sx={{ color: COLORS.red }}>
                  {fmt(cExpenses)}
                </Typography>
              </Box>
              {cSavings > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" fontWeight={600} sx={{ color: COLORS.green }}>
                    Investments
                  </Typography>
                  <Typography variant="caption" fontWeight={600} sx={{ color: COLORS.green }}>
                    {fmt(cSavings)}
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.25 }}>
                <Typography variant="caption" fontWeight={700} sx={{ color: COLORS.accentLight }}>
                  Total Out
                </Typography>
                <Typography variant="caption" fontWeight={700} sx={{ color: COLORS.accentLight }}>
                  {fmt(cExpenses + cSavings)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
