import React from 'react'
import Nav from './components/Nav'
import Classification from './components/Classification'

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Nav title="APT Poker" />
      <Classification />
    </div>
  )
}

export default App