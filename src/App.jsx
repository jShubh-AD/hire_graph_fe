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
import Activity from './pages/Activity';

const ProtectedLayout = ({ setIsAuthenticated, profileData, skillsLibrary, recommendations, fetchProfile, fetchRecommendations }) => {
  return (
    <div className="flex w-full h-screen bg-white overflow-hidden font-sans text-dark relative">
      {/* Desktop Sidebar */}
      <div className="hidden sm:block h-full shrink-0">
        <Sidebar setIsAuthenticated={setIsAuthenticated} />
      </div>

      <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden bg-surface">
        <TopBar />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <div className="page-transition">
            <Outlet context={{ profileData, skillsLibrary, recommendations, fetchProfile, fetchRecommendations }} />
          </div>
        </main>
      </div>

      {/* Mobile Navigation Bar - Fixed Bottom */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-border flex items-center justify-around px-2 z-50 shadow-[0_-1px_10px_rgba(0,0,0,0.02)]">
        <Sidebar setIsAuthenticated={setIsAuthenticated} isMobile={true} />
      </div>
    </div>
  );
};

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  
  // Centralized State
  const [profileData, setProfileData] = useState(null);
  const [skillsLibrary, setSkillsLibrary] = useState([]);
  const [recommendations, setRecommendations] = useState(null);

  useEffect(() => {
    const handleAuthError = () => {
      setIsAuthenticated(false);
      navigate('/login');
    };

    window.addEventListener('auth:unauthorized', handleAuthError);
    return () => window.removeEventListener('auth:unauthorized', handleAuthError);
  }, [navigate]);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/user/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setProfileData(data);
        setIsAuthenticated(true);
        return data;
      } else if (res.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Profile fetch failed', err);
    }
  };

  const fetchLibrary = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/skills`);
      if (res.ok) {
        const data = await res.json();
        setSkillsLibrary(data);
      }
    } catch (err) {
      console.error('Library fetch failed', err);
    }
  };

  const fetchRecommendations = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/jobs/recommendations`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setRecommendations(data);
        return data;
      }
    } catch (err) {
      console.error('Recommendations fetch failed', err);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          await fetchProfile();
          // Fetch additional data if authenticated
          await Promise.all([
            fetchLibrary(),
            fetchRecommendations()
          ]);
        } else {
          await fetchLibrary();
        }
      } catch (err) {
        console.error("Initialization failed", err);
      } finally {
        setIsValidating(false);
      }
    };
    
    initialize();
  }, [isAuthenticated]);

  if (isValidating) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#f9fafb' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px',
            border: '4px solid #6366f1',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ color: '#6b7280', fontSize: '14px' }}>Verifying session…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!isAuthenticated ? <Login setAuth={setIsAuthenticated} /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!isAuthenticated ? <Register setAuth={setIsAuthenticated} /> : <Navigate to="/" replace />} />

      {/* Protected Routes */}
      <Route
        element={
          isAuthenticated ? (
            <ProtectedLayout 
              setIsAuthenticated={setIsAuthenticated} 
              profileData={profileData} 
              skillsLibrary={skillsLibrary}
              recommendations={recommendations}
              fetchProfile={fetchProfile}
              fetchRecommendations={fetchRecommendations}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="/resume" element={<ResumeSkills />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
