import React from 'react'
import Nav from '../components/Nav'
import { useLocation, useNavigate } from 'react-router-dom'

const Mesas = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { members = [], guests = [] } = location.state || {}

  if (!members.length) {
    navigate('/config-etapa')
    return null
  }

  const allPlayers = [...members, ...guests.filter(g => g.trim() !== '')]
  const playersPerTable = Math.ceil(allPlayers.length / 2)
  const showThirdTable = allPlayers.length > 18

  const shuffleArray = (array: string[]) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const shuffledPlayers = shuffleArray(allPlayers)
  const table1 = shuffledPlayers.slice(0, playersPerTable)
  const table2 = shuffledPlayers.slice(playersPerTable, playersPerTable * 2)
  const table3 = showThirdTable ? shuffledPlayers.slice(playersPerTable * 2) : []

  const renderTable = (players: string[], tableNumber: number) => (
    <div className="flex-1">
      <h2 className="text-xl font-bold text-apt-800 mb-4 text-center">Mesa {tableNumber}</h2>
      <div className="space-y-2">
        {players.map((player, index) => (
          <div key={index} className="p-2 bg-apt-100 border border-apt-300 rounded text-apt-800 flex items-center">
            <span className="w-6 text-apt-600 font-bold mr-2">{index + 1}</span>
            {player}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-apt-100">
      <Nav title="Mesas" />
      <div className="px-4 py-6">
        <div className="flex gap-4">
          {renderTable(table1, 1)}
          {renderTable(table2, 2)}
          {showThirdTable && renderTable(table3, 3)}
        </div>
        <button className="w-full bg-apt-500 text-apt-100 p-3 rounded mt-6 hover:bg-apt-300 hover:text-apt-900">
          Iniciar Etapa
        </button>
      </div>
    </div>
  )
}

export default Mesas
