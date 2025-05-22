import React, { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import { useGuests } from '../hooks/useGuests'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { icons } from '../utils/icons'

interface Player {
  id: string
  nome: string
  apelido: string | null
  telefone: string | null
  confirmado?: boolean
  status?: 'falta' | 'confirmado' | 'convidado'
}

const EtapaJogadores = () => {
  const navigate = useNavigate()
  const { guests, addGuest, updateGuest, removeGuest } = useGuests()
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmedPlayers, setConfirmedPlayers] = useState<{ [key: string]: boolean }>({})
  const [addedGuests, setAddedGuests] = useState<{ [key: number]: boolean }>({})

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const { data, error } = await supabase.rpc('jogadores_load_data')
        if (error) {
          console.error('Error:', error)
          return
        }

        if (data) {
          // Filter out guests from players list
          const regularPlayers = data.filter(p => p.id !== null)
          setPlayers(regularPlayers)
          
          // Initialize confirmed players based on status
          const initialConfirmed: { [key: string]: boolean } = {}
          const initialGuests: string[] = []
          
          data.forEach(player => {
            if (player.id) {
              if (player.status === 'confirmado') {
                initialConfirmed[player.id] = true
              } else if (player.status === 'falta') {
                initialConfirmed[player.id] = false
              }
            } else if (player.status === 'convidado') {
              initialGuests.push(player.nome)
            }
          })
          
          setConfirmedPlayers(initialConfirmed)
          initialGuests.forEach(guest => addGuest(guest))
        }
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPlayers()
  }, [])

  const handlePlayerStatus = async (playerId: string, confirmed: boolean) => {
    try {
      const { error } = await supabase.rpc('etapa_gerenciar_jogador', {
        p_jogador_id: playerId,
        p_confirmado: confirmed
      })

      if (error) {
        console.error('Error:', error)
        return
      }

      setConfirmedPlayers(prev => ({
        ...prev,
        [playerId]: confirmed,
        // Clear opposite status when setting new status
        ...(confirmed ? { [playerId]: true } : { [playerId]: false })
      }))
    } catch (err) {
      console.error('Management error:', err)
    }
  }

  const handleRemoveGuest = async (index: number) => {
    const guestName = guests[index]
    try {
      const { error } = await supabase.rpc('etapa_gerenciar_jogador', {
        p_jogador_id: null,
        p_confirmado: false,
        p_nome_convidado: guestName
      })

      if (error) {
        console.error('Error:', error)
        return
      }

      // Only remove from local state after successful API call
      removeGuest(index)
    } catch (err) {
      console.error('Guest removal error:', err)
    }
  }

  const handleAddGuest = async (index: number) => {
    const guestName = guests[index]
    if (!guestName.trim()) return

    try {
      const { error } = await supabase.rpc('etapa_gerenciar_jogador', {
        p_jogador_id: null,
        p_confirmado: true,
        p_nome_convidado: guestName
      })

      if (error) {
        console.error('Error:', error)
        return
      }

      setAddedGuests(prev => ({
        ...prev,
        [index]: true
      }))
      // Don't remove the guest input after adding
    } catch (err) {
      console.error('Guest addition error:', err)
    }
  }

  const handleSortearMesas = () => {
    navigate('/config-etapa/mesas', { 
      state: { 
        members: players.map(p => ({ id: p.id, nome: p.nome })),
        guests: guests.filter(g => g.trim() !== '')
      } 
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-apt-100">
        <Nav title="Jogadores" />
        <div className="px-4 py-6">
          <div className="text-apt-800">Carregando jogadores...</div>
        </div>
      </div>
    )
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
                  onClick={() => handlePlayerStatus(player.id, true)}
                  className={`w-10 h-10 border rounded flex items-center justify-center ${
                    confirmedPlayers[player.id] === true 
                      ? 'bg-apt-800 border-apt-800' 
                      : 'border-apt-800 hover:bg-gray-100'
                  }`}
                >
                  <icons.BadgeCheck 
                    className={confirmedPlayers[player.id] === true
                      ? 'text-apt-100' 
                      : 'text-apt-800'
                    }
                  />
                </button>
                <button 
                  onClick={() => handlePlayerStatus(player.id, false)}
                  className={`w-10 h-10 border rounded flex items-center justify-center ${
                    confirmedPlayers[player.id] === false 
                      ? 'bg-apt-800 border-apt-800' 
                      : 'border-apt-800 hover:bg-gray-100'
                  }`}
                >
                  <icons.BadgeX 
                    className={confirmedPlayers[player.id] === false
                      ? 'text-apt-100' 
                      : 'text-red-500'
                    }
                  />
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
                className="flex-1 p-2 border rounded mr-2"
              />
              <div className="flex gap-2">
                {!addedGuests[index] ? (
                  <button 
                    onClick={() => handleAddGuest(index)}
                    className="w-10 h-10 border border-apt-800 rounded flex items-center justify-center hover:bg-gray-100"
                  >
                    <icons.BadgePlus className="text-apt-800" />
                  </button>
                ) : (
                  <button 
                    onClick={() => handleRemoveGuest(index)}
                    className="w-10 h-10 border border-apt-800 rounded flex items-center justify-center hover:bg-gray-100"
                  >
                    <icons.BadgeMinus className="text-red-500" />
                  </button>
                )}
              </div>
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