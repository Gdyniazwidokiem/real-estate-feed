import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

document.addEventListener('DOMContentLoaded', () => {
  if (!localStorage.getItem('user')) {
    localStorage.setItem('user', JSON.stringify({ email: 'alex@cityhomes.com', isPremium: false }));
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
