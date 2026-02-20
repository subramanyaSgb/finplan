import { BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import BarChartIcon from '@mui/icons-material/BarChart';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import { useLocation, useNavigate } from 'react-router-dom';

const tabs = [
  { path: '/', label: 'Dashboard', icon: <DashboardOutlinedIcon /> },
  { path: '/expenses', label: 'Expenses', icon: <AttachMoneyIcon /> },
  { path: '/goals', label: 'Goals', icon: <TrackChangesIcon /> },
  { path: '/reports', label: 'Reports', icon: <BarChartIcon /> },
  { path: '/tools', label: 'Tools', icon: <BuildOutlinedIcon /> },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentTab = tabs.findIndex(t => t.path === location.pathname);

  return (
    <Box sx={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 480, zIndex: 50 }}>
      <BottomNavigation
        value={currentTab === -1 ? 0 : currentTab}
        onChange={(_, newValue) => navigate(tabs[newValue].path)}
        showLabels
      >
        {tabs.map(tab => (
          <BottomNavigationAction key={tab.path} label={tab.label} icon={tab.icon} />
        ))}
      </BottomNavigation>
    </Box>
  );
}
