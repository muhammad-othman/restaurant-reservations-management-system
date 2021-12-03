import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { AuthProvider } from './contexts/AuthContext';
import { LoadingProvider } from './contexts/LoadingContext';
import { BrowserRouter } from 'react-router-dom';
import { RestaurantProvider } from './contexts/RestaurantContext';
import { ToastContainer } from 'react-toastify';

ReactDOM.render(
  <React.StrictMode>
    <LoadingProvider>
      <AuthProvider>
        <RestaurantProvider>
          <DndProvider backend={HTML5Backend}>
            <BrowserRouter>
              <ToastContainer />
              <App />
            </BrowserRouter>
          </DndProvider>
        </RestaurantProvider>
      </AuthProvider>
    </LoadingProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

