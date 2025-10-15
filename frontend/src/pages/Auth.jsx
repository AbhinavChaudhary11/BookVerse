import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { FaUserAlt, FaEnvelope, FaLock } from 'react-icons/fa';

export default function Auth() {
  const { login, register } = useAuth();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') || 'login';

  const [mode, setMode] = useState(initialMode);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') await login(email, password);
      else await register(username, email, password);
      navigate('/home');
    } catch (err) {
      setError('Authentication failed');
    }
  }

  useEffect(() => {
    setMode(searchParams.get('mode') || 'login');
  }, [searchParams]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#fffdf8] overflow-hidden">

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="w-full bg-white rounded-2xl shadow-2xl p-10 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            {mode === 'login' ? 'Login' : 'Create Account'}
          </h1>
          
          <form className="space-y-4" onSubmit={onSubmit}>
            {mode === 'register' && (
              <div className="relative">
                <FaUserAlt className="absolute left-3 top-3 text-gray-400" />
                <input
                  className="w-full border rounded-xl px-10 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            )}

            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input
                className="w-full border rounded-xl px-10 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                className="w-full border rounded-xl px-10 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button className="w-full py-3 bg-orange-400 hover:bg-orange-600 text-white rounded-xl font-semibold shadow-lg transition transform hover:scale-105">
              {mode === 'login' ? 'Login' : 'Create Account'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              className="text-orange-400 font-medium hover:underline"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            >
              {mode === 'login' ? 'Need an account? Register' : 'Have an account? Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
