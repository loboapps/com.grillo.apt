import React, { useState, useEffect } from 'react'
import Nav from '../components/Nav'
import SubNav from '../components/SubNav'
import Toast from '../components/Toast'
import { useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'

interface EtapaConfig {
  id: string
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
  etapa: EtapaConfig
}

const ConfiguracaoFinanceiro = () => {
  const location = useLocation()
  const etapaId = location.state?.etapaId as string | undefined

  const [loading, setLoading] = useState(true)
  const [configData, setConfigData] = useState<FinancialConfig | null>(null)
  const [editValues, setEditValues] = useState<EtapaConfig | null>(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!etapaId) {
        console.log('etapaId não existe')
        setLoading(false)
        setConfigData(null)
        return
      }

      setLoading(true)
      console.log('Chamando configetapa_financeiro_load com etapaId:', etapaId)

      const { data, error } = await supabase.rpc('configetapa_financeiro_load', { p_etapa_id: etapaId })

      console.log('Resposta do supabase:', { data, error })

      if (error) {
        console.log('Erro na consulta:', error)
        setConfigData(null)
      } else if (data && typeof data === 'object' && data.etapa) {
        console.log('Dados encontrados:', data)
        setConfigData(data)
        setEditValues(data.etapa)
      } else {
        console.log('Resposta não tem o formato esperado:', data)
        setConfigData(null)
      }
      setLoading(false)
    }
    fetchData()
  }, [etapaId])
  
  useEffect(() => {
    if (configData?.etapa) setEditValues(configData.etapa)
  }, [configData])

  const handleInputChange = (field: keyof EtapaConfig, value: number) => {
    if (!editValues) return
    setEditValues({ ...editValues, [field]: value })
  }

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editValues?.id) return
    setSaving(true)
    const { error } = await supabase.rpc('configetapa_financeiro_confirmar', {
      p_etapa_id: editValues.id,
      p_presidente_value: editValues.fn_presidente_value,
      p_vice_value: editValues.fn_vice_value,
      p_dealer_value: editValues.dealer_value,
      p_local_value: editValues.local_value,
      p_mesa_final_value: editValues.mesa_final_value,
      p_season1st_value: editValues.season1st_value,
    })
    if (error) {
      setToast({ message: 'Erro ao salvar: ' + error.message, type: 'error' })
    } else {
      setToast({ message: 'Configuração salva com sucesso!', type: 'success' })
    }
    setSaving(false)
  }

  const renderValueInput = (label: string, field: keyof EtapaConfig) => (
    <div className="flex items-center justify-between">
      <span className="text-apt-800">{label}</span>
      <div className="flex items-center">
        <span className="mr-2">R$</span>
        <input
          type="number"
          value={editValues?.[field]?.toFixed(2) ?? ''}
          onChange={e => handleInputChange(field, Number(e.target.value))}
          className="w-24 p-2 border rounded text-right"
          step="0.01"
        />
      </div>
    </div>
  )

  const renderSection = (title: string, smallMargin?: boolean) => (
    <div className={`relative ${smallMargin ? 'my-4' : 'my-8'}`}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-apt-300"></div>
      </div>
      <div className="relative flex justify-center">
        <span className="bg-apt-100 px-4 text-sm font-medium text-apt-800 uppercase tracking-widest">
          {title}
        </span>
      </div>
    </div>
  )

  if (loading) return <div>Carregando...</div>
  if (!configData || !editValues) return <div>Nenhum dado encontrado</div>

  return (
    <div className="min-h-screen bg-apt-100">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <Nav title="Configurar etapa" />
      <SubNav title="Financeiro" />
      <div className="px-4 pt-2 pb-6">
        <form onSubmit={handleConfirm}>
          <div className="space-y-4">
            {renderSection('Buy-in')}
            <div className="space-y-2 text-apt-800">
              <div className="flex justify-between items-center">
                <span>{configData.numero_buyins}x Buy-in</span>
                <span>R$ {configData.valor_buyins.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>{configData.numero_rebuys}x Re-buy</span>
                <span>R$ {configData.valor_rebuys.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>{configData.numero_addons}x Add-on</span>
                <span>R$ {configData.valor_addons.toFixed(2)}</span>
              </div>
            </div>

            {renderSection('Custos')}
            <div className="space-y-4">
              {[
                { label: 'Presidente', field: 'fn_presidente_value' },
                { label: 'Vice-presidente', field: 'fn_vice_value' },
                { label: 'Dealer', field: 'dealer_value' },
                { label: 'Local', field: 'local_value' },
                { label: 'Mesa final', field: 'mesa_final_value' },
                { label: 'Campeão torneio', field: 'season1st_value' }
              ].map(({ label, field }) => renderValueInput(label, field as keyof EtapaConfig))}
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-apt-500 text-apt-100 p-3 rounded hover:bg-apt-300 hover:text-apt-900"
              >
                {saving ? 'Salvando...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ConfiguracaoFinanceiro
