import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { LoadingProvider } from './contexts/LoadingContext';
import { BrowserRouter } from 'react-router-dom';
import { RestaurantProvider } from './contexts/RestaurantContext';

ReactDOM.render(
  <React.StrictMode>
    <LoadingProvider>
      <AuthProvider>
        <RestaurantProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </RestaurantProvider>
      </AuthProvider>
    </LoadingProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

