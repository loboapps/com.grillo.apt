import React, { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import SubNav from '../components/SubNav'
import Toast from '../components/Toast'
import { useGuests } from '../hooks/useGuests'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { icons } from '../utils/icons'

interface Player {
  id_jogador: string
  nome: string
  status: 'pendente' | 'falta'
}

const ManageJogador = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const etapaId = location.state?.etapaId
  const { guests, addGuest, updateGuest, removeGuest } = useGuests()
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [confirmedGuests, setConfirmedGuests] = useState<string[]>([])

  // Carrega jogadores e convidados
  const fetchPlayers = async () => {
    setLoading(true)
    if (!etapaId) {
      setLoading(false)
      return
    }
    try {
      const { data, error } = await supabase.rpc('manageetapa_jogadores_load', { p_etapa_id: etapaId })
      console.log('manageetapa_jogadores_load retorno:', { data, error })
      if (error) {
        setToast({ message: 'Erro ao carregar jogadores', type: 'error' })
        setLoading(false)
        return
      }
      // O retorno é um array de jogadores (falta ou pendente) e convidados
      const jogadores = Array.isArray(data) ? data : []
      setPlayers(jogadores.filter((p: any) => p.id_jogador))
      setConfirmedGuests(jogadores.filter((p: any) => !p.id_jogador).map((g: any) => g.nome))
    } catch (err) {
      console.error('Erro inesperado em fetchPlayers:', err)
      setToast({ message: 'Erro inesperado ao carregar jogadores', type: 'error' })
    }
    setLoading(false)
  }

  useEffect(() => {
    if (etapaId) fetchPlayers()
  }, [etapaId])

  // Atualiza status do jogador
  const handlePlayerStatus = async (playerId: string, status: 'falta' | 'presente') => {
    if (!etapaId) return
    const { data, error } = await supabase.rpc('configetapa_jogador_status', {
      p_etapa_id: etapaId,
      p_jogador_id: playerId,
      p_status: status
    })
    if (error) {
      setToast({ message: 'Erro ao atualizar status', type: 'error' })
    } else {
      setToast({ message: data || 'Status atualizado', type: 'success' })
      fetchPlayers()
    }
  }

  // Remove ou adiciona convidado
  const handleGuestAction = async (guestName: string, acao: 'adicionar' | 'cortar') => {
    if (!etapaId) return
    const { data, error } = await supabase.rpc('configetapa_jogadores_convidado', {
      p_etapa_id: etapaId,
      p_jogador_nome: guestName,
      p_acao: acao
    })
    if (error) {
      setToast({ message: 'Erro ao atualizar convidado', type: 'error' })
    } else {
      setToast({ message: data || 'Ação realizada', type: 'success' })
      fetchPlayers()
    }
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
        <Nav title="Gerenciar Jogador" />
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
      <Nav title="Gerenciar Jogador" />
      <SubNav title="Jogadores" />
      <div className="px-4 pt-2 pb-6">
        <div className="space-y-4">
          {/* Regular Players Section */}
          {players.map((player, index) => (
            <div key={player.id_jogador} className={`flex items-center ${
              index < players.length - 1 ? 'border-b' : ''
            } border-apt-300 pb-2`}>
              <span className="text-apt-800 flex-1">{player.nome}</span>
              <div className="flex gap-2 min-w-[120px] justify-end">
                {/* Presente */}
                <button
                  disabled={player.status === 'presente'}
                  onClick={() => handlePlayerStatus(player.id_jogador, 'presente')}
                  className={`w-10 h-10 border rounded flex items-center justify-center ${
                    player.status === 'presente'
                      ? 'bg-apt-800 border-apt-800 cursor-default'
                      : 'border-apt-800 hover:bg-gray-100'
                  }`}
                >
                  <icons.BadgeCheck
                    className={player.status === 'presente'
                      ? 'text-apt-100'
                      : 'text-apt-800'
                    }
                  />
                </button>
                {/* Falta */}
                <button
                  disabled={player.status === 'falta'}
                  onClick={() => handlePlayerStatus(player.id_jogador, 'falta')}
                  className={`w-10 h-10 border rounded flex items-center justify-center ${
                    player.status === 'falta'
                      ? 'bg-apt-800 border-apt-800 cursor-default'
                      : 'border-apt-800 hover:bg-gray-100'
                  }`}
                >
                  <icons.BadgeX
                    className={player.status === 'falta'
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
                    onClick={() => handleGuestAction(guest, 'cortar')}
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
                <button 
                  onClick={() => {
                    if (guest.trim()) {
                      handleGuestAction(guest, 'adicionar')
                      removeGuest(index)
                    }
                  }}
                  className="w-10 h-10 border border-apt-800 rounded flex items-center justify-center hover:bg-gray-100"
                >
                  <icons.BadgePlus className="text-apt-800" />
                </button>
              </div>
            </div>
          ))}

          {/* Action Buttons */}
          <div className="mt-6 space-y-4">
            <button onClick={addGuest} className="w-full bg-apt-500 text-apt-100 p-3 rounded hover:bg-apt-300 hover:text-apt-900">
              Adicionar Convidado
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageJogador