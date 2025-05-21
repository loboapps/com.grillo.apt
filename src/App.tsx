import React from 'react'
import Nav from './components/Nav'
import Classification from './components/Classification'

function App() {
  return (
    <div className="min-h-screen bg-apt-100">
      <h1 className="text-3xl font-bold text-apt-800">
      </h1>
      <Nav title="APT Poker" />
      <Classification />
    </div>
  )
}

export default App