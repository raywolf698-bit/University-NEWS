"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import useAuthRedirect from '@/utils/useAuthRedirect'

export default function FacultyNewsPage() {
  const { slug } = useParams()
  const { user, authChecked } = useAuthRedirect()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState({})
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')

  const faculties = {
    'business-administration': { name: 'Business Administration', icon: '💼', color: '#F40756' },
    'engineering':             { name: 'Engineering',             icon: '⚙️', color: '#29abe2' },
    'digital-innovation':      { name: 'Digital Innovation',      icon: '💡', color: '#f7941d' },
    'medicine':                { name: 'Medicine',                icon: '🏥', color: '#00c47a' },
    'liberal-arts':            { name: 'Liberal Arts',            icon: '📚', color: '#9c27b0' },
    'communication-arts':      { name: 'Communication Arts',      icon: '🎬', color: '#ff5722' },
    'science-technology':      { name: 'Science & Technology',    icon: '🔬', color: '#00bcd4' },
    'law':                     { name: 'Law',                     icon: '⚖️', color: '#795548' },
    'architecture':            { name: 'Architecture',            icon: '🏛️', color: '#607d8b' },
    'education':               { name: 'Education',               icon: '🎓', color: '#F40756' },
  }

  const faculty = faculties[slug] || { name: slug, icon: '📰', color: '#F40756' }
  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  useEffect(() => {
    if (!authChecked) return
    fetchArticles()
  }, [authChecked, page, slug])

  const fetchArticles = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ status: 'published', category: slug, page, limit: 9 })
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
    if (search.trim()) window.location.href = `/?search=${encodeURIComponent(search)}`
  }

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''
  const categoryColor = (type) => ({ news: '#F40756', research: '#29abe2', campus_update: '#00c47a', event: '#f7941d' })[type] || '#F40756'
  const categoryLabel = (type) => ({ news: 'NEWS', announcement: 'ANNOUNCEMENT', campus_update: 'CAMPUS', event: 'EVENTS', research: 'RESEARCH' })[type] || type?.toUpperCase()

  if (!authChecked) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0d0d1a', color: '#fff', fontFamily: 'sans-serif', fontSize: 16, gap: 12 }}>
      <div style={{ width: 8, height: 8, background: '#F40756', borderRadius: '50%', animation: 'pulse 1s infinite' }} />
      Loading...
    </div>
  )

  return (
    <div style={{ fontFamily: "'Inter', 'Sarabun', sans-serif", background: '#0d0d1a', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Sarabun:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        button { font-family: inherit; }

        .nav-link { transition: color 0.2s, border-color 0.2s; }
        .nav-link:hover { color: #F40756 !important; }

        .card-bounce { transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s cubic-bezier(0.34,1.56,0.64,1), border-color 0.2s; }
        .card-bounce:hover { transform: translateY(-6px) scale(1.01); box-shadow: 0 20px 40px rgba(0,0,0,0.3) !important; border-color: rgba(244,7,86,0.3) !important; }

        .btn-bounce { transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s; }
        .btn-bounce:hover { transform: translateY(-2px) scale(1.04); box-shadow: 0 8px 30px rgba(244,7,86,0.5) !important; }
        .btn-bounce:active { transform: scale(0.96); }

        .page-btn { transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); }
        .page-btn:hover { transform: scale(1.05); }

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

        .articles-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; }
        .faculty-hero-inner { display: flex; align-items: center; gap: 2rem; }
        .faculty-icon-box { width: 80px; height: 80px; font-size: 40px; }
        .faculty-hero-title { font-size: 36px; }
        .main-pad { padding: 2rem 2rem 4rem; }

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
          .articles-grid { grid-template-columns: repeat(2, 1fr); }
        }

        /* MOBILE */
        @media (max-width: 767px) {
          .hamburger { display: flex !important; }
          .desktop-nav { display: none !important; }
          .desktop-auth { display: none !important; }
          .search-bar { display: none !important; }
          .mobile-menu { display: block; }
          .articles-grid { grid-template-columns: 1fr 1fr; gap: 0.75rem; }
          .faculty-hero-inner { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .faculty-icon-box { width: 60px; height: 60px; font-size: 30px; }
          .faculty-hero-title { font-size: 26px !important; }
          .main-pad { padding: 1rem 1rem 3rem; }
          .header-inner { gap: 1rem !important; }
        }

        /* SMALL MOBILE */
        @media (max-width: 480px) {
          .articles-grid { grid-template-columns: 1fr; }
          .faculty-hero-title { font-size: 22px !important; }
          .page-btn { padding: 8px 14px !important; font-size: 12px !important; }
        }
      `}</style>

      {/* BG BLOBS */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '5%', right: '5%', width: 400, height: 400, background: `radial-gradient(circle, ${faculty.color}18 0%, transparent 70%)`, animation: 'float1 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(100,7,244,0.08) 0%, transparent 70%)', animation: 'float2 10s ease-in-out infinite' }} />
      </div>

      {/* ── HEADER (identical to HomePage) ── */}
      <header style={{ background: 'rgba(13,13,26,0.95)', backdropFilter: 'blur(20px)', padding: '0 1.25rem', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(244,7,86,0.15)' }}>
        <div className="header-inner" style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', gap: '1.5rem', height: 64 }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{ width: 42, height: 42, background: 'linear-gradient(135deg, #F40756, #ff6b9d)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: '#fff', boxShadow: '0 0 20px rgba(244,7,86,0.4)' }}>U</div>
            <div>
              <div style={{ color: '#fff', fontSize: 14, fontWeight: 800, lineHeight: 1.1, letterSpacing: 1 }}>UNIVERSITY</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9, letterSpacing: 2 }}>NEWS PLATFORM</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="desktop-nav" style={{ display: 'flex', gap: '1.5rem', flex: 1 }}>
            {[['Home', '/'], ['Faculties', '/faculties'], ['Spotlight', '/spotlight'], ['Events', '/events'], ['About', '/about']].map(([n, h]) => (
              <Link key={n} href={h} className="nav-link" style={{
                color: n === 'Faculties' ? '#F40756' : 'rgba(255,255,255,0.6)',
                fontSize: 13, fontWeight: 600,
                borderBottom: n === 'Faculties' ? '2px solid #F40756' : '2px solid transparent',
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
            <button type="submit" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center' }}>🔍</button>
          </form>

          {/* Desktop Auth */}
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

          {/* Hamburger */}
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
          <div className="mobile-menu" style={{ animation: 'slideDown 0.2s ease', background: 'rgba(13,13,26,0.98)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.07)', padding: '1rem 1.25rem 1.5rem' }}>
            <form onSubmit={(e) => { handleSearch(e); setMenuOpen(false) }} style={{ display: 'flex', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, alignItems: 'center', padding: '8px 14px', gap: 8, marginBottom: 16 }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search news, events..." style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 14, flex: 1 }} />
              <button type="submit" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 16 }}>🔍</button>
            </form>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
              {[['Home', '/'], ['Faculties', '/faculties'], ['Spotlight', '/spotlight'], ['Events', '/events'], ['About', '/about']].map(([n, h]) => (
                <Link key={n} href={h} onClick={() => setMenuOpen(false)} style={{ color: n === 'Faculties' ? '#F40756' : 'rgba(255,255,255,0.7)', fontSize: 15, fontWeight: 600, padding: '10px 12px', borderRadius: 8, background: n === 'Faculties' ? 'rgba(244,7,86,0.08)' : 'transparent' }}>{n}</Link>
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

      {/* BREADCRUMB */}
      <div style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '10px 2rem', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: '#F40756' }}>Home</Link>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>›</span>
          <Link href="/faculties" style={{ color: '#F40756' }}>Faculties</Link>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>›</span>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>{faculty.name}</span>
        </div>
      </div>

      {/* FACULTY HERO */}
      <div style={{ padding: '3rem 2rem', position: 'relative', zIndex: 10, borderBottom: `1px solid ${faculty.color}33` }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="faculty-hero-inner">
            <div className="faculty-icon-box" style={{ background: `${faculty.color}22`, border: `2px solid ${faculty.color}44`, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 0 30px ${faculty.color}33` }}>
              {faculty.icon}
            </div>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', background: `${faculty.color}22`, border: `1px solid ${faculty.color}44`, color: faculty.color, fontSize: 10, fontWeight: 800, padding: '3px 14px', borderRadius: 20, letterSpacing: 2, marginBottom: 10 }}>
                FACULTY NEWS
              </div>
              <h1 className="faculty-hero-title" style={{ color: '#fff', fontWeight: 900, marginBottom: 8, letterSpacing: -0.5 }}>{faculty.name}</h1>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.6 }}>
                Latest news, research and updates from the Faculty of {faculty.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ARTICLES */}
      <main className="main-pad fade-in" style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: 'rgba(255,255,255,0.3)', fontSize: 16 }}>
            <div style={{ width: 40, height: 40, border: '3px solid rgba(244,7,86,0.2)', borderTopColor: '#F40756', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
            Loading...
          </div>
        ) : articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>📰</div>
            <h3 style={{ color: '#fff', fontSize: 20, marginBottom: 8 }}>No articles yet</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 20 }}>No news published for this faculty yet.</p>
            <Link href="/faculties" style={{ color: '#F40756', fontWeight: 700, fontSize: 14 }}>← Back to Faculties</Link>
          </div>
        ) : (
          <>
            <div className="articles-grid">
              {articles.map(a => (
                <Link key={a.id} href={`/articles/${a.slug}`} className="card-bounce" style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${faculty.color}33`,
                  borderTop: `3px solid ${faculty.color}`,
                  borderRadius: 16, overflow: 'hidden', display: 'block',
                }}>
                  <div style={{ height: 180, background: 'rgba(255,255,255,0.03)', overflow: 'hidden', position: 'relative' }}>
                    {a.cover_image
                      ? <img src={a.cover_image} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <div style={{ width: '100%', height: '100%', background: `linear-gradient(135deg, #1a0a2e, ${faculty.color}44)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>{faculty.icon}</div>
                    }
                    <div style={{ position: 'absolute', top: 8, left: 8 }}>
                      <span style={{ background: categoryColor(a.article_type), color: '#fff', fontSize: 9, padding: '3px 10px', borderRadius: 20, fontWeight: 800, letterSpacing: 0.5 }}>
                        {categoryLabel(a.article_type)}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: '1.25rem' }}>
                    <h3 style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 700, lineHeight: 1.4, margin: '0 0 8px' }}>
                      {a.title.length > 65 ? a.title.slice(0, 65) + '...' : a.title}
                    </h3>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, lineHeight: 1.6, marginBottom: 10 }}>{a.excerpt?.slice(0, 100)}...</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>By {a.author_name}</span>
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>📅 {formatDate(a.published_at)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {pagination.totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: '1.5rem' }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="page-btn" style={{ padding: '9px 22px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: page === 1 ? 'rgba(255,255,255,0.03)' : 'linear-gradient(135deg, #F40756, #ff6b9d)', color: page === 1 ? 'rgba(255,255,255,0.2)' : '#fff', cursor: page === 1 ? 'default' : 'pointer', fontWeight: 700, fontSize: 13, boxShadow: page === 1 ? 'none' : '0 4px 15px rgba(244,7,86,0.3)' }}>← Prev</button>
                <span style={{ padding: '9px 18px', fontSize: 13, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.04)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>{page} / {pagination.totalPages}</span>
                <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages} className="page-btn" style={{ padding: '9px 22px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: page === pagination.totalPages ? 'rgba(255,255,255,0.03)' : 'linear-gradient(135deg, #F40756, #ff6b9d)', color: page === pagination.totalPages ? 'rgba(255,255,255,0.2)' : '#fff', cursor: page === pagination.totalPages ? 'default' : 'pointer', fontWeight: 700, fontSize: 13, boxShadow: page === pagination.totalPages ? 'none' : '0 4px 15px rgba(244,7,86,0.3)' }}>Next →</button>
              </div>
            )}
          </>
        )}
      </main>

      {/* FOOTER */}
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