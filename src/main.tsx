import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Admin from './pages/admin'
import EtapaJogadores from './pages/configetapa_jogadores'
import EtapaEliminacaoRebuy from './pages/etapa_eliminacao_rebuy'
import EtapaMesas from './pages/configetapa_mesas'
import ConfiguracaoFinanceiro from './pages/configetapa_financeiro'
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
          <Route path="/config-etapa/financeiro" element={<ConfiguracaoFinanceiro />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
)
