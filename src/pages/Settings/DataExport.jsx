import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { exportFullBackup, exportTableAsCSV } from '../../utils/export';
import { useAppState } from '../../context/AppContext';
import { useSnackbar } from '../../context/SnackbarContext';
import { COLORS } from '../../theme';

export default function DataExport() {
  const { expenses, monthlyData } = useAppState();
  const showSnackbar = useSnackbar();
  const [exporting, setExporting] = useState(null);

  const handleFullBackup = async () => {
    try {
      setExporting('full');
      await exportFullBackup();
      showSnackbar('Backup exported successfully');
    } catch (err) {
      showSnackbar('Export failed: ' + err.message, 'error');
    } finally {
      setExporting(null);
    }
  };

  const handleExportExpenses = () => {
    try {
      setExporting('expenses');
      if (!expenses.length) {
        showSnackbar('No expenses to export', 'warning');
        return;
      }
      exportTableAsCSV(expenses, 'expenses');
      showSnackbar('Expenses exported as CSV');
    } catch (err) {
      showSnackbar('Export failed: ' + err.message, 'error');
    } finally {
      setExporting(null);
    }
  };

  const handleExportMonthly = () => {
    try {
      setExporting('monthly');
      if (!monthlyData.length) {
        showSnackbar('No monthly data to export', 'warning');
        return;
      }
      exportTableAsCSV(monthlyData, 'monthly-data');
      showSnackbar('Monthly data exported as CSV');
    } catch (err) {
      showSnackbar('Export failed: ' + err.message, 'error');
    } finally {
      setExporting(null);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Button
        variant="outlined"
        startIcon={<FileDownloadIcon />}
        onClick={handleFullBackup}
        disabled={exporting === 'full'}
        fullWidth
        sx={{ justifyContent: 'flex-start', py: 1.25 }}
      >
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="body2" fontWeight={600}>
            Export Full Backup (JSON)
          </Typography>
          <Typography variant="caption" color="text.secondary">
            All data including settings and categories
          </Typography>
        </Box>
      </Button>

      <Button
        variant="outlined"
        startIcon={<FileDownloadIcon />}
        onClick={handleExportExpenses}
        disabled={exporting === 'expenses'}
        fullWidth
        sx={{ justifyContent: 'flex-start', py: 1.25 }}
      >
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="body2" fontWeight={600}>
            Export Expenses (CSV)
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {expenses.length} expense{expenses.length !== 1 ? 's' : ''} as spreadsheet
          </Typography>
        </Box>
      </Button>

      <Button
        variant="outlined"
        startIcon={<FileDownloadIcon />}
        onClick={handleExportMonthly}
        disabled={exporting === 'monthly'}
        fullWidth
        sx={{ justifyContent: 'flex-start', py: 1.25 }}
      >
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="body2" fontWeight={600}>
            Export Monthly Data (CSV)
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {monthlyData.length} month{monthlyData.length !== 1 ? 's' : ''} of income & budget data
          </Typography>
        </Box>
      </Button>
    </Box>
  );
}
