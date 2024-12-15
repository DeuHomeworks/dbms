import React from 'react';
import ReactDOM from 'react-dom/client'; // Use createRoot from react-dom/client
import App from './App';
import './styles/Global.css';
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root')); // Create a root
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
