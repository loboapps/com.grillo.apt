import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Admin from './pages/admin'
import ConfigEtapa from './pages/ConfigEtapa'
import GerenciarEtapa from './pages/GerenciarEtapa'
import Mesas from './pages/Mesas'
import EtapaJogadores from './pages/etapa_jogadores'
import EtapaEliminacaoRebuy from './pages/etapa_eliminacao_rebuy'
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
          <Route path="/mesas" element={<Mesas />} />
          <Route path="/config-etapa/jogadores" element={<EtapaJogadores />} />
          <Route path="/gerenciar-etapa/eliminacao" element={<EtapaEliminacaoRebuy />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
)
