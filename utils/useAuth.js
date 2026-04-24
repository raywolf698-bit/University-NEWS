"use client"
import { useEffect, useState } from 'react'

export default function useAuth() {
  const [user, setUser] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
    setAuthChecked(true)
  }, [])

  return { user, authChecked }
}