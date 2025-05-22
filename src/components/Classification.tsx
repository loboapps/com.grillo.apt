import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface Player {
  nome: string
  pontos: number
  etapas: number
  ativo: boolean
  melhor_posicao: number
}

const Classification = () => {
  const [players, setPlayers] = useState<Player[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.rpc('classificacao_load_data')
      if (data) setPlayers(data)
      if (error) console.error('Error:', error)
    }
    fetchData()
  }, [])

  return (
    <div className="px-4 py-6">
      <div className="grid grid-cols-4 gap-4 font-bold text-apt-900 mb-2 border-b-2 border-apt-600 pb-2">
        <div className="ml-2">Pos</div>
        <div>Nome</div>
        <div className="text-center">Etapas</div>
        <div className="text-center">Pontos</div>
      </div>
      {players.map((player, index) => (
        <div 
          key={player.nome} 
          className={`grid grid-cols-4 gap-4 py-2 border-b border-apt-200 ${
            index === 0 
              ? 'bg-apt-200 text-apt-900' 
              : index < 6 
                ? 'bg-apt-700 text-apt-100'
                : 'bg-apt-900 text-apt-100'
          }`}
        >
          <div className="ml-2">
            {index + 1}
          </div>
          <div>
            {player.nome}
          </div>
          <div className="text-center">
            {player.etapas}
          </div>
          <div className="text-center relative text-lg font-semibold">
            {player.pontos}
            {player.ativo && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-apt-300 rounded-full" />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Classification
