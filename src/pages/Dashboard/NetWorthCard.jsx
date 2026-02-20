import { Card, CardContent, Typography, Box, Divider } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { useInvestments } from '../../hooks/useInvestments';
import { useGoals } from '../../hooks/useGoals';
import { COLORS } from '../../theme';
import { fmt, fmtFull } from '../../utils/format';

export default function NetWorthCard() {
  const { totalMF, totalFD } = useInvestments();
  const { goals } = useGoals();

  const goalsSaved = goals.reduce((s, g) => s + (g.saved || 0), 0);
  const grandTotal = totalFD + totalMF + goalsSaved;

  const items = [
    { label: 'Fixed Deposits', value: totalFD, color: COLORS.orange },
    { label: 'Mutual Funds (SIP)', value: totalMF, color: COLORS.cyan },
    { label: 'Goal Savings', value: goalsSaved, color: COLORS.purple },
  ];

  return (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${COLORS.accentDim} 0%, ${COLORS.purpleDim} 50%, ${COLORS.bgCard} 100%)`,
        border: `1px solid ${COLORS.borderLight}`,
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <AccountBalanceIcon sx={{ color: COLORS.accentLight, fontSize: 20 }} />
          <Typography variant="subtitle2" fontWeight={700} sx={{ color: COLORS.accentLight }}>
            Wealth Snapshot
          </Typography>
        </Box>

        {items.map((item) => (
          <Box
            key={item.label}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 0.75,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: item.color,
                  flexShrink: 0,
                }}
              />
              <Typography variant="body2" sx={{ color: COLORS.textMuted }}>
                {item.label}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
              {fmt(item.value)}
            </Typography>
          </Box>
        ))}

        <Divider sx={{ my: 1 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" fontWeight={700} sx={{ color: COLORS.white }}>
            Total Wealth
          </Typography>
          <Typography variant="h6" fontWeight={700} sx={{ color: COLORS.white, letterSpacing: -0.5 }}>
            {fmtFull(grandTotal)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
