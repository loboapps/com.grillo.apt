import React, { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import { useGuests } from '../hooks/useGuests'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

interface Player {
  id: string
  nome: string
  apelido: string | null
  telefone: string | null
}

const EtapaJogadores = () => {
  const navigate = useNavigate()
  const { guests, addGuest, updateGuest, removeGuest } = useGuests()
  const [players, setPlayers] = useState<Player[]>([])

  useEffect(() => {
    const fetchPlayers = async () => {
      const { data, error } = await supabase.rpc('jogadores_load_data')
      if (error) {
        console.error('Error:', error)
        return
      }
      if (data?.[0]?.jogadores_load_data) {
        setPlayers(data[0].jogadores_load_data)
      }
    }
    fetchPlayers()
  }, [])

  const handleSortearMesas = () => {
    navigate('/config-etapa/mesas', { 
      state: { 
        members: players.map(p => ({ id: p.id, nome: p.nome })),
        guests: guests.filter(g => g.trim() !== '')
      } 
    })
  }

  return (
    <div className="min-h-screen bg-apt-100">
      <Nav title="Jogadores" />
      <div className="px-4 py-6">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-apt-800 mb-4">Jogadores</h2>
          {players.map((player) => (
            <div key={player.id} className="flex items-center border-b border-apt-300 pb-2">
              <span className="text-apt-800 flex-1">{player.nome}</span>
              <div className="flex gap-2 min-w-[120px] justify-end">
                <button 
                  className="w-10 h-10 border border-black rounded flex items-center justify-center hover:bg-gray-100"
                  data-player-id={player.id}
                >
                  ☑️
                </button>
                <button 
                  className="w-10 h-10 border border-black rounded flex items-center justify-center hover:bg-gray-100"
                  data-player-id={player.id}
                >
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
            <button
              onClick={handleSortearMesas}
              className="w-full bg-apt-500 text-apt-100 p-3 rounded hover:bg-apt-300 hover:text-apt-900"
            >
              Sortear Mesa
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EtapaJogadores