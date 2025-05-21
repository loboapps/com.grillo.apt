import React from 'react'
import Nav from '../components/Nav'
import { useRebuys } from '../hooks/useRebuys'

const players = [
  'Pietro', 'Chico', 'Binho', 'Marcelo', 'João',
  'Geléia', 'Gean', 'Jeferson', 'Guedes', 'Matrix',
  'Leandro', 'Quadros', 'Barcímio', 'Leo'
]

const GerenciarEtapa = () => {
  const { rebuys, addRebuy, hasMaxRebuys } = useRebuys()

  return (
    <div className="min-h-screen bg-apt-100">
      <Nav title="Gerenciar Etapa" />
      
      <div className="px-4 py-6">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-apt-800 mb-4">Jogadores na Etapa</h2>
          {players.map((player, index) => (
            <div key={index} className="flex items-center border-b border-apt-300 pb-2">
              <span className="text-apt-800 flex-1">{player}</span>
              <div className="flex gap-2 min-w-[120px] justify-end">
                <button className="w-10 h-10 border border-black rounded flex items-center justify-center hover:bg-gray-100">
                  ❌
                </button>
                <button 
                  onClick={() => addRebuy(player)}
                  disabled={hasMaxRebuys(player)}
                  className={`w-[80px] h-10 border border-black rounded flex items-center justify-center ${
                    hasMaxRebuys(player) 
                      ? 'bg-gray-200 cursor-not-allowed opacity-50' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  ♻️ x {rebuys[player] || 0}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <button
            className="w-full bg-apt-500 text-apt-100 p-3 rounded hover:bg-apt-300 hover:text-apt-900"
          >
            Gerenciar Financeiro
          </button>
        </div>
      </div>
    </div>
  )
}

export default GerenciarEtapa
