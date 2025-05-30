import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { icons } from '../utils/icons'
import Toast from '../components/Toast'

const MenuIcon = icons.SquareMenu

interface NavProps {
  title: string;
  onNavData?: (navData: any) => void // callback para passar o nav_load para páginas filhas se necessário
}

const Nav: React.FC<NavProps> = ({ title, onNavData }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const { user } = useAuth()
  const [navData, setNavData] = useState<any>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchNav = async () => {
      const { data, error } = await supabase.rpc('nav_load')
      console.log('Dados brutos recebidos:', data) // Debug
      
      // Ajustado para lidar com o formato real dos dados
      let nav = null
      if (Array.isArray(data) && data.length > 0) {
        // Se data é um array, pega o primeiro item
        if (data[0]?.nav_load) {
          nav = data[0].nav_load
        } else if (data[0]?.status) {
          // Se o primeiro item já tem status, é o objeto direto
          nav = data[0]
        }
      } else if (data?.nav_load) {
        nav = data.nav_load
      } else if (data?.status) {
        // Se data já tem status, é o objeto direto
        nav = data
      }
      
      console.log('Nav processado:', nav) // Debug
      
      if (nav) {
        setNavData(nav)
        if (onNavData) onNavData(nav)
      }
    }
    fetchNav()
  }, [onNavData])

  const toggleSubMenu = (item: string) => {
    setExpandedItem(expandedItem === item ? null : item)
  }

  // Helper for admin-only
  const isAdmin = !!user

  return (
    <>
      <nav className="bg-apt-500 text-apt-100 px-4 py-3 flex items-center justify-between shadow-md">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
          <MenuIcon />
        </button>
        <h1 className="text-xl font-bold">{title}</h1>
        <div className="w-8"></div>
      </nav>

      {/* Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-apt-800 bg-opacity-50 transition-opacity duration-300 z-50"
          onClick={() => setIsMenuOpen(false)}
        >
          {/* Sliding Menu */}
          <div 
            className={`fixed inset-y-0 left-0 w-64 bg-apt-100 transform transition-transform duration-300 ease-in-out z-50 ${
              isMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 space-y-1">
              {/* status: aguardando */}
              {navData?.status === 'aguardando' && (
                <>
                  <Link to="/classificacao" className="block py-1 text-apt-800 hover:text-apt-700">
                    Classificação
                  </Link>
                  <Link to="/financeiro" className="block py-1 text-apt-800 hover:text-apt-700">
                    Financeiro {navData.ultima_etapa_nome}
                  </Link>
                  {isAdmin && (
                    <>
                      <div className="mt-12 mb-3">
                        <div className="flex items-center justify-center">
                          <div className="w-full border-t border-apt-300"></div>
                        </div>
                        <div className="flex justify-center my-2">
                          <span className="bg-apt-100 px-2 text-xs font-medium text-apt-700 uppercase tracking-widest">
                            ADMIN
                          </span>
                        </div>
                        <div className="flex items-center justify-center">
                          <div className="w-full border-t border-apt-300"></div>
                        </div>
                      </div>
                      <div className="mb-3 flex flex-col items-center">
                        <div className="text-apt-900 text-base text-center">{navData.proxima_etapa_nome}</div>
                        <div className="text-apt-900 text-base text-center">{navData.proxima_etapa_data}</div>
                      </div>
                      <button
                        className="w-full bg-apt-500 text-apt-100 p-2 rounded hover:bg-apt-300 hover:text-apt-900"
                        onClick={async () => {
                          // Debug 1: Verificar o UUID
                          console.log('UUID que será enviado:', navData.proxima_etapa_id)
                          console.log('Tipo do UUID:', typeof navData.proxima_etapa_id)
                          console.log('UUID é válido?', navData.proxima_etapa_id ? 'Sim' : 'Não')
                          
                          try {
                            // Debug 2: Testar a chamada RPC
                            console.log('Iniciando chamada RPC...')
                            const { data, error } = await supabase.rpc('aguardando_iniciar_etapa', {
                              p_etapa_id: navData.proxima_etapa_id
                            })
                            
                            // Debug 3: Ver resposta completa
                            console.log('Resposta completa:', { data, error })
                            console.log('Error details:', error)
                            
                            if (error) {
                              console.log('Tipo do error:', error.code)
                              console.log('Mensagem do error:', error.message)
                              console.log('Details do error:', error.details)
                              console.log('Hint do error:', error.hint)
                            }
                            
                            if (error || data?.sucesso === false) {
                              setToast({
                                message: data?.mensagem || error?.message || 'Erro ao iniciar etapa',
                                type: 'error'
                              })
                              return
                            }
                            
                            // Sucesso: recarrega nav_load
                            const { data: newNavData } = await supabase.rpc('nav_load')
                            let newNav = null
                            if (Array.isArray(newNavData) && newNavData.length > 0) {
                              if (newNavData[0]?.nav_load) {
                                newNav = newNavData[0].nav_load
                              } else if (newNavData[0]?.status) {
                                newNav = newNavData[0]
                              }
                            } else if (newNavData?.nav_load) {
                              newNav = newNavData.nav_load
                            } else if (newNavData?.status) {
                              newNav = newNavData
                            }
                            if (newNav) {
                              setNavData(newNav)
                              if (onNavData) onNavData(newNav)
                            }
                            setToast({
                              message: data?.mensagem || 'Configuração da etapa iniciada com sucesso',
                              type: 'success'
                            })
                            
                          } catch (catchError) {
                            console.log('Erro no catch:', catchError)
                          }
                        }}
                      >
                        Iniciar configuração
                      </button>
                    </>
                  )}
                </>
              )}

              {/* status: configuracao */}
              {navData?.status === 'configuracao' && (
                <>
                  <Link to="/classificacao" className="block py-1 text-apt-800 hover:text-apt-700">
                    Classificação
                  </Link>
                  <Link to="/financeiro" className="block py-1 text-apt-800 hover:text-apt-700">
                    Financeiro
                  </Link>
                  {isAdmin && (
                    <>
                      <div className="mt-12 mb-3">
                        <div className="flex items-center justify-center">
                          <div className="w-full border-t border-apt-300"></div>
                        </div>
                        <div className="flex justify-center my-2">
                          <span className="bg-apt-100 px-2 text-xs font-medium text-apt-700 uppercase tracking-widest">
                            ADMIN
                          </span>
                        </div>
                        <div className="flex items-center justify-center">
                          <div className="w-full border-t border-apt-300"></div>
                        </div>
                      </div>
                      <Link 
                        to="/config/financeiro" 
                        state={{ etapaId: navData.etapa_id }}
                        className="block py-1 text-apt-800 hover:text-apt-700"
                      >
                        Financeiro
                      </Link>
                      <Link 
                        to="/config/jogadores" 
                        state={{ etapaId: navData.etapa_id }}
                        className="block py-1 text-apt-800 hover:text-apt-700"
                      >
                        Jogadores
                      </Link>
                      <Link 
                        to="/config/sorteio" 
                        state={{ etapaId: navData.etapa_id }}
                        className="block py-1 text-apt-800 hover:text-apt-700"
                      >
                        Sorteio
                      </Link>
                    </>
                  )}
                </>
              )}

              {/* status: gerenciamento */}
              {navData?.status === 'gerenciamento' && (
                <>
                  <Link to="/classificacao" className="block py-1 text-apt-800 hover:text-apt-700">
                    Classificação ao vivo
                  </Link>
                  <Link to="/financeiro" className="block py-1 text-apt-800 hover:text-apt-700">
                    Financeiro {navData.etapa_nome}
                  </Link>
                  {isAdmin && (
                    <>
                      <div className="mt-12 mb-3">
                        <div className="flex items-center justify-center">
                          <div className="w-full border-t border-apt-300"></div>
                        </div>
                        <div className="flex justify-center my-2">
                          <span className="bg-apt-100 px-2 text-xs font-medium text-apt-700 uppercase tracking-widest">
                            ADMIN
                          </span>
                        </div>
                        <div className="flex items-center justify-center">
                          <div className="w-full border-t border-apt-300"></div>
                        </div>
                      </div>
                      <Link 
                        to="/manage/jogador" 
                        state={{ etapaId: navData.etapa_id }}
                        className="block py-1 text-apt-800 hover:text-apt-700"
                      >
                        Adicionar Jogador
                      </Link>
                      <Link 
                        to="/manage/eliminacao" 
                        state={{ etapaId: navData.etapa_id }}
                        className="block py-1 text-apt-800 hover:text-apt-700"
                      >
                        Rebuy e Eliminação
                      </Link>
                      <Link 
                        to="/manage/financeiro" 
                        state={{ etapaId: navData.etapa_id }}
                        className="block py-1 text-apt-800 hover:text-apt-700"
                      >
                        Financeiro
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  )
}

export default Nav