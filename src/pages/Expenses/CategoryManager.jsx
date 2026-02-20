import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Typography, Switch, IconButton, Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppState, useAppDispatch } from '../../context/AppContext';
import { db } from '../../db';
import { COLORS } from '../../theme';

export default function CategoryManager({ open, onClose }) {
  const { categories, expenses } = useAppState();
  const dispatch = useAppDispatch();
  const [newCatName, setNewCatName] = useState('');

  const updateCategories = async (updated) => {
    dispatch({ type: 'SET_CATEGORIES', payload: updated });
    // Persist to Dexie: clear and re-add all
    await db.categories.clear();
    const withOrder = updated.map((c, i) => ({ ...c, sortOrder: i }));
    await db.categories.bulkAdd(withOrder);
  };

  const addCategory = async () => {
    const name = newCatName.trim();
    if (!name) return;
    if (categories.find((c) => c.name.toLowerCase() === name.toLowerCase())) return;
    const newCat = { name, visible: true, sortOrder: categories.length };
    const id = await db.categories.add(newCat);
    const updated = [...categories, { ...newCat, id }];
    dispatch({ type: 'SET_CATEGORIES', payload: updated });
    setNewCatName('');
  };

  const toggleVisibility = (catId) => {
    const updated = categories.map((c) =>
      c.id === catId ? { ...c, visible: !c.visible } : c
    );
    updateCategories(updated);
  };

  const deleteCategory = (catId) => {
    const cat = categories.find((c) => c.id === catId);
    if (!cat) return;
    const isUsed = expenses.some((e) => e.category === cat.name);
    if (isUsed) return; // Prevent deletion of used categories
    const updated = categories.filter((c) => c.id !== catId);
    updateCategories(updated);
  };

  const showAll = () => {
    const updated = categories.map((c) => ({ ...c, visible: true }));
    updateCategories(updated);
  };

  const hideAll = () => {
    const updated = categories.map((c) => ({ ...c, visible: false }));
    updateCategories(updated);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') addCategory();
  };

  const handleClose = () => {
    setNewCatName('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" fontWeight={700} fontSize={18}>
          Manage Categories
        </Typography>
        <IconButton onClick={handleClose} size="small" edge="end">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: '8px !important' }}>
        {/* Add new category */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="New category name..."
            size="small"
            fullWidth
            sx={{ '& .MuiOutlinedInput-root': { fontSize: 13 } }}
          />
          <Button
            variant="contained"
            onClick={addCategory}
            disabled={!newCatName.trim()}
            startIcon={<AddIcon />}
            sx={{ flexShrink: 0, px: 2 }}
          >
            Add
          </Button>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
          Toggle visibility to show/hide categories in the expense dropdown
        </Typography>

        {/* Category list */}
        {categories.map((cat) => {
          const usageCount = expenses.filter((e) => e.category === cat.name).length;
          const isUsed = usageCount > 0;

          return (
            <Box
              key={cat.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                py: 1,
                borderBottom: `1px solid ${COLORS.border}30`,
              }}
            >
              {/* Visibility toggle */}
              <Switch
                size="small"
                checked={cat.visible}
                onChange={() => toggleVisibility(cat.id)}
                sx={{ mr: 0.5 }}
              />

              {/* Name */}
              <Typography
                sx={{
                  flex: 1,
                  fontSize: 14,
                  fontWeight: 500,
                  color: cat.visible ? COLORS.text : COLORS.textDim,
                  textDecoration: cat.visible ? 'none' : 'line-through',
                }}
              >
                {cat.name}
              </Typography>

              {/* Usage count */}
              {usageCount > 0 && (
                <Chip
                  label={usageCount}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: 10,
                    bgcolor: COLORS.bgCard,
                    color: COLORS.textMuted,
                  }}
                />
              )}

              {/* Delete button */}
              <IconButton
                size="small"
                onClick={() => deleteCategory(cat.id)}
                disabled={isUsed}
                sx={{
                  color: isUsed ? COLORS.border : COLORS.textDim,
                  cursor: isUsed ? 'not-allowed' : 'pointer',
                }}
              >
                <DeleteIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          );
        })}

        {categories.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            No categories yet. Add one above.
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button variant="outlined" onClick={showAll} sx={{ flex: 1, fontSize: 12 }}>
          Show All
        </Button>
        <Button variant="outlined" onClick={hideAll} sx={{ flex: 1, fontSize: 12 }}>
          Hide All
        </Button>
      </DialogActions>
    </Dialog>
  );
}
