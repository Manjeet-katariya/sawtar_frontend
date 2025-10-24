import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';                      // ✅ Then Tailwind + custom styles

import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { AuthProvider } from './manageApi/context/AuthContext';
import { store } from './manageApi/store/store';
import PersistLogin from './manageApi/context/PersistLogin';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from './manageApi/context/CartContext';

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // Retry failed queries twice
      staleTime: 5 * 60 * 1000, // Cache queries for 5 minutes
    },
    mutations: {
      retry: 1, // Retry failed mutations once
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BrowserRouter>
            <PersistLogin>
              <CartProvider>
                <App />
                <ToastContainer position="top-right" autoClose={3000} />
              </CartProvider>
            </PersistLogin>
          </BrowserRouter>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>
);
