import React from 'react'

const players = [
  { pos: 1, name: 'Pietro', points: 65 },
  { pos: 2, name: 'Chico', points: 45 },
  { pos: 3, name: 'Binho', points: 32 },
  { pos: 4, name: 'Marcelo', points: 27 },
  { pos: 5, name: 'João', points: 25 },
  { pos: 6, name: 'Geléia', points: 23 },
  { pos: 7, name: 'Gean', points: 18 },
  { pos: 8, name: 'Jeferson', points: 18 },
  { pos: 9, name: 'Guedes', points: 16 },
  { pos: 10, name: 'Matrix', points: 14 },
  { pos: 11, name: 'Leandro', points: 11 },
  { pos: 12, name: 'Quadros', points: 4 },
  { pos: 13, name: 'Barcímio', points: 2 },
  { pos: 14, name: 'Leo', points: 0 },
]

const Classification = () => {
  return (
    <div className="px-4 py-6">
      <div className="grid grid-cols-3 gap-4 font-bold text-apt-900 mb-2 border-b-2 border-apt-600 pb-2">
        <div>P</div>
        <div>Nome</div>
        <div>Pontos</div>
      </div>
      {players.map((player) => {
        const getRowStyle = () => {
          if (player.pos === 1) return 'bg-apt-400 text-apt-100'
          if (player.pos <= 6) return 'bg-apt-200 text-apt-900'
          return ''
        }

        return (
          <div 
            key={player.pos} 
            className={`grid grid-cols-3 gap-4 py-2 border-b border-apt-200 ${getRowStyle()}`}
          >
            <div className={player.pos > 6 ? 'text-apt-900' : ''}>{player.pos}</div>
            <div className={player.pos > 6 ? 'text-apt-900' : ''}>{player.name}</div>
            <div className={player.pos > 6 ? 'text-apt-900' : ''}>{player.points}</div>
          </div>
        )
      })}
    </div>
  )
}

export default Classification
