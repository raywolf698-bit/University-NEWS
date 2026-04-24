"use client"
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import useAuthRedirect from '@/utils/useAuthRedirect'

export default function HomePage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({})
  const [activeType, setActiveType] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, authChecked } = useAuthRedirect()

  useEffect(() => {
    if (authChecked) fetchArticles()
  }, [page, activeType, authChecked])

  // Close menu on resize to desktop
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setMenuOpen(false) }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const fetchArticles = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ status: 'published', limit: 50 })
      if (search) params.append('search', search)
      if (activeType) params.append('article_type', activeType)
      params.append('page', page)
      const res = await fetch(`/api/articles?${params}`)
      const data = await res.json()
      setArticles(data.data || [])
      setPagination(data.pagination || {})
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchArticles()
  }

  const formatDate = (d) => {
    if (!d) return ''
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const categoryColor = (type) => {
    const map = {
      news: '#F40756', announcement: '#F40756',
      campus_update: '#00c47a', event: '#ff9500', research: '#29abe2',
    }
    return map[type] || '#F40756'
  }

  const categoryLabel = (type) => {
    const map = {
      news: 'NEWS', announcement: 'ANNOUNCEMENT',
      campus_update: 'CAMPUS', event: 'EVENTS', research: 'RESEARCH',
    }
    return map[type] || type?.toUpperCase()
  }

  const faculties = [
    { name: 'Business Administration', icon: '💼', slug: 'business-administration' },
    { name: 'Engineering', icon: '⚙️', slug: 'engineering' },
    { name: 'Digital Innovation', icon: '💡', slug: 'digital-innovation' },
    { name: 'Medicine', icon: '🏥', slug: 'medicine' },
    { name: 'Liberal Arts', icon: '📚', slug: 'liberal-arts' },
    { name: 'Communication Arts', icon: '🎬', slug: 'communication-arts' },
    { name: 'Science & Technology', icon: '🔬', slug: 'science-technology' },
  ]

  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const featured = articles[0]
  const latest = articles.slice(1, 5)
  const grid = articles.slice(1)

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

        .card-bounce { transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s, border-color 0.2s; }
        .card-bounce:hover { transform: translateY(-4px) scale(1.01); }

        .btn-bounce { transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s; }
        .btn-bounce:hover { transform: translateY(-2px) scale(1.04); box-shadow: 0 8px 30px rgba(244,7,86,0.5) !important; }
        .btn-bounce:active { transform: scale(0.96); }

        .faculty-item { transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); }
        .faculty-item:hover { background: rgba(244,7,86,0.15) !important; border-color: rgba(244,7,86,0.4) !important; transform: translateX(4px); }

        .hero-card { transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1); }
        .hero-card:hover { transform: scale(1.005); }

        .filter-btn { transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); }
        .filter-btn:hover { transform: scale(1.05); }

        .page-btn { transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); }
        .page-btn:hover { transform: scale(1.05); }

        .mobile-menu { display: none; }

        input::placeholder { color: rgba(255,255,255,0.3); }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        ::-webkit-scrollbar-thumb { background: rgba(244,7,86,0.4); border-radius: 3px; }

        @keyframes pulse { 0%,100% { opacity:1; transform: scale(1); } 50% { opacity:0.5; transform: scale(1.3); } }
        @keyframes fadeInUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .fade-in { animation: fadeInUp 0.5s ease forwards; }

        /* ── RESPONSIVE ── */

        /* Desktop nav hidden on mobile */
        .desktop-nav { display: flex; }
        .desktop-search { display: flex; }
        .desktop-auth { display: flex; }
        .hamburger { display: none; }

        /* Hero + Sidebar grid */
        .hero-grid { display: grid; grid-template-columns: 1fr 320px; gap: 1.5rem; }

        /* News 4-col grid */
        .news-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }

        /* Hall of fame flex */
        .hof-inner { display: flex; gap: 2rem; align-items: center; }
        .hof-cards { display: flex; gap: 1rem; flex: 1; overflow-x: auto; }

        /* Footer */
        .footer-inner { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
        .footer-links { display: flex; gap: 1.5rem; }

        /* Tablet — ≤1024px */
        @media (max-width: 1024px) {
          .hero-grid { grid-template-columns: 1fr 280px; }
          .news-grid { grid-template-columns: repeat(2, 1fr); }
        }

        /* Mobile — ≤768px */
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .desktop-search { display: none !important; }
          .desktop-auth { display: none !important; }
          .hamburger { display: flex !important; }

          .mobile-menu { display: block; }

          .hero-grid { grid-template-columns: 1fr; }
          .news-grid { grid-template-columns: repeat(2, 1fr); }

          .hof-inner { flex-direction: column; align-items: flex-start; }
          .hof-cards { width: 100%; }

          .footer-inner { flex-direction: column; align-items: flex-start; }
          .footer-links { flex-wrap: wrap; gap: 1rem; }

          .main-pad { padding: 1rem !important; }
          .header-pad { padding: 0 1rem !important; }
        }

        /* Small mobile — ≤480px */
        @media (max-width: 480px) {
          .news-grid { grid-template-columns: 1fr; }
          .filter-scroll { overflow-x: auto; padding-bottom: 4px; flex-wrap: nowrap !important; }
          .filter-scroll::-webkit-scrollbar { height: 3px; }
        }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{ background: 'rgba(13,13,26,0.95)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(244,7,86,0.15)' }}>
        <div className="header-pad" style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', height: 64 }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{
              width: 40, height: 40,
              background: 'linear-gradient(135deg, #F40756, #ff6b9d)',
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 18, fontWeight: 900, color: '#fff',
              boxShadow: '0 0 20px rgba(244,7,86,0.4)', flexShrink: 0
            }}>U</div>
            <div>
              <div style={{ color: '#fff', fontSize: 13, fontWeight: 800, lineHeight: 1.1, letterSpacing: 1 }}>UNIVERSITY</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9, letterSpacing: 2 }}>NEWS PLATFORM</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="desktop-nav" style={{ gap: '1.5rem', flex: 1 }}>
            {[['Home', '/'], ['Faculties', '/faculties'], ['Spotlight', '/spotlight'], ['Events', '/events'], ['About', '/about']].map(([n, h]) => (
              <Link key={n} href={h} className="nav-link" style={{
                color: n === 'Home' ? '#F40756' : 'rgba(255,255,255,0.6)',
                fontSize: 13, fontWeight: 600,
                borderBottom: n === 'Home' ? '2px solid #F40756' : '2px solid transparent',
                paddingBottom: 4, letterSpacing: 0.3, whiteSpace: 'nowrap'
              }}>{n}</Link>
            ))}
          </nav>

          {/* Desktop Search */}
          <form className="desktop-search" onSubmit={handleSearch} style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, alignItems: 'center', padding: '6px 14px', gap: 8 }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search news..."
              style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 13, width: 160 }}
            />
            <button type="submit" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 14, display: 'flex' }}>🔍</button>
          </form>

          {/* Desktop Auth */}
          <div className="desktop-auth" style={{ alignItems: 'center', gap: 10, flexShrink: 0 }}>
            {user ? (
              <>
                <Link href="/profile" style={{ color: '#F40756', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>Dashboard</Link>
                {user.role === 'admin' && (
                  <Link href="/admin/articles" style={{ color: '#fff', fontSize: 12, fontWeight: 700, background: 'linear-gradient(135deg, #F40756, #ff6b9d)', padding: '6px 14px', borderRadius: 6, whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(244,7,86,0.3)' }}>Admin</Link>
                )}
                <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {user.avatar_url
                    ? <img src={user.avatar_url} alt="" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '2px solid #F40756' }} />
                    : <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg, #F40756, #ff6b9d)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12 }}>{initials}</div>
                  }
                  <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{user.full_name?.split(' ')[0]}</span>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 500 }}>Login</Link>
                <Link href="/register" className="btn-bounce" style={{ background: 'linear-gradient(135deg, #F40756, #ff6b9d)', color: '#fff', padding: '7px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700, boxShadow: '0 4px 15px rgba(244,7,86,0.4)', display: 'inline-block' }}>Register</Link>
              </>
            )}
          </div>

          {/* Hamburger — mobile only */}
          <div style={{ flex: 1 }} className="desktop-nav" />
          <button
            className="hamburger"
            onClick={() => setMenuOpen(o => !o)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, display: 'flex', flexDirection: 'column', gap: 5, marginLeft: 'auto' }}
            aria-label="Menu"
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: 'block', width: 22, height: 2, background: menuOpen && i === 1 ? 'transparent' : '#fff',
                borderRadius: 2, transition: 'all 0.3s',
                transform: menuOpen ? (i === 0 ? 'rotate(45deg) translate(5px,5px)' : i === 2 ? 'rotate(-45deg) translate(5px,-5px)' : '') : '',
              }} />
            ))}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {menuOpen && (
          <div className="mobile-menu" style={{ background: 'rgba(13,13,26,0.98)', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '1rem' }}>
            {/* Mobile search */}
            <form onSubmit={(e) => { handleSearch(e); setMenuOpen(false) }} style={{ display: 'flex', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, alignItems: 'center', padding: '8px 14px', gap: 8, marginBottom: 12 }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search news, events..."
                style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 14, flex: 1 }}
              />
              <button type="submit" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 16 }}>🔍</button>
            </form>

            {/* Mobile nav links */}
            {[['Home', '/'], ['Faculties', '/faculties'], ['Spotlight', '/spotlight'], ['Events', '/events'], ['About', '/about']].map(([n, h]) => (
              <Link key={n} href={h} onClick={() => setMenuOpen(false)} style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: 15, fontWeight: 600, padding: '10px 4px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{n}</Link>
            ))}

            {/* Mobile auth */}
            <div style={{ marginTop: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
              {user ? (
                <>
                  <Link href="/profile" onClick={() => setMenuOpen(false)} style={{ color: '#F40756', fontSize: 14, fontWeight: 700 }}>Dashboard</Link>
                  {user.role === 'admin' && (
                    <Link href="/admin/articles" onClick={() => setMenuOpen(false)} style={{ color: '#fff', fontSize: 13, fontWeight: 700, background: 'linear-gradient(135deg, #F40756, #ff6b9d)', padding: '7px 16px', borderRadius: 6 }}>Admin</Link>
                  )}
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMenuOpen(false)} style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: 500 }}>Login</Link>
                  <Link href="/register" onClick={() => setMenuOpen(false)} style={{ background: 'linear-gradient(135deg, #F40756, #ff6b9d)', color: '#fff', padding: '8px 20px', borderRadius: 8, fontSize: 14, fontWeight: 700 }}>Register</Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="main-pad" style={{ maxWidth: 1280, margin: '0 auto', padding: '1.5rem 2rem' }}>

        {/* FILTER TABS */}
        <div className="filter-scroll" style={{ display: 'flex', gap: 8, marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {[['All', ''], ['News', 'news'], ['Events', 'event'], ['Research', 'research'], ['Campus', 'campus_update'], ['Announcement', 'announcement']].map(([label, val]) => (
            <button key={val} className="filter-btn" onClick={() => { setActiveType(val); setPage(1) }} style={{
              padding: '7px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', flexShrink: 0,
              background: activeType === val ? 'linear-gradient(135deg, #F40756, #ff6b9d)' : 'rgba(255,255,255,0.07)',
              color: activeType === val ? '#fff' : 'rgba(255,255,255,0.5)',
              fontSize: 12, fontWeight: 700, letterSpacing: 0.5,
              boxShadow: activeType === val ? '0 4px 15px rgba(244,7,86,0.35)' : 'none',
            }}>{label}</button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: 'rgba(255,255,255,0.3)', fontSize: 16 }}>
            <div style={{ width: 40, height: 40, border: '3px solid rgba(244,7,86,0.2)', borderTopColor: '#F40756', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
            Loading...
          </div>
        ) : (
          <>
            {/* ── HERO + SIDEBAR ── */}
            <div className="hero-grid" style={{ marginBottom: '2rem' }}>

              {/* HERO */}
              {featured && (
                <Link href={`/articles/${featured.slug}`} className="hero-card" style={{
                  borderRadius: 16, overflow: 'hidden', display: 'block',
                  position: 'relative', minHeight: 360,
                  border: '1px solid rgba(255,255,255,0.06)'
                }}>
                  {featured.cover_image ? (
                    <img src={featured.cover_image} alt={featured.title}
                      style={{ width: '100%', height: 380, objectFit: 'cover' }} />
                  ) : (
                    <div style={{ height: 380, background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1a4e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80 }}>📰</div>
                  )}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.95))', padding: '4rem 1.5rem 1.5rem' }}>
                    <span style={{ background: 'linear-gradient(135deg, #F40756, #ff6b9d)', color: '#fff', fontSize: 10, padding: '3px 12px', borderRadius: 20, fontWeight: 800, letterSpacing: 1, boxShadow: '0 4px 12px rgba(244,7,86,0.4)', display: 'inline-block', marginBottom: 10 }}>INNOVATE • INSPIRE • IMPACT</span>
                    <h2 style={{ color: '#fff', fontSize: 'clamp(18px, 3vw, 28px)', fontWeight: 900, lineHeight: 1.2, marginBottom: 10 }}>
                      {featured.title}
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
                      {featured.excerpt?.slice(0, 120)}...
                    </p>
                    <button className="btn-bounce" style={{ background: 'linear-gradient(135deg, #F40756, #ff6b9d)', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontWeight: 800, fontSize: 13, boxShadow: '0 4px 20px rgba(244,7,86,0.4)' }}>Read More →</button>
                  </div>
                </Link>
              )}

              {/* SIDEBAR */}
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ color: '#fff', fontWeight: 800, fontSize: 14, letterSpacing: 0.5 }}>Latest News</span>
                  <Link href="/" style={{ color: '#F40756', fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>View All →</Link>
                </div>
                {latest.map((a, i) => (
                  <Link key={a.id} href={`/articles/${a.slug}`} className="card-bounce" style={{ display: 'flex', gap: 10, padding: '12px', borderBottom: i < latest.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <div style={{ width: 68, height: 52, background: 'rgba(255,255,255,0.05)', borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                      {a.cover_image
                        ? <img src={a.cover_image} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📰</div>
                      }
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ color: categoryColor(a.article_type), fontSize: 9, fontWeight: 800, letterSpacing: 1 }}>{categoryLabel(a.article_type)}</span>
                      <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: 600, lineHeight: 1.4, margin: '3px 0 4px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {a.title}
                      </p>
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>📅 {formatDate(a.published_at)}</span>
                    </div>
                  </Link>
                ))}

                {/* Explore by Faculty */}
                <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ fontWeight: 800, fontSize: 13, color: '#fff', letterSpacing: 0.5 }}>Explore by Faculty</span>
                    <Link href="/faculties" style={{ color: '#F40756', fontSize: 11, fontWeight: 700 }}>View All →</Link>
                  </div>
                  {faculties.map(f => (
                    <Link key={f.name} href={`/faculties/${f.slug}`} className="faculty-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 8, marginBottom: 4, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 14 }}>{f.icon}</span>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{f.name}</span>
                      </div>
                      <span style={{ color: '#F40756', fontSize: 14 }}>›</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* ── LATEST NEWS GRID ── */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: 'clamp(18px, 3vw, 22px)', fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>
                  Latest <span style={{ background: 'linear-gradient(135deg, #F40756, #ff6b9d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>News</span>
                </h2>
                <Link href="/" style={{ color: '#F40756', fontSize: 12, fontWeight: 700, letterSpacing: 0.5 }}>View All →</Link>
              </div>
              <div className="news-grid">
                {grid.slice(0, 4).map(a => (
                  <Link key={a.id} href={`/articles/${a.slug}`} className="card-bounce" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden', display: 'block' }}>
                    <div style={{ height: 160, background: 'rgba(255,255,255,0.03)', overflow: 'hidden', position: 'relative' }}>
                      {a.cover_image
                        ? <img src={a.cover_image} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1a1a2e, #2d1a4e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>📰</div>
                      }
                      <div style={{ position: 'absolute', top: 8, left: 8 }}>
                        <span style={{ background: categoryColor(a.article_type), color: '#fff', fontSize: 9, padding: '2px 8px', borderRadius: 20, fontWeight: 800, letterSpacing: 0.5 }}>{categoryLabel(a.article_type)}</span>
                      </div>
                    </div>
                    <div style={{ padding: '12px' }}>
                      <h3 style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 700, lineHeight: 1.5, margin: '0 0 8px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {a.title}
                      </h3>
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>📅 {formatDate(a.published_at)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* ── HALL OF FAME ── */}
            <div style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #2d1a4e 50%, #1a1a3e 100%)', border: '1px solid rgba(244,7,86,0.2)', borderRadius: 16, padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 0 40px rgba(244,7,86,0.08)' }}>
              <div className="hof-inner">
                <div style={{ flex: '0 0 auto', minWidth: 180, maxWidth: 220 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(244,7,86,0.15)', border: '1px solid rgba(244,7,86,0.3)', color: '#F40756', fontSize: 10, fontWeight: 800, padding: '3px 12px', borderRadius: 20, letterSpacing: 1, marginBottom: 12 }}>HALL OF FAME</div>
                  <h3 style={{ color: '#fff', fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 900, lineHeight: 1.2, marginBottom: 10 }}>
                    Celebrating<br />Excellence
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.7, marginBottom: 20 }}>
                    Honoring the achievements of our people who make a difference.
                  </p>
                  <Link href="/spotlight" className="btn-bounce" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #F40756, #ff6b9d)', color: '#fff', padding: '10px 24px', borderRadius: 8, fontSize: 13, fontWeight: 700, boxShadow: '0 4px 20px rgba(244,7,86,0.4)' }}>View More →</Link>
                </div>
                <div className="hof-cards">
                  {[
                    { name: 'Achievement Award', title: '1st Place, Innovation Challenge 2025', emoji: '🏆' },
                    { name: 'Research Excellence', title: 'Outstanding Research in AI Technology', emoji: '🔬' },
                    { name: 'Sports Achievement', title: 'National Athlete Award 2025', emoji: '🏅' },
                  ].map((p, i) => (
                    <Link key={i} href="/spotlight" className="card-bounce" style={{ display: 'block', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: '1.25rem', minWidth: 150, flex: '1 1 150px', textAlign: 'center' }}>
                      <div style={{ fontSize: 36, marginBottom: 10 }}>{p.emoji}</div>
                      <div style={{ color: '#fff', fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{p.name}</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, lineHeight: 1.5 }}>{p.title}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* ── PAGINATION ── */}
            {pagination.totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: '1.5rem' }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="page-btn" style={{ padding: '9px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: page === 1 ? 'rgba(255,255,255,0.03)' : 'linear-gradient(135deg, #F40756, #ff6b9d)', color: page === 1 ? 'rgba(255,255,255,0.2)' : '#fff', cursor: page === 1 ? 'default' : 'pointer', fontWeight: 700, fontSize: 13 }}>← Prev</button>
                <span style={{ padding: '9px 18px', fontSize: 13, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.04)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>{page} / {pagination.totalPages}</span>
                <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages} className="page-btn" style={{ padding: '9px 20px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: page === pagination.totalPages ? 'rgba(255,255,255,0.03)' : 'linear-gradient(135deg, #F40756, #ff6b9d)', color: page === pagination.totalPages ? 'rgba(255,255,255,0.2)' : '#fff', cursor: page === pagination.totalPages ? 'default' : 'pointer', fontWeight: 700, fontSize: 13 }}>Next →</button>
              </div>
            )}
          </>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '2rem', marginTop: '3rem' }}>
        <div className="footer-inner" style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg, #F40756, #ff6b9d)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 14, flexShrink: 0 }}>U</div>
            <div>
              <div style={{ color: '#fff', fontSize: 13, fontWeight: 800 }}>University News Platform</div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>INNOVATE • INSPIRE • IMPACT</div>
            </div>
          </div>
          <div className="footer-links">
            {[['Home', '/'], ['Faculties', '/faculties'], ['Spotlight', '/spotlight'], ['Events', '/events'], ['About', '/about']].map(([n, h]) => (
              <Link key={n} href={h} style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 500 }}>{n}</Link>
            ))}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>© {new Date().getFullYear()} University News</p>
        </div>
      </footer>
    </div>
  )
}