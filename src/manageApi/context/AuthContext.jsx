import React, { createContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { loginUser, logoutUser, refreshToken, rehydrateAuthState, fetchPermissions } from '../store/authSlice';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, token, loading, error, isAuthenticated, permissions } = useSelector((state) => state.auth);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    dispatch(rehydrateAuthState());
  }, [dispatch]);

  useEffect(() => {
    if (user && user.role?.code && token) {
      dispatch(fetchPermissions({ roleCode: user.role.code, token }));
    }
  }, [user, token, dispatch]);

  useEffect(() => {
    if (token) {
      const checkAndRefresh = () => {
        try {
          const decoded = jwtDecode(token);
          const timeToExp = decoded.exp * 1000 - Date.now();
          if (timeToExp < 5 * 60 * 1000) {
            dispatch(refreshToken());
          }
        } catch (err) {
          dispatch(logoutUser());
        }
      };

      checkAndRefresh();
      const id = setInterval(checkAndRefresh, 60 * 1000);
      setIntervalId(id);

      return () => clearInterval(id);
    } else if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  }, [token, dispatch]);

  const login = async (email, password, endpoint) => {
    const result = await dispatch(loginUser({ email, password, endpoint })).unwrap();
    return result;
  };

  const logout = async () => {
    await dispatch(logoutUser()).unwrap();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      error, 
      isAuthenticated,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;