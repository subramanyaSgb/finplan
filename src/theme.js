import { createTheme } from '@mui/material/styles';

export const COLORS = {
  bg: '#0A0A0F',
  bgCard: '#13131A',
  bgCardHover: '#1A1A24',
  border: '#1E1E2A',
  borderLight: '#2A2A3A',
  text: '#E8E8F0',
  textMuted: '#8888A0',
  textDim: '#55556A',
  accent: '#3B82F6',
  accentLight: '#60A5FA',
  accentDim: '#1E3A5F',
  green: '#22C55E',
  greenDim: '#0A3D1F',
  greenBg: '#0F2D1A',
  red: '#EF4444',
  redDim: '#3D0A0A',
  redBg: '#2D0F0F',
  orange: '#F59E0B',
  orangeDim: '#3D2A0A',
  purple: '#A855F7',
  purpleDim: '#2A0A3D',
  cyan: '#06B6D4',
  cyanDim: '#0A2A3D',
  white: '#FFFFFF',
};

export const PIE_COLORS = [
  '#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#A855F7',
  '#06B6D4', '#EC4899', '#84CC16', '#F97316', '#6366F1',
];

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: COLORS.accent, light: COLORS.accentLight },
    secondary: { main: COLORS.purple },
    error: { main: COLORS.red },
    warning: { main: COLORS.orange },
    success: { main: COLORS.green },
    info: { main: COLORS.cyan },
    background: { default: COLORS.bg, paper: COLORS.bgCard },
    text: { primary: COLORS.text, secondary: COLORS.textMuted, disabled: COLORS.textDim },
    divider: COLORS.border,
  },
  typography: {
    fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: { backgroundImage: 'none', border: `1px solid ${COLORS.border}` },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: `${COLORS.bg}F0`,
          backdropFilter: 'blur(20px)',
          borderTop: `1px solid ${COLORS.border}`,
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: { color: COLORS.textDim, '&.Mui-selected': { color: COLORS.accent }, minWidth: 0 },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.purple})`,
          boxShadow: `0 4px 20px ${COLORS.accent}40`,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: COLORS.bg,
          borderRadius: '24px 24px 0 0',
          border: `1px solid ${COLORS.border}`,
          borderBottom: 'none',
          margin: 0,
          maxWidth: 480,
          width: '100%',
          position: 'fixed',
          bottom: 0,
        },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'small', fullWidth: true },
      styleOverrides: {
        root: { '& .MuiOutlinedInput-root': { backgroundColor: COLORS.bgCard, borderRadius: 12 } },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, textTransform: 'none', fontWeight: 600 },
      },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 6, fontWeight: 600 } },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: COLORS.bg,
          backgroundImage: 'none',
          border: `1px solid ${COLORS.border}`,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&.Mui-selected': { backgroundColor: `${COLORS.accent}15` },
          '&.Mui-selected:hover': { backgroundColor: `${COLORS.accent}25` },
          '&:hover': { backgroundColor: `${COLORS.bgCardHover}` },
        },
      },
    },
  },
});

export default theme;
