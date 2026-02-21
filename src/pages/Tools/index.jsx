import { useState } from 'react';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import { COLORS } from '../../theme';
import EMICalculator from './EMICalculator';
import SIPCalculator from './SIPCalculator';
import FDCalculator from './FDCalculator';
import TaxEstimator from './TaxEstimator';
import LoanComparison from './LoanComparison';
import BillReminders from './BillReminders';

const toolTabs = [
  { label: 'EMI', component: EMICalculator },
  { label: 'SIP', component: SIPCalculator },
  { label: 'FD', component: FDCalculator },
  { label: 'Tax', component: TaxEstimator },
  { label: 'Compare', component: LoanComparison },
  { label: 'Reminders', component: BillReminders },
];

export default function Tools() {
  const [activeTab, setActiveTab] = useState(0);

  const ActiveComponent = toolTabs[activeTab].component;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6" fontWeight={700}>
        Tools
      </Typography>

      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          minHeight: 36,
          '& .MuiTabs-indicator': {
            bgcolor: COLORS.accent,
            height: 3,
            borderRadius: 1.5,
          },
          '& .MuiTab-root': {
            minHeight: 36,
            minWidth: 'auto',
            px: 1.5,
            py: 0.75,
            fontSize: 12,
            fontWeight: 600,
            color: COLORS.textMuted,
            textTransform: 'none',
            '&.Mui-selected': {
              color: COLORS.accentLight,
            },
          },
          '& .MuiTabs-scrollButtons': {
            color: COLORS.textMuted,
            '&.Mui-disabled': { opacity: 0.3 },
          },
        }}
      >
        {toolTabs.map((tab) => (
          <Tab key={tab.label} label={tab.label} />
        ))}
      </Tabs>

      <ActiveComponent />
    </Box>
  );
}
