"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', background: '#0d0d1a', color: 'rgba(255,255,255,0.4)',
      fontFamily: "'Inter', sans-serif", fontSize: 14, gap: 10
    }}>
      <div style={{ width: 8, height: 8, background: '#F40756', borderRadius: '50%', animation: 'pulse 1s infinite' }} />
      Checking access...
      <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.4)} }`}</style>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', 'Sarabun', sans-serif", background: '#0d0d1a' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Sarabun:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }

        .nav-item { transition: all 0.2s ease; }
        .nav-item:hover { background: rgba(244,7,86,0.12) !important; color: #fff !important; }

        .logout-btn { transition: all 0.2s ease; }
        .logout-btn:hover { background: rgba(244,7,86,0.15) !important; border-color: rgba(244,7,86,0.3) !important; }

        .view-site-btn { transition: all 0.2s ease; }
        .view-site-btn:hover { background: rgba(244,7,86,0.15) !important; color: #F40756 !important; }

        .hamburger-btn { transition: all 0.2s; }
        .hamburger-btn:hover { background: rgba(244,7,86,0.15) !important; }

        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.4)} }
        @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }

        /* ── RESPONSIVE ── */

        /* Sidebar: fixed on desktop, slide-over on mobile */
        .sidebar { width: 220px; position: fixed; top: 0; left: 0; height: 100vh; z-index: 200; }
        .content-area { margin-left: 220px; }
        .hamburger { display: none; }
        .sidebar-overlay { display: none; }
        .topbar-title { display: block; }

        /* ── TABLET (≤ 768px) ── */
        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s cubic-bezier(0.34,1.2,0.64,1);
            width: 240px !important;
          }
          .sidebar.open {
            transform: translateX(0);
            animation: none;
          }
          .content-area { margin-left: 0 !important; }
          .hamburger { display: flex !important; }
          .sidebar-overlay {
            display: block;
            position: fixed; inset: 0; background: rgba(0,0,0,0.6);
            z-index: 199; backdrop-filter: blur(4px);
          }
          .topbar-welcome { display: none !important; }
        }

        /* ── MOBILE (≤ 480px) ── */
        @media (max-width: 480px) {
          .topbar-inner { padding: 0 1rem !important; }
          .topbar-viewsite span { display: none; }
          .content-padding { padding: 1rem !important; }
        }
      `}</style>

      {/* ── SIDEBAR OVERLAY (mobile) ── */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`} style={{
        background: 'rgba(255,255,255,0.03)',
        borderRight: '1px solid rgba(244,7,86,0.15)',
        display: 'flex', flexDirection: 'column',
        boxShadow: '4px 0 24px rgba(0,0,0,0.3)'
      }}>

        {/* Logo */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38, height: 38,
              background: 'linear-gradient(135deg, #F40756, #ff6b9d)',
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 16, fontWeight: 900, color: '#fff',
              boxShadow: '0 0 16px rgba(244,7,86,0.4)'
            }}>U</div>
            <div>
              <div style={{ color: '#fff', fontSize: 13, fontWeight: 800, letterSpacing: 1 }}>UNIVERSITY</div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, letterSpacing: 2 }}>ADMIN PANEL</div>
            </div>
          </Link>
          {/* Close button (mobile only) */}
          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              display: 'none', background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.5)', borderRadius: 8,
              width: 30, height: 30, cursor: 'pointer', fontSize: 16,
              alignItems: 'center', justifyContent: 'center',
              fontFamily: 'inherit'
            }}
            className="sidebar-close"
          >✕</button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '1rem 0' }}>
          {navItems.map(item => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href} className="nav-item"
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 20px', fontSize: 13, fontWeight: 600,
                  color: active ? '#fff' : 'rgba(255,255,255,0.5)',
                  background: active ? 'rgba(244,7,86,0.15)' : 'transparent',
                  borderLeft: active ? '3px solid #F40756' : '3px solid transparent',
                  transition: 'all 0.2s'
                }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}

          <div style={{ margin: '1rem 20px', borderTop: '1px solid rgba(255,255,255,0.07)' }} />

          <Link href="/" className="nav-item" onClick={() => setSidebarOpen(false)} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '11px 20px', fontSize: 13, fontWeight: 600,
            color: 'rgba(255,255,255,0.35)', borderLeft: '3px solid transparent',
            transition: 'all 0.2s'
          }}>
            <span style={{ fontSize: 16 }}>🌐</span>
            View Site
          </Link>
        </nav>

        {/* User + Logout */}
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 34, height: 34,
              background: 'linear-gradient(135deg, #F40756, #ff6b9d)',
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14,
              boxShadow: '0 0 10px rgba(244,7,86,0.3)',
              flexShrink: 0
            }}>{user.full_name?.charAt(0)}</div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ color: '#fff', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.full_name}</div>
              <div style={{ color: '#F40756', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>{user.role}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn" style={{
            width: '100%', padding: '8px', cursor: 'pointer', fontSize: 13,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, color: 'rgba(255,255,255,0.6)',
            display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center',
            fontWeight: 600, fontFamily: "'Inter', sans-serif"
          }}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* ── CONTENT AREA ── */}
      <div className="content-area" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* Top bar */}
        <div style={{
          background: 'rgba(13,13,26,0.95)',
          backdropFilter: 'blur(20px)',
          height: 60,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid rgba(244,7,86,0.12)',
          position: 'sticky', top: 0, zIndex: 50,
          boxShadow: '0 2px 20px rgba(0,0,0,0.3)'
        }}>
          <div className="topbar-inner" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 2rem', flex: 1, justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Hamburger (tablet/mobile) */}
              <button
                className="hamburger hamburger-btn"
                onClick={() => setSidebarOpen(true)}
                style={{
                  display: 'none', background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8, width: 36, height: 36,
                  color: '#fff', cursor: 'pointer', fontSize: 18,
                  alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'inherit', flexShrink: 0
                }}
              >☰</button>
              <div style={{ width: 4, height: 20, borderRadius: 2, background: 'linear-gradient(180deg, #F40756, #ff6b9d)' }} />
              <h1 className="topbar-title" style={{ fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: 0.2 }}>
                {navItems.find(n => n.href === pathname)?.label || 'Admin'}
              </h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span className="topbar-welcome" style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
                Welcome, <span style={{ color: 'rgba(255,255,255,0.65)', fontWeight: 600 }}>{user.full_name}</span>
              </span>
              <Link href="/" className="topbar-viewsite view-site-btn" style={{
                background: 'rgba(255,255,255,0.07)',
                color: 'rgba(255,255,255,0.55)',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '6px 14px', borderRadius: 8,
                fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6
              }}>🌐 <span>View Site</span></Link>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="content-padding" style={{ padding: '2rem', flex: 1, background: '#0d0d1a' }}>
          {children}
        </div>
      </div>

      {/* Extra style to show sidebar-close btn and hamburger on mobile via CSS display */}
      <style>{`
        @media (max-width: 768px) {
          .sidebar-close { display: flex !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </div>
  )
}