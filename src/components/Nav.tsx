import React, { useState } from 'react'
import { Bars3Icon } from '@heroicons/react/24/outline'

interface NavProps {
  title: string;
}

const Nav: React.FC<NavProps> = ({ title }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <nav className="bg-black text-white px-4 py-3 flex items-center justify-between shadow-md">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
          <Bars3Icon className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold">{title}</h1>
        <div className="w-8"></div>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMenuOpen(false)}>
          <div className="bg-white w-64 h-full shadow-lg">
            <div className="p-4">
              <a href="#" className="block py-2 text-gray-900 hover:text-red-600">Classificação</a>
              <a href="#" className="block py-2 text-gray-900 hover:text-red-600">Admin</a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Nav
