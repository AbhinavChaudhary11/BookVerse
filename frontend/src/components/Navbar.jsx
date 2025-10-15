import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';


export default function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="font-extrabold text-4xl bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent hover:from-blue-600 hover:to-blue-800 transition-all duration-300"

        >
          BookVerse
        </Link>

        {token && (
          <div className="flex items-center gap-6">
            {/* Nav links */}
            {[
              { path: '/home', label: 'Home' },
              { path: '/library', label: 'Library' },
              { path: '/friends', label: 'Friends' },
              { path: '/profile', label: 'Profile' },
            ].map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `font-medium transition-colors px-3 py-1 rounded-lg ${
                    isActive
                      ? 'bg-orange-100 text-orange-500'
                      : 'text-gray-700 hover:text-orange-400 hover:bg-gray-100'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            {/* Logout button */}
            <button
              className="px-4 py-1 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              Logout
            </button>
            
          </div>
        )}
      </div>
    </nav>
  );
}
