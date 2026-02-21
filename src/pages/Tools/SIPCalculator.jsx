import { useState, useMemo } from 'react';
import {
  Box, Card, CardContent, TextField, Button, Typography, InputAdornment,
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { COLORS } from '../../theme';
import { fmt, fmtFull } from '../../utils/format';

export default function SIPCalculator() {
  const [form, setForm] = useState({ amount: '5000', rate: '12', years: '10' });
  const [result, setResult] = useState(null);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const calculate = () => {
    const P = parseFloat(form.amount);
    const annualRate = parseFloat(form.rate);
    const years = parseFloat(form.years);
    if (!P || !annualRate || !years) return;

    const r = annualRate / 12 / 100; // monthly rate
    const n = years * 12; // total months

    // FV = P * [(1+r)^n - 1] / r * (1+r)
    const futureValue = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const totalInvested = P * n;
    const estimatedReturns = futureValue - totalInvested;

    // Build chart data (yearly snapshots)
    const chartData = [];
    for (let y = 0; y <= years; y++) {
      const months = y * 12;
      if (months === 0) {
        chartData.push({ year: `Y0`, invested: 0, value: 0 });
        continue;
      }
      const fv = P * ((Math.pow(1 + r, months) - 1) / r) * (1 + r);
      const inv = P * months;
      chartData.push({
        year: `Y${y}`,
        invested: Math.round(inv),
        value: Math.round(fv),
      });
    }

    setResult({ futureValue, totalInvested, estimatedReturns, chartData });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <Box
        sx={{
          bgcolor: COLORS.bg,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 2,
          p: 1.5,
          minWidth: 140,
        }}
      >
        <Typography sx={{ fontSize: 11, fontWeight: 600, color: COLORS.text, mb: 0.5 }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: 11, color: COLORS.green }}>
          Value: {fmtFull(payload[0]?.value)}
        </Typography>
        <Typography sx={{ fontSize: 11, color: COLORS.accent }}>
          Invested: {fmtFull(payload[1]?.value)}
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Card>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            SIP Calculator
          </Typography>

          <TextField
            label="Monthly SIP Amount"
            value={form.amount}
            onChange={set('amount')}
            type="number"
            placeholder="e.g. 5000"
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">{'\u20B9'}</InputAdornment>,
              },
            }}
          />

          <TextField
            label="Expected Annual Return"
            value={form.rate}
            onChange={set('rate')}
            type="number"
            placeholder="e.g. 12"
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              },
            }}
          />

          <TextField
            label="Investment Period"
            value={form.years}
            onChange={set('years')}
            type="number"
            placeholder="e.g. 10"
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">years</InputAdornment>,
              },
            }}
          />

          <Button
            variant="contained"
            fullWidth
            startIcon={<CalculateIcon />}
            onClick={calculate}
            sx={{ py: 1.25, mt: 0.5 }}
          >
            Calculate
          </Button>
        </CardContent>
      </Card>

      {result && (
        <>
          {/* Results Card */}
          <Card
            sx={{
              background: `linear-gradient(135deg, ${COLORS.greenDim}, ${COLORS.bgCard})`,
            }}
          >
            <CardContent>
              <Typography
                variant="overline"
                sx={{ color: COLORS.green, fontWeight: 600, letterSpacing: 1 }}
              >
                SIP RESULTS
              </Typography>

              <Box sx={{ textAlign: 'center', my: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Maturity Value
                </Typography>
                <Typography
                  sx={{
                    fontSize: 32,
                    fontWeight: 800,
                    color: COLORS.white,
                    letterSpacing: -1,
                  }}
                >
                  {fmtFull(result.futureValue)}
                </Typography>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 10, color: COLORS.textMuted }}>
                    Total Invested
                  </Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: COLORS.accent }}>
                    {fmt(result.totalInvested)}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 10, color: COLORS.textMuted }}>
                    Estimated Returns
                  </Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: COLORS.green }}>
                    {fmt(result.estimatedReturns)}
                  </Typography>
                </Box>
              </Box>

              {/* Visual breakdown bar */}
              <Box
                sx={{
                  display: 'flex',
                  gap: '2px',
                  height: 12,
                  borderRadius: 1.5,
                  overflow: 'hidden',
                  mt: 2,
                }}
              >
                <Box sx={{ flex: result.totalInvested, bgcolor: COLORS.accent }} />
                <Box sx={{ flex: result.estimatedReturns, bgcolor: COLORS.green }} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.75 }}>
                <Typography sx={{ fontSize: 10, color: COLORS.accentLight }}>
                  Invested {Math.round((result.totalInvested / result.futureValue) * 100)}%
                </Typography>
                <Typography sx={{ fontSize: 10, color: COLORS.green }}>
                  Returns {Math.round((result.estimatedReturns / result.futureValue) * 100)}%
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Chart Card */}
          <Card>
            <CardContent>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                Wealth Growth Over Time
              </Typography>
              <Box sx={{ width: '100%', height: 220 }}>
                <ResponsiveContainer>
                  <AreaChart data={result.chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    <defs>
                      <linearGradient id="sipValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.green} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={COLORS.green} stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="sipInvested" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.accent} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={COLORS.accent} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="year"
                      tick={{ fontSize: 10, fill: COLORS.textMuted }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: COLORS.textMuted }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => fmt(v, '')}
                      width={45}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={COLORS.green}
                      fill="url(#sipValue)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="invested"
                      stroke={COLORS.accent}
                      fill="url(#sipInvested)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: COLORS.green }} />
                  <Typography sx={{ fontSize: 10, color: COLORS.textMuted }}>Value</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: COLORS.accent }} />
                  <Typography sx={{ fontSize: 10, color: COLORS.textMuted }}>Invested</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
}
