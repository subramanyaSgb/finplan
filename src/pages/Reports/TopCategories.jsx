import { useMemo } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { COLORS, PIE_COLORS } from '../../theme';
import { fmtFull, pct } from '../../utils/format';

const MAX_CATEGORIES = 10;

export default function TopCategories({ data }) {
  const ranked = useMemo(() => {
    const catTotals = {};
    data.forEach((m) => {
      if (!m.expenses) return;
      Object.entries(m.expenses).forEach(([cat, val]) => {
        const v = parseFloat(val) || 0;
        if (v > 0) catTotals[cat] = (catTotals[cat] || 0) + v;
      });
    });

    const sorted = Object.entries(catTotals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, MAX_CATEGORIES);

    const grandTotal = Object.values(catTotals).reduce((s, v) => s + v, 0);

    return sorted.map(([name, total], i) => ({
      rank: i + 1,
      name,
      total,
      percentage: grandTotal > 0 ? (total / grandTotal) * 100 : 0,
      color: PIE_COLORS[i % PIE_COLORS.length],
    }));
  }, [data]);

  if (ranked.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="body2" color="text.secondary">No data for selected period</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} gutterBottom>
        Top Spending Categories
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
        {ranked.map((item) => (
          <Box key={item.name}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  sx={{
                    color: COLORS.textDim,
                    width: 20,
                    textAlign: 'right',
                    flexShrink: 0,
                  }}
                >
                  {item.rank}
                </Typography>
                <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text }}>
                  {item.name}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ color: COLORS.textMuted }}>
                  {Math.round(item.percentage)}%
                </Typography>
                <Typography variant="body2" fontWeight={600} sx={{ color: COLORS.text, minWidth: 80, textAlign: 'right' }}>
                  {fmtFull(item.total)}
                </Typography>
              </Box>
            </Box>
            <LinearProgress
              variant="determinate"
              value={item.percentage}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: COLORS.border,
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  bgcolor: item.color,
                },
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
