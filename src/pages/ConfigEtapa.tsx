import React from 'react'
import Nav from '../components/Nav'
import { useGuests } from '../hooks/useGuests'

const players = [
  'Pietro', 'Chico', 'Binho', 'Marcelo', 'João',
  'Geléia', 'Gean', 'Jeferson', 'Guedes', 'Matrix',
  'Leandro', 'Quadros', 'Barcímio', 'Leo'
]

const ConfigEtapa = () => {
  const { guests, addGuest, updateGuest, removeGuest } = useGuests()

  return (
    <div className="min-h-screen bg-apt-100">
      <Nav title="Config Etapa" />
      <div className="px-4 py-6">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-apt-800 mb-4">Jogadores</h2>
          {players.map((player, index) => (
            <div key={index} className="flex items-center border-b border-apt-300 pb-2">
              <span className="text-apt-800 flex-1">{player}</span>
              <div className="flex gap-2 min-w-[120px] justify-end">
                <button className="w-10 h-10 border border-black rounded flex items-center justify-center hover:bg-gray-100">
                  ☑️
                </button>
                <button className="w-10 h-10 border border-black rounded flex items-center justify-center hover:bg-gray-100">
                  ❌
                </button>
              </div>
            </div>
          ))}
          
          {guests.map((guest, index) => (
            <div key={`guest-${index}`} className="mt-2 flex items-center border-b pb-2">
              <input
                type="text"
                value={guest}
                onChange={(e) => updateGuest(index, e.target.value)}
                placeholder="Nome do convidado"
                className="flex-1 p-2 border rounded"
              />
              <button 
                onClick={() => removeGuest(index)}
                className="ml-2 text-red-600"
              >
                ❌
              </button>
            </div>
          ))}

          <div className="mt-6 space-y-4">
            <button onClick={addGuest} className="w-full bg-apt-500 text-apt-100 p-3 rounded hover:bg-apt-300 hover:text-apt-900">
              Adicionar Convidado
            </button>
            <button className="w-full bg-apt-500 text-apt-100 p-3 rounded hover:bg-apt-300 hover:text-apt-900">
              Sortear Mesa
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfigEtapa
