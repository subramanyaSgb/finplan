import { useState } from 'react';
import {
  Box, Card, CardContent, TextField, Button, Typography, InputAdornment,
  IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { COLORS } from '../../theme';
import { fmtFull } from '../../utils/format';

const emptyLoan = { name: '', amount: '', rate: '', tenure: '' };

function calcEMI(principal, annualRate, tenureMonths) {
  const R = annualRate / 12 / 100;
  const N = tenureMonths;
  if (!principal || !R || !N) return null;
  const emi = principal * R * Math.pow(1 + R, N) / (Math.pow(1 + R, N) - 1);
  const totalPayment = emi * N;
  const totalInterest = totalPayment - principal;
  return { emi, totalPayment, totalInterest };
}

export default function LoanComparison() {
  const [loans, setLoans] = useState([
    { name: 'Bank A', amount: '1000000', rate: '8.5', tenure: '240' },
    { name: 'Bank B', amount: '1000000', rate: '9.0', tenure: '240' },
  ]);
  const [results, setResults] = useState(null);

  const updateLoan = (index, field) => (e) => {
    setLoans((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: e.target.value };
      return updated;
    });
  };

  const addLoan = () => {
    if (loans.length >= 3) return;
    setLoans((prev) => [...prev, { ...emptyLoan, name: `Option ${prev.length + 1}` }]);
  };

  const removeLoan = (index) => {
    if (loans.length <= 1) return;
    setLoans((prev) => prev.filter((_, i) => i !== index));
    setResults(null);
  };

  const compare = () => {
    const calcs = loans.map((loan) => {
      const P = parseFloat(loan.amount);
      const R = parseFloat(loan.rate);
      const N = parseFloat(loan.tenure);
      const result = calcEMI(P, R, N);
      return {
        name: loan.name || `Loan ${loans.indexOf(loan) + 1}`,
        ...result,
      };
    });

    // Filter out invalid entries
    const valid = calcs.filter((c) => c.emi);
    if (valid.length === 0) return;

    // Find cheapest (lowest total payment)
    const minTotal = Math.min(...valid.map((c) => c.totalPayment));
    const enriched = valid.map((c) => ({
      ...c,
      isCheapest: c.totalPayment === minTotal,
    }));

    setResults(enriched);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Loan Input Cards */}
      {loans.map((loan, idx) => (
        <Card key={idx}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" fontWeight={600}>
                Loan {idx + 1}
              </Typography>
              {loans.length > 1 && (
                <IconButton
                  size="small"
                  onClick={() => removeLoan(idx)}
                  sx={{ color: COLORS.red }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>

            <TextField
              label="Loan Name"
              value={loan.name}
              onChange={updateLoan(idx, 'name')}
              placeholder="e.g. SBI Home Loan"
              size="small"
            />

            <TextField
              label="Loan Amount"
              value={loan.amount}
              onChange={updateLoan(idx, 'amount')}
              type="number"
              placeholder="e.g. 1000000"
              size="small"
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start">{'\u20B9'}</InputAdornment>,
                },
              }}
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              <TextField
                label="Rate (% p.a.)"
                value={loan.rate}
                onChange={updateLoan(idx, 'rate')}
                type="number"
                placeholder="e.g. 8.5"
                size="small"
              />
              <TextField
                label="Tenure (months)"
                value={loan.tenure}
                onChange={updateLoan(idx, 'tenure')}
                type="number"
                placeholder="e.g. 240"
                size="small"
              />
            </Box>
          </CardContent>
        </Card>
      ))}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        {loans.length < 3 && (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addLoan}
            sx={{ flex: 1 }}
          >
            Add Loan
          </Button>
        )}
        <Button
          variant="contained"
          startIcon={<CompareArrowsIcon />}
          onClick={compare}
          sx={{ flex: 1, py: 1.25 }}
        >
          Compare
        </Button>
      </Box>

      {/* Comparison Results */}
      {results && (
        <Card
          sx={{
            background: `linear-gradient(135deg, ${COLORS.cyanDim}, ${COLORS.bgCard})`,
          }}
        >
          <CardContent>
            <Typography
              variant="overline"
              sx={{ color: COLORS.cyan, fontWeight: 600, letterSpacing: 1 }}
            >
              COMPARISON RESULTS
            </Typography>

            <TableContainer sx={{ mt: 1.5 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: COLORS.textMuted, fontSize: 11, fontWeight: 600 }}>
                      Loan
                    </TableCell>
                    <TableCell sx={{ color: COLORS.textMuted, fontSize: 11, fontWeight: 600 }} align="right">
                      EMI
                    </TableCell>
                    <TableCell sx={{ color: COLORS.textMuted, fontSize: 11, fontWeight: 600 }} align="right">
                      Interest
                    </TableCell>
                    <TableCell sx={{ color: COLORS.textMuted, fontSize: 11, fontWeight: 600 }} align="right">
                      Total
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.map((row, idx) => (
                    <TableRow
                      key={idx}
                      sx={{
                        bgcolor: row.isCheapest ? `${COLORS.green}15` : 'transparent',
                        '& td': { borderColor: COLORS.border },
                      }}
                    >
                      <TableCell
                        sx={{
                          fontSize: 12,
                          fontWeight: row.isCheapest ? 700 : 400,
                          color: row.isCheapest ? COLORS.green : COLORS.text,
                        }}
                      >
                        {row.name}
                        {row.isCheapest && (
                          <Typography
                            component="span"
                            sx={{
                              display: 'block',
                              fontSize: 9,
                              color: COLORS.green,
                              fontWeight: 700,
                            }}
                          >
                            BEST OPTION
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontSize: 11,
                          fontWeight: row.isCheapest ? 700 : 400,
                          color: COLORS.text,
                        }}
                      >
                        {fmtFull(row.emi)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontSize: 11,
                          fontWeight: row.isCheapest ? 700 : 400,
                          color: COLORS.red,
                        }}
                      >
                        {fmtFull(row.totalInterest)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontSize: 11,
                          fontWeight: row.isCheapest ? 700 : 400,
                          color: COLORS.text,
                        }}
                      >
                        {fmtFull(row.totalPayment)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Savings note */}
            {results.length > 1 && (() => {
              const cheapest = results.find((r) => r.isCheapest);
              const others = results.filter((r) => !r.isCheapest);
              if (!cheapest || others.length === 0) return null;
              const maxSaving = Math.max(...others.map((o) => o.totalPayment - cheapest.totalPayment));
              return (
                <Box
                  sx={{
                    mt: 2,
                    p: 1.5,
                    bgcolor: `${COLORS.green}10`,
                    borderRadius: 2,
                    border: `1px solid ${COLORS.green}30`,
                  }}
                >
                  <Typography sx={{ fontSize: 12, color: COLORS.green, fontWeight: 600, textAlign: 'center' }}>
                    {cheapest.name} saves you up to {fmtFull(maxSaving)}
                  </Typography>
                </Box>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
