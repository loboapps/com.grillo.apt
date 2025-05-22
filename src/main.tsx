import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Admin from './pages/admin'
import EtapaJogadores from './pages/etapa_jogadores'
import EtapaEliminacaoRebuy from './pages/etapa_eliminacao_rebuy'
import Mesas from './pages/Mesas'
import EtapaMesas from './pages/etapa_mesas'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/config-etapa/jogadores" element={<EtapaJogadores />} />
          <Route path="/gerenciar-etapa/eliminacao" element={<EtapaEliminacaoRebuy />} />
          <Route path="/config-etapa/mesas" element={<EtapaMesas />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
)
