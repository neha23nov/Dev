import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load — restore user from localStorage
  // Without this, every refresh logs you out
  useEffect(() => {
    const stored = localStorage.getItem('devhire_user');
    const token = localStorage.getItem('devhire_token');
    if (stored && token) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('devhire_token', token);
    localStorage.setItem('devhire_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('devhire_token');
    localStorage.removeItem('devhire_user');
    setUser(null);
  };

  // Helpers used throughout the app
  const isClient = user?.role === 'client';
  const isFreelancer = user?.role === 'freelancer';
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{
      user, login, logout, loading,
      isClient, isFreelancer, isLoggedIn
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook — use this in every component instead of useContext directly
export const useAuth = () => useContext(AuthContext);