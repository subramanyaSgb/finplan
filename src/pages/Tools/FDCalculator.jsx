import { useState } from 'react';
import {
  Box, Card, CardContent, TextField, Button, Typography, InputAdornment,
  MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import { COLORS } from '../../theme';
import { fmtFull } from '../../utils/format';

const COMPOUNDING_OPTIONS = [
  { value: 4, label: 'Quarterly' },
  { value: 2, label: 'Half-Yearly' },
  { value: 1, label: 'Yearly' },
];

function calcFD(principal, rate, years, compounding) {
  // A = P(1 + r/n)^(nt)
  const r = rate / 100;
  const n = compounding;
  const t = years;
  const amount = principal * Math.pow(1 + r / n, n * t);
  return amount;
}

export default function FDCalculator() {
  const [form, setForm] = useState({
    principal: '100000',
    rate: '7',
    years: '5',
    compounding: 4,
  });
  const [result, setResult] = useState(null);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const calculate = () => {
    const P = parseFloat(form.principal);
    const rate = parseFloat(form.rate);
    const years = parseFloat(form.years);
    const n = parseInt(form.compounding);
    if (!P || !rate || !years) return;

    const maturityAmount = calcFD(P, rate, years, n);
    const interestEarned = maturityAmount - P;

    // Comparison table: different rates
    const offsets = [-2, -1, 0, 1, 2];
    const comparisons = offsets.map((offset) => {
      const compRate = rate + offset;
      if (compRate <= 0) return null;
      const amt = calcFD(P, compRate, years, n);
      return {
        rate: compRate,
        maturity: amt,
        interest: amt - P,
        isCurrent: offset === 0,
      };
    }).filter(Boolean);

    setResult({ maturityAmount, interestEarned, principal: P, comparisons });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Card>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            Fixed Deposit Calculator
          </Typography>

          <TextField
            label="Principal Amount"
            value={form.principal}
            onChange={set('principal')}
            type="number"
            placeholder="e.g. 100000"
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
            placeholder="e.g. 7"
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">% p.a.</InputAdornment>,
              },
            }}
          />

          <TextField
            label="Tenure"
            value={form.years}
            onChange={set('years')}
            type="number"
            placeholder="e.g. 5"
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">years</InputAdornment>,
              },
            }}
          />

          <TextField
            select
            label="Compounding Frequency"
            value={form.compounding}
            onChange={set('compounding')}
          >
            {COMPOUNDING_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>

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
              background: `linear-gradient(135deg, ${COLORS.purpleDim}, ${COLORS.bgCard})`,
            }}
          >
            <CardContent>
              <Typography
                variant="overline"
                sx={{ color: COLORS.purple, fontWeight: 600, letterSpacing: 1 }}
              >
                FD MATURITY
              </Typography>

              <Box sx={{ textAlign: 'center', my: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Maturity Amount
                </Typography>
                <Typography
                  sx={{
                    fontSize: 32,
                    fontWeight: 800,
                    color: COLORS.white,
                    letterSpacing: -1,
                  }}
                >
                  {fmtFull(result.maturityAmount)}
                </Typography>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 10, color: COLORS.textMuted }}>
                    Principal
                  </Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>
                    {fmtFull(result.principal)}
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 10, color: COLORS.textMuted }}>
                    Interest Earned
                  </Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: COLORS.green }}>
                    {fmtFull(result.interestEarned)}
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
                <Box sx={{ flex: result.principal, bgcolor: COLORS.purple }} />
                <Box sx={{ flex: result.interestEarned, bgcolor: COLORS.green }} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.75 }}>
                <Typography sx={{ fontSize: 10, color: COLORS.purple }}>
                  Principal {Math.round((result.principal / result.maturityAmount) * 100)}%
                </Typography>
                <Typography sx={{ fontSize: 10, color: COLORS.green }}>
                  Interest {Math.round((result.interestEarned / result.maturityAmount) * 100)}%
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Comparison Table */}
          <Card>
            <CardContent>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                Rate Comparison
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: COLORS.textMuted, fontSize: 11, fontWeight: 600 }}>
                        Rate
                      </TableCell>
                      <TableCell sx={{ color: COLORS.textMuted, fontSize: 11, fontWeight: 600 }} align="right">
                        Maturity
                      </TableCell>
                      <TableCell sx={{ color: COLORS.textMuted, fontSize: 11, fontWeight: 600 }} align="right">
                        Interest
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {result.comparisons.map((row) => (
                      <TableRow
                        key={row.rate}
                        sx={{
                          bgcolor: row.isCurrent ? `${COLORS.accent}15` : 'transparent',
                          '& td': {
                            borderColor: COLORS.border,
                          },
                        }}
                      >
                        <TableCell
                          sx={{
                            fontSize: 12,
                            fontWeight: row.isCurrent ? 700 : 400,
                            color: row.isCurrent ? COLORS.accentLight : COLORS.text,
                          }}
                        >
                          {row.rate}%{row.isCurrent ? ' (current)' : ''}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            fontSize: 12,
                            fontWeight: row.isCurrent ? 700 : 400,
                            color: COLORS.text,
                          }}
                        >
                          {fmtFull(row.maturity)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            fontSize: 12,
                            fontWeight: row.isCurrent ? 700 : 400,
                            color: COLORS.green,
                          }}
                        >
                          {fmtFull(row.interest)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
}
