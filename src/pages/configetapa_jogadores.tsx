import React, { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import SubNav from '../components/SubNav'
import Toast from '../components/Toast'
import { useGuests } from '../hooks/useGuests'
import { useNavigate } from 'react-router-dom'
import { icons } from '../utils/icons'

// MOCK DATA
const MOCK_PLAYERS = [
  { id: '1', nome: 'Pietro', apelido: null, telefone: null, status: 'confirmado' },
  { id: '2', nome: 'Chico', apelido: null, telefone: null, status: 'confirmado' },
  { id: '3', nome: 'Binho', apelido: null, telefone: null, status: 'falta' },
  { id: '4', nome: 'Marcelo', apelido: null, telefone: null, status: 'confirmado' },
  { id: '5', nome: 'João', apelido: null, telefone: null, status: 'falta' }
]
const MOCK_CONFIRMED_GUESTS = ['Barcímio', 'Leo']

interface Player {
  id: string | null
  nome: string
  apelido: string | null
  telefone: string | null
  status: 'falta' | 'confirmado' | 'convidado' | null
}

const ConfiguracaoJogadores = () => {
  const navigate = useNavigate()
  const { guests, addGuest, updateGuest, removeGuest } = useGuests()
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmedPlayers, setConfirmedPlayers] = useState<{ [key: string]: boolean }>({})
  const [addedGuests, setAddedGuests] = useState<{ [key: number]: boolean }>({})
  const [confirmedGuests, setConfirmedGuests] = useState<string[]>([])
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    // MOCK: popula os dados sem backend
    setPlayers(MOCK_PLAYERS)
    setConfirmedGuests(MOCK_CONFIRMED_GUESTS)
    const initialConfirmed = MOCK_PLAYERS.reduce((acc, player) => ({
      ...acc,
      [player.id!]: player.status === 'confirmado'
    }), {})
    setConfirmedPlayers(initialConfirmed)
    setLoading(false)
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
        ...(confirmed ? { [playerId]: true } : { [playerId]: false })
      }))
    } catch (err) {
      console.error('Management error:', err)
    }
  }

  const handleRemoveGuest = async (index: number) => {
    const guestName = confirmedGuests[index]
    try {
      const { data, error } = await supabase.rpc('etapa_gerenciar_jogador', {
        p_jogador_id: null,
        p_confirmado: false,
        p_nome_convidado: guestName
      })

      if (error) {
        console.error('Error:', error)
        return
      }

      if (data?.status === 'removido') {
        setToast({ message: 'Convidado removido com sucesso', type: 'success' })
        setConfirmedGuests(prev => prev.filter((_, i) => i !== index))
      } else if (data?.status === 'nao_encontrado_para_remocao') {
        setToast({ message: 'Convidado não encontrado', type: 'error' })
      }
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

      setConfirmedGuests(prev => [...prev, guestName])
      removeGuest(index)
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

  const renderSection = (title: string, smallMargin?: boolean) => (
    <div className={`relative ${smallMargin ? 'my-4' : 'my-8'}`}>
      <div className="absolute inset-0 flex items-center z-0">
        <div className="w-full border-t border-apt-300"></div>
      </div>
      <div className="relative flex justify-center z-0">
        <span className="bg-apt-100 px-4 text-sm font-medium text-apt-800 uppercase tracking-widest">
          {title}
        </span>
      </div>
    </div>
  )

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
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      <Nav title="Configurar etapa" />
      <SubNav title="Jogadores" />
      <div className="px-4 pt-2 pb-6">
        <div className="space-y-4">
          {/* Regular Players Section */}
          {players.map((player, index) => (
            <div key={player.id} className={`flex items-center ${
              index < players.length - 1 ? 'border-b' : ''
            } border-apt-300 pb-2`}>
              <span className="text-apt-800 flex-1">{player.nome}</span>
              <div className="flex gap-2 min-w-[120px] justify-end">
                <button 
                  onClick={() => setConfirmedPlayers(prev => ({ ...prev, [player.id!]: true }))}
                  className={`w-10 h-10 border rounded flex items-center justify-center ${
                    confirmedPlayers[player.id!] === true 
                      ? 'bg-apt-800 border-apt-800' 
                      : 'border-apt-800 hover:bg-gray-100'
                  }`}
                >
                  <icons.BadgeCheck 
                    className={confirmedPlayers[player.id!] === true
                      ? 'text-apt-100' 
                      : 'text-apt-800'
                    }
                  />
                </button>
                <button 
                  onClick={() => setConfirmedPlayers(prev => ({ ...prev, [player.id!]: false }))}
                  className={`w-10 h-10 border rounded flex items-center justify-center ${
                    confirmedPlayers[player.id!] === false 
                      ? 'bg-apt-800 border-apt-800' 
                      : 'border-apt-800 hover:bg-gray-100'
                  }`}
                >
                  <icons.BadgeX 
                    className={confirmedPlayers[player.id!] === false
                      ? 'text-apt-100' 
                      : 'text-red-500'
                    }
                  />
                </button>
              </div>
            </div>
          ))}

          {/* Confirmed Guests Section */}
          {confirmedGuests.length > 0 && (
            <>
              {renderSection('Convidados')}
              {confirmedGuests.map((guest, index) => (
                <div key={`confirmed-guest-${index}`} className="flex items-center border-b border-apt-300 pb-2">
                  <span className="text-apt-800 flex-1">{guest}</span>
                  <button 
                    onClick={() => setConfirmedGuests(prev => prev.filter((_, i) => i !== index))}
                    className="w-10 h-10 border border-apt-800 rounded flex items-center justify-center hover:bg-gray-100"
                  >
                    <icons.BadgeMinus className="text-red-500" />
                  </button>
                </div>
              ))}
            </>
          )}

          {/* New Guest Input Section */}
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
                    onClick={() => {
                      setConfirmedGuests(prev => [...prev, guest])
                      removeGuest(index)
                    }}
                    className="w-10 h-10 border border-apt-800 rounded flex items-center justify-center hover:bg-gray-100"
                  >
                    <icons.BadgePlus className="text-apt-800" />
                  </button>
                ) : (
                  <button 
                    onClick={() => setConfirmedGuests(prev => prev.filter((_, i) => i !== index))}
                    className="w-10 h-10 border border-apt-800 rounded flex items-center justify-center hover:bg-gray-100"
                  >
                    <icons.BadgeMinus className="text-red-500" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Action Buttons */}
          <div className="mt-6 space-y-4">
            <button onClick={addGuest} className="w-full bg-apt-500 text-apt-100 p-3 rounded hover:bg-apt-300 hover:text-apt-900">
              Adicionar Convidado
            </button>
            <button
              onClick={() => navigate('/config-etapa/mesas', { 
                state: { 
                  members: players.map(p => ({ id: p.id, nome: p.nome })),
                  guests: guests.filter(g => g.trim() !== '')
                } 
              })}
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

export default ConfiguracaoJogadores