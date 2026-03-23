import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Progress from './pages/Progress';
import Timetable from './pages/Timetable';
import Analytics from './pages/Analytics';
import Quests from './pages/Quests';
import FeedbackList from './pages/FeedbackList';

import { ThemeProvider } from './components/ThemeProvider';

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundary>
      <Router>
        <Toaster position="top-right" toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            borderRadius: '1rem',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            fontSize: '14px',
            fontWeight: '600'
          }
        }} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="progress" element={<Progress />} />
            <Route path="timetable" element={<Timetable />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="quests" element={<Quests />} />
            <Route path="feedback-intel" element={<FeedbackList />} />
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
