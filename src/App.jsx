import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import { AppProvider, useAppState } from './context/AppContext';
import { SnackbarProvider } from './context/SnackbarContext';
import AppShell from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Goals from './pages/Goals';
import Reports from './pages/Reports';
import Tools from './pages/Tools';
import Settings from './pages/Settings';
import { useRecurringProcessor } from './hooks/useRecurringProcessor';
import Onboarding from './components/Onboarding';
import InstallPrompt from './components/InstallPrompt';

// Runs recurring transaction processor on app startup
function RecurringProcessor() {
  useRecurringProcessor();
  return null;
}

// Shows onboarding wizard when the database is empty (first launch)
function OnboardingGate({ children }) {
  const { loaded, monthlyData, categories } = useAppState();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (loaded && monthlyData.length === 0 && categories.length === 0 && !dismissed) {
      setShowOnboarding(true);
    }
  }, [loaded, monthlyData.length, categories.length, dismissed]);

  return (
    <>
      {children}
      <Onboarding open={showOnboarding} onComplete={() => { setShowOnboarding(false); setDismissed(true); }} />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <InstallPrompt />
      <AppProvider>
        <SnackbarProvider>
          <RecurringProcessor />
          <OnboardingGate>
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
          </OnboardingGate>
        </SnackbarProvider>
      </AppProvider>
    </ThemeProvider>
  );
}
