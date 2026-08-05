import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { BrowserRouter } from 'react-router-dom';
import { CarritoProvider } from './context/CarritoContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <CarritoProvider>
      <App />
    </CarritoProvider>
  </BrowserRouter>
);