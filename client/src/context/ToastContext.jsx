import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => setToasts((t) => t.filter(x => x.id !== id)), [])

  const show = useCallback((message, variant = 'info', ms = 3000) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t, { id, message, variant }])
    if (ms > 0) setTimeout(() => remove(id), ms)
  }, [remove])

  const value = useMemo(() => ({ show, toasts, remove }), [show, toasts, remove])
  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}