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
  const { user } = useAuth()

  return (
    <>
      <nav className="bg-apt-500 text-apt-100 px-4 py-3 flex items-center justify-between shadow-md">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
          <MenuIcon />
        </button>
        <h1 className="text-xl font-bold">{title}</h1>
        <div className="w-8"></div>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-apt-800 bg-opacity-50" onClick={() => setIsMenuOpen(false)}>
          <div className="bg-apt-100 w-64 h-full shadow-lg">
            <div className="p-4">
              <Link to="/" className="block py-2 text-apt-800 hover:text-apt-700">Classificação</Link>
              {user ? (
                <>
                  <Link to="/config-etapa" className="block py-2 text-apt-800 hover:text-apt-700">Config etapa</Link>
                  <Link to="/gerenciar-etapa" className="block py-2 text-apt-800 hover:text-apt-700">Gerenciar etapa</Link>
                  <Link to="/cadastrar-usuarios" className="block py-2 text-apt-800 hover:text-apt-700">Cadastrar usuários</Link>
                </>
              ) : (
                <Link to="/admin" className="block py-2 text-apt-800 hover:text-apt-700">Login</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Nav
