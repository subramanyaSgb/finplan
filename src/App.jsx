import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import { AppProvider } from './context/AppContext';
import { SnackbarProvider } from './context/SnackbarContext';
import AppShell from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Goals from './pages/Goals';
import Reports from './pages/Reports';
import Tools from './pages/Tools';
import Settings from './pages/Settings';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <SnackbarProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<AppShell />}>
                <Route index element={<Dashboard />} />
                <Route path="expenses" element={<Expenses />} />
                <Route path="goals" element={<Goals />} />
                <Route path="reports" element={<Reports />} />
                <Route path="tools" element={<Tools />} />
              </Route>
              <Route path="settings" element={<Settings />} />
            </Routes>
          </BrowserRouter>
        </SnackbarProvider>
      </AppProvider>
    </ThemeProvider>
  );
}
