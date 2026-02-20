import { Card, CardContent, Typography, Box, Divider } from '@mui/material';
import { useMonthlyData } from '../../hooks/useMonthlyData';
import { COLORS } from '../../theme';
import { fmtFull } from '../../utils/format';

export default function SavingsBreakdown() {
  const { currentData, calcSavings } = useMonthlyData();

  const savEntries = currentData.savings
    ? Object.entries(currentData.savings)
        .filter(([, v]) => v > 0)
        .sort((a, b) => b[1] - a[1])
    : [];

  const total = calcSavings(currentData);

  if (savEntries.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Savings & Investments
          </Typography>
          <Typography variant="body2" sx={{ color: COLORS.textDim }}>
            No savings recorded this month
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Savings & Investments
        </Typography>

        {savEntries.map(([name, amount]) => (
          <Box
            key={name}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 0.75,
            }}
          >
            <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
              {name}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
              {fmtFull(parseFloat(amount))}
            </Typography>
          </Box>
        ))}

        <Divider sx={{ my: 1 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" fontWeight={700} sx={{ color: COLORS.green }}>
            Total
          </Typography>
          <Typography variant="body2" fontWeight={700} sx={{ color: COLORS.green, fontVariantNumeric: 'tabular-nums' }}>
            {fmtFull(total)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
