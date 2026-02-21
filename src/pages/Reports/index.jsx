import { useState, useMemo } from 'react';
import { Box, Typography, Tabs, Tab, Card, CardContent } from '@mui/material';
import { useMonthlyData } from '../../hooks/useMonthlyData';
import { COLORS } from '../../theme';
import DateRangeFilter from './DateRangeFilter';
import SpendingTrends from './SpendingTrends';
import CategoryComparison from './CategoryComparison';
import IncomeVsExpense from './IncomeVsExpense';
import YearOverYear from './YearOverYear';
import TopCategories from './TopCategories';
import SavingsRate from './SavingsRate';

const reportTabs = [
  { label: 'Trends', component: SpendingTrends },
  { label: 'Categories', component: CategoryComparison },
  { label: 'Inc vs Exp', component: IncomeVsExpense },
  { label: 'YoY', component: YearOverYear },
  { label: 'Top Spend', component: TopCategories },
  { label: 'Savings %', component: SavingsRate },
];

export default function Reports() {
  const { monthlyData, calcIncome, calcExpenses, calcSavings } = useMonthlyData();
  const [activeTab, setActiveTab] = useState(0);
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(Math.max(0, monthlyData.length - 1));

  // Keep toIdx in sync when monthlyData grows
  const safeToIdx = Math.min(toIdx, monthlyData.length - 1);
  const safeFromIdx = Math.min(fromIdx, safeToIdx);

  const filteredData = useMemo(() => {
    if (monthlyData.length === 0) return [];
    return monthlyData.slice(safeFromIdx, safeToIdx + 1);
  }, [monthlyData, safeFromIdx, safeToIdx]);

  // Empty state
  if (monthlyData.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6, px: 2.5 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Reports & Analytics
        </Typography>
        <Typography variant="body2" sx={{ color: COLORS.textMuted, lineHeight: 1.5 }}>
          Add monthly budget data from the Dashboard to see spending trends, category breakdowns,
          and savings analysis here.
        </Typography>
      </Box>
    );
  }

  const ActiveComponent = reportTabs[activeTab].component;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6" fontWeight={700}>
        Reports & Analytics
      </Typography>

      <DateRangeFilter
        monthlyData={monthlyData}
        fromIdx={safeFromIdx}
        toIdx={safeToIdx}
        onFromChange={setFromIdx}
        onToChange={setToIdx}
      />

      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          minHeight: 36,
          '& .MuiTab-root': {
            minHeight: 36,
            py: 0.75,
            px: 1.5,
            fontSize: 12,
            fontWeight: 600,
            textTransform: 'none',
          },
        }}
      >
        {reportTabs.map((tab) => (
          <Tab key={tab.label} label={tab.label} />
        ))}
      </Tabs>

      <Card>
        <CardContent sx={{ p: 2 }}>
          <ActiveComponent
            data={filteredData}
            calcIncome={calcIncome}
            calcExpenses={calcExpenses}
            calcSavings={calcSavings}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
