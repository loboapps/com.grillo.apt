import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import Admin from './pages/admin'
import Classificacao from './pages/Classificacao'
import Financeiro from './pages/financeiro'
import Mesas from './pages/mesas'
import Perfil from './pages/perfil'
import Login from './pages/login'
import ConfiguracaoFinanceiro from './pages/configetapa_financeiro'
import ConfiguracaoJogadores from './pages/configetapa_jogadores'
import ConfiguracaoSorteio from './pages/configetapa_sorteio.tsx'
import ManageJogador from './pages/manageetapa_jogador'
import ManageEliminacao from './pages/manageetapa_eliminacao'
import ManageFinanceiro from './pages/manageetapa_financeiro'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/classificacao" element={<Classificacao />} />
          <Route path="/financeiro" element={<Financeiro />} />
          <Route path="/mesas" element={<Mesas />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/login" element={<Login />} />

          {/* Admin/configuração */}
          <Route path="/config/financeiro" element={<ConfiguracaoFinanceiro />} />
          <Route path="/config/jogadores" element={<ConfiguracaoJogadores />} />
          <Route path="/config/sorteio" element={<ConfiguracaoSorteio />} />

          {/* Admin/gerenciamento */}
          <Route path="/manage/jogador" element={<ManageJogador />} />
          <Route path="/manage/eliminacao" element={<ManageEliminacao />} />
          <Route path="/manage/financeiro" element={<ManageFinanceiro />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
)
