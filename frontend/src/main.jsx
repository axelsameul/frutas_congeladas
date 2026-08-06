import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ScrollToTop from './components/ScrollToTop';
import { BrowserRouter } from 'react-router-dom';
import { CarritoProvider } from './context/CarritoContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ScrollToTop />
    <CarritoProvider>
      <App />
    </CarritoProvider>
  </BrowserRouter>
);