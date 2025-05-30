import React from 'react'
import Nav from '../components/Nav'

//financeiro

const Financeiro = () => {
  // Dummy data
  const etapaNome = 'Etapa 3'
  const etapaData = '10/05/2025'
  const buyinTotal = 11
  const buyinValor = 1320.0
  const rebuyTotal = 10
  const rebuyValor = 1000.0

  const premiacao = [
    { lugar: '1º Lugar', valor: 1000.0 },
    { lugar: '2º Lugar', valor: 1000.0 },
    { lugar: '3º Lugar', valor: 1000.0 },
    { lugar: '4º Lugar', valor: 1000.0 }
  ]

  const custos = [
    { label: 'Presidente', valor: 120.0 },
    { label: 'Casa', valor: 160.0 },
    { label: 'Dealer', valor: 200.0 }
  ]

  const premiacoes = [
    { label: 'Mesa Final', etapa: 80.0, total: 240.0 },
    { label: 'Campão', etapa: 40.0, total: 180.0 }
  ]

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

  return (
    <div className="min-h-screen bg-apt-100">
      <Nav title="Financeiro" />
      <div className="px-4 pt-10 pb-6">
        {/* Header: Etapa e Data */}
        <div className="flex justify-between items-center mb-8">
          <span className="text-3xl font-bold text-apt-800">{etapaNome}</span>
          <span className="text-2xl font-bold text-apt-800">{etapaData}</span>
        </div>

        {/* Buy-ins */}
        {renderSection('Buy-ins')}
        <div className="grid grid-cols-2 gap-y-2 text-apt-800">
          <div>
            <span className="font-bold">{buyinTotal}</span>
            <span className="ml-1">x Buy-in</span>
          </div>
          <div className="text-right">R${buyinValor.toFixed(2)}</div>
          <div>
            <span className="font-bold">{rebuyTotal}</span>
            <span className="ml-1">x Re-buys</span>
          </div>
          <div className="text-right">R${rebuyValor.toFixed(2)}</div>
        </div>

        {/* Premiação */}
        {renderSection('Premiação')}
        <div className="grid grid-cols-2 gap-y-2 text-apt-800">
          {premiacao.map((p, i) => (
            <React.Fragment key={i}>
              <div>{p.lugar}</div>
              <div className="text-right">R${p.valor.toFixed(2)}</div>
            </React.Fragment>
          ))}
        </div>

        {/* Custos */}
        {renderSection('Custos')}
        <div className="grid grid-cols-2 gap-y-2 text-apt-800">
          {custos.map((c, i) => (
            <React.Fragment key={i}>
              <div>{c.label}</div>
              <div className="text-right">R${c.valor.toFixed(2)}</div>
            </React.Fragment>
          ))}
        </div>

        {/* Premiações */}
        {renderSection('Premiações')}
        <div className="grid grid-cols-3 gap-y-2 text-apt-800">
          <div></div>
          <div className="text-right font-bold pr-2">Etapa</div>
          <div className="text-right font-bold">Total</div>
          {premiacoes.map((p, i) => (
            <React.Fragment key={i}>
              <div>{p.label}</div>
              <div className="text-right pr-2">R${p.etapa.toFixed(2)}</div>
              <div className="text-right">R${p.total.toFixed(2)}</div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Financeiro