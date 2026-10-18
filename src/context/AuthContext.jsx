import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi, getStoredToken, setStoredToken } from '../lib/api';

const AuthContext = createContext(null);

const PENDING_EMAIL_KEY = 'toyvolt_pending_verification_email';

const getInitialPendingEmail = () => {
  try {
    return sessionStorage.getItem(PENDING_EMAIL_KEY) || '';
  } catch {
    return '';
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  const [pendingVerificationEmailState, setPendingVerificationEmailState] = useState(
    getInitialPendingEmail
  );
  const [returnToPath, setReturnToPath] = useState('/');

  const navigate = useNavigate();
  const location = useLocation();

  const setPendingVerificationEmail = useCallback((email) => {
    const clean = (email || '').trim();
    setPendingVerificationEmailState(clean);
    try {
      if (clean) {
        sessionStorage.setItem(PENDING_EMAIL_KEY, clean);
      } else {
        sessionStorage.removeItem(PENDING_EMAIL_KEY);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const currentUser = await authApi.getMe();
      setUser(currentUser);
      return currentUser;
    } catch {
      setUser(null);
      setStoredToken(null);
      return null;
    } finally {
      setIsLoadingAuth(false);
    }
  }, []);

  useEffect(() => {
    const storedToken = getStoredToken();
    if (storedToken) {
      refreshProfile();
    } else {
      setIsLoadingAuth(false);
    }
  }, [refreshProfile]);

  const openAuthModal = useCallback(
    (tab = 'login', email = '') => {
      setAuthModalTab(tab);
      if (email) {
        setPendingVerificationEmail(email);
      }

      const currentPath = location.pathname;
      const isAuthRoute =
        currentPath === '/login' ||
        currentPath === '/signin' ||
        currentPath === '/register' ||
        currentPath === '/signup' ||
        currentPath === '/verify-email' ||
        currentPath === '/verify-otp' ||
        currentPath === '/forgot-password';

      if (!isAuthRoute) {
        setReturnToPath(currentPath || '/');
      }

      setAuthModalOpen(false);

      if (tab === 'register') {
        navigate('/register', {
          state: {
            from: !isAuthRoute ? currentPath : returnToPath,
            prefillEmail: email || ''
          }
        });
      } else if (tab === 'verify-otp' || tab === 'verify-email') {
        navigate('/verify-email', {
          state: {
            from: !isAuthRoute ? currentPath : returnToPath,
            email: email || pendingVerificationEmailState
          }
        });
      } else if (tab === 'forgot-password' || tab === 'reset-password') {
        navigate('/forgot-password', {
          state: {
            from: !isAuthRoute ? currentPath : returnToPath,
            email: email || pendingVerificationEmailState
          }
        });
      } else {
        navigate('/login', {
          state: {
            from: !isAuthRoute ? currentPath : returnToPath
          }
        });
      }
    },
    [location.pathname, navigate, pendingVerificationEmailState, returnToPath, setPendingVerificationEmail]
  );

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
  }, []);

  const handleLoginSuccess = useCallback(
    (loggedInUser, redirectOverride) => {
      setUser(loggedInUser);
      setAuthModalOpen(false);
      setPendingVerificationEmail('');
      const destination =
        redirectOverride ||
        location.state?.from ||
        returnToPath ||
        '/';
      const safeDestination =
        destination === '/login' ||
        destination === '/register' ||
        destination === '/verify-email' ||
        destination === '/forgot-password'
          ? '/'
          : destination;
      navigate(safeDestination, { replace: true });
    },
    [location.state, navigate, returnToPath, setPendingVerificationEmail]
  );

  const handleLogout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === 'admin',
        isLoadingAuth,
        authModalOpen,
        authModalTab,
        setAuthModalTab,
        pendingVerificationEmail: pendingVerificationEmailState,
        setPendingVerificationEmail,
        returnToPath,
        setReturnToPath,
        openAuthModal,
        closeAuthModal,
        handleLoginSuccess,
        handleLogout,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
