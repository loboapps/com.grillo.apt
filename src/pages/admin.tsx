import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

type AuthMode = 'login' | 'register' | 'reset'

const Admin = () => {
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } 
      else if (mode === 'register') {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: { data: { name } }
        })
        if (error) throw error
        setMessage('Verifique seu email para confirmar o cadastro')
      }
      else if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email)
        if (error) throw error
        setMessage('Se o email existir, você receberá instruções para resetar sua senha')
      }
    } catch (error: any) {
      setMessage(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">
          {mode === 'login' ? 'Login' : mode === 'register' ? 'Cadastro' : 'Recuperar Senha'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <input
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          )}
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />

          {mode !== 'reset' && (
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          )}

          <button
            type="submit"
            className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700"
          >
            {mode === 'login' ? 'Entrar' : mode === 'register' ? 'Cadastrar' : 'Enviar'}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-gray-600">{message}</p>
        )}

        <div className="mt-4 text-sm text-gray-600">
          {mode === 'login' ? (
            <>
              <button onClick={() => setMode('register')} className="text-red-600 hover:underline">
                Criar conta
              </button>
              {' | '}
              <button onClick={() => setMode('reset')} className="text-red-600 hover:underline">
                Esqueci minha senha
              </button>
            </>
          ) : (
            <button onClick={() => setMode('login')} className="text-red-600 hover:underline">
              Voltar para login
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Admin
