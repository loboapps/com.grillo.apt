import React, { useState, useEffect } from 'react'
import Nav from '../components/Nav'
import SubNav from '../components/SubNav'
import { supabase } from '../lib/supabase'

interface EtapaConfig {
  etapa: string
  data: string
  inicio: string | null
  fim: string | null
  fn_presidente_value: number
  fn_vice_value: number
  dealer_value: number
  local_value: number
  mesa_final_value: number
  season1st_value: number
}

interface FinancialConfig {
  nome: string
  inicio: string
  fim: string
  numero_buyins: number
  valor_buyins: number
  numero_rebuys: number
  valor_rebuys: number
  numero_addons: number
  valor_addons: number
  etapas: EtapaConfig[]
}

const ConfiguracaoFinanceiro = () => {
  const [loading, setLoading] = useState(true)
  const [configData, setConfigData] = useState<FinancialConfig | null>(null)
  const [selectedEtapa, setSelectedEtapa] = useState<EtapaConfig | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: response, error } = await supabase.rpc('configfinanceiro_load_data')
        console.log('Raw response:', response)

        if (error) {
          console.error('Error:', error)
          return
        }

        // Response comes directly as array with first item containing all data
        if (response?.[0]) {
          const config = response[0]
          console.log('Config data:', config)
          setConfigData(config)
          
          const activeEtapa = config.etapas.find(e => e.inicio && !e.fim) 
            || config.etapas.find(e => !e.inicio && !e.fim)
          
          setSelectedEtapa(activeEtapa || config.etapas[0])
        }
      } catch (err) {
        console.error('Fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatDateTime = (dateTime: string | null) => {
    if (!dateTime) return ''
    return new Date(dateTime).toLocaleString('pt-BR')
  }

  const renderValueInput = (label: string, value: number) => (
    <div className="flex items-center justify-between">
      <span className="text-apt-800">{label}</span>
      <div className="flex items-center">
        <span className="mr-2">R$</span>
        <input
          type="number"
          value={value.toFixed(2)}
          className="w-24 p-2 border rounded text-right"
          step="0.01"
        />
      </div>
    </div>
  )

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

  if (loading) return <div>Carregando...</div>
  if (!configData) return <div>Nenhum dado encontrado</div>

  const isEtapaEditable = selectedEtapa && !selectedEtapa.fim

  return (
    <div className="min-h-screen bg-apt-100">
      <Nav title="Configurar etapa" />
      <SubNav title="Financeiro" />
      <div className="px-4 pt-2 pb-6">
        <div className="space-y-4">
          {renderSection('Etapa', true)}
          
          <div className="space-y-4">
            <select 
              value={selectedEtapa?.etapa || ''}
              onChange={(e) => {
                const etapa = configData.etapas.find(et => et.etapa === e.target.value)
                setSelectedEtapa(etapa || null)
              }}
              className="w-full p-2 border rounded"
            >
              {configData.etapas.map(etapa => (
                <option key={etapa.etapa} value={etapa.etapa}>
                  {etapa.etapa}
                </option>
              ))}
            </select>

            {selectedEtapa?.inicio && (
              <div className="text-apt-800">
                <div>Início: {formatDateTime(selectedEtapa.inicio)}</div>
                {selectedEtapa.fim && (
                  <div>Fim: {formatDateTime(selectedEtapa.fim)}</div>
                )}
              </div>
            )}
          </div>

          {renderSection('Entradas')}
          
          <div className="space-y-4 text-apt-800">
            <div className="flex justify-between items-center">
              <span>Buy-in</span>
              <span>{configData.numero_buyins}x R$ {configData.valor_buyins.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Re-buy</span>
              <span>{configData.numero_rebuys}x R$ {configData.valor_rebuys.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Add-on</span>
              <span>{configData.numero_addons}x R$ {configData.valor_addons.toFixed(2)}</span>
            </div>
          </div>

          {renderSection('Custos fixos')}
          
          <div className="space-y-4">
            {isEtapaEditable ? (
              <>
                {renderValueInput('Presidente', selectedEtapa.fn_presidente_value)}
                {renderValueInput('Vice-presidente', selectedEtapa.fn_vice_value)}
                {renderValueInput('Dealer', selectedEtapa.dealer_value)}
                {renderValueInput('Local', selectedEtapa.local_value)}
                {renderValueInput('Mesa final', selectedEtapa.mesa_final_value)}
                {renderValueInput('Campeão torneio', selectedEtapa.season1st_value)}
              </>
            ) : (
              <div className="space-y-2 text-apt-800">
                {["Presidente", "Vice-presidente", "Dealer", "Local", "Mesa final", "Campeão torneio"].map((label, index) => (
                  <div key={label} className="flex justify-between items-center">
                    <span>{label}</span>
                    <span>R$ {selectedEtapa?.[
                      ['fn_presidente_value', 'fn_vice_value', 'dealer_value', 'local_value', 'mesa_final_value', 'season1st_value'][index]
                    ].toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {isEtapaEditable && (
            <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-apt-500 text-apt-100 p-3 rounded hover:bg-apt-300 hover:text-apt-900"
              >
                Confirmar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConfiguracaoFinanceiro
