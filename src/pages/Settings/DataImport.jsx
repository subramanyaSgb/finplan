import { useState, useRef } from 'react';
import {
  Box, Button, Typography, Dialog, DialogTitle,
  DialogContent, DialogActions,
} from '@mui/material';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { importFullBackup } from '../../utils/import';
import { useSnackbar } from '../../context/SnackbarContext';
import { COLORS } from '../../theme';

export default function DataImport() {
  const showSnackbar = useSnackbar();
  const fileRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setConfirmOpen(true);
    }
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  const handleConfirmImport = async () => {
    if (!selectedFile) return;
    try {
      setImporting(true);
      await importFullBackup(selectedFile);
      showSnackbar('Data imported successfully! Reloading...');
      setConfirmOpen(false);
      setSelectedFile(null);
      // Reload page to refresh all context with new data
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      showSnackbar('Import failed: ' + err.message, 'error');
      setImporting(false);
    }
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    setSelectedFile(null);
    setImporting(false);
  };

  return (
    <Box>
      <input
        type="file"
        ref={fileRef}
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      <Button
        variant="outlined"
        startIcon={<FileUploadIcon />}
        onClick={() => fileRef.current?.click()}
        fullWidth
        sx={{ justifyContent: 'flex-start', py: 1.25 }}
      >
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="body2" fontWeight={600}>
            Import Backup (JSON)
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Restore from a previously exported backup file
          </Typography>
        </Box>
      </Button>

      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 1, mt: 1.5,
        p: 1.5, borderRadius: 2,
        bgcolor: `${COLORS.orange}10`, border: `1px solid ${COLORS.orange}30`,
      }}>
        <WarningAmberIcon sx={{ color: COLORS.orange, fontSize: 18 }} />
        <Typography variant="caption" sx={{ color: COLORS.orange }}>
          Importing will replace all existing data
        </Typography>
      </Box>

      <Dialog open={confirmOpen} onClose={handleCancel}>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Confirm Import
        </DialogTitle>
        <DialogContent>
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 1, mb: 2,
            p: 1.5, borderRadius: 2,
            bgcolor: `${COLORS.red}15`, border: `1px solid ${COLORS.red}30`,
          }}>
            <WarningAmberIcon sx={{ color: COLORS.red }} />
            <Typography variant="body2" sx={{ color: COLORS.red, fontWeight: 600 }}>
              This will replace ALL existing data!
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            File: {selectedFile?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            All your current expenses, goals, savings, and settings will be
            permanently replaced with data from the backup file. This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={handleCancel} disabled={importing}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={handleConfirmImport}
            disabled={importing}
          >
            {importing ? 'Importing...' : 'Yes, Replace All Data'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
