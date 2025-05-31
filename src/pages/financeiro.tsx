import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Nav from '../components/Nav'
import { supabase } from '../lib/supabase'

const Financeiro = () => {
  const location = useLocation()
  const etapaId = location.state?.etapaId
  
  // Adicione estes logs para debug
  console.log('location.state:', location.state)
  console.log('etapaId:', etapaId)
  
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (!etapaId) {
        console.log('etapaId não existe, retornando')
        return
      }
      
      setLoading(true)
      console.log('Chamando financeiro_load com etapaId:', etapaId)
      
      const { data: resp, error } = await supabase.rpc('financeiro_load', { p_etapa_id: etapaId })
      
      console.log('Resposta do supabase:', { resp, error })
      
      if (error) {
        console.log('Erro na consulta:', error)
        setData(null)
      } else if (Array.isArray(resp) && resp[0]?.financeiro_load) {
        console.log('Dados encontrados:', resp[0].financeiro_load)
        setData(resp[0].financeiro_load)
      } else {
        console.log('Resposta não tem o formato esperado:', resp)
        setData(null)
      }
      setLoading(false)
    }
    fetchData()
  }, [etapaId])

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

  if (loading) {
    return (
      <div className="min-h-screen bg-apt-100">
        <Nav title="Financeiro" />
        <div className="px-4 pt-10 pb-6">Carregando...</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-apt-100">
        <Nav title="Financeiro" />
        <div className="px-4 pt-10 pb-6">Nenhum dado encontrado</div>
      </div>
    )
  }

  // Dados do JSON
  const etapaInfo = data.etapa_info
  const buyIns = data.buy_ins
  const premiacao = data.premiacao
  const custos = data.custos_etapa
  const mesaFinal = data.mesa_final
  const campeao = data.campeao

  return (
    <div className="min-h-screen bg-apt-100">
      <Nav title="Financeiro" />
      <div className="px-4 pt-10 pb-6">
        {/* Header: Etapa e Data */}
        <div className="flex justify-between items-center mb-8">
          <span className="text-3xl font-bold text-apt-800">{etapaInfo.nome_etapa}</span>
          <span className="text-2xl font-bold text-apt-800">{etapaInfo.data}</span>
        </div>

        {/* Buy-ins */}
        {renderSection('Buy-ins')}
        <div className="grid grid-cols-2 gap-y-2 text-apt-800">
          <div>
            <span className="font-bold">{buyIns.quantidade_buyin}</span>
            <span className="ml-1">x Buy-in</span>
          </div>
          <div className="text-right">R${buyIns.valor_total_buyin.toFixed(2)}</div>
          <div>
            <span className="font-bold">{buyIns.quantidade_rebuy}</span>
            <span className="ml-1">x Re-buys</span>
          </div>
          <div className="text-right">R${buyIns.valor_total_rebuy.toFixed(2)}</div>
          {buyIns.quantidade_addon !== 0 && (
            <>
              <div>
                <span className="font-bold">{buyIns.quantidade_addon}</span>
                <span className="ml-1">x Add-on</span>
              </div>
              <div className="text-right">R${buyIns.valor_total_addon.toFixed(2)}</div>
            </>
          )}
        </div>

        {/* Premiação */}
        {renderSection('Premiação')}
        <div className="grid grid-cols-2 gap-y-2 text-apt-800">
          {premiacao.map((p: any, i: number) => (
            <React.Fragment key={i}>
              <div>{p.posicao}º Lugar</div>
              <div className="text-right">R${p.premio.toFixed(2)}</div>
            </React.Fragment>
          ))}
        </div>

        {/* Custos */}
        {renderSection('Custos')}
        <div className="grid grid-cols-2 gap-y-2 text-apt-800">
          <div>Presidente</div>
          <div className="text-right">R${custos.presidente.toFixed(2)}</div>
          <div>Vice</div>
          <div className="text-right">R${custos.vice.toFixed(2)}</div>
          <div>Casa</div>
          <div className="text-right">R${custos.local?.toFixed(2) ?? '0.00'}</div>
          <div>Dealer</div>
          <div className="text-right">R${custos.dealer?.toFixed(2) ?? '0.00'}</div>
        </div>

        {/* Premiações */}
        {renderSection('Premiações')}
        <div className="grid grid-cols-3 gap-y-2 text-apt-800">
          <div></div>
          <div className="text-right font-bold pr-1">Etapa</div>
          <div className="text-right font-bold">Total</div>
          <div>Mesa Final</div>
          <div className="text-right pr-1">R${mesaFinal.etapa.toFixed(2)}</div>
          <div className="text-right">R${mesaFinal.torneio.toFixed(2)}</div>
          <div>Campão</div>
          <div className="text-right pr-1">R${campeao.etapa.toFixed(2)}</div>
          <div className="text-right">R${campeao.torneio.toFixed(2)}</div>
        </div>
      </div>
    </div>
  )
}

export default Financeiro