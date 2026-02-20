import { Box, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';

export default function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const showFab = location.pathname !== '/expenses';

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', maxWidth: 480, mx: 'auto', position: 'relative' }}>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
      <Header />
      <Box sx={{ px: 2, pt: 2, pb: '100px' }}>
        <Outlet />
      </Box>
      {showFab && (
        <Fab
          color="primary"
          onClick={() => navigate('/expenses')}
          sx={{ position: 'fixed', bottom: 88, right: 20, zIndex: 40 }}
        >
          <AddIcon />
        </Fab>
      )}
      <BottomNav />
    </Box>
  );
}
