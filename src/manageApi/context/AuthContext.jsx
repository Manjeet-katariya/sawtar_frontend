// context/AuthProvider.jsx
import React, { createContext, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { 
  loginUser, 
  logoutUser, 
  refreshToken, 
  rehydrateAuthState, 
  fetchMyPermissions  
} from '../store/authSlice';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { 
    user, 
    token, 
    loading, 
    error, 
    isAuthenticated 
  } = useSelector((state) => state.auth);

  const [intervalId, setIntervalId] = useState(null);
  const hasFetchedPermissions = useRef(false); // ← Track if permissions were fetched

  // 1. Rehydrate on mount
  useEffect(() => {
    dispatch(rehydrateAuthState());
  }, [dispatch]);

  // 2. Fetch permissions ONLY ONCE after successful login
  useEffect(() => {
    if (isAuthenticated && user && token && !hasFetchedPermissions.current) {
      hasFetchedPermissions.current = true; // Prevent re-fetch
      dispatch(fetchMyPermissions()).catch(() => {
        // Optional: handle failure without breaking
      });
    }

    // Reset flag on logout
    if (!isAuthenticated) {
      hasFetchedPermissions.current = false;
    }
  }, [isAuthenticated, user, token, dispatch]);

  // 3. Auto refresh token
  useEffect(() => {
    if (!token) {
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
      return;
    }

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

    return () => {
      clearInterval(id);
      setIntervalId(null);
    };
  }, [token, dispatch]); // ← Removed `intervalId` from deps

  // 4. Login / Logout
  const login = async (email, password, endpoint) => {
    const result = await dispatch(loginUser({ email, password, endpoint })).unwrap();
    return result;
  };

  const logout = async () => {
    hasFetchedPermissions.current = false; // Reset on logout
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