import React from 'react';
import ReactDOM from 'react-dom/client'; 
import App from './app'; 
import './styles.css';

// ✅ Use createRoot() instead of ReactDOM.render()
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
