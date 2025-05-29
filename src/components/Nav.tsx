import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const MenuIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
)

interface NavProps {
  title: string;
  onNavData?: (navData: any) => void // callback para passar o nav_load para páginas filhas se necessário
}

const Nav: React.FC<NavProps> = ({ title, onNavData }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const { user } = useAuth()
  const [navData, setNavData] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchNav = async () => {
      const { data, error } = await supabase.rpc('nav_load')
      if (data) {
        setNavData(data)
        if (onNavData) onNavData(data)
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
                  <Link to="/" className="block py-1 text-apt-800 hover:text-apt-700">
                    Classificação
                  </Link>
                  <Link to={`/financeiro/${navData.ultima_etapa_uuid}`} className="block py-1 text-apt-800 hover:text-apt-700">
                    Financeiro {navData.ultima_etapa_nome}
                  </Link>
                  {isAdmin && (
                    <>
                      <div className="my-3">
                        <div className="flex items-center justify-center">
                          <div className="w-full border-t border-apt-300"></div>
                        </div>
                        <div className="flex justify-center">
                          <span className="bg-apt-100 px-2 text-xs font-medium text-apt-800 uppercase tracking-widest">
                            ADMIN
                          </span>
                        </div>
                      </div>
                      <div className="mb-1">
                        <div className="text-apt-900">{navData.proxima_etapa_nome}</div>
                        <div className="text-apt-900">{navData.proxima_etapa_data}</div>
                      </div>
                      <button
                        className="w-full bg-apt-500 text-apt-100 p-2 rounded hover:bg-apt-300 hover:text-apt-900"
                        onClick={async () => {
                          await supabase.rpc('iniciar_config_etapa', {
                            p_etapa_id: navData.proxima_etapa_uuid
                          })
                          navigate(`/config-etapa/financeiro/${navData.proxima_etapa_uuid}`)
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
                  <Link to="/" className="block py-1 text-apt-800 hover:text-apt-700">
                    Classificação
                  </Link>
                  <Link to={`/financeiro/${navData.ultima_etapa_uuid}`} className="block py-1 text-apt-800 hover:text-apt-700">
                    Financeiro {navData.ultima_etapa_nome}
                  </Link>
                  {isAdmin && (
                    <>
                      <div className="my-3">
                        <div className="flex items-center justify-center">
                          <div className="w-full border-t border-apt-300"></div>
                        </div>
                        <div className="flex justify-center">
                          <span className="bg-apt-100 px-2 text-xs font-medium text-apt-800 uppercase tracking-widest">
                            ADMIN
                          </span>
                        </div>
                      </div>
                      <Link to={`/config-etapa/financeiro/${navData.etapa_uuid}`} className="block py-1 text-apt-800 hover:text-apt-700">
                        Financeiro
                      </Link>
                      <Link to={`/config-etapa/jogadores/${navData.etapa_uuid}`} className="block py-1 text-apt-800 hover:text-apt-700">
                        Jogadores
                      </Link>
                    </>
                  )}
                </>
              )}

              {/* status: gerenciamento */}
              {navData?.status === 'gerenciamento' && (
                <>
                  <Link to="/" className="block py-1 text-apt-800 hover:text-apt-700">
                    Classificação ao vivo
                  </Link>
                  <Link to={`/financeiro/${navData.etapa_uuid}`} className="block py-1 text-apt-800 hover:text-apt-700">
                    Financeiro {navData.etapa_nome}
                  </Link>
                  {isAdmin && (
                    <>
                      <div className="my-3">
                        <div className="flex items-center justify-center">
                          <div className="w-full border-t border-apt-300"></div>
                        </div>
                        <div className="flex justify-center">
                          <span className="bg-apt-100 px-2 text-xs font-medium text-apt-800 uppercase tracking-widest">
                            ADMIN
                          </span>
                        </div>
                      </div>
                      <button
                        className="block w-full text-left py-1 text-apt-800 hover:text-apt-700"
                        // onClick={...}
                      >
                        Adicionar Jogador
                      </button>
                      <Link to="/gerenciar-etapa/eliminacao" className="block py-1 text-apt-800 hover:text-apt-700">
                        Rebuy e Eliminação
                      </Link>
                      <Link to={`/gerenciar-etapa/financeiro/${navData.etapa_uuid}`} className="block py-1 text-apt-800 hover:text-apt-700">
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
    </>
  )
}

export default Nav
