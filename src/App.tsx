import React from 'react'
import Classificacao from './pages/Classificacao'
import InstallPrompt from './components/InstallPrompt'

function App() {
  return (
    <div className="min-h-screen bg-apt-100">
      <Classificacao />
      <InstallPrompt />
    </div>
  )
}

export default App