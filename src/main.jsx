import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { DatabaseProvider } from './context/DatabaseContext'

import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DatabaseProvider>
          <App />
        </DatabaseProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
