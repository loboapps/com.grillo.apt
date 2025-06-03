import React, { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import { icons } from '../utils/icons'
import { useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const MAX_REBUYS = 2

interface Player {
  etapa_id: string
  jogador_id: string
  nome: string
  rebuys: number
}

const ManageEliminacao = () => {
  const location = useLocation()
  const etapaId = location.state?.etapaId
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ open: boolean; player: Player | null }>({ open: false, player: null })

  useEffect(() => {
    const fetchPlayers = async () => {
      setLoading(true)
      if (!etapaId) {
        setPlayers([])
        setLoading(false)
        return
      }
      try {
        const { data, error } = await supabase.rpc('manageetapa_eliminacao_load', { p_etapa_id: etapaId })
        console.log('manageetapa_eliminacao_load retorno:', { data, error })
        if (error) {
          setPlayers([])
        } else if (Array.isArray(data)) {
          setPlayers(data)
        } else {
          setPlayers([])
        }
      } catch (err) {
        console.error('Erro inesperado em fetchPlayers:', err)
        setPlayers([])
      }
      setLoading(false)
    }
    fetchPlayers()
  }, [etapaId])

  const handleRebuy = (player: Player) => {
    // Aqui você pode adicionar lógica para registrar o rebuy no backend
    // Após sucesso, recarregue os dados
    // Exemplo:
    // await supabase.rpc('manageetapa_eliminacao_rebuy', { p_etapa_id: player.etapa_id, p_jogador_id: player.jogador_id })
    // fetchPlayers()
  }

  const handleEliminate = (player: Player) => {
    setModal({ open: true, player })
  }

  const confirmEliminate = () => {
    // Aqui você pode adicionar lógica para eliminar o jogador (chamada backend)
    setModal({ open: false, player: null })
    // Após sucesso, recarregue os dados
    // fetchPlayers()
  }

  return (
    <div className="min-h-screen bg-apt-100">
      <Nav title="Eliminação e Rebuy" />
      <div className="px-4 py-6">
        {loading ? (
          <div>Carregando jogadores...</div>
        ) : (
          <div className="space-y-4">
            {players.map((player, index) => (
              <div key={player.jogador_id} className={`flex items-center ${index < players.length - 1 ? 'border-b' : ''} border-apt-300 pb-2`}>
                <span className="text-apt-800 flex-1">{player.nome}</span>
                <div className="flex gap-2 min-w-[120px] justify-end">
                  {/* Rebuy */}
                  <button
                    onClick={() => handleRebuy(player)}
                    disabled={player.rebuys >= MAX_REBUYS}
                    className={`w-[80px] h-10 border border-black rounded flex items-center justify-center ${
                      player.rebuys >= MAX_REBUYS ? 'bg-gray-200 cursor-not-allowed opacity-50' : 'hover:bg-gray-100'
                    }`}
                  >
                    <icons.RotateCw className="w-5 h-5 mr-2" />
                    x {player.rebuys}
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
        )}

        <div className="mt-6">
          <button
            className="w-full bg-apt-500 text-apt-100 p-3 rounded hover:bg-apt-300 hover:text-apt-900"
          >
            Gerenciar Financeiro
          </button>
        </div>
      </div>

      {/* Modal de confirmação de eliminação */}
      {modal.open && modal.player && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-apt-100 rounded-lg shadow-lg p-6 w-full max-w-xs">
            <div className="mb-4 text-center text-apt-900 font-semibold">
              Deseja eliminar {modal.player.nome}?
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