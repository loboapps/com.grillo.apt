import React, { useState } from 'react'
import Nav from '../components/Nav'

interface FinancialConfig {
  buyin: { quantity: number; value: number }
  rebuy: { quantity: number; value: number }
  addon: { quantity: number; value: number }
  presidente: number
  vicePresidente: number
  dealer: { quantity: number; value: number }
  local: number
  mesaFinal: number
  campeaoTorneio: number
}

const ConfiguracaoFinanceiro = () => {
  const [config, setConfig] = useState<FinancialConfig>({
    buyin: { quantity: 1, value: 120 },
    rebuy: { quantity: 2, value: 100 },
    addon: { quantity: 0, value: 0 },
    presidente: 120,
    vicePresidente: 0,
    dealer: { quantity: 1, value: 200 },
    local: 160,
    mesaFinal: 80,
    campeaoTorneio: 40
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement save functionality
    console.log('Financial config:', config)
  }

  const renderQuantitySelect = (
    value: number,
    onChange: (value: number) => void
  ) => (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-20 p-2 border rounded bg-white text-apt-800"
    >
      {[1, 2, 3, 4, 5].map((num) => (
        <option key={num} value={num}>
          {num}
        </option>
      ))}
    </select>
  )

  const renderValueInput = (
    value: number,
    onChange: (value: number) => void
  ) => (
    <div className="flex items-center">
      <span className="mr-2">R$</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-24 p-2 border rounded"
        step="0.01"
      />
    </div>
  )

  const renderSection = (title: string) => (
    <div className="relative my-8">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-apt-300"></div>
      </div>
      <div className="relative flex justify-center">
        <span className="bg-apt-100 px-4 text-sm font-medium text-apt-800">
          {title}
        </span>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-apt-100">
      <Nav title="Configuração Financeira" />
      <form onSubmit={handleSubmit} className="px-4 py-6">
        <div className="space-y-4">
          {renderSection('Etapa')}
          
          {renderSection('Jogadores')}
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-apt-800">Buy-in</span>
                {renderQuantitySelect(config.buyin.quantity, (value) =>
                  setConfig({ ...config, buyin: { ...config.buyin, quantity: value } })
                )}
              </div>
              {renderValueInput(config.buyin.value, (value) =>
                setConfig({ ...config, buyin: { ...config.buyin, value } })
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-apt-800">Rebuy</span>
                {renderQuantitySelect(config.rebuy.quantity, (value) =>
                  setConfig({ ...config, rebuy: { ...config.rebuy, quantity: value } })
                )}
              </div>
              {renderValueInput(config.rebuy.value, (value) =>
                setConfig({ ...config, rebuy: { ...config.rebuy, value } })
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-apt-800">Add-on</span>
                {renderQuantitySelect(config.addon.quantity, (value) =>
                  setConfig({ ...config, addon: { ...config.addon, quantity: value } })
                )}
              </div>
              {renderValueInput(config.addon.value, (value) =>
                setConfig({ ...config, addon: { ...config.addon, value } })
              )}
            </div>
          </div>

          {renderSection('Custos fixos')}
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-apt-800">Presidente</span>
              {renderValueInput(config.presidente, (value) =>
                setConfig({ ...config, presidente: value })
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-apt-800">Vice-presidente</span>
              {renderValueInput(config.vicePresidente, (value) =>
                setConfig({ ...config, vicePresidente: value })
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-apt-800">Dealer</span>
                {renderQuantitySelect(config.dealer.quantity, (value) =>
                  setConfig({ ...config, dealer: { ...config.dealer, quantity: value } })
                )}
              </div>
              {renderValueInput(config.dealer.value, (value) =>
                setConfig({ ...config, dealer: { ...config.dealer, value } })
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-apt-800">Local</span>
              {renderValueInput(config.local, (value) =>
                setConfig({ ...config, local: value })
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-apt-800">Mesa final</span>
              {renderValueInput(config.mesaFinal, (value) =>
                setConfig({ ...config, mesaFinal: value })
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-apt-800">Campeão torneio</span>
              {renderValueInput(config.campeaoTorneio, (value) =>
                setConfig({ ...config, campeaoTorneio: value })
              )}
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-apt-500 text-apt-100 p-3 rounded hover:bg-apt-300 hover:text-apt-900"
            >
              Confirmar
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ConfiguracaoFinanceiro
