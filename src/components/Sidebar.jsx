import { NavLink, useNavigate } from 'react-router-dom';
import { Home, FileText, User, LogOut, Briefcase, Search, History, Users } from 'lucide-react';

const Sidebar = ({ setIsAuthenticated, isMobile = false }) => {
  const navigate = useNavigate();
  const userString = localStorage.getItem('user');
  let user = {};
  try {
    user = userString ? JSON.parse(userString) : {};
  } catch {
    user = {};
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Activity', path: '/activity', icon: History },
    { name: 'Network', path: '/network', icon: Users },
    { name: 'Resume', path: '/resume', icon: FileText },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  if (isMobile) {
    return (
      <nav className="flex items-center justify-around w-full h-full px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center transition-all px-3 py-1 rounded-lg ${
                isActive ? 'text-primary scale-110' : 'text-gray-400'
              }`
            }
          >
            {({ isActive }) => (
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            )}
          </NavLink>
        ))}
        <button onClick={handleLogout} className="text-gray-400 px-3 py-1">
          <LogOut size={22} />
        </button>
      </nav>
    );
  }

  return (
    <aside className="w-[260px] bg-white border-r border-border flex flex-col justify-between h-full shrink-0 transition-all z-40">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-8 cursor-pointer group" onClick={() => navigate('/')}>
          <div className="bg-primary text-white p-2 rounded-xl shadow-[0_0_12px_rgba(108,71,255,0.15)] group-hover:scale-105 transition-transform">
            <Briefcase size={22} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold tracking-tight text-dark">
            GraphHire
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col px-3 gap-1 flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-3 rounded-[10px] transition-all relative font-medium text-[14px] ${
                  isActive
                    ? 'bg-primary/5 text-primary'
                    : 'text-gray-500 hover:text-dark hover:bg-gray-50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-primary rounded-r-full" />
                  )}
                  <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-primary' : 'text-gray-400 group-hover:text-dark'} />
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Section bottom */}
        <div className="p-4 bg-surface/50 border-t border-border mx-3 mb-6 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold shrink-0 text-sm shadow-sm">
              {user.name ? user.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) : 'U'}
            </div>
            <div className="truncate flex-1 min-w-0">
              <p className="text-sm font-semibold text-dark truncate leading-tight">{user.name || 'User'}</p>
              <p className="text-[11px] text-gray-500 truncate mt-0.5">{user.email || 'user@example.com'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-[12px] font-semibold text-gray-500 hover:text-danger bg-white border border-border rounded-[10px] shadow-sm hover:shadow-gray-100/50 transition-all"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
