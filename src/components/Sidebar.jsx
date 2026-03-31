import { NavLink, useNavigate } from 'react-router-dom';
import { Home, FileText, User, LogOut, Briefcase } from 'lucide-react';

const Sidebar = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const userString = localStorage.getItem('user');
  let user = {};
  try {
    user = userString ? JSON.parse(userString) : {};
  } catch (e) {
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
    { name: 'Resume & Skills', path: '/resume', icon: FileText },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <aside className="w-[240px] bg-gray-50 flex flex-col justify-between h-full p-4 shrink-0 transition-all">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 px-2 mb-8 mt-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="bg-purple-600 text-white p-2 rounded-xl shadow-lg shadow-purple-600/30">
            <Briefcase size={22} />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            GraphHire
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all font-medium ${
                  isActive
                    ? 'bg-purple-100 text-purple-700 shadow-sm'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 hover:scale-[1.02]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={20} className={isActive ? 'text-purple-600' : 'text-gray-400'} />
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* User Section bottom */}
      <div className="pt-4 border-t border-gray-200 mt-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-teal-400 flex items-center justify-center text-white font-bold shrink-0 shadow-md">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="truncate flex-1">
              <p className="text-sm font-semibold text-gray-900 truncate">{user.name || 'User'}</p>
              <p className="text-xs text-gray-500 truncate">{user.email || 'user@example.com'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-1"
            title="Log out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
