"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import useAuthRedirect from '@/utils/useAuthRedirect'

export default function SpotlightPage() {
  const { user, authChecked } = useAuthRedirect()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authChecked) return
    fetch('/api/articles?status=published&limit=20')
      .then(r => r.json())
      .then(d => setArticles(d.data || []))
      .finally(() => setLoading(false))
  }, [authChecked])

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''
  const categoryColor = (type) => ({ news: '#F40756', research: '#29abe2', campus_update: '#00c47a', event: '#ff9500', announcement: '#F40756' })[type] || '#F40756'

  if (!authChecked) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0d0d1a', color: '#fff', fontFamily: 'sans-serif' }}>
      Loading...
    </div>
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
        .hall-card { transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), background 0.2s; }
        .hall-card:hover { transform: translateY(-4px) scale(1.03); background: rgba(244,7,86,0.15) !important; }
        @keyframes float1 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(30px,-30px); } }
        @keyframes float2 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-20px,20px); } }
        @keyframes fadeInUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
        .fade-in { animation: fadeInUp 0.5s ease forwards; }
        ::-webkit-scrollbar { height: 4px; } 
        ::-webkit-scrollbar-thumb { background: rgba(244,7,86,0.4); border-radius: 2px; }
      `}</style>

      {/* BG BLOBS */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '5%', left: '5%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(244,7,86,0.1) 0%, transparent 70%)', animation: 'float1 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(100,7,244,0.08) 0%, transparent 70%)', animation: 'float2 10s ease-in-out infinite' }} />
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
              <Link key={n} href={h} className="nav-link" style={{ color: n === 'Spotlight' ? '#F40756' : 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600, borderBottom: n === 'Spotlight' ? '2px solid #F40756' : '2px solid transparent', paddingBottom: 4, letterSpacing: 0.3 }}>{n}</Link>
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

      {/* HERO */}
      <div style={{ padding: '4rem 2rem', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(244,7,86,0.15)', border: '1px solid rgba(244,7,86,0.3)', color: '#F40756', fontSize: 10, fontWeight: 800, padding: '4px 16px', borderRadius: 20, letterSpacing: 2, marginBottom: 16 }}>
          ACHIEVEMENTS & AWARDS
        </div>
        <h1 style={{ color: '#fff', fontSize: 48, fontWeight: 900, marginBottom: 16, letterSpacing: -1 }}>
          🏆 <span style={{ background: 'linear-gradient(135deg, #F40756, #ff6b9d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Spotlight</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
          Celebrating the outstanding achievements of our university community.
        </p>
      </div>

      {/* HALL OF FAME */}
      <div style={{ padding: '0 2rem 3rem', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: 8 }}>
            {[
              { emoji: '🏆', title: 'Innovation Award', name: 'Engineering Team', year: '2026' },
              { emoji: '🔬', title: 'Research Excellence', name: 'Medical Faculty', year: '2026' },
              { emoji: '🏅', title: 'National Sports', name: 'Athletics Team', year: '2026' },
              { emoji: '🎨', title: 'Arts & Culture', name: 'Liberal Arts', year: '2026' },
            ].map((a, i) => (
              <div key={i} className="hall-card" style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(244,7,86,0.2)',
                borderRadius: 16, padding: '1.5rem 2rem',
                minWidth: 220, textAlign: 'center', flexShrink: 0,
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>{a.emoji}</div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{a.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{a.name} · {a.year}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ARTICLES */}
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem 4rem', position: 'relative', zIndex: 10 }}>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: '1.5rem', letterSpacing: -0.5 }}>
          Achievement <span style={{ background: 'linear-gradient(135deg, #F40756, #ff6b9d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Stories</span>
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.3)' }}>
            <div style={{ width: 36, height: 36, border: '3px solid rgba(244,7,86,0.2)', borderTopColor: '#F40756', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
            Loading...
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {articles.map(a => (
              <Link key={a.id} href={`/articles/${a.slug}`} className="card" style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 16, overflow: 'hidden', display: 'block',
              }}>
                <div style={{ height: 180, background: 'rgba(255,255,255,0.03)', overflow: 'hidden', position: 'relative' }}>
                  {a.cover_image
                    ? <img src={a.cover_image} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1a0a2e, #4a1a2e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>🏆</div>
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
        )}
      </main>

      <footer style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>© {new Date().getFullYear()} University News Platform</p>
      </footer>
    </div>
  )
}