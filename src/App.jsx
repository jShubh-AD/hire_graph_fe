import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ResumeSkills from './pages/ResumeSkills';
import Profile from './pages/Profile';
import Jobs from './pages/Jobs';

const ProtectedLayout = ({ setIsAuthenticated }) => {
  return (
    <div className="flex w-full h-screen bg-gray-50 overflow-hidden font-sans text-gray-900">
      <Sidebar setIsAuthenticated={setIsAuthenticated} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-white sm:rounded-tl-3xl sm:border-t sm:border-l border-gray-200 shadow-sm p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const handleAuthError = () => {
      setIsAuthenticated(false);
      navigate('/login');
    };

    window.addEventListener('auth:unauthorized', handleAuthError);
    return () => window.removeEventListener('auth:unauthorized', handleAuthError);
  }, [navigate]);

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login setAuth={setIsAuthenticated} /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!isAuthenticated ? <Register setAuth={setIsAuthenticated} /> : <Navigate to="/" replace />} />

      {/* Protected Routes */}
      <Route
        element={isAuthenticated ? <ProtectedLayout setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" replace />}
      >
        <Route path="/" element={<Home />} />
        <Route path="/resume" element={<ResumeSkills />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
