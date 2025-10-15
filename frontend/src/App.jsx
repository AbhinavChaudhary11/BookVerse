import { Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import BookDetail from './pages/BookDetail.jsx';
import Library from './pages/Library.jsx';
import Friends from './pages/Friends.jsx';
import Profile from './pages/Profile.jsx';
import Auth from './pages/Auth.jsx';
import HomePage from './pages/HomePage.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/auth" replace />;
  return children;
}

function RootRedirect() {
  const { token } = useAuth();
  return token ? <Navigate to="/home" replace /> : <HomePage />;
}

export default function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col w-full bg-[#fffdf8]">
        <Navbar />
        <main className="w-full">
          <ScrollToTop /> 
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<RootRedirect />} />
              <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
              <Route path="/book/:id" element={<ProtectedRoute><BookDetail /></ProtectedRoute>} />
              <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
              <Route path="/friends" element={<ProtectedRoute><Friends /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/auth" element={<Auth />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </AuthProvider>
  );
}
