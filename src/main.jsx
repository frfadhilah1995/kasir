import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { DatabaseProvider } from './context/DatabaseContext'

import { AuthProvider } from './context/AuthContext';
import ErrorBoundary from './components/Shared/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/kasir">
      <ErrorBoundary>
        <AuthProvider>
          <DatabaseProvider>
            <App />
          </DatabaseProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>,
)
