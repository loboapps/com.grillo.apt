import React, { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import { useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const ConfiguracaoSorteio = () => {
  const location = useLocation()
  const etapaId = location.state?.etapaId
  // Log para depuração da etapaId recebida
  console.log('configetapa_sorteio.tsx - etapaId recebido:', etapaId)
  const [loading, setLoading] = useState(true)
  const [mesas, setMesas] = useState<{ [key: string]: { pos: number; jogador: string }[] }>({})

  useEffect(() => {
    const fetchSorteio = async () => {
      if (!etapaId) {
        console.log('fetchSorteio() - etapaId não definido, abortando chamada ao backend')
        return
      }
      setLoading(true)
      console.log('fetchSorteio() chamado com etapaId:', etapaId)
      const { data, error } = await supabase.rpc('configetapa_sorteio', { p_etapa_id: etapaId })
      console.log('Retorno do supabase.rpc(configetapa_sorteio):', { data, error })
      if (error) {
        setMesas({})
      } else if (data && typeof data === 'object') {
        setMesas(data)
      }
      setLoading(false)
    }
    fetchSorteio()
  }, [etapaId])

  const renderTable = (mesaKey: string, jogadores: { pos: number; jogador: string }[]) => (
    <div className="flex-1" key={mesaKey}>
      <h2 className="text-xl font-bold text-apt-800 mb-4 text-center">{mesaKey.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h2>
      <div className="space-y-2">
        {jogadores.map((item) => (
          <div key={item.pos} className="p-2 bg-apt-100 border border-apt-300 rounded text-apt-800 flex items-center">
            <span className="w-6 text-apt-600 font-bold mr-2">{item.pos}</span>
            {item.jogador}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-apt-100">
      <Nav title="Sorteio de Mesas" />
      <div className="px-4 py-6">
        {loading ? (
          <div>Carregando sorteio...</div>
        ) : (
          <div className="flex gap-4">
            {Object.entries(mesas).map(([mesaKey, jogadores]) =>
              renderTable(mesaKey, jogadores)
            )}
          </div>
        )}

      </div>
    </div>
  )
}

export default ConfiguracaoSorteio
