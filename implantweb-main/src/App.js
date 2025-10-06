import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';  // Import necessary components

import theme from './theme/theme';  // Import theme
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import SignIn from './Login_Page/SignIn';
import About from './pages/About';
import ContactUs from './pages/ContactUs';
import Sidebar from './Sidebar';
import AdminPage from './pages/AdminPage';
import DashboardContent from './Components/SearchPatient/DashboardContent';
import DashboardTracker from './pages/Dashboard_Tracker';
import * as Sentry from '@sentry/react';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from "./pages/ProtectedRoute";

Sentry.init({
  dsn: "https://4320ed9ddad5854daf15db2ef74506ff@o4508533162573824.ingest.us.sentry.io/4508533163950080",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<ProtectedRoute component={SignIn} />} />
          <Route path="/about" element={<ProtectedRoute component={About} />} />
          <Route path="/contact" element={<ProtectedRoute component={ContactUs} />} />
          <Route path="/patient" element={<ProtectedRoute component={DashboardContent} />} />
          <Route path="/dashboard" element={<ProtectedRoute component={DashboardTracker} />} />
          <Route path="/sidebar" element={<ProtectedRoute component={Sidebar} />} />
          <Route path="/admin" element={<ProtectedRoute component={AdminPage} />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;