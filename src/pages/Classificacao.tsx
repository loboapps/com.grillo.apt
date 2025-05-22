import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Nav from '../components/Nav'

interface Player {
  nome: string
  nome_torneio: string
  pontos: number
  etapas: number
  ativo: boolean
  melhor_posicao: number | null
}

const Classificacao = () => {
  const [players, setPlayers] = useState<Player[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.rpc('classificacao_load_data')
      if (data?.[0]?.classificacao_load_data) {
        setPlayers(data[0].classificacao_load_data)
      }
    }
    fetchData()
  }, [])

  return (
    <div>
      <Nav />
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4">Classificação</h1>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Nome</th>
              <th className="px-4 py-2">Torneio</th>
              <th className="px-4 py-2">Pontos</th>
              <th className="px-4 py-2">Etapas</th>
              <th className="px-4 py-2">Melhor Posição</th>
              <th className="px-4 py-2">Ativo</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{player.nome}</td>
                <td className="border px-4 py-2">{player.nome_torneio}</td>
                <td className="border px-4 py-2">{player.pontos}</td>
                <td className="border px-4 py-2">{player.etapas}</td>
                <td className="border px-4 py-2">{player.melhor_posicao}</td>
                <td className="border px-4 py-2">{player.ativo ? 'Sim' : 'Não'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Classificacao