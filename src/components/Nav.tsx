import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

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
}

const Nav: React.FC<NavProps> = ({ title }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const { user } = useAuth()

  const toggleSubMenu = (item: string) => {
    setExpandedItem(expandedItem === item ? null : item)
  }

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
            <div className="p-4 space-y-2">
              <Link to="/" className="block py-2 text-apt-800 hover:text-apt-700">
                Classificação
              </Link>

              {user && (
                <>
                  {/* Configurar etapa */}
                  <div>
                    <button 
                      onClick={() => toggleSubMenu('config')}
                      className="w-full text-left py-2 text-apt-800 hover:text-apt-700 flex items-center justify-between"
                    >
                      <span>Configurar etapa</span>
                      <span className="text-xs">{expandedItem === 'config' ? '▼' : '▶'}</span>
                    </button>
                    {expandedItem === 'config' && (
                      <div className="pl-4 space-y-2">
                        <Link to="/config-etapa/financeiro" className="block py-1 text-apt-800 hover:text-apt-700">
                          Financeiro
                        </Link>
                        <Link to="/config-etapa/jogadores" className="block py-1 text-apt-800 hover:text-apt-700">
                          Jogadores
                        </Link>
                        <Link to="/config-etapa/mesas" className="block py-1 text-apt-800 hover:text-apt-700">
                          Sortear mesas
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Gerenciar etapas */}
                  <div>
                    <button 
                      onClick={() => toggleSubMenu('gerenciar')}
                      className="w-full text-left py-2 text-apt-800 hover:text-apt-700 flex items-center justify-between"
                    >
                      <span>Gerenciar etapas</span>
                      <span className="text-xs">{expandedItem === 'gerenciar' ? '▼' : '▶'}</span>
                    </button>
                    {expandedItem === 'gerenciar' && (
                      <div className="pl-4 space-y-2">
                        <Link to="/gerenciar-etapa/eliminacao" className="block py-1 text-apt-800 hover:text-apt-700">
                          Eliminação e Rebuy
                        </Link>
                        <Link to="/gerenciar-etapa/financeiro" className="block py-1 text-apt-800 hover:text-apt-700">
                          Financeiro
                        </Link>
                      </div>
                    )}
                  </div>
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
