"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import useAuthRedirect from '@/utils/useAuthRedirect'

export default function EventsPage() {
  const { user, authChecked } = useAuthRedirect()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeMonth, setActiveMonth] = useState(new Date().getMonth())
  const [hoveredCard, setHoveredCard] = useState(null)

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
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }

        .nav-link { transition: color 0.2s, border-color 0.2s; }
        .nav-link:hover { color: #F40756 !important; }

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
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .fade-in { animation: fadeInUp 0.5s ease forwards; }

        .stat-card { transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), border-color 0.2s; }
        .stat-card:hover { transform: translateY(-3px); border-color: rgba(244,7,86,0.3) !important; }

        input::placeholder { color: rgba(255,255,255,0.3); }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        ::-webkit-scrollbar-thumb { background: rgba(244,7,86,0.4); border-radius: 3px; }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{ background: 'rgba(13,13,26,0.95)', backdropFilter: 'blur(20px)', padding: '0 2rem', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(244,7,86,0.15)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', gap: '2rem', height: 64 }}>
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

          <nav style={{ display: 'flex', gap: '1.5rem', flex: 1 }}>
            {[['Home', '/'], ['Faculties', '/faculties'], ['Spotlight', '/spotlight'], ['Events', '/events'], ['About', '/about']].map(([n, h]) => (
              <Link key={n} href={h} className="nav-link" style={{
                color: n === 'Events' ? '#F40756' : 'rgba(255,255,255,0.6)',
                fontSize: 13, fontWeight: 600,
                borderBottom: n === 'Events' ? '2px solid #F40756' : '2px solid transparent',
                paddingBottom: 4, letterSpacing: 0.3
              }}>{n}</Link>
            ))}
          </nav>

          {user ? (
            <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              {user.avatar_url
                ? <img src={user.avatar_url} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #F40756', boxShadow: '0 0 10px rgba(244,7,86,0.3)' }} />
                : <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #F40756, #ff6b9d)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, boxShadow: '0 0 10px rgba(244,7,86,0.3)' }}>
                  {initials}
                </div>
              }
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{user.full_name?.split(' ')[0]}</span>
            </Link>
          ) : (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
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
      </header>

      {/* ── HERO ── */}
      <div style={{ position: 'relative', overflow: 'hidden', padding: '5rem 2rem 4rem', textAlign: 'center', background: 'linear-gradient(180deg, #0d0d1a 0%, #130d2a 50%, #0d0d1a 100%)' }}>
        {/* floating orbs */}
        <div className="hero-orb" style={{ position: 'absolute', top: '10%', left: '8%', width: 280, height: 280, background: 'radial-gradient(circle, rgba(244,7,86,0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div className="hero-orb-2" style={{ position: 'absolute', bottom: '5%', right: '8%', width: 220, height: 220, background: 'radial-gradient(circle, rgba(100,50,200,0.1) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '30%', right: '20%', width: 140, height: 140, background: 'radial-gradient(circle, rgba(244,7,86,0.07) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(244,7,86,0.12)', border: '1px solid rgba(244,7,86,0.3)', borderRadius: 20, padding: '5px 16px', marginBottom: 20 }}>
            <div style={{ width: 6, height: 6, background: '#F40756', borderRadius: '50%', animation: 'pulse 1.5s infinite' }} />
            <span style={{ color: '#F40756', fontSize: 11, fontWeight: 800, letterSpacing: 2 }}>UNIVERSITY CALENDAR</span>
          </div>
          <h1 style={{ color: '#fff', fontSize: 52, fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.1, marginBottom: 16 }}>
            Upcoming{' '}
            <span style={{ background: 'linear-gradient(135deg, #F40756, #ff6b9d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Events</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 17, maxWidth: 520, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
            Stay connected with campus life — discover talks, workshops, competitions, and everything happening at university.
          </p>

          {/* Stats row */}
          <div style={{ display: 'inline-flex', gap: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px 28px' }}>
            {[
              { num: events.length, label: 'Total Events' },
              { num: filteredEvents.length, label: fullMonths[activeMonth] },
              { num: new Date().getFullYear(), label: 'Academic Year' },
            ].map((s, i) => (
              <React.Fragment key={i}>
                {i > 0 && <div style={{ width: 1, background: 'rgba(255,255,255,0.1)', alignSelf: 'stretch' }} />}
                <div style={{ padding: '0 16px', textAlign: 'center' }}>
                  <div style={{ color: '#fff', fontSize: 22, fontWeight: 900 }}>{s.num}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, letterSpacing: 0.5, marginTop: 2 }}>{s.label}</div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ── MONTH FILTER ── */}
      <div style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '1rem 2rem', overflowX: 'auto' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', gap: 8 }}>
          {months.map((m, i) => (
            <button key={m} onClick={() => setActiveMonth(i)} className="month-btn" style={{
              padding: '7px 18px', borderRadius: 20, border: 'none',
              background: activeMonth === i ? 'linear-gradient(135deg, #F40756, #ff6b9d)' : 'rgba(255,255,255,0.07)',
              color: activeMonth === i ? '#fff' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer', fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
              whiteSpace: 'nowrap',
              boxShadow: activeMonth === i ? '0 4px 15px rgba(244,7,86,0.35)' : 'none',
            }}>{m}</button>
          ))}
        </div>
      </div>

      {/* ── MAIN ── */}
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '2.5rem 2rem' }}>

        {/* Section header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>
              <span style={{ background: 'linear-gradient(135deg, #F40756, #ff6b9d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{fullMonths[activeMonth]}</span>
              {' '}Events
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginTop: 4 }}>
              {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '6rem', color: 'rgba(255,255,255,0.3)' }}>
            <div style={{ width: 44, height: 44, border: '3px solid rgba(244,7,86,0.2)', borderTopColor: '#F40756', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontSize: 14, letterSpacing: 0.5 }}>Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20 }}>
            <div style={{ fontSize: 64, marginBottom: 20, opacity: 0.4 }}>📅</div>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginBottom: 8 }}>No events in {fullMonths[activeMonth]}</p>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.2)' }}>Try a different month to find upcoming events</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredEvents.map((e, idx) => (
              <Link
                key={e.id}
                href={`/articles/${e.slug}`}
                className="event-card fade-in"
                style={{
                  display: 'flex', gap: 0, overflow: 'hidden',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 16,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  animationDelay: `${idx * 0.05}s`,
                  animationFillMode: 'both',
                }}
              >
                {/* DATE BOX */}
                <div className="date-box" style={{
                  background: 'linear-gradient(135deg, #F40756, #ff6b9d)',
                  padding: '0 1.5rem',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  minWidth: 90, flexShrink: 0,
                  boxShadow: '4px 0 20px rgba(244,7,86,0.2)'
                }}>
                  <div style={{ color: '#fff', fontSize: 34, fontWeight: 900, lineHeight: 1, letterSpacing: -1 }}>
                    {e.published_at ? new Date(e.published_at).getDate() : '?'}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: 700, letterSpacing: 1 }}>
                    {e.published_at ? months[new Date(e.published_at).getMonth()].toUpperCase() : ''}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 2 }}>
                    {e.published_at ? new Date(e.published_at).getFullYear() : ''}
                  </div>
                </div>

                {/* EVENT INFO */}
                <div style={{ padding: '1.5rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{
                      background: 'rgba(244,7,86,0.15)', border: '1px solid rgba(244,7,86,0.3)',
                      color: '#F40756', fontSize: 9, padding: '2px 10px',
                      borderRadius: 20, fontWeight: 800, letterSpacing: 1
                    }}>EVENT</span>
                    {e.published_at && (
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>
                        {formatDate(e.published_at)}
                      </span>
                    )}
                  </div>
                  <h3 style={{ color: 'rgba(255,255,255,0.92)', fontSize: 17, fontWeight: 700, lineHeight: 1.4, margin: '0 0 8px' }}>
                    {e.title}
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, lineHeight: 1.65, marginBottom: 12 }}>
                    {e.excerpt?.slice(0, 130)}...
                  </p>
                  <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                    {e.view_count !== undefined && (
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                        👁 {e.view_count} views
                      </span>
                    )}
                    <span className="arrow-link" style={{ color: '#F40756', fontSize: 13, fontWeight: 700 }}>
                      View Details →
                    </span>
                  </div>
                </div>

                {/* THUMBNAIL */}
                {e.cover_image && (
                  <div style={{ width: 160, flexShrink: 0, overflow: 'hidden', position: 'relative' }}>
                    <img
                      src={e.cover_image}
                      alt={e.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                      onMouseEnter={e => e.target.style.transform = 'scale(1.08)'}
                      onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(13,13,26,0.2), transparent)' }} />
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '2.5rem 2rem', marginTop: '3rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #F40756, #ff6b9d)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 14, boxShadow: '0 0 15px rgba(244,7,86,0.3)' }}>U</div>
            <div>
              <div style={{ color: '#fff', fontSize: 13, fontWeight: 800 }}>University News Platform</div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>INNOVATE • INSPIRE • IMPACT</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Home', 'Faculties', 'Spotlight', 'Events', 'About'].map(n => (
              <Link key={n} href="/" style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 500 }}>{n}</Link>
            ))}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>© {new Date().getFullYear()} University News</p>
        </div>
      </footer>
    </div>
  )
}