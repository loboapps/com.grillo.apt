import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Nav from '../components/Nav'
import { supabase } from '../lib/supabase'

const ManageFinanceiro = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const etapaId = location.state?.etapaId

  // Debug log
  console.log('manageetapa_financeiro.tsx etapaId:', etapaId)

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(null)
  const [premiacaoInputs, setPremiacaoInputs] = useState<{ [key: number]: string }>({})

  useEffect(() => {
    const fetchData = async () => {
      console.log('fetchData() chamado em manageetapa_financeiro')
      if (!etapaId) {
        console.log('etapaId não definido')
        setLoading(false)
        return
      }
      setLoading(true)
      const { data: resp, error } = await supabase.rpc('manageetapa_financeiro_load', { p_etapa_id: etapaId })
      console.log('manageetapa_financeiro_load retorno:', { data: resp, error })
      if (error) {
        setData(null)
      } else if (resp && typeof resp === 'object') {
        setData(resp)
        // Inicializa os inputs da premiação
        if (resp.premiacao && Array.isArray(resp.premiacao)) {
          const inputs: { [key: number]: string } = {}
          resp.premiacao.forEach((p: any, i: number) => {
            inputs[i] = p.premio?.toFixed(2) ?? ''
          })
          setPremiacaoInputs(inputs)
        }
      } else {
        setData(null)
      }
      setLoading(false)
    }
    fetchData()
  }, [etapaId])

  // Atualiza o valor do input apenas se o usuário alterar manualmente
  const handlePremiacaoInput = (index: number, value: string) => {
    // Permite apenas números e ponto
    if (/^[0-9]*\.?[0-9]*$/.test(value)) {
      setPremiacaoInputs(prev => ({
        ...prev,
        [index]: value
      }))
    }
  }

  // Retorna o valor do input se foi alterado, senão o valor original do JSON
  const getPremiacaoInputValue = (i: number, p: any) => {
    return premiacaoInputs[i] !== undefined
      ? premiacaoInputs[i]
      : (typeof p.premio === 'number' ? p.premio.toFixed(2) : '')
  }

  const handleConfirmarPremiacao = async () => {
    if (!etapaId) return
    // Monta os valores dos inputs (garante float, 0 se vazio)
    const premios = premiacao.map((p: any, i: number) =>
      parseFloat(getPremiacaoInputValue(i, p) || '0')
    )
    try {
      const { data: resp, error } = await supabase.rpc('manageetapa_premiacao', {
        p_etapa_id: etapaId,
        p_premio_1st: premios[0],
        p_premio_2nd: premios[1],
        p_premio_3rd: premios[2],
        p_premio_4th: premios[3],
      })
      console.log('manageetapa_premiacao retorno:', { data: resp, error })
      // Redireciona após o envio
      window.location.href = 'https://apt-com-grillo.vercel.app/manage/eliminacao'
    } catch (err) {
      console.error('Erro ao confirmar premiação:', err)
    }
  }

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
        <Nav title="Gerenciar Financeiro" />
        <div className="px-4 pt-10 pb-6">Carregando...</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-apt-100">
        <Nav title="Gerenciar Financeiro" />
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

  // Novos totais
  const totais = {
    arrecadacao: data.arrecadacao,
    despesas: data.custos_etapa_total,
    totalEntradas: data.total_entradas,
    premiacao: data.premiacao_total
  }

  return (
    <div className="min-h-screen bg-apt-100">
      <Nav title="Gerenciar Financeiro" />
      <div className="px-4 pt-10 pb-6">
        {/* Header: Etapa e Data */}
        <div className="flex justify-between items-center mb-8">
          <span className="text-3xl font-bold text-apt-800">{etapaInfo?.nome_etapa}</span>
          <span className="text-2xl font-bold text-apt-800">{etapaInfo?.data}</span>
        </div>

        {/* Buy-ins */}
        {renderSection('Buy-ins')}
        <div className="grid grid-cols-2 gap-y-2 text-apt-800">
          <div>
            <span className="font-bold">{buyIns?.quantidade_buyin}</span>
            <span className="ml-1">x Buy-in</span>
          </div>
          <div className="text-right">R${buyIns?.valor_total_buyin?.toFixed(2)}</div>
          <div>
            <span className="font-bold">{buyIns?.quantidade_rebuy}</span>
            <span className="ml-1">x Re-buys</span>
          </div>
          <div className="text-right">R${buyIns?.valor_total_rebuy?.toFixed(2)}</div>
          {buyIns?.quantidade_addon !== 0 && (
            <>
              <div>
                <span className="font-bold">{buyIns?.quantidade_addon}</span>
                <span className="ml-1">x Add-on</span>
              </div>
              <div className="text-right">R${buyIns?.valor_total_addon?.toFixed(2)}</div>
            </>
          )}
        </div>

        {/* Premiação */}
        {renderSection('Premiação')}
        <div className="grid grid-cols-2 gap-y-2 text-apt-800">
          {premiacao?.map((p: any, i: number) => (
            <React.Fragment key={i}>
              <div>
                {p.posicao}º Lugar
                {typeof p.porcentagem === 'number' && (
                  <span className="ml-1 text-xs text-apt-600">({p.porcentagem}%)</span>
                )}
              </div>
              <div className="flex items-center justify-end">
                <span className="mr-2">R$</span>
                <input
                  type="text"
                  value={getPremiacaoInputValue(i, p)}
                  onChange={e => handlePremiacaoInput(i, e.target.value)}
                  className="w-24 p-2 border rounded text-right"
                  inputMode="decimal"
                  pattern="[0-9]*\.?[0-9]*"
                  maxLength={10}
                />
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Custos */}
        {renderSection('Custos')}
        <div className="grid grid-cols-2 gap-y-2 text-apt-800">
          <div>Presidente</div>
          <div className="text-right">R${custos?.presidente?.toFixed(2)}</div>
          <div>Vice</div>
          <div className="text-right">R${custos?.vice?.toFixed(2)}</div>
          <div>Casa</div>
          <div className="text-right">R${custos?.local?.toFixed(2) ?? '0.00'}</div>
          <div>Dealer</div>
          <div className="text-right">R${custos?.dealer?.toFixed(2) ?? '0.00'}</div>
        </div>

        {/* Premiações */}
        {renderSection('Premiações')}
        <div className="grid grid-cols-3 gap-y-2 text-apt-800">
          <div></div>
          <div className="text-right font-bold pr-1">Etapa</div>
          <div className="text-right font-bold">Total</div>
          <div>Mesa Final</div>
          <div className="text-right pr-1">R${mesaFinal?.etapa?.toFixed(2)}</div>
          <div className="text-right">R${mesaFinal?.torneio?.toFixed(2)}</div>
          <div>Campão</div>
          <div className="text-right pr-1">R${campeao?.etapa?.toFixed(2)}</div>
          <div className="text-right">R${campeao?.torneio?.toFixed(2)}</div>
        </div>

        {/* Totais */}
        {renderSection('Totais')}
        <div className="grid grid-cols-2 gap-y-2 text-apt-800">
          <div>Arrecadação</div>
          <div className="text-right">R${totais.arrecadacao?.toFixed(2)}</div>
          <div>Despesas</div>
          <div className="text-right">R${totais.despesas?.toFixed(2)}</div>
          <div>Total Entradas</div>
          <div className="text-right">{totais.totalEntradas}</div>
          <div>Premiação</div>
          <div className="text-right">R${totais.premiacao?.toFixed(2)}</div>
        </div>

        {/* Botão Confirmar Premiação */}
        <div className="mt-8">
          <button
            className="w-full bg-apt-500 text-apt-100 p-3 rounded hover:bg-apt-300 hover:text-apt-900"
            onClick={handleConfirmarPremiacao}
          >
            Confirmar Premiação
          </button>
        </div>
      </div>
    </div>
  )
}

export default ManageFinanceiro