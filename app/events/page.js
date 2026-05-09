"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import useAuthRedirect from '@/utils/useAuthRedirect'

export default function EventsPage() {
  const { user, authChecked } = useAuthRedirect()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeMonth, setActiveMonth] = useState(new Date().getMonth())
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!authChecked) return
    fetch('/api/articles?status=published&article_type=event&limit=50')
      .then(r => r.json())
      .then(d => setEvents(d.data || []))
      .finally(() => setLoading(false))
  }, [authChecked])

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const fullMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const filteredEvents = events.filter(e => {
    if (!e.published_at) return true
    return new Date(e.published_at).getMonth() === activeMonth
  })

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : ''
  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  if (!authChecked) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0d0d1a', color: '#fff', fontFamily: 'sans-serif', fontSize: 16, gap: 12 }}>
      <div style={{ width: 8, height: 8, background: '#F40756', borderRadius: '50%', animation: 'pulse 1s infinite' }} />
      Loading...
    </div>
  )

  return (
    <div style={{ fontFamily: "'Inter', 'Sarabun', sans-serif", background: '#0d0d1a', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Sarabun:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        button { font-family: inherit; }

        .nav-link { transition: color 0.2s; }
        .nav-link:hover { color: #F40756 !important; }

        .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 4px; background: none; border: none; }
        .hamburger span { display: block; width: 22px; height: 2px; background: rgba(255,255,255,0.8); border-radius: 2px; transition: all 0.3s; }
        .mobile-menu { display: none; }
        .desktop-nav { display: flex !important; }
        .desktop-auth { display: flex !important; }

        .month-btn { transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); }
        .month-btn:hover { transform: scale(1.08); }
        .event-card { transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s cubic-bezier(0.34,1.56,0.64,1), border-color 0.2s; }
        .event-card:hover { transform: translateY(-5px) scale(1.01); box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(244,7,86,0.2) !important; }
        .btn-bounce { transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s; }
        .btn-bounce:hover { transform: translateY(-2px) scale(1.04); box-shadow: 0 8px 30px rgba(244,7,86,0.5) !important; }
        .btn-bounce:active { transform: scale(0.96); }
        .date-box { transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1); }
        .event-card:hover .date-box { transform: scale(1.05); }
        .arrow-link { transition: transform 0.2s, color 0.2s; display: inline-flex; align-items: center; gap: 4px; }
        .event-card:hover .arrow-link { transform: translateX(4px); color: #ff6b9d !important; }
        .hero-orb { animation: float 6s ease-in-out infinite; }
        .hero-orb-2 { animation: float 8s ease-in-out infinite reverse; }

        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        @keyframes pulse { 0%,100% { opacity:1; transform: scale(1); } 50% { opacity:0.5; transform: scale(1.3); } }
        @keyframes fadeInUp { from { opacity:0; transform: translateY(24px); } to { opacity:1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideDown { from { opacity:0; transform: translateY(-10px); } to { opacity:1; transform: translateY(0); } }
        .fade-in { animation: fadeInUp 0.5s ease forwards; }

        .hero-title { font-size: 52px; }
        .hero-desc { font-size: 17px; }
        .hero-stats { display: inline-flex; }

        .card-inner { display: flex; flex-direction: row; }
        .card-date-box {
          min-width: 90px; padding: 0 1.5rem;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center; flex-shrink: 0;
        }
        .card-date-num { font-size: 34px; }
        .card-info { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; justify-content: center; }
        .card-title { font-size: 17px; }
        .card-excerpt { font-size: 13px; }
        .card-thumb { width: 160px; flex-shrink: 0; overflow: hidden; position: relative; }

        .month-strip { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
        .month-strip::-webkit-scrollbar { display: none; }

        .footer-inner { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
        .footer-links { display: flex; gap: 1.5rem; }

        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        ::-webkit-scrollbar-thumb { background: rgba(244,7,86,0.4); border-radius: 3px; }

        @media (max-width: 1024px) {
          .hero-title { font-size: 44px; }
          .card-thumb { width: 130px; }
        }

        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .desktop-auth { display: none !important; }
          .hamburger { display: flex !important; }
          .mobile-menu { display: block; }

          .hero-title { font-size: 34px; letter-spacing: -0.5px; }
          .hero-desc { font-size: 14px; }
          .hero-stats { flex-direction: column; gap: 0; width: 100%; max-width: 320px; }
          .hero-stats-divider-h { display: none !important; }
          .hero-stats-divider-v { display: block !important; width: 100%; height: 1px; background: rgba(255,255,255,0.1); }

          .card-inner { flex-direction: column; }
          .card-date-box { min-width: unset; width: 100%; flex-direction: row; gap: 10px; padding: 0.75rem 1rem; justify-content: flex-start; }
          .card-date-num { font-size: 22px; }
          .card-info { padding: 0.75rem 1rem 1rem; }
          .card-title { font-size: 15px; }
          .card-excerpt { font-size: 12px; -webkit-line-clamp: 2; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; }
          .card-thumb { width: 100%; height: 160px; }
          .card-thumb img { width: 100%; height: 100%; object-fit: cover; }

          .footer-links { flex-wrap: wrap; gap: 0.75rem; }
          .footer-inner { flex-direction: column; align-items: flex-start; }
        }

        @media (max-width: 480px) {
          .hero-title { font-size: 28px; }
          .hero-section { padding: 3rem 1rem 2.5rem; }
          .main-pad { padding: 1.5rem 1rem; }
          .month-pad { padding: 0.75rem 1rem; }
          .header-pad { padding: 0 1rem; }
          .footer-pad { padding: 2rem 1rem; }
          .month-btn { padding: 6px 12px !important; font-size: 11px !important; }
          .card-info { padding: 0.75rem; }
          .stat-num { font-size: 18px !important; }
        }

        @media (max-width: 360px) {
          .hero-title { font-size: 24px; }
          .logo-text-block { display: none; }
        }
      `}</style>

      {/* ── HEADER ── */}
{/* ── HEADER ── */}
      <header style={{ background: 'rgba(13,13,26,0.95)', backdropFilter: 'blur(20px)', padding: '0 1.25rem', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(244,7,86,0.15)' }}>
        <div className="header-inner" style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', gap: '1.5rem', height: 64 }}>

          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{ width: 42, height: 42, background: 'linear-gradient(135deg, #F40756, #ff6b9d)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: '#fff', boxShadow: '0 0 20px rgba(244,7,86,0.4)' }}>U</div>
            <div>
              <div style={{ color: '#fff', fontSize: 14, fontWeight: 800, lineHeight: 1.1, letterSpacing: 1 }}>UNIVERSITY</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9, letterSpacing: 2 }}>NEWS PLATFORM</div>
            </div>
          </Link>

          <nav className="desktop-nav" style={{ display: 'flex', gap: '1.5rem', flex: 1 }}>
            {[['Home', '/'], ['Faculties', '/faculties'], ['Spotlight', '/spotlight'], ['Events', '/events'], ['About', '/about']].map(([n, h]) => (
              <Link key={n} href={h} className="nav-link" style={{ color: n === 'Events' ? '#F40756' : 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600, borderBottom: n === 'Events' ? '2px solid #F40756' : '2px solid transparent', paddingBottom: 4, letterSpacing: 0.3 }}>{n}</Link>
            ))}
          </nav>

          <div className="desktop-auth" style={{ display: 'flex' }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                <Link href="/profile" style={{ color: '#F40756', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>Dashboard</Link>
                {user.role === 'admin' && (
                  <Link href="/admin/articles" style={{ color: '#fff', fontSize: 12, fontWeight: 700, background: 'linear-gradient(135deg, #F40756, #ff6b9d)', padding: '6px 14px', borderRadius: 6, whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(244,7,86,0.3)' }}>Admin</Link>
                )}
                <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {user.avatar_url
                    ? <img src={user.avatar_url} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #F40756', boxShadow: '0 0 10px rgba(244,7,86,0.3)' }} />
                    : <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #F40756, #ff6b9d)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, boxShadow: '0 0 10px rgba(244,7,86,0.3)' }}>{initials}</div>
                  }
                  <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{user.full_name?.split(' ')[0]}</span>
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <Link href="/login" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 500 }}>Login</Link>
                <Link href="/register" className="btn-bounce" style={{ background: 'linear-gradient(135deg, #F40756, #ff6b9d)', color: '#fff', padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700, boxShadow: '0 4px 15px rgba(244,7,86,0.4)', display: 'inline-block' }}>Register</Link>
              </div>
            )}
          </div>

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

        {menuOpen && (
          <div className="mobile-menu" style={{ animation: 'slideDown 0.2s ease', background: 'rgba(13,13,26,0.98)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '1rem 1.25rem 1.5rem' }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
              {[['Home', '/'], ['Faculties', '/faculties'], ['Spotlight', '/spotlight'], ['Events', '/events'], ['About', '/about']].map(([n, h]) => (
                <Link key={n} href={h} onClick={() => setMenuOpen(false)} style={{ color: n === 'Events' ? '#F40756' : 'rgba(255,255,255,0.7)', fontSize: 15, fontWeight: 600, padding: '10px 12px', borderRadius: 8, background: n === 'Events' ? 'rgba(244,7,86,0.08)' : 'transparent' }}>{n}</Link>
              ))}
            </nav>
            {user ? (
              <div style={{ display: 'flex', gap: 10 }}>
                <Link href="/profile" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '10px', background: 'rgba(244,7,86,0.1)', border: '1px solid rgba(244,7,86,0.3)', borderRadius: 8, color: '#F40756', fontWeight: 700, fontSize: 14 }}>Dashboard</Link>
                {user.role === 'admin' && <Link href="/admin/articles" onClick={() => setMenuOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '10px', background: 'linear-gradient(135deg, #F40756, #ff6b9d)', borderRadius: 8, color: '#fff', fontWeight: 700, fontSize: 14 }}>Admin</Link>}
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
      <div className="hero-section" style={{ position: 'relative', overflow: 'hidden', padding: '5rem 2rem 4rem', textAlign: 'center', background: 'linear-gradient(180deg, #0d0d1a 0%, #130d2a 50%, #0d0d1a 100%)' }}>
        <div className="hero-orb" style={{ position: 'absolute', top: '10%', left: '8%', width: 280, height: 280, background: 'radial-gradient(circle, rgba(244,7,86,0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div className="hero-orb-2" style={{ position: 'absolute', bottom: '5%', right: '8%', width: 220, height: 220, background: 'radial-gradient(circle, rgba(100,50,200,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(244,7,86,0.12)', border: '1px solid rgba(244,7,86,0.3)', borderRadius: 20, padding: '5px 16px', marginBottom: 20 }}>
            <div style={{ width: 6, height: 6, background: '#F40756', borderRadius: '50%', animation: 'pulse 1.5s infinite' }} />
            <span style={{ color: '#F40756', fontSize: 11, fontWeight: 800, letterSpacing: 2 }}>UNIVERSITY CALENDAR</span>
          </div>
          <h1 className="hero-title" style={{ color: '#fff', fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.1, marginBottom: 16 }}>
            Upcoming{' '}
            <span style={{ background: 'linear-gradient(135deg, #F40756, #ff6b9d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Events</span>
          </h1>
          <p className="hero-desc" style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 520, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Stay connected with campus life — discover talks, workshops, competitions, and everything happening at university.
          </p>

          <div className="hero-stats" style={{ gap: 0, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px 28px' }}>
            {[
              { num: events.length, label: 'Total Events' },
              { num: filteredEvents.length, label: fullMonths[activeMonth] },
              { num: new Date().getFullYear(), label: 'Academic Year' },
            ].map((s, i) => (
              <React.Fragment key={i}>
                {i > 0 && (
                  <>
                    <div className="hero-stats-divider-h" style={{ width: 1, background: 'rgba(255,255,255,0.1)', alignSelf: 'stretch' }} />
                    <div className="hero-stats-divider-v" style={{ display: 'none' }} />
                  </>
                )}
                <div style={{ padding: '8px 20px', textAlign: 'center' }}>
                  <div className="stat-num" style={{ color: '#fff', fontSize: 22, fontWeight: 900 }}>{s.num}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, letterSpacing: 0.5, marginTop: 2 }}>{s.label}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ── MONTH FILTER ── */}
      <div className="month-pad" style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '1rem 2rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="month-strip">
            {months.map((m, i) => (
              <button key={m} onClick={() => setActiveMonth(i)} className="month-btn" style={{ padding: '7px 18px', borderRadius: 20, border: 'none', background: activeMonth === i ? 'linear-gradient(135deg, #F40756, #ff6b9d)' : 'rgba(255,255,255,0.07)', color: activeMonth === i ? '#fff' : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 12, fontWeight: 700, letterSpacing: 0.5, whiteSpace: 'nowrap', boxShadow: activeMonth === i ? '0 4px 15px rgba(244,7,86,0.35)' : 'none', flexShrink: 0 }}>{m}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <main className="main-pad" style={{ maxWidth: 1280, margin: '0 auto', padding: '2.5rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 8 }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>
              <span style={{ background: 'linear-gradient(135deg, #F40756, #ff6b9d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{fullMonths[activeMonth]}</span>{' '}Events
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginTop: 4 }}>
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '6rem 2rem', color: 'rgba(255,255,255,0.3)' }}>
            <div style={{ width: 44, height: 44, border: '3px solid rgba(244,7,86,0.2)', borderTopColor: '#F40756', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontSize: 14, letterSpacing: 0.5 }}>Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20 }}>
            <div style={{ fontSize: 56, marginBottom: 20, opacity: 0.4 }}>📅</div>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginBottom: 8 }}>No events in {fullMonths[activeMonth]}</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>Try a different month to find upcoming events</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredEvents.map((e, idx) => (
              <Link key={e.id} href={`/articles/${e.slug}`} className="event-card fade-in" style={{ display: 'block', overflow: 'hidden', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.2)', animationDelay: `${idx * 0.05}s`, animationFillMode: 'both' }}>
                <div className="card-inner">
                  <div className="card-date-box date-box" style={{ background: 'linear-gradient(135deg, #F40756, #ff6b9d)', boxShadow: '4px 0 20px rgba(244,7,86,0.2)' }}>
                    <div className="card-date-num" style={{ color: '#fff', fontWeight: 900, lineHeight: 1, letterSpacing: -1 }}>
                      {e.published_at ? new Date(e.published_at).getDate() : '?'}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>
                      {e.published_at ? months[new Date(e.published_at).getMonth()].toUpperCase() : ''}
                    </div>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 2 }}>
                      {e.published_at ? new Date(e.published_at).getFullYear() : ''}
                    </div>
                  </div>

                  <div className="card-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                      <span style={{ background: 'rgba(244,7,86,0.15)', border: '1px solid rgba(244,7,86,0.3)', color: '#F40756', fontSize: 9, padding: '2px 10px', borderRadius: 20, fontWeight: 800, letterSpacing: 1, whiteSpace: 'nowrap' }}>EVENT</span>
                      {e.published_at && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{formatDate(e.published_at)}</span>}
                    </div>
                    <h3 className="card-title" style={{ color: 'rgba(255,255,255,0.92)', fontWeight: 700, lineHeight: 1.4, margin: '0 0 8px' }}>{e.title}</h3>
                    <p className="card-excerpt" style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.65, marginBottom: 12 }}>{e.excerpt?.slice(0, 130)}...</p>
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                      {e.view_count !== undefined && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>👁 {e.view_count} views</span>}
                      <span className="arrow-link" style={{ color: '#F40756', fontSize: 13, fontWeight: 700 }}>View Details →</span>
                    </div>
                  </div>

                  {e.cover_image && (
                    <div className="card-thumb">
                      <img src={e.cover_image} alt={e.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                        onMouseEnter={ev => ev.target.style.transform = 'scale(1.08)'}
                        onMouseLeave={ev => ev.target.style.transform = 'scale(1)'} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(13,13,26,0.2), transparent)' }} />
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer className="footer-pad" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '2.5rem 2rem', marginTop: '3rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="footer-inner">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #F40756, #ff6b9d)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 14, boxShadow: '0 0 15px rgba(244,7,86,0.3)', flexShrink: 0 }}>U</div>
              <div>
                <div style={{ color: '#fff', fontSize: 13, fontWeight: 800 }}>University News Platform</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>INNOVATE • INSPIRE • IMPACT</div>
              </div>
            </div>
            <div className="footer-links">
              {['Home', 'Faculties', 'Spotlight', 'Events', 'About'].map(n => (
                <Link key={n} href="/" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 500 }}>{n}</Link>
              ))}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>© {new Date().getFullYear()} University News</p>
          </div>
        </div>
      </footer>
    </div>
  )
}