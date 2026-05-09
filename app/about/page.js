"use client"
import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import useAuthRedirect from '@/utils/useAuthRedirect'

const faculties = [
  { name: 'Business Administration', icon: '💼', color: '#f59e0b' },
  { name: 'Engineering', icon: '⚙️', color: '#3b82f6' },
  { name: 'Digital Innovation', icon: '💡', color: '#8b5cf6' },
  { name: 'Medicine', icon: '🏥', color: '#10b981' },
  { name: 'Liberal Arts', icon: '📚', color: '#ec4899' },
  { name: 'Communication Arts', icon: '🎬', color: '#f97316' },
  { name: 'Science & Technology', icon: '🔬', color: '#06b6d4' },
]

const features = [
  {
    icon: '⚡',
    title: 'Real-Time Publishing',
    desc: 'News goes live the moment admin approves — no delays, no queues. Your campus stays informed instantly.',
    accent: '#F40756',
  },
  {
    icon: '🏛️',
    title: 'Faculty-Wide Coverage',
    desc: 'Every faculty has its own news stream. Filter by department, discover stories relevant to your world.',
    accent: '#29abe2',
  },
  {
    icon: '🏆',
    title: 'Spotlight & Hall of Fame',
    desc: 'We celebrate people, not just events. Student and faculty achievements get the recognition they deserve.',
    accent: '#f59e0b',
  },
  {
    icon: '📅',
    title: 'Events Calendar',
    desc: 'Never miss a seminar, workshop, or campus event. Browse upcoming events across all faculties.',
    accent: '#8b5cf6',
  },
  {
    icon: '🛠️',
    title: 'Admin Managed Content',
    desc: 'All posts are created and managed by the admin to ensure accurate and high-quality information.',
    accent: '#F40756',
  },
]

function useInView(threshold = 0.15) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, inView]
}

function FadeUp({ children, delay = 0 }) {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? 'translateY(0)' : 'translateY(32px)',
      transition: `opacity 0.65s cubic-bezier(0.34,1.2,0.64,1) ${delay}ms, transform 0.65s cubic-bezier(0.34,1.2,0.64,1) ${delay}ms`,
    }}>
      {children}
    </div>
  )
}

export default function AboutPage() {
  const { user, authChecked } = useAuthRedirect()
  const [menuOpen, setMenuOpen] = useState(false)
  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  if (!authChecked) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0d0d1a', color: '#fff', fontFamily: 'sans-serif', fontSize: 16, gap: 12 }}>
      <div style={{ width: 8, height: 8, background: '#F40756', borderRadius: '50%', animation: 'pulse 1s infinite' }} />
      Loading...
    </div>
  )

  return (
    <div style={{ fontFamily: "'Inter', 'Sarabun', sans-serif", background: '#0d0d1a', minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Sarabun:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }

        .nav-link { transition: color 0.2s, border-color 0.2s; }
        .nav-link:hover { color: #F40756 !important; }

        .btn-spring {
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s;
        }
        .btn-spring:hover { transform: translateY(-2px) scale(1.04); box-shadow: 0 8px 30px rgba(244,7,86,0.5) !important; }
        .btn-spring:active { transform: scale(0.96); }

        .card-spring {
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s cubic-bezier(0.34,1.56,0.64,1), border-color 0.2s;
        }
        .card-spring:hover { transform: translateY(-8px) scale(1.02); }

        .faculty-card {
          transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), background 0.2s, border-color 0.2s;
        }
        .faculty-card:hover { transform: translateY(-6px) scale(1.04); }

        .feature-card {
          transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s, border-color 0.25s;
        }
        .feature-card:hover { transform: translateY(-10px); }

        @keyframes pulse { 0%,100% { opacity:1; transform: scale(1); } 50% { opacity:0.5; transform: scale(1.3); } }
        @keyframes float { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-12px) rotate(3deg); } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes slideDown { from { opacity:0; transform: translateY(-10px); } to { opacity:1; transform: translateY(0); } }

        .shimmer-text {
          background: linear-gradient(90deg, #F40756, #ff6b9d, #fff, #F40756);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }

        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        ::-webkit-scrollbar-thumb { background: rgba(244,7,86,0.4); border-radius: 3px; }

        /* ── NAV ── */
        .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 4px; background: none; border: none; }
        .hamburger span { display: block; width: 22px; height: 2px; background: rgba(255,255,255,0.8); border-radius: 2px; transition: all 0.3s; }
        .mobile-menu { display: none; }
        .desktop-nav { display: flex !important; }
        .desktop-auth { display: flex !important; }

        /* ── LAYOUT DEFAULTS (desktop) ── */
        .hero-title { font-size: 56px; }
        .faculty-grid { grid-template-columns: repeat(4, 1fr); }
        .feature-grid { grid-template-columns: repeat(3, 1fr); }
        .mission-flex { flex-direction: row; }
        .cta-buttons { flex-direction: row; }
        .footer-inner { flex-direction: row; justify-content: space-between; }
        .footer-links { display: flex; }

        /* ── TABLET (≤ 900px) ── */
        @media (max-width: 900px) {
          .hero-title { font-size: 40px !important; }
          .faculty-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .feature-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }

        /* ── MOBILE (≤ 767px) ── */
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .desktop-auth { display: none !important; }
          .hamburger { display: flex !important; }
          .mobile-menu { display: block; }
          .header-inner { padding: 0 1rem !important; gap: 0.75rem !important; }
          .header-logo-text { display: none; }
          .hero-section { padding: 3.5rem 1rem 3rem !important; }
          .hero-title { font-size: 28px !important; letter-spacing: -0.5px !important; }
          .hero-subtitle { font-size: 14px !important; }
          .hero-tags { gap: 6px !important; }
          .hero-tag { font-size: 10px !important; padding: 5px 12px !important; }
          .main-content { padding: 0 1rem 3rem !important; }
          .mission-flex { flex-direction: column !important; gap: 1rem !important; }
          .mission-box { padding: 1.5rem !important; }
          .mission-title { font-size: 20px !important; }
          .mission-text { font-size: 14px !important; }
          .faculty-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 0.6rem !important; }
          .feature-grid { grid-template-columns: 1fr !important; }
          .cta-box { padding: 2rem 1.25rem !important; }
          .cta-title { font-size: 22px !important; }
          .cta-buttons { flex-direction: column !important; align-items: center !important; gap: 0.75rem !important; }
          .cta-btn { width: 100% !important; justify-content: center !important; }
          .footer-inner { flex-direction: column !important; align-items: flex-start !important; gap: 1rem !important; padding: 1.5rem 1rem !important; }
          .footer-links { flex-wrap: wrap !important; gap: 1rem !important; }
        }

        /* ── SMALL MOBILE (≤ 480px) ── */
        @media (max-width: 480px) {
          .hero-title { font-size: 24px !important; }
          .faculty-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }

        /* ── XS MOBILE (≤ 360px) ── */
        @media (max-width: 360px) {
          .hero-title { font-size: 20px !important; }
        }
      `}</style>

{/* ── HEADER ── */}
      <header style={{ background: 'rgba(13,13,26,0.95)', backdropFilter: 'blur(20px)', padding: '0 1.25rem', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(244,7,86,0.15)' }}>
        <div className="header-inner" style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', gap: '1.5rem', height: 64 }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{
              width: 42, height: 42,
              background: 'linear-gradient(135deg, #F40756, #ff6b9d)',
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 18, fontWeight: 900, color: '#fff',
              boxShadow: '0 0 20px rgba(244,7,86,0.4)'
            }}>U</div>
            <div>
              <div style={{ color: '#fff', fontSize: 14, fontWeight: 800, lineHeight: 1.1, letterSpacing: 1 }}>UNIVERSITY</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9, letterSpacing: 2 }}>NEWS PLATFORM</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="desktop-nav" style={{ display: 'flex', gap: '1.5rem', flex: 1 }}>
            {[['Home', '/'], ['Faculties', '/faculties'], ['Spotlight', '/spotlight'], ['Events', '/events'], ['About', '/about']].map(([n, h]) => (
              <Link key={n} href={h} className="nav-link" style={{
                color: n === 'About' ? '#F40756' : 'rgba(255,255,255,0.6)',
                fontSize: 13, fontWeight: 600,
                borderBottom: n === 'About' ? '2px solid #F40756' : '2px solid transparent',
                paddingBottom: 4, letterSpacing: 0.3
              }}>{n}</Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="desktop-auth" style={{ display: 'flex' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                <Link href="/profile" style={{ color: '#F40756', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>Dashboard</Link>
                {user.role === 'admin' && (
                  <Link href="/admin/articles" style={{
                    color: '#fff', fontSize: 12, fontWeight: 700,
                    background: 'linear-gradient(135deg, #F40756, #ff6b9d)',
                    padding: '6px 14px', borderRadius: 6, whiteSpace: 'nowrap',
                    boxShadow: '0 4px 12px rgba(244,7,86,0.3)'
                  }}>Admin</Link>
                )}
                <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {user.avatar_url
                    ? <img src={user.avatar_url} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #F40756', boxShadow: '0 0 10px rgba(244,7,86,0.3)' }} />
                    : <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #F40756, #ff6b9d)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, boxShadow: '0 0 10px rgba(244,7,86,0.3)' }}>
                        {initials}
                      </div>
                  }
                  <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{user.full_name?.split(' ')[0]}</span>
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <Link href="/login" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 500 }}>Login</Link>
                <Link href="/register" className="btn-bounce" style={{
                  background: 'linear-gradient(135deg, #F40756, #ff6b9d)',
                  color: '#fff', padding: '8px 20px', borderRadius: 8,
                  fontSize: 13, fontWeight: 700,
                  boxShadow: '0 4px 15px rgba(244,7,86,0.4)',
                  display: 'inline-block'
                }}>Register</Link>
              </div>
            )}
          </div>

          {/* Hamburger (mobile only) */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
            {user && (
              <Link href="/profile" className="hamburger" style={{ display: 'none' }}>
                <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #F40756, #ff6b9d)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12 }}>{initials}</div>
              </Link>
            )}
            <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
              <span style={{ transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
              <span style={{ opacity: menuOpen ? 0 : 1 }} />
              <span style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <div className="mobile-menu" style={{
            animation: 'slideDown 0.2s ease',
            background: 'rgba(13,13,26,0.98)', backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            padding: '1rem 1.25rem 1.5rem'
          }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
              {[['Home', '/'], ['Faculties', '/faculties'], ['Spotlight', '/spotlight'], ['Events', '/events'], ['About', '/about']].map(([n, h]) => (
                <Link key={n} href={h} onClick={() => setMenuOpen(false)} style={{
                  color: n === 'About' ? '#F40756' : 'rgba(255,255,255,0.7)',
                  fontSize: 15, fontWeight: 600, padding: '10px 12px',
                  borderRadius: 8, background: n === 'About' ? 'rgba(244,7,86,0.08)' : 'transparent'
                }}>{n}</Link>
              ))}
            </nav>
            {user ? (
              <div style={{ display: 'flex', gap: 10 }}>
                <Link href="/profile" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '10px', background: 'rgba(244,7,86,0.1)', border: '1px solid rgba(244,7,86,0.3)', borderRadius: 8, color: '#F40756', fontWeight: 700, fontSize: 14 }}>Dashboard</Link>
                {user.role === 'admin' && (
                  <Link href="/admin/articles" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '10px', background: 'linear-gradient(135deg, #F40756, #ff6b9d)', borderRadius: 8, color: '#fff', fontWeight: 700, fontSize: 14 }}>Admin</Link>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 10 }}>
                <Link href="/login" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: 14 }}>Login</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '10px', background: 'linear-gradient(135deg, #F40756, #ff6b9d)', borderRadius: 8, color: '#fff', fontWeight: 700, fontSize: 14 }}>Register</Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <div className="hero-section" style={{ position: 'relative', padding: '6rem 2rem 5rem', textAlign: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '15%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(244,7,86,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(41,171,226,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(244,7,86,0.15)', border: '1px solid rgba(244,7,86,0.3)',
            borderRadius: 20, padding: '5px 16px', marginBottom: 24
          }}>
            <div style={{ width: 6, height: 6, background: '#F40756', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
            <span style={{ color: '#F40756', fontSize: 11, fontWeight: 800, letterSpacing: 2 }}>WHO WE ARE</span>
          </div>

          <h1 className="hero-title" style={{ color: '#fff', fontWeight: 900, lineHeight: 1.05, marginBottom: 20, letterSpacing: -1.5 }}>
            About{' '}
            <span className="shimmer-text">University News</span>
          </h1>

          <p className="hero-subtitle" style={{ color: 'rgba(255,255,255,0.55)', fontSize: 18, maxWidth: 560, margin: '0 auto 2rem', lineHeight: 1.8, fontWeight: 400 }}>
            The official news platform connecting students, faculty and staff with the latest updates, achievements and stories from our university community.
          </p>

          <div className="hero-tags" style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['INNOVATE', 'INSPIRE', 'IMPACT'].map((w, i) => (
              <span className="hero-tag" key={w} style={{
                background: i === 0 ? 'rgba(244,7,86,0.15)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${i === 0 ? 'rgba(244,7,86,0.3)' : 'rgba(255,255,255,0.1)'}`,
                color: i === 0 ? '#F40756' : 'rgba(255,255,255,0.5)',
                padding: '6px 18px', borderRadius: 20,
                fontSize: 11, fontWeight: 800, letterSpacing: 2
              }}>{w}</span>
            ))}
          </div>
        </div>
      </div>

      <main className="main-content" style={{ maxWidth: 1000, margin: '0 auto', padding: '0 2rem 4rem' }}>

        {/* ── MISSION ── */}
        <FadeUp delay={0}>
          <div className="mission-box" style={{
            position: 'relative', borderRadius: 20, padding: '2.5rem',
            marginBottom: '2rem', overflow: 'hidden',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #F40756, #ff6b9d, transparent)' }} />
            <div style={{ position: 'absolute', top: '50%', right: '-5%', width: 200, height: 200, background: 'radial-gradient(circle, rgba(244,7,86,0.06) 0%, transparent 70%)', transform: 'translateY(-50%)', pointerEvents: 'none' }} />

            <div className="mission-flex" style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
              <div style={{
                width: 56, height: 56, flexShrink: 0,
                background: 'linear-gradient(135deg, rgba(244,7,86,0.2), rgba(244,7,86,0.05))',
                border: '1px solid rgba(244,7,86,0.2)',
                borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
                animation: 'float 4s ease-in-out infinite'
              }}>🎯</div>
              <div>
                <div style={{ color: '#F40756', fontSize: 10, fontWeight: 800, letterSpacing: 2, marginBottom: 6 }}>OUR PURPOSE</div>
                <h2 className="mission-title" style={{ color: '#fff', fontSize: 26, fontWeight: 800, marginBottom: 14, letterSpacing: -0.5 }}>Our Mission</h2>
                <p className="mission-text" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, lineHeight: 1.9, maxWidth: 680 }}>
                  To provide timely, accurate and engaging news coverage that reflects the vibrant academic, cultural and social life of our university community. Every article, every story, every announcement — crafted to keep our community connected and informed.
                </p>
              </div>
            </div>
          </div>
        </FadeUp>

        {/* ── FACULTY COVERAGE GRID ── */}
        <FadeUp delay={80}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ color: '#F40756', fontSize: 10, fontWeight: 800, letterSpacing: 2, marginBottom: 6 }}>COVERAGE</div>
              <h2 style={{ color: '#fff', fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>Faculties We Cover</h2>
            </div>
            <div className="faculty-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.85rem' }}>
              {faculties.map((f, i) => (
                <Link key={f.name} href={`/faculties/${f.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}>
                  <div className="faculty-card" style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 14, padding: '1.25rem 1rem',
                    textAlign: 'center', cursor: 'pointer',
                    position: 'relative', overflow: 'hidden',
                  }}>
                    <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 0%, ${f.color}10 0%, transparent 70%)`, pointerEvents: 'none' }} />
                    <div style={{
                      width: 44, height: 44, margin: '0 auto 10px',
                      background: `${f.color}18`,
                      border: `1px solid ${f.color}30`,
                      borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20
                    }}>{f.icon}</div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 600, lineHeight: 1.4 }}>{f.name}</div>
                    <div style={{ width: 24, height: 2, background: f.color, margin: '8px auto 0', borderRadius: 1, opacity: 0.6 }} />
                  </div>
                </Link>
              ))}
              {/* +more card */}
              <Link href="/faculties">
                <div className="faculty-card" style={{
                  background: 'rgba(244,7,86,0.06)',
                  border: '1px dashed rgba(244,7,86,0.25)',
                  borderRadius: 14, padding: '1.25rem 1rem',
                  textAlign: 'center', cursor: 'pointer',
                }}>
                  <div style={{
                    width: 44, height: 44, margin: '0 auto 10px',
                    background: 'rgba(244,7,86,0.1)',
                    borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#F40756', fontSize: 22, fontWeight: 900
                  }}>+</div>
                  <div style={{ color: '#F40756', fontSize: 12, fontWeight: 700 }}>View All</div>
                  <div style={{ color: 'rgba(244,7,86,0.5)', fontSize: 10, marginTop: 3 }}>Faculties →</div>
                </div>
              </Link>
            </div>
          </div>
        </FadeUp>

        {/* ── PLATFORM FEATURES ── */}
        <FadeUp delay={120}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ color: '#F40756', fontSize: 10, fontWeight: 800, letterSpacing: 2, marginBottom: 6 }}>WHAT MAKES US DIFFERENT</div>
              <h2 style={{ color: '#fff', fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>Platform Features</h2>
            </div>
            <div className="feature-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {features.map((f, i) => (
                <FadeUp key={f.title} delay={i * 60}>
                  <div className="feature-card" style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 16, padding: '1.5rem',
                    position: 'relative', overflow: 'hidden', height: '100%',
                  }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${f.accent}, transparent)` }} />
                    <div style={{
                      width: 48, height: 48, marginBottom: 14,
                      background: `${f.accent}15`,
                      border: `1px solid ${f.accent}25`,
                      borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22
                    }}>{f.icon}</div>
                    <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, lineHeight: 1.7 }}>{f.desc}</p>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* ── CONTACT CTA ── */}
        <FadeUp delay={160}>
          <div className="cta-box" style={{
            position: 'relative', borderRadius: 20, padding: '3rem 2.5rem',
            textAlign: 'center', overflow: 'hidden',
            background: 'linear-gradient(135deg, rgba(244,7,86,0.1) 0%, rgba(45,26,78,0.4) 50%, rgba(13,13,26,0.8) 100%)',
            border: '1px solid rgba(244,7,86,0.15)',
          }}>
            <div style={{ position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)', width: 400, height: 400, background: 'radial-gradient(circle, rgba(244,7,86,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: 40, marginBottom: 16, animation: 'float 3s ease-in-out infinite' }}>📬</div>
              <h2 className="cta-title" style={{ color: '#fff', fontSize: 28, fontWeight: 900, marginBottom: 10, letterSpacing: -0.5 }}>Get In Touch</h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 28, maxWidth: 440, margin: '0 auto 28px', lineHeight: 1.7 }}>
                Have a story tip, want to contribute, or just have questions? Our admin team is here for you.
              </p>
              <div className="cta-buttons" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="mailto:news@university.edu" className="btn-spring cta-btn" style={{
                  background: 'linear-gradient(135deg, #F40756, #ff6b9d)',
                  color: '#fff', padding: '13px 28px', borderRadius: 10,
                  fontWeight: 700, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 8,
                  boxShadow: '0 8px 24px rgba(244,7,86,0.35)'
                }}>✉️ ben@unicersity.ac.th</a>
                <Link href="/register" className="btn-spring cta-btn" style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: '#fff', padding: '13px 28px', borderRadius: 10,
                  fontWeight: 700, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 8,
                  border: '1px solid rgba(255,255,255,0.12)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
                }}>✍️ Become a Contributor</Link>
              </div>
            </div>
          </div>
        </FadeUp>

      </main>

      {/* ── FOOTER ── */}
      <footer style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '2.5rem 1.25rem', marginTop: '1rem' }}>
        <div className="footer-inner" style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #F40756, #ff6b9d)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 14, boxShadow: '0 0 15px rgba(244,7,86,0.3)' }}>U</div>
            <div>
              <div style={{ color: '#fff', fontSize: 13, fontWeight: 800 }}>University News Platform</div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>INNOVATE • INSPIRE • IMPACT</div>
            </div>
          </div>
          <div className="footer-links" style={{ display: 'flex', gap: '1.5rem' }}>
            {[['Home', '/'], ['Faculties', '/faculties'], ['Spotlight', '/spotlight'], ['Events', '/events']].map(([n, h]) => (
              <Link key={n} href={h} className="nav-link" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 500 }}>{n}</Link>
            ))}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>© {new Date().getFullYear()} University News</p>
        </div>
      </footer>
    </div>
  )
}