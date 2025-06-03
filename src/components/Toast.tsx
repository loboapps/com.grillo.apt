import React from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 10000) // 10 segundos
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className={`px-4 py-2 rounded ${
        type === 'success' 
          ? 'border border-apt-900 bg-apt-100 text-apt-800' 
          : 'border border-apt-700 bg-apt-100 text-apt-600'
      }`}>
        {message}
      </div>
    </div>
  )
}

export default Toast
