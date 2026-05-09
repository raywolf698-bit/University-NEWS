"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import useAuthRedirect from '@/utils/useAuthRedirect'

export default function SpotlightPage() {
  const { user, authChecked } = useAuthRedirect()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!authChecked) return
    fetch('/api/articles?status=published&limit=20')
      .then(r => r.json())
      .then(d => setArticles(d.data || []))
      .finally(() => setLoading(false))
  }, [authChecked])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) window.location.href = `/?search=${encodeURIComponent(search)}`
  }

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''
  const categoryColor = (type) => ({ news: '#F40756', research: '#29abe2', campus_update: '#00c47a', event: '#ff9500' })[type] || '#F40756'

  if (!authChecked) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0d0d1a', color: '#fff', fontFamily: 'sans-serif', fontSize: 16, gap: 12 }}>
      <div style={{ width: 8, height: 8, background: '#F40756', borderRadius: '50%', animation: 'pulse 1s infinite' }} />
      Loading...
    </div>
  )

  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div style={{ fontFamily: "'Inter', 'Sarabun', sans-serif", background: '#0d0d1a', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Sarabun:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }

        .nav-link { transition: color 0.2s, border-color 0.2s; }
        .nav-link:hover { color: #F40756 !important; }

        .card-bounce { transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s cubic-bezier(0.34,1.56,0.64,1), border-color 0.2s; }
        .card-bounce:hover { transform: translateY(-6px) scale(1.01); box-shadow: 0 20px 40px rgba(0,0,0,0.3) !important; border-color: rgba(244,7,86,0.3) !important; }

        .btn-bounce { transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s; }
        .btn-bounce:hover { transform: translateY(-2px) scale(1.04); box-shadow: 0 8px 30px rgba(244,7,86,0.5) !important; }
        .btn-bounce:active { transform: scale(0.96); }

        .hall-card { transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), background 0.2s, box-shadow 0.3s; }
        .hall-card:hover { transform: translateY(-4px) scale(1.03); background: rgba(244,7,86,0.1) !important; box-shadow: 0 12px 32px rgba(244,7,86,0.15) !important; }

        .faculty-item { transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); }
        .faculty-item:hover { background: rgba(244,7,86,0.15) !important; border-color: rgba(244,7,86,0.4) !important; transform: translateX(4px); }

        .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 4px; background: none; border: none; }
        .hamburger span { display: block; width: 22px; height: 2px; background: rgba(255,255,255,0.8); border-radius: 2px; transition: all 0.3s; }
        .mobile-menu { display: none; }
        .search-form input:focus { outline: none; }
        .search-form { border: 1px solid rgba(255,255,255,0.1) !important; transition: border-color 0.2s, box-shadow 0.2s; }
        .search-form:focus-within { border-color: rgba(244,7,86,0.5) !important; box-shadow: 0 0 0 3px rgba(244,7,86,0.1) !important; }
        input::placeholder { color: rgba(255,255,255,0.3); }

        .search-bar { display: flex !important; }
        .desktop-nav { display: flex !important; }
        .desktop-auth { display: flex !important; }
        .main-pad { padding: 2rem; }

        @keyframes pulse { 0%,100% { opacity:1; transform: scale(1); } 50% { opacity:0.5; transform: scale(1.3); } }
        @keyframes fadeInUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideDown { from { opacity:0; transform: translateY(-10px); } to { opacity:1; transform: translateY(0); } }
        @keyframes float1 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(30px,-30px); } }
        @keyframes float2 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-20px,20px); } }
        .fade-in { animation: fadeInUp 0.5s ease forwards; }

        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        ::-webkit-scrollbar-thumb { background: rgba(244,7,86,0.4); border-radius: 3px; }

        /* TABLET */
        @media (max-width: 1024px) {
          .search-bar { display: none !important; }
          .articles-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }

        /* MOBILE */
        @media (max-width: 767px) {
          .hamburger { display: flex !important; }
          .desktop-nav { display: none !important; }
          .desktop-auth { display: none !important; }
          .search-bar { display: none !important; }
          .mobile-menu { display: block; }
          .main-pad { padding: 1rem; }
          .header-inner { gap: 1rem !important; }
          .articles-grid { grid-template-columns: 1fr !important; }
          .hero-title { font-size: 30px !important; }
          .hall-cards { flex-wrap: wrap; }
        }

        /* SMALL MOBILE */
        @media (max-width: 480px) {
          .hero-title { font-size: 24px !important; }
          .articles-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* BG BLOBS */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '5%', left: '5%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(244,7,86,0.1) 0%, transparent 70%)', animation: 'float1 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(100,7,244,0.08) 0%, transparent 70%)', animation: 'float2 10s ease-in-out infinite' }} />
      </div>

      {/* ── HEADER (identical to HomePage) ── */}
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
                color: n === 'Spotlight' ? '#F40756' : 'rgba(255,255,255,0.6)',
                fontSize: 13, fontWeight: 600,
                borderBottom: n === 'Spotlight' ? '2px solid #F40756' : '2px solid transparent',
                paddingBottom: 4, letterSpacing: 0.3
              }}>{n}</Link>
            ))}
          </nav>

          {/* Search Bar */}
          <form
            className="search-bar search-form"
            onSubmit={handleSearch}
            style={{ display: 'flex', background: 'rgba(255,255,255,0.07)', borderRadius: 24, alignItems: 'center', padding: '6px 14px', gap: 8 }}
          >
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search news, events..."
              style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 13, width: 180 }}
            />
            <button
              type="submit"
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center' }}
            >🔍</button>
          </form>

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
            <form onSubmit={(e) => { handleSearch(e); setMenuOpen(false) }} style={{ display: 'flex', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, alignItems: 'center', padding: '8px 14px', gap: 8, marginBottom: 16 }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search news, events..."
                style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 14, flex: 1 }}
              />
              <button type="submit" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 16 }}>🔍</button>
            </form>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
              {[['Home', '/'], ['Faculties', '/faculties'], ['Spotlight', '/spotlight'], ['Events', '/events'], ['About', '/about']].map(([n, h]) => (
                <Link key={n} href={h} onClick={() => setMenuOpen(false)} style={{
                  color: n === 'Spotlight' ? '#F40756' : 'rgba(255,255,255,0.7)',
                  fontSize: 15, fontWeight: 600, padding: '10px 12px',
                  borderRadius: 8, background: n === 'Spotlight' ? 'rgba(244,7,86,0.08)' : 'transparent'
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
      <div className="main-pad" style={{ padding: '4rem 2rem', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(244,7,86,0.15)', border: '1px solid rgba(244,7,86,0.3)', color: '#F40756', fontSize: 10, fontWeight: 800, padding: '4px 16px', borderRadius: 20, letterSpacing: 2, marginBottom: 16 }}>
          ACHIEVEMENTS & AWARDS
        </div>
        <h1 className="hero-title" style={{ color: '#fff', fontSize: 48, fontWeight: 900, marginBottom: 16, letterSpacing: -1 }}>
          🏆 <span style={{ background: 'linear-gradient(135deg, #F40756, #ff6b9d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Spotlight</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
          Celebrating the outstanding achievements of our university community.
        </p>
      </div>

      {/* ── HALL OF FAME ── */}
      <div className="main-pad" style={{ padding: '0 2rem 3rem', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a0a2e 0%, #2d1a4e 50%, #1a1a3e 100%)',
            border: '1px solid rgba(244,7,86,0.2)',
            borderRadius: 16, padding: '1.5rem',
            boxShadow: '0 0 40px rgba(244,7,86,0.08)'
          }}>
            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: 8 }} className="hall-cards">
              {[
                { emoji: '🏆', title: 'Innovation Award', name: 'Engineering Team', year: '2026' },
                { emoji: '🔬', title: 'Research Excellence', name: 'Medical Faculty', year: '2026' },
                { emoji: '🏅', title: 'National Sports', name: 'Athletics Team', year: '2026' },
                { emoji: '🎨', title: 'Arts & Culture', name: 'Liberal Arts', year: '2026' },
              ].map((a, i) => (
                <div key={i} className="hall-card" style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 14, padding: '1.25rem',
                  minWidth: 180, textAlign: 'center', flex: '1 1 160px',
                  backdropFilter: 'blur(10px)',
                }}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>{a.emoji}</div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{a.title}</div>
                  <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11 }}>{a.name} · {a.year}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── ARTICLES GRID ── */}
      <main className="main-pad fade-in" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem 4rem', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>
            Achievement <span style={{ background: 'linear-gradient(135deg, #F40756, #ff6b9d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Stories</span>
          </h2>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: 'rgba(255,255,255,0.3)', fontSize: 16 }}>
            <div style={{ width: 40, height: 40, border: '3px solid rgba(244,7,86,0.2)', borderTopColor: '#F40756', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
            Loading...
          </div>
        ) : (
          <div className="articles-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {articles.map(a => (
              <Link key={a.id} href={`/articles/${a.slug}`} className="card-bounce" style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 14, overflow: 'hidden', display: 'block',
              }}>
                <div style={{ height: 160, background: 'rgba(255,255,255,0.03)', overflow: 'hidden', position: 'relative' }}>
                  {a.cover_image
                    ? <img src={a.cover_image} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1a1a2e, #2d1a4e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🏆</div>
                  }
                  <div style={{ position: 'absolute', top: 8, left: 8 }}>
                    <span style={{ background: categoryColor(a.article_type), color: '#fff', fontSize: 9, padding: '2px 8px', borderRadius: 20, fontWeight: 800, letterSpacing: 0.5 }}>
                      {a.article_type?.toUpperCase().replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div style={{ padding: '14px' }}>
                  <h3 style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 700, lineHeight: 1.5, margin: '0 0 8px' }}>
                    {a.title.length > 65 ? a.title.slice(0, 65) + '...' : a.title}
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, lineHeight: 1.6, marginBottom: 10 }}>
                    {a.excerpt?.slice(0, 80)}...
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>By {a.author_name}</span>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>📅 {formatDate(a.published_at)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* ── FOOTER (identical to HomePage) ── */}
      <footer style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '2.5rem 1.25rem', marginTop: '3rem', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #F40756, #ff6b9d)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 14, boxShadow: '0 0 15px rgba(244,7,86,0.3)' }}>U</div>
            <div>
              <div style={{ color: '#fff', fontSize: 13, fontWeight: 800 }}>University News Platform</div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>INNOVATE • INSPIRE • IMPACT</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
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