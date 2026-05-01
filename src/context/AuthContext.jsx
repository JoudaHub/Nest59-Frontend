import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI } from '../services/api'

const Ctx = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null)
  const [ready,   setReady]   = useState(false)

  useEffect(() => {
    const t = localStorage.getItem('cs_token')
    if (!t) { setReady(true); return }
    authAPI.me()
      .then(d => setUser(d.user))
      .catch(() => localStorage.removeItem('cs_token'))
      .finally(() => setReady(true))
  }, [])

  const login = useCallback(async (email, password) => {
    const d = await authAPI.login({ email, password })
    localStorage.setItem('cs_token', d.token)
    setUser(d.user)
    return d
  }, [])

  const register = useCallback(async (form) => {
    const d = await authAPI.register(form)
    localStorage.setItem('cs_token', d.token)
    setUser(d.user)
    return d
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('cs_token')
    setUser(null)
  }, [])

  return (
    <Ctx.Provider value={{ user, ready, login, register, logout }}>
      {children}
    </Ctx.Provider>
  )
}

export const useAuth = () => useContext(Ctx)
