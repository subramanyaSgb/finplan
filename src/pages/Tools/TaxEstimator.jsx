import { useState } from 'react';
import {
  Box, Card, CardContent, TextField, Button, Typography, InputAdornment, Chip,
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { COLORS } from '../../theme';
import { fmtFull } from '../../utils/format';

// New Regime FY 2025-26 slabs
function calcNewRegimeTax(grossIncome) {
  const stdDeduction = 75000;
  const taxableIncome = Math.max(0, grossIncome - stdDeduction);

  // Rebate u/s 87A: if taxable income <= 12L, rebate up to 25000
  const slabs = [
    { upto: 400000, rate: 0 },
    { upto: 800000, rate: 0.05 },
    { upto: 1200000, rate: 0.10 },
    { upto: 1600000, rate: 0.15 },
    { upto: 2000000, rate: 0.20 },
    { upto: 2400000, rate: 0.25 },
    { upto: Infinity, rate: 0.30 },
  ];

  let tax = 0;
  let prev = 0;
  for (const slab of slabs) {
    if (taxableIncome <= prev) break;
    const slabAmount = Math.min(taxableIncome, slab.upto) - prev;
    tax += Math.max(0, slabAmount) * slab.rate;
    prev = slab.upto;
  }

  // Rebate u/s 87A for new regime
  if (taxableIncome <= 1200000) {
    tax = Math.max(0, tax - 25000);
  }

  // 4% cess
  const cess = tax * 0.04;

  return {
    grossIncome,
    stdDeduction,
    taxableIncome,
    tax,
    cess,
    totalTax: tax + cess,
  };
}

// Old Regime slabs
function calcOldRegimeTax(grossIncome, deductions) {
  const stdDeduction = 50000;
  const sec80C = Math.min(parseFloat(deductions.sec80C) || 0, 150000);
  const sec80D = Math.min(parseFloat(deductions.sec80D) || 0, 50000);
  const hra = parseFloat(deductions.hra) || 0;

  const totalDeductions = stdDeduction + sec80C + sec80D + hra;
  const taxableIncome = Math.max(0, grossIncome - totalDeductions);

  const slabs = [
    { upto: 250000, rate: 0 },
    { upto: 500000, rate: 0.05 },
    { upto: 1000000, rate: 0.20 },
    { upto: Infinity, rate: 0.30 },
  ];

  let tax = 0;
  let prev = 0;
  for (const slab of slabs) {
    if (taxableIncome <= prev) break;
    const slabAmount = Math.min(taxableIncome, slab.upto) - prev;
    tax += Math.max(0, slabAmount) * slab.rate;
    prev = slab.upto;
  }

  // Rebate u/s 87A for old regime: if taxable income <= 5L, rebate up to 12500
  if (taxableIncome <= 500000) {
    tax = Math.max(0, tax - 12500);
  }

  // 4% cess
  const cess = tax * 0.04;

  return {
    grossIncome,
    stdDeduction,
    totalDeductions,
    taxableIncome,
    tax,
    cess,
    totalTax: tax + cess,
  };
}

export default function TaxEstimator() {
  const [income, setIncome] = useState('1200000');
  const [deductions, setDeductions] = useState({
    sec80C: '150000',
    sec80D: '25000',
    hra: '0',
  });
  const [result, setResult] = useState(null);

  const setDed = (field) => (e) =>
    setDeductions((d) => ({ ...d, [field]: e.target.value }));

  const calculate = () => {
    const gross = parseFloat(income);
    if (!gross) return;

    const newRegime = calcNewRegimeTax(gross);
    const oldRegime = calcOldRegimeTax(gross, deductions);
    const betterRegime = newRegime.totalTax <= oldRegime.totalTax ? 'new' : 'old';
    const savings = Math.abs(newRegime.totalTax - oldRegime.totalTax);

    setResult({ newRegime, oldRegime, betterRegime, savings });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Input Card */}
      <Card>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            Income Tax Estimator (FY 2025-26)
          </Typography>

          <TextField
            label="Annual Gross Income"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            type="number"
            placeholder="e.g. 1200000"
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">{'\u20B9'}</InputAdornment>,
              },
            }}
          />

          <Typography
            variant="caption"
            sx={{ color: COLORS.textMuted, fontWeight: 600, letterSpacing: 0.5, mt: 0.5 }}
          >
            DEDUCTIONS (Old Regime only)
          </Typography>

          <TextField
            label="Section 80C (max 1.5L)"
            value={deductions.sec80C}
            onChange={setDed('sec80C')}
            type="number"
            placeholder="e.g. 150000"
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">{'\u20B9'}</InputAdornment>,
              },
            }}
          />

          <TextField
            label="Section 80D - Health Insurance (max 50K)"
            value={deductions.sec80D}
            onChange={setDed('sec80D')}
            type="number"
            placeholder="e.g. 25000"
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">{'\u20B9'}</InputAdornment>,
              },
            }}
          />

          <TextField
            label="HRA Exemption"
            value={deductions.hra}
            onChange={setDed('hra')}
            type="number"
            placeholder="e.g. 0"
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">{'\u20B9'}</InputAdornment>,
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
            Compare Tax Regimes
          </Button>
        </CardContent>
      </Card>

      {result && (
        <>
          {/* Recommendation */}
          <Card
            sx={{
              background:
                result.betterRegime === 'new'
                  ? `linear-gradient(135deg, ${COLORS.greenDim}, ${COLORS.bgCard})`
                  : `linear-gradient(135deg, ${COLORS.orangeDim}, ${COLORS.bgCard})`,
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <CheckCircleIcon
                sx={{
                  color: result.betterRegime === 'new' ? COLORS.green : COLORS.orange,
                  fontSize: 28,
                  mb: 0.5,
                }}
              />
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: COLORS.white }}>
                {result.betterRegime === 'new' ? 'New Regime' : 'Old Regime'} is better for you
              </Typography>
              <Typography sx={{ fontSize: 11, color: COLORS.textMuted, mt: 0.5 }}>
                You save {fmtFull(result.savings)} compared to the{' '}
                {result.betterRegime === 'new' ? 'Old' : 'New'} Regime
              </Typography>
            </CardContent>
          </Card>

          {/* Side-by-side comparison */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            {/* New Regime */}
            <Card
              sx={{
                border: result.betterRegime === 'new'
                  ? `2px solid ${COLORS.green}`
                  : `1px solid ${COLORS.border}`,
              }}
            >
              <CardContent sx={{ p: '12px !important' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 700, color: COLORS.text }}>
                    New Regime
                  </Typography>
                  {result.betterRegime === 'new' && (
                    <Chip
                      label="Better"
                      size="small"
                      sx={{
                        bgcolor: `${COLORS.green}20`,
                        color: COLORS.green,
                        height: 18,
                        fontSize: 9,
                        fontWeight: 700,
                      }}
                    />
                  )}
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box>
                    <Typography sx={{ fontSize: 9, color: COLORS.textMuted }}>
                      Std. Deduction
                    </Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>
                      {fmtFull(result.newRegime.stdDeduction)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 9, color: COLORS.textMuted }}>
                      Taxable Income
                    </Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>
                      {fmtFull(result.newRegime.taxableIncome)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 9, color: COLORS.textMuted }}>Tax</Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: COLORS.orange }}>
                      {fmtFull(result.newRegime.tax)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 9, color: COLORS.textMuted }}>
                      Cess (4%)
                    </Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: COLORS.textMuted }}>
                      {fmtFull(result.newRegime.cess)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      borderTop: `1px solid ${COLORS.border}`,
                      pt: 1,
                    }}
                  >
                    <Typography sx={{ fontSize: 9, color: COLORS.textMuted }}>
                      Total Tax
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 16,
                        fontWeight: 800,
                        color: result.betterRegime === 'new' ? COLORS.green : COLORS.red,
                      }}
                    >
                      {fmtFull(result.newRegime.totalTax)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Old Regime */}
            <Card
              sx={{
                border: result.betterRegime === 'old'
                  ? `2px solid ${COLORS.green}`
                  : `1px solid ${COLORS.border}`,
              }}
            >
              <CardContent sx={{ p: '12px !important' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 700, color: COLORS.text }}>
                    Old Regime
                  </Typography>
                  {result.betterRegime === 'old' && (
                    <Chip
                      label="Better"
                      size="small"
                      sx={{
                        bgcolor: `${COLORS.green}20`,
                        color: COLORS.green,
                        height: 18,
                        fontSize: 9,
                        fontWeight: 700,
                      }}
                    />
                  )}
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box>
                    <Typography sx={{ fontSize: 9, color: COLORS.textMuted }}>
                      Total Deductions
                    </Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>
                      {fmtFull(result.oldRegime.totalDeductions)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 9, color: COLORS.textMuted }}>
                      Taxable Income
                    </Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: COLORS.text }}>
                      {fmtFull(result.oldRegime.taxableIncome)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 9, color: COLORS.textMuted }}>Tax</Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: COLORS.orange }}>
                      {fmtFull(result.oldRegime.tax)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 9, color: COLORS.textMuted }}>
                      Cess (4%)
                    </Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: COLORS.textMuted }}>
                      {fmtFull(result.oldRegime.cess)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      borderTop: `1px solid ${COLORS.border}`,
                      pt: 1,
                    }}
                  >
                    <Typography sx={{ fontSize: 9, color: COLORS.textMuted }}>
                      Total Tax
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 16,
                        fontWeight: 800,
                        color: result.betterRegime === 'old' ? COLORS.green : COLORS.red,
                      }}
                    >
                      {fmtFull(result.oldRegime.totalTax)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </>
      )}
    </Box>
  );
}
