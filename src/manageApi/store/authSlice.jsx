import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const loadInitialState = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 > Date.now()) {
        return {
          user: decoded,
          token: token,
          permissions: [],
          loading: false,
          error: null,
          isAuthenticated: true
        };
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      localStorage.removeItem('token');
    }
  }
  return {
    user: null,
    token: null,
    permissions: [],
    loading: false,
    error: null,
    isAuthenticated: false
  };
};

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password, endpoint }, { rejectWithValue }) => {
    try {
      const response = await axios.post(endpoint, { email, password });
      const data = response.data;
      
      if (!data.success) {
        return rejectWithValue(data);
      }
      
      localStorage.setItem('token', data.token);
      const decoded = jwtDecode(data.token);
      
      return { 
        user: decoded, 
        token: data.token, 
        message: data.message 
      };
    } catch (err) {
      const errorResponse = err.response?.data || { 
        message: 'Network error', 
        errors: [] 
      };
      return rejectWithValue(errorResponse);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser', 
  async (_, { getState }) => {
    try {
      const { auth: { token } } = getState();
      if (token) {
        await axios.post('/api/auth/logout');
      }
    } catch (error) {
      console.warn('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      return null;
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken', 
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth: { token } } = getState();
      if (!token) return rejectWithValue('No token to refresh');
      
      const response = await axios.post('/api/auth/refresh');
      const newToken = response.data.token;
      const decoded = jwtDecode(newToken);
      
      localStorage.setItem('token', newToken);
      return { user: decoded, token: newToken };
    } catch (err) {
      localStorage.removeItem('token');
      return rejectWithValue('Refresh failed');
    }
  }
);

export const fetchPermissions = createAsyncThunk(
  'auth/fetchPermissions',
  async ({ roleCode, token }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/permission?roleCode=${roleCode}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        return response.data.permissions;
      } else {
        return rejectWithValue(response.data.message);
      }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Error fetching permissions');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: loadInitialState(),
  reducers: {
    rehydrateAuthState: (state) => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          if (decoded.exp * 1000 > Date.now()) {
            state.user = decoded;
            state.token = token;
            state.isAuthenticated = true;
            state.error = null;
          } else {
            localStorage.removeItem('token');
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
          }
        } catch (error) {
          localStorage.removeItem('token');
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        }
      } else {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      }
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Login failed';
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.permissions = [];
        state.loading = false;
        state.error = null;
        state.isAuthenticated = false;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.permissions = [];
        state.isAuthenticated = false;
      })
      .addCase(fetchPermissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = action.payload;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { rehydrateAuthState, clearError } = authSlice.actions;
export default authSlice.reducer;