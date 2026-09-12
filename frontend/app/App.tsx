import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from '../contexts/LanguageContext';

// Lazy load pages for better performance
const LandingPage = React.lazy(() => import('../features/landing/LandingPage'));
const AuthPage = React.lazy(() => import('../features/auth/AuthPage'));
const Dashboard = React.lazy(() => import('../features/dashboard/Dashboard'));
const SymptomChecker = React.lazy(() => import('../features/symptoms/SymptomChecker').then(m => ({ default: m.SymptomChecker })));
const LabReport = React.lazy(() => import('../features/lab/LabReport'));
const MedicationSafety = React.lazy(() => import('../features/medications/MedicationSafety'));
const Timeline = React.lazy(() => import('../features/timeline/Timeline').then(m => ({ default: m.Timeline })));

// Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Loading fallback component (Tailwind)
const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-screen bg-background">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-sm text-text-light">Loading...</p>
    </div>
  </div>
);

// App content with routing
const AppContent: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/symptoms" element={<SymptomChecker />} />
          <Route path="/lab" element={<LabReport />} />
          <Route path="/medications" element={<MedicationSafety />} />
          <Route path="/timeline" element={<Timeline />} />
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
        <AppContent />
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default App;
