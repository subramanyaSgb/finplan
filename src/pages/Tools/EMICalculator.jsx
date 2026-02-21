import { useState } from 'react';
import {
  Box, Card, CardContent, TextField, Button, Typography, InputAdornment,
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import { COLORS } from '../../theme';
import { fmt, fmtFull, pct } from '../../utils/format';

export default function EMICalculator() {
  const [form, setForm] = useState({ principal: '120640', rate: '9.5', tenure: '36' });
  const [result, setResult] = useState(null);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const calculate = () => {
    const P = parseFloat(form.principal);
    const annualRate = parseFloat(form.rate);
    const N = parseFloat(form.tenure);
    if (!P || !annualRate || !N) return;

    const R = annualRate / 12 / 100;
    const emiVal = P * R * Math.pow(1 + R, N) / (Math.pow(1 + R, N) - 1);
    const totalPay = emiVal * N;
    const interest = totalPay - P;

    setResult({ emi: emiVal, total: totalPay, interest, principal: P });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Card>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            Loan EMI Calculator
          </Typography>

          <TextField
            label="Loan Amount"
            value={form.principal}
            onChange={set('principal')}
            type="number"
            placeholder="e.g. 120640"
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">{'\u20B9'}</InputAdornment>,
              },
            }}
          />

          <TextField
            label="Interest Rate"
            value={form.rate}
            onChange={set('rate')}
            type="number"
            placeholder="e.g. 9.5"
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">% p.a.</InputAdornment>,
              },
            }}
          />

          <TextField
            label="Tenure"
            value={form.tenure}
            onChange={set('tenure')}
            type="number"
            placeholder="e.g. 36"
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">months</InputAdornment>,
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
            Calculate EMI
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card
          sx={{
            background: `linear-gradient(135deg, ${COLORS.accentDim}, ${COLORS.bgCard})`,
          }}
        >
          <CardContent>
            <Typography
              variant="overline"
              sx={{ color: COLORS.accentLight, fontWeight: 600, letterSpacing: 1 }}
            >
              EMI BREAKDOWN
            </Typography>

            {/* Monthly EMI - large centered */}
            <Box sx={{ textAlign: 'center', my: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Monthly EMI
              </Typography>
              <Typography
                sx={{
                  fontSize: 32,
                  fontWeight: 800,
                  color: COLORS.white,
                  letterSpacing: -1,
                }}
              >
                {fmtFull(result.emi)}
              </Typography>
            </Box>

            {/* 3-column grid: Principal, Interest, Total */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1.5 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontSize: 10, color: COLORS.textMuted }}>Principal</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>
                  {fmt(result.principal)}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontSize: 10, color: COLORS.textMuted }}>Interest</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: COLORS.red }}>
                  {fmt(result.interest)}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontSize: 10, color: COLORS.textMuted }}>Total Pay</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: COLORS.orange }}>
                  {fmt(result.total)}
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
              <Box sx={{ flex: result.principal, bgcolor: COLORS.accent }} />
              <Box sx={{ flex: result.interest, bgcolor: COLORS.red }} />
            </Box>

            {/* Percentage labels */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.75 }}>
              <Typography sx={{ fontSize: 10, color: COLORS.accentLight }}>
                Principal {pct(result.principal, result.total)}%
              </Typography>
              <Typography sx={{ fontSize: 10, color: COLORS.red }}>
                Interest {pct(result.interest, result.total)}%
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
