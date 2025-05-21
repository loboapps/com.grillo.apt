import React, { useState } from 'react'
import Nav from '../components/Nav'

const players = [
  'Pietro', 'Chico', 'Binho', 'Marcelo', 'João',
  'Geléia', 'Gean', 'Jeferson', 'Guedes', 'Matrix',
  'Leandro', 'Quadros', 'Barcímio', 'Leo'
]

const GerenciarEtapa = () => {
  const [rebuys, setRebuys] = useState<{ [key: string]: number }>({})

  const handleRebuy = (player: string) => {
    setRebuys(prev => ({
      ...prev,
      [player]: (prev[player] || 0) + 1
    }))
  }

  return (
    <div className="min-h-screen bg-white">
      <Nav title="Gerenciar Etapa" />
      
      <div className="px-4 py-6">
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4">Jogadores na Etapa</h2>
          {players.map((player, index) => (
            <div key={index} className="flex items-center justify-between border-b pb-2">
              <span className="text-gray-900">{player}</span>
              <div className="space-x-2">
                <button className="w-10 h-10 border border-black rounded flex items-center justify-center hover:bg-gray-100">
                  ❌
                </button>
                <button 
                  onClick={() => handleRebuy(player)}
                  className="px-3 h-10 border border-black rounded flex items-center justify-center hover:bg-gray-100 whitespace-nowrap"
                >
                  ♻️ x {rebuys[player] || 0}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <button
            className="w-full bg-red-600 text-white p-3 rounded hover:bg-red-700"
          >
            Gerenciar Financeiro
          </button>
        </div>
      </div>
    </div>
  )
}

export default GerenciarEtapa
