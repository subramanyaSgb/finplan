import { Box, Card, CardContent, Typography, Tooltip } from '@mui/material';
import { useMonthlyData } from '../../hooks/useMonthlyData';
import { COLORS } from '../../theme';
import { fmt, fmtFull, pct } from '../../utils/format';

export default function OverviewCards() {
  const { currentData, calcIncome, calcExpenses, calcSavings } = useMonthlyData();

  const income = calcIncome(currentData);
  const expenses = calcExpenses(currentData);
  const savings = calcSavings(currentData);
  const totalOut = expenses + savings;
  const left = currentData.left ?? (income - totalOut);

  const cards = [
    {
      label: 'INCOME',
      value: income,
      color: COLORS.accentLight,
      gradient: `linear-gradient(135deg, ${COLORS.accentDim}, ${COLORS.bgCard})`,
      sub: `Salary: ${fmt(currentData.income?.Salary || currentData.salary || 0)}`,
    },
    {
      label: 'EXPENSES',
      value: expenses,
      color: COLORS.red,
      gradient: `linear-gradient(135deg, ${COLORS.redDim}, ${COLORS.bgCard})`,
      sub: `${pct(expenses, income)}% of income`,
    },
    {
      label: 'LEFT OVER',
      value: left,
      color: left >= 0 ? COLORS.green : COLORS.red,
      gradient: `linear-gradient(135deg, ${COLORS.greenDim}, ${COLORS.bgCard})`,
      sub: `${pct(Math.max(0, left), income)}% saved`,
    },
    {
      label: 'INVESTMENTS',
      value: savings,
      color: COLORS.purple,
      gradient: `linear-gradient(135deg, ${COLORS.purpleDim}, ${COLORS.bgCard})`,
      sub: `${pct(savings, income)}% of income`,
    },
  ];

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25 }}>
      {cards.map((c) => (
        <Tooltip key={c.label} title={fmtFull(c.value)} arrow placement="top">
          <Card sx={{ background: c.gradient }}>
            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
              <Typography
                variant="caption"
                sx={{ color: c.color, fontWeight: 500, letterSpacing: 0.5 }}
              >
                {c.label}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: c.label === 'LEFT OVER' ? c.color : COLORS.white,
                  letterSpacing: -0.5,
                  mt: 0.5,
                }}
              >
                {fmt(c.value)}
              </Typography>
              <Typography variant="caption" sx={{ color: COLORS.textMuted, mt: 0.25, display: 'block' }}>
                {c.sub}
              </Typography>
            </CardContent>
          </Card>
        </Tooltip>
      ))}
    </Box>
  );
}
