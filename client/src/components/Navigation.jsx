import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/expenses', label: 'Expenses', icon: '💸' },
    { path: '/investments', label: 'Investments', icon: '📈' },
    { path: '/loans', label: 'Loans', icon: '💰' },
    { path: '/ai-chat', label: 'AI Chat', icon: '🤖' },
  ];

  return (
    <div className="w-64 bg-white h-screen shadow-lg flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-primary">FinMate</h1>
        <p className="text-sm text-gray-600 mt-1">Finance Manager</p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-800 text-sm">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-600">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition text-sm"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navigation;
