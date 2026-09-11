import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, CssBaseline, CircularProgress, Box } from '@mui/material';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';
import { theme, rtlTheme } from '../theme/theme';

// Lazy load pages for better performance
const LandingPage = React.lazy(() => import('../features/landing/LandingPage'));
const Dashboard = React.lazy(() => import('../features/dashboard/Dashboard'));
const SymptomTriage = React.lazy(() => import('../features/symptoms/SymptomTriage'));
const LabReportReader = React.lazy(() => import('../features/lab/LabReportReader'));
const MedicationSafety = React.lazy(() => import('../features/medications/MedicationSafety'));
const HealthTimeline = React.lazy(() => import('../features/timeline/HealthTimeline'));

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Loading fallback component
const LoadingFallback = () => (
  <Box 
    sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh' 
    }}
  >
    <CircularProgress />
  </Box>
);

// Theme wrapper that switches based on language
const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isRTL } = useLanguage();
  return (
    <ThemeProvider theme={isRTL ? rtlTheme : theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

// App content with routing
const AppContent: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/symptoms" element={<SymptomTriage />} />
          <Route path="/lab" element={<LabReportReader />} />
          <Route path="/medications" element={<MedicationSafety />} />
          <Route path="/timeline" element={<HealthTimeline />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

// Main App component
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ThemeWrapper>
          <AppContent />
        </ThemeWrapper>
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
