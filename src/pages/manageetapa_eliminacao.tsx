import React, { useState } from 'react'
import Nav from '../components/Nav'
import { icons } from '../utils/icons'

const MAX_REBUYS = 2

const players = [
  'Pietro', 'Chico', 'Binho', 'Marcelo', 'João',
  'Geléia', 'Gean', 'Jeferson', 'Guedes', 'Matrix',
  'Leandro', 'Quadros', 'Barcímio', 'Leo'
]

const ManageEliminacao = () => {
  const [rebuys, setRebuys] = useState<{ [key: string]: number }>({})
  const [modal, setModal] = useState<{ open: boolean; player: string | null }>({ open: false, player: null })

  const handleRebuy = (player: string) => {
    const currentRebuys = rebuys[player] || 0
    if (currentRebuys < MAX_REBUYS) {
      setRebuys(prev => ({
        ...prev,
        [player]: currentRebuys + 1
      }))
    }
  }

  const handleEliminate = (player: string) => {
    setModal({ open: true, player })
  }

  const confirmEliminate = () => {
    // Aqui você pode adicionar lógica para eliminar o jogador
    setModal({ open: false, player: null })
  }

  return (
    <div className="min-h-screen bg-apt-100">
      <Nav title="Eliminação e Rebuy" />
      <div className="px-4 py-6">
        <div className="space-y-4">
          {players.map((player, index) => (
            <div key={index} className={`flex items-center ${index < players.length - 1 ? 'border-b' : ''} border-apt-300 pb-2`}>
              <span className="text-apt-800 flex-1">{player}</span>
              <div className="flex gap-2 min-w-[120px] justify-end">
                {/* Rebuy */}
                <button
                  onClick={() => handleRebuy(player)}
                  disabled={(rebuys[player] || 0) >= MAX_REBUYS}
                  className={`w-[80px] h-10 border border-black rounded flex items-center justify-center ${
                    (rebuys[player] || 0) >= MAX_REBUYS ? 'bg-gray-200 cursor-not-allowed opacity-50' : 'hover:bg-gray-100'
                  }`}
                >
                  <icons.RotateCw className="w-5 h-5 mr-2" />
                  x {rebuys[player] || 0}
                </button>
                {/* Eliminar */}
                <button
                  onClick={() => handleEliminate(player)}
                  className="w-10 h-10 border border-black rounded flex items-center justify-center hover:bg-gray-100"
                >
                  <icons.BadgeMinus className="text-red-500 w-6 h-6" />
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

      {/* Modal de confirmação de eliminação */}
      {modal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-apt-100 rounded-lg shadow-lg p-6 w-full max-w-xs">
            <div className="mb-4 text-center text-apt-900 font-semibold">
              Deseja eliminar {modal.player}?
            </div>
            <div className="flex gap-4 justify-center">
              <button
                className="flex-1 bg-apt-500 text-apt-100 py-2 rounded hover:bg-apt-300 hover:text-apt-900"
                onClick={() => setModal({ open: false, player: null })}
              >
                Cancelar
              </button>
              <button
                className="flex-1 bg-apt-800 text-apt-100 py-2 rounded hover:bg-apt-600"
                onClick={confirmEliminate}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageEliminacao