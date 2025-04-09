import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ContextProvider } from './SocketContext';
import AppRoutes from './AppRoutes';
import './styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <ContextProvider>
      <AppRoutes />
    </ContextProvider>
  </BrowserRouter>
);
