import React, { useState } from 'react'

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

  return (
    <>
      <nav className="bg-black text-white px-4 py-3 flex items-center justify-between shadow-md">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
          <MenuIcon />
        </button>
        <h1 className="text-xl font-bold">{title}</h1>
        <div className="w-8"></div>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)}>
          <div className="bg-white w-64 h-full shadow-lg">
            <div className="p-4">
              <a href="/classificacao" className="block py-2 text-gray-900 hover:text-red-600">Classificação</a>
              <a href="/admin" className="block py-2 text-gray-900 hover:text-red-600">Admin</a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Nav
