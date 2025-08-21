import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  async function fetchMe() {
    try {
      const me = await api.get('auth/me').json()
      setUser(me)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  async function login(email, password) {
    await api.post('auth/login', { json: { email, password } }).json()
    await fetchMe()
    navigate('/dashboard')
  }

  async function register(name, email, password) {
    await api.post('auth/register', { json: { name, email, password } }).json()
    navigate('/login')
  }

  async function logout() {
    try { await api.post('auth/logout').json() } catch {}
    setUser(null)
    navigate('/login')
  }

  useEffect(() => { fetchMe() }, [])

  const value = useMemo(() => ({ user, loading, login, register, logout, refresh: fetchMe }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

