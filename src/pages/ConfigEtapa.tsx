import React, { useState } from 'react'
import Nav from '../components/Nav'

const players = [
  'Pietro', 'Chico', 'Binho', 'Marcelo', 'João',
  'Geléia', 'Gean', 'Jeferson', 'Guedes', 'Matrix',
  'Leandro', 'Quadros', 'Barcímio', 'Leo'
]

const ConfigEtapa = () => {
  const [guests, setGuests] = useState<string[]>([])
  const [newGuest, setNewGuest] = useState('')

  const handleAddGuest = () => {
    setGuests([...guests, ''])
  }

  const handleGuestChange = (index: number, value: string) => {
    const updatedGuests = [...guests]
    updatedGuests[index] = value
    setGuests(updatedGuests)
  }

  return (
    <div className="min-h-screen bg-white">
      <Nav title="Config Etapa" />
      
      <div className="px-4 py-6">
        <div className="space-y-4">
          {players.map((player, index) => (
            <div key={index} className="flex items-center justify-between border-b pb-2">
              <span className="text-gray-900">{player}</span>
              <div className="space-x-4">
                <button className="text-2xl">☑️</button>
                <button className="text-2xl">❌</button>
              </div>
            </div>
          ))}

          {guests.map((guest, index) => (
            <div key={`guest-${index}`} className="mt-2">
              <input
                type="text"
                value={guest}
                onChange={(e) => handleGuestChange(index, e.target.value)}
                placeholder="Nome do convidado"
                className="w-full p-2 border rounded"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          <button
            onClick={handleAddGuest}
            className="w-full bg-gray-900 text-white p-3 rounded hover:bg-gray-800"
          >
            Adicionar Convidado
          </button>

          <button
            className="w-full bg-red-600 text-white p-3 rounded hover:bg-red-700"
          >
            Sortear Mesa
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfigEtapa
