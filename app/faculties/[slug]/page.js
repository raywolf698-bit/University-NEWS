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

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''
  const categoryColor = (type) => ({ news: '#F40756', research: '#29abe2', campus_update: '#00c47a', event: '#f7941d', announcement: '#F40756' })[type] || '#F40756'

  if (!authChecked) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0d0d1a', color: '#fff', fontFamily: 'sans-serif' }}>Loading...</div>
  )

  return (
    <div style={{ fontFamily: "'Inter', 'Sarabun', sans-serif", background: '#0d0d1a', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        .card { transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s, border-color 0.2s; }
        .card:hover { transform: translateY(-6px) scale(1.01); box-shadow: 0 20px 40px rgba(0,0,0,0.3) !important; border-color: rgba(244,7,86,0.3) !important; }
        .nav-link:hover { color: #F40756 !important; }
        .page-btn { transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s; }
        .page-btn:hover { transform: scale(1.05); }
        @keyframes float1 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(30px,-30px); } }
        @keyframes float2 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-20px,20px); } }
        @keyframes fadeInUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
        .fade-in { animation: fadeInUp 0.5s ease forwards; }
      `}</style>

      {/* BG BLOBS */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '5%', right: '5%', width: 400, height: 400, background: `radial-gradient(circle, ${faculty.color}18 0%, transparent 70%)`, animation: 'float1 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(100,7,244,0.08) 0%, transparent 70%)', animation: 'float2 10s ease-in-out infinite' }} />
      </div>

      {/* HEADER */}
      <header style={{ background: 'rgba(13,13,26,0.8)', backdropFilter: 'blur(20px)', padding: '0 2rem', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(244,7,86,0.15)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', gap: '2rem', height: 64 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 42, height: 42, background: 'linear-gradient(135deg, #F40756, #ff6b9d)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: '#fff', boxShadow: '0 0 20px rgba(244,7,86,0.4)' }}>U</div>
            <div>
              <div style={{ color: '#fff', fontSize: 14, fontWeight: 800, letterSpacing: 1 }}>UNIVERSITY</div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, letterSpacing: 2 }}>NEWS PLATFORM</div>
            </div>
          </Link>
          <nav style={{ display: 'flex', gap: '1.5rem', flex: 1 }}>
            {[['Home', '/'], ['Faculties', '/faculties'], ['Spotlight', '/spotlight'], ['Events', '/events'], ['About', '/about']].map(([n, h]) => (
              <Link key={n} href={h} className="nav-link" style={{ color: n === 'Faculties' ? '#F40756' : 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, borderBottom: n === 'Faculties' ? '2px solid #F40756' : '2px solid transparent', paddingBottom: 4, letterSpacing: 0.3 }}>{n}</Link>
            ))}
          </nav>
          {user && (
            <Link href="/profile" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #F40756, #ff6b9d)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, boxShadow: '0 0 10px rgba(244,7,86,0.3)' }}>{user.full_name?.charAt(0)}</div>
              <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{user.full_name?.split(' ')[0]}</span>
            </Link>
          )}
        </div>
      </header>

      {/* BREADCRUMB */}
      <div style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '10px 2rem', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
          <Link href="/" style={{ color: '#F40756' }}>Home</Link>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>›</span>
          <Link href="/faculties" style={{ color: '#F40756' }}>Faculties</Link>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>›</span>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>{faculty.name}</span>
        </div>
      </div>

      {/* HERO */}
      <div style={{ padding: '3rem 2rem', position: 'relative', zIndex: 10, borderBottom: `1px solid ${faculty.color}33` }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ width: 80, height: 80, background: `${faculty.color}22`, border: `2px solid ${faculty.color}44`, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, flexShrink: 0, boxShadow: `0 0 30px ${faculty.color}33` }}>
            {faculty.icon}
          </div>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', background: `${faculty.color}22`, border: `1px solid ${faculty.color}44`, color: faculty.color, fontSize: 10, fontWeight: 800, padding: '3px 14px', borderRadius: 20, letterSpacing: 2, marginBottom: 10 }}>
              FACULTY NEWS
            </div>
            <h1 style={{ color: '#fff', fontSize: 36, fontWeight: 900, marginBottom: 8, letterSpacing: -0.5 }}>{faculty.name}</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15 }}>
              Latest news, research and updates from the Faculty of {faculty.name}
            </p>
          </div>
        </div>
      </div>

      {/* ARTICLES */}
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem', position: 'relative', zIndex: 10 }} className="fade-in">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.3)' }}>
            <div style={{ width: 36, height: 36, border: '3px solid rgba(244,7,86,0.2)', borderTopColor: '#F40756', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
            Loading articles...
          </div>
        ) : articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem' }}>
            <div style={{ fontSize: 60, marginBottom: 16 }}>📰</div>
            <h3 style={{ color: '#fff', fontSize: 20, marginBottom: 8 }}>No articles yet</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginBottom: 20 }}>No news published for this faculty yet.</p>
            <Link href="/faculties" style={{ color: '#F40756', fontWeight: 700, fontSize: 14 }}>← Back to Faculties</Link>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {articles.map(a => (
                <Link key={a.id} href={`/articles/${a.slug}`} className="card" style={{
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
                    <div style={{ position: 'absolute', top: 10, left: 10 }}>
                      <span style={{ background: categoryColor(a.article_type), color: '#fff', fontSize: 9, padding: '3px 10px', borderRadius: 20, fontWeight: 800, letterSpacing: 0.5 }}>
                        {a.article_type?.toUpperCase().replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: '1.25rem' }}>
                    <h3 style={{ color: 'rgba(255,255,255,0.9)', fontSize: 15, fontWeight: 700, lineHeight: 1.4, margin: '0 0 8px' }}>{a.title}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, lineHeight: 1.6, marginBottom: 12 }}>{a.excerpt?.slice(0, 100)}...</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>By {a.author_name}</span>
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>📅 {formatDate(a.published_at)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* PAGINATION */}
            {pagination.totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: '2rem' }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="page-btn"
                  style={{ padding: '9px 22px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: page === 1 ? 'rgba(255,255,255,0.03)' : 'linear-gradient(135deg, #F40756, #ff6b9d)', color: page === 1 ? 'rgba(255,255,255,0.2)' : '#fff', cursor: page === 1 ? 'default' : 'pointer', fontWeight: 700, fontSize: 13, boxShadow: page === 1 ? 'none' : '0 4px 15px rgba(244,7,86,0.3)' }}>← Prev</button>
                <span style={{ padding: '9px 18px', fontSize: 13, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.04)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)' }}>
                  {page} / {pagination.totalPages}
                </span>
                <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages} className="page-btn"
                  style={{ padding: '9px 22px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: page === pagination.totalPages ? 'rgba(255,255,255,0.03)' : 'linear-gradient(135deg, #F40756, #ff6b9d)', color: page === pagination.totalPages ? 'rgba(255,255,255,0.2)' : '#fff', cursor: page === pagination.totalPages ? 'default' : 'pointer', fontWeight: 700, fontSize: 13, boxShadow: page === pagination.totalPages ? 'none' : '0 4px 15px rgba(244,7,86,0.3)' }}>Next →</button>
              </div>
            )}
          </>
        )}
      </main>

      <footer style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>© {new Date().getFullYear()} University News Platform</p>
      </footer>
    </div>
  )
}