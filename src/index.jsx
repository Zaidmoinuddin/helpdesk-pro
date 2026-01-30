import './styles.css';

import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary';
import React from 'react';
import ReactDOM from 'react-dom/client';

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );
} else {
  console.error('Root element not found');
}
