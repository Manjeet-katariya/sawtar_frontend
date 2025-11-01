// store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

// Load from localStorage
const loadInitialState = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 > Date.now()) {
        return {
          user: decoded,
          token,
          permissions: {}, // FLAT MAP
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
    permissions: {},
    loading: false,
    error: null,
    isAuthenticated: false
  };
};

// LOGIN
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password, endpoint }, { rejectWithValue }) => {
    try {
      const response = await axios.post(endpoint, { email, password });
      const data = response.data;
      
      if (!data.success) return rejectWithValue(data);
      
      localStorage.setItem('token', data.token);
      const decoded = jwtDecode(data.token);
      
      return { user: decoded, token: data.token };
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: 'Network error' });
    }
  }
);

// LOGOUT
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { getState }) => {
    try {
      const { token } = getState().auth;
      if (token) await axios.post('/api/auth/logout');
    } catch (error) {
      console.warn('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
    }
  }
);

// REFRESH TOKEN
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      if (!token) return rejectWithValue('No token');
      
      const res = await axios.post('/api/auth/refresh');
      const newToken = res.data.token;
      const decoded = jwtDecode(newToken);
      
      localStorage.setItem('token', newToken);
      return { user: decoded, token: newToken };
    } catch (err) {
      localStorage.removeItem('token');
      return rejectWithValue('Refresh failed');
    }
  }
);

// FETCH MY PERMISSIONS (NEW ENDPOINT)
export const fetchMyPermissions = createAsyncThunk(
  'auth/fetchMyPermissions',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      const res = await axios.get('http://localhost:5000/api/permission/my', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        return res.data.permissions;
      } else {
        return rejectWithValue(res.data.message);
      }
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch permissions');
    }
  }
);

// SLICE
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
          } else {
            localStorage.removeItem('token');
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
          }
        } catch {
          localStorage.removeItem('token');
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        }
      }
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
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

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.permissions = {};
        state.isAuthenticated = false;
        state.error = null;
      })

      // REFRESH
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.permissions = {};
        state.isAuthenticated = false;
      })

      // FETCH PERMISSIONS
      .addCase(fetchMyPermissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyPermissions.fulfilled, (state, action) => {
        state.loading = false;
        // FLAT MAP: "Productsss→Add New" → { canView: 1, route: "/products/new" }
        state.permissions = action.payload.reduce((map, p) => {
          const key = p.subModule
            ? `${p.module.name}→${p.subModule.name}`
            : p.module.name;

          map[key] = {
            canView: p.permissions.canView,
            canAdd: p.permissions.canAdd,
            canEdit: p.permissions.canEdit,
            canDelete: p.permissions.canDelete,
            canViewAll: p.permissions.canViewAll,
            route: p.subModule?.route || p.module.route,
            icon: p.subModule?.icon || p.module.icon,
            name: p.subModule?.name || p.module.name,
            moduleName: p.module.name
          };
          return map;
        }, {});
      })
      .addCase(fetchMyPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.permissions = {};
      });
  }
});

export const { rehydrateAuthState, clearError } = authSlice.actions;
export default authSlice.reducer;