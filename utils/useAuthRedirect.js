"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function useAuthRedirect() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    console.log('AUTH CHECK - stored user:', stored)
    if (!stored) {
      router.replace('/login')
      setAuthChecked(true)
    } else {
      setUser(JSON.parse(stored))
      setAuthChecked(true)
    }
  }, [])

  return { user, authChecked }
}