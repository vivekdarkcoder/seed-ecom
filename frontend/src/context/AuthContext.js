import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginAPI, register as registerAPI, getMe } from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('sc_token');
    if (token) {
      getMe()
        .then((res) => setUser(res.data.user))
        .catch(() => { localStorage.removeItem('sc_token'); localStorage.removeItem('sc_user'); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await loginAPI({ email, password });
    localStorage.setItem('sc_token', res.data.token);
    localStorage.setItem('sc_user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    toast.success(`Welcome back, ${res.data.user.name}!`);
    return res.data.user;
  };

  const register = async (data) => {
    const res = await registerAPI(data);
    localStorage.setItem('sc_token', res.data.token);
    setUser(res.data.user);
    toast.success('Account created successfully!');
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('sc_token');
    localStorage.removeItem('sc_user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
