"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (!stored) { router.push('/login'); return }
    const u = JSON.parse(stored)
    if (u.role !== 'admin') {
      router.push('/profile'); return
    }
    setUser(u)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  const navItems = [
    { label: 'Dashboard',   href: '/admin',          icon: '📊' },
    { label: 'Articles',    href: '/admin/articles',  icon: '📰' },
    { label: 'Users',       href: '/admin/users',     icon: '👥' },
  ]

  if (!user) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif', color: '#666' }}>
      Checking access...
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Sarabun', sans-serif", background: '#f4f4f4' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        .nav-item:hover { background: rgba(105,0,40,0.15) !important; color: #fff !important; }
      `}</style>

      {/* SIDEBAR */}
      <aside style={{
        width: 220, background: '#f40756',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0, height: '100vh',
        zIndex: 100, boxShadow: '2px 0 10px rgba(0,0,0,0.2)'
      }}>
        {/* Logo */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38, height: 38, background: '#fff',
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#f40756'
            }}>U</div>
            <div>
              <div style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>UNIVERSITY</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, letterSpacing: 1 }}>ADMIN PANEL</div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '1rem 0' }}>
          {navItems.map(item => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href} className="nav-item" style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 20px', fontSize: 14, fontWeight: 600,
                color: '#fff',
                background: active ? 'rgba(255,255,255,0.2)' : 'transparent',
                borderLeft: active ? '4px solid #fff' : '4px solid transparent',
                transition: 'all 0.2s'
              }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}

          <div style={{ margin: '1rem 20px', borderTop: '1px solid rgba(255,255,255,0.15)' }} />

          <Link href="/" style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '11px 20px', fontSize: 14, fontWeight: 600,
            color: 'rgba(255,255,255,0.7)', transition: 'all 0.2s'
          }}>
            <span style={{ fontSize: 16 }}>🌐</span>
            View Site
          </Link>
        </nav>

        {/* User + Logout */}
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 34, height: 34, background: 'rgba(255,255,255,0.2)',
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14,
              border: '2px solid rgba(255,255,255,0.4)'
            }}>{user.full_name?.charAt(0)}</div>
            <div>
              <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{user.full_name}</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, textTransform: 'capitalize' }}>{user.role}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{
            width: '100%', padding: '8px', background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)', borderRadius: 6,
            color: '#fff', cursor: 'pointer', fontSize: 13,
            display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center',
          }}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <div style={{ marginLeft: 220, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <div style={{
          background: '#fff', padding: '0 2rem', height: 60,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)', position: 'sticky', top: 0, zIndex: 50
        }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e' }}>
            {navItems.find(n => n.href === pathname)?.label || 'Admin'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: '#888' }}>Welcome, {user.full_name}</span>
            <Link href="/" style={{
              background: 'f40756', color: '#fff',
              padding: '6px 14px', borderRadius: 4,
              fontSize: 12, fontWeight: 700
            }}>View Site</Link>
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding: '2rem', flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  )
}