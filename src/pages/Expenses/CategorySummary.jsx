import { Card, CardContent, Box, Typography, LinearProgress } from '@mui/material';
import { COLORS, PIE_COLORS } from '../../theme';
import { fmtFull, pct } from '../../utils/format';

export default function CategorySummary({ monthExpenses }) {
  if (!monthExpenses || monthExpenses.length === 0) return null;

  // Aggregate by category
  const cats = {};
  const catCounts = {};
  monthExpenses.forEach((e) => {
    cats[e.category] = (cats[e.category] || 0) + (e.amount || 0);
    catCounts[e.category] = (catCounts[e.category] || 0) + 1;
  });

  const catEntries = Object.entries(cats).sort((a, b) => b[1] - a[1]);
  const total = monthExpenses.reduce((s, e) => s + (e.amount || 0), 0);

  if (catEntries.length === 0) return null;

  return (
    <Card sx={{ mb: 1.5 }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1.25 }}>
          Quick-Add by Category
        </Typography>

        {catEntries.slice(0, 6).map(([cat, val], i) => {
          const color = PIE_COLORS[i % PIE_COLORS.length];
          const percentage = pct(val, total);

          return (
            <Box key={cat} sx={{ mb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.4 }}>
                <Typography sx={{ fontSize: 12 }}>{cat}</Typography>
                <Typography sx={{ fontSize: 12, color: COLORS.textMuted }}>
                  {fmtFull(val)} &middot; {percentage}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={percentage}
                sx={{
                  height: 5,
                  borderRadius: 3,
                  bgcolor: `${color}20`,
                  '& .MuiLinearProgress-bar': {
                    bgcolor: color,
                    borderRadius: 3,
                  },
                }}
              />
            </Box>
          );
        })}
      </CardContent>
    </Card>
  );
}
