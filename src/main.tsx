import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Admin from './pages/admin'
import ConfigEtapa from './pages/ConfigEtapa'
import GerenciarEtapa from './pages/GerenciarEtapa'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/config-etapa" element={<ConfigEtapa />} />
          <Route path="/gerenciar-etapa" element={<GerenciarEtapa />} />
          <Route path="/cadastrar-usuarios" element={<div>Cadastrar Usuários</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
)
