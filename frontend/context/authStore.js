import { create } from 'zustand'

function getStoredAuth() {
  if (typeof window === 'undefined') return { token: null, user: null }
  try {
    const raw = window.localStorage.getItem('kietloop_auth')
    if (!raw) return { token: null, user: null }
    return JSON.parse(raw)
  } catch {
    return { token: null, user: null }
  }
}

function setStoredAuth(value) {
  if (typeof window === 'undefined') return
  if (!value?.token) {
    window.localStorage.removeItem('kietloop_auth')
    return
  }
  window.localStorage.setItem('kietloop_auth', JSON.stringify(value))
}

const initial = getStoredAuth()

export const useAuthStore = create((set) => ({
  token: initial.token,
  user: initial.user,
  setAuth: (token, user) => {
    const normalizedUser = user ? { ...user, id: user.id || user._id } : null
    setStoredAuth({ token, user: normalizedUser })
    set({ token, user: normalizedUser })
  },
  clearAuth: () => {
    setStoredAuth(null)
    set({ token: null, user: null })
  }
}))
