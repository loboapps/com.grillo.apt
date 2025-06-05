import React, { useEffect, useState, useCallback } from 'react'
import Nav from '../components/Nav'
import { icons } from '../utils/icons'
import { useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const MAX_REBUYS = 2

interface Player {
  etapa_id: string
  jogador_id: string | null
  nome: string
  rebuys: number
}

const ManageEliminacao = () => {
  const location = useLocation()
  const etapaId = location.state?.etapaId
  const [players, setPlayers] = useState<Player[]>([])
  const [intervalo, setIntervalo] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ open: boolean; player: Player | null }>({ open: false, player: null })
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // fetchPlayers com useCallback para garantir escopo correto
  const fetchPlayers = useCallback(async () => {
    setLoading(true)
    if (!etapaId) {
      setPlayers([])
      setLoading(false)
      return
    }
    try {
      const { data, error } = await supabase.rpc('manageetapa_eliminacao_load', { p_etapa_id: etapaId })
      // Suporta tanto retorno direto quanto { data: [...], intervalo: true }
      let jogadores: Player[] = []
      let intervaloFlag = false
      if (data?.data && Array.isArray(data.data)) {
        jogadores = data.data
        intervaloFlag = !!data.intervalo
      } else if (Array.isArray(data)) {
        jogadores = data
      }
      setPlayers(jogadores)
      setIntervalo(intervaloFlag)
      console.log('manageetapa_eliminacao_load sucesso:', jogadores, 'intervalo:', intervaloFlag)
    } catch (err) {
      setPlayers([])
      setIntervalo(false)
    }
    setLoading(false)
    // Toast desaparece após 10s
    if (toast) {
      setTimeout(() => setToast(null), 10000)
    }
  }, [etapaId, toast])

  useEffect(() => {
    fetchPlayers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etapaId, fetchPlayers])

  const handleRebuy = async (player: Player) => {
    if (!etapaId) return
    setPlayers([]) // Limpa a lista para mostrar "processando"
    setLoading(true)
    const { data, error } = await supabase.rpc('manageetapa_eliminacao', {
      p_etapa_id: etapaId,
      p_jogador_id: player.jogador_id ?? null,
      p_nome: player.nome,
      p_acao: 'rebuy'
    })
    if (error || data?.success === false) {
      setToast({ message: data?.error || error?.message || 'Erro ao registrar rebuy', type: 'error' })
      setTimeout(() => setToast(null), 10000)
    } else {
      setToast({ message: data?.message || 'Rebuy realizado com sucesso', type: 'success' })
      setTimeout(() => setToast(null), 10000)
    }
    fetchPlayers()
  }

  const handleEliminate = (player: Player) => {
    setModal({ open: true, player })
  }

  const confirmEliminate = async () => {
    if (!modal.player || !etapaId) {
      setModal({ open: false, player: null })
      return
    }
    setPlayers([]) // Limpa a lista para mostrar "processando"
    setLoading(true)
    const { data, error } = await supabase.rpc('manageetapa_eliminacao', {
      p_etapa_id: etapaId,
      p_jogador_id: modal.player.jogador_id ?? null,
      p_nome: modal.player.nome,
      p_acao: 'eliminacao'
    })
    if (error || data?.success === false) {
      setToast({ message: data?.error || error?.message || 'Erro ao eliminar jogador', type: 'error' })
      setTimeout(() => setToast(null), 10000)
    } else {
      setToast({ message: data?.message || 'Eliminação realizada com sucesso', type: 'success' })
      setTimeout(() => setToast(null), 10000)
    }
    setModal({ open: false, player: null })
    fetchPlayers()
  }

  return (
    <div className="min-h-screen bg-apt-100">
      <Nav title="Eliminação e Rebuy" />
      <div className="px-4 py-6">
        {toast && (
          <div>
            {/* Toast */}
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
              <div className={`px-4 py-2 rounded ${
                toast.type === 'success' 
                  ? 'border border-apt-900 bg-apt-100 text-apt-800' 
                  : 'border border-apt-700 bg-apt-100 text-apt-600'
              }`}>
                {toast.message}
              </div>
            </div>
          </div>
        )}
        {loading ? (
          <div>Processando...</div>
        ) : (
          <div className="space-y-4">
            {players.map((player, index) => (
              <div key={player.nome + (player.jogador_id ?? '')} className={`flex items-center ${index < players.length - 1 ? 'border-b' : ''} border-apt-300 pb-2`}>
                <span className="text-apt-800 flex-1">{player.nome}</span>
                <div className="flex gap-2 min-w-[120px] justify-end">
                  {/* Rebuy */}
                  <button
                    onClick={() => handleRebuy(player)}
                    disabled={intervalo || player.rebuys >= MAX_REBUYS}
                    className={`w-[80px] h-10 border border-black rounded flex items-center justify-center ${
                      intervalo || player.rebuys >= MAX_REBUYS ? 'bg-gray-200 cursor-not-allowed opacity-50' : 'hover:bg-gray-100'
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