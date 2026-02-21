import { useState } from 'react';
import {
  Typography, Box, IconButton, Accordion, AccordionSummary,
  AccordionDetails, Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RepeatIcon from '@mui/icons-material/Repeat';
import TuneIcon from '@mui/icons-material/Tune';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../theme';
import CurrencySettings from './CurrencySettings';
import DataExport from './DataExport';
import DataImport from './DataImport';
import RecurringRulesManager from './RecurringRulesManager';
import AppPreferences from './AppPreferences';
import ResetData from './ResetData';

const sectionSx = {
  bgcolor: 'transparent',
  boxShadow: 'none',
  '&:before': { display: 'none' },
  '&.Mui-expanded': { margin: 0 },
};

const summarySx = {
  px: 0, minHeight: 48,
  '& .MuiAccordionSummary-content': { alignItems: 'center', gap: 1.5, my: 1 },
  '&.Mui-expanded': { minHeight: 48 },
};

const iconBoxSx = (color) => ({
  width: 36, height: 36, borderRadius: 2,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  bgcolor: `${color}15`,
});

export default function Settings() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (_event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', maxWidth: 480, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{
        px: 2, pt: 2, pb: 1,
        display: 'flex', alignItems: 'center', gap: 1,
        borderBottom: `1px solid ${COLORS.border}20`,
        position: 'sticky', top: 0, zIndex: 10,
        bgcolor: 'background.default',
      }}>
        <IconButton onClick={() => navigate(-1)} sx={{ color: 'text.primary' }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" fontWeight={700}>Settings</Typography>
      </Box>

      {/* Content */}
      <Box sx={{ px: 2, pb: 4 }}>

        {/* Currency Section */}
        <Accordion
          expanded={expanded === 'currency'}
          onChange={handleChange('currency')}
          sx={sectionSx}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={summarySx}>
            <Box sx={iconBoxSx(COLORS.accent)}>
              <CurrencyExchangeIcon sx={{ color: COLORS.accent, fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="body1" fontWeight={600}>Currency</Typography>
              <Typography variant="caption" color="text.secondary">
                Default currency for transactions
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 0, pt: 0 }}>
            <CurrencySettings />
          </AccordionDetails>
        </Accordion>

        <Divider sx={{ borderColor: `${COLORS.border}40` }} />

        {/* Data Export Section */}
        <Accordion
          expanded={expanded === 'export'}
          onChange={handleChange('export')}
          sx={sectionSx}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={summarySx}>
            <Box sx={iconBoxSx(COLORS.green)}>
              <CloudDownloadIcon sx={{ color: COLORS.green, fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="body1" fontWeight={600}>Export Data</Typography>
              <Typography variant="caption" color="text.secondary">
                Download backups and CSV reports
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 0, pt: 0 }}>
            <DataExport />
          </AccordionDetails>
        </Accordion>

        <Divider sx={{ borderColor: `${COLORS.border}40` }} />

        {/* Data Import Section */}
        <Accordion
          expanded={expanded === 'import'}
          onChange={handleChange('import')}
          sx={sectionSx}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={summarySx}>
            <Box sx={iconBoxSx(COLORS.orange)}>
              <CloudUploadIcon sx={{ color: COLORS.orange, fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="body1" fontWeight={600}>Import Data</Typography>
              <Typography variant="caption" color="text.secondary">
                Restore from a backup file
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 0, pt: 0 }}>
            <DataImport />
          </AccordionDetails>
        </Accordion>

        <Divider sx={{ borderColor: `${COLORS.border}40` }} />

        {/* Recurring Rules Section */}
        <Accordion
          expanded={expanded === 'recurring'}
          onChange={handleChange('recurring')}
          sx={sectionSx}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={summarySx}>
            <Box sx={iconBoxSx(COLORS.purple)}>
              <RepeatIcon sx={{ color: COLORS.purple, fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="body1" fontWeight={600}>Recurring Rules</Typography>
              <Typography variant="caption" color="text.secondary">
                Automated expenses and savings
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 0, pt: 0 }}>
            <RecurringRulesManager />
          </AccordionDetails>
        </Accordion>

        <Divider sx={{ borderColor: `${COLORS.border}40` }} />

        {/* Preferences Section */}
        <Accordion
          expanded={expanded === 'preferences'}
          onChange={handleChange('preferences')}
          sx={sectionSx}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={summarySx}>
            <Box sx={iconBoxSx(COLORS.cyan)}>
              <TuneIcon sx={{ color: COLORS.cyan, fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="body1" fontWeight={600}>Preferences</Typography>
              <Typography variant="caption" color="text.secondary">
                Date format, numbers, and display
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 0, pt: 0 }}>
            <AppPreferences />
          </AccordionDetails>
        </Accordion>

        <Divider sx={{ borderColor: `${COLORS.border}40` }} />

        {/* Danger Zone Section */}
        <Accordion
          expanded={expanded === 'danger'}
          onChange={handleChange('danger')}
          sx={sectionSx}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={summarySx}>
            <Box sx={iconBoxSx(COLORS.red)}>
              <WarningAmberIcon sx={{ color: COLORS.red, fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="body1" fontWeight={600}>Danger Zone</Typography>
              <Typography variant="caption" color="text.secondary">
                Reset and delete data
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 0, pt: 0 }}>
            <ResetData />
          </AccordionDetails>
        </Accordion>

        <Divider sx={{ borderColor: `${COLORS.border}40` }} />

        {/* About Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 2 }}>
          <Box sx={iconBoxSx(COLORS.textMuted)}>
            <InfoOutlinedIcon sx={{ color: COLORS.textMuted, fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="body1" fontWeight={600}>About</Typography>
            <Typography variant="caption" color="text.secondary">
              FinPlan PWA v1.0.0
            </Typography>
          </Box>
        </Box>

      </Box>
    </Box>
  );
}
