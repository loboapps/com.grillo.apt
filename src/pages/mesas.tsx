import React, { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import { useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const Mesas = () => {
  const location = useLocation()
  // Não precisa de etapaId, pois a função mesas_load não espera parâmetro
  const [loading, setLoading] = useState(true)
  const [mesas, setMesas] = useState<{ [key: string]: { pos: number; jogador: string }[] }>({})

  useEffect(() => {
    const fetchMesas = async () => {
      setLoading(true)
      const { data, error } = await supabase.rpc('mesas_load')
      if (error) {
        console.error('Erro ao chamar mesas_load:', error)
        setMesas({})
      } else if (data && typeof data === 'object' && !Array.isArray(data)) {
        setMesas(data)
        console.log('Sucesso ao chamar mesas_load:', data)
      } else if (data && Array.isArray(data) && data[0]?.mesas_load) {
        setMesas(data[0].mesas_load)
        console.log('Sucesso ao chamar mesas_load:', data[0].mesas_load)
      } else {
        setMesas({})
        console.warn('mesas_load retornou formato inesperado:', data)
      }
      setLoading(false)
    }
    fetchMesas()
  }, [])

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
      <Nav title="Mesas" />
      <div className="px-4 py-6">
        {loading ? (
          <div>Carregando mesas...</div>
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

export default Mesas