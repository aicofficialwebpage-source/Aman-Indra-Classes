import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { LoadingProvider } from './context/LoadingContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingButtons from './components/FloatingButtons';

// Pages
import Home from './pages/Home';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const MainLayout: React.FC = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const isAdminPath = location.pathname.startsWith('/admin');

  // Synchronize HTML dark mode class based on active theme and route
  React.useEffect(() => {
    const root = window.document.documentElement;
    const isThemeDisabled = location.pathname.startsWith('/admin') || location.pathname === '/login';

    if (isThemeDisabled) {
      root.classList.remove('dark');
    } else {
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme, location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Show Navbar on public-facing pages */}
      {!isAdminPath && <Navbar />}
      
      {/* Dynamic Main Body Content */}
      <div className={`flex-1 ${!isAdminPath ? 'pt-24' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<BlogList />} />
          <Route path="/blogs/:slug" element={<BlogDetail />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
            />
        </Routes>
      </div>

      {/* Show Footer and Call Floating buttons on public-facing pages */}
      {!isAdminPath && <Footer />}
      {!isAdminPath && <FloatingButtons />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <LoadingProvider>
          <AuthProvider>
            <SettingsProvider>
              <BrowserRouter>
                <MainLayout />
              </BrowserRouter>
            </SettingsProvider>
          </AuthProvider>
        </LoadingProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
