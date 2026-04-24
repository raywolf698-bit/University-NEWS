"use client"
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import useAuth from '@/utils/useAuth'

export default function ArticlePage() {
  const { slug } = useParams()
  const router = useRouter()
  const { user, authChecked } = useAuth()
  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const [article, setArticle] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [search, setSearch] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) router.push(`/?search=${encodeURIComponent(search)}`)
  }

  useEffect(() => {
    if (!slug) return
    fetchArticle()
  }, [slug])

  const fetchArticle = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/articles?status=published&limit=50`)
      const data = await res.json()
      const found = (data.data || []).find(a => a.slug === slug)

      if (!found) {
        setNotFound(true)
        return
      }
      setArticle(found)

      const rel = await fetch(`/api/articles?status=published&article_type=${found.article_type}&limit=4`)
      const relData = await rel.json()
      setRelated((relData.data || []).filter(a => a.slug !== slug).slice(0, 3))
    } catch (err) {
      console.error(err)
      setNotFound(true)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (d) => {
    if (!d) return ''
    return new Date(d).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    })
  }

  const categoryColor = (type) => {
    const map = {
      news: '#F40756',
      announcement: '#F40756',
      campus_update: '#00c47a',
      event: '#ff9500',
      research: '#29abe2',
    }
    return map[type] || '#F40756'
  }

  const categoryLabel = (type) => {
    const map = {
      news: 'NEWS',
      announcement: 'ANNOUNCEMENT',
      campus_update: 'CAMPUS',
      event: 'EVENTS',
      research: 'RESEARCH',
    }
    return map[type] || type?.toUpperCase()
  }

  return (
    <div style={{ fontFamily: "'Inter', 'Sarabun', sans-serif", background: '#0d0d1a', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Sarabun:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }

        .nav-link { transition: color 0.2s, border-color 0.2s; }
        .nav-link:hover { color: #F40756 !important; }

        .related-card { transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), border-color 0.2s, box-shadow 0.3s; }
        .related-card:hover { transform: translateY(-4px); border-color: rgba(244,7,86,0.25) !important; box-shadow: 0 12px 30px rgba(0,0,0,0.3) !important; }

        .share-btn { transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); }
        .share-btn:hover { background: linear-gradient(135deg, #F40756, #ff6b9d) !important; color: #fff !important; border-color: transparent !important; transform: scale(1.1); }

        .btn-bounce { transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s; }
        .btn-bounce:hover { transform: translateY(-2px) scale(1.04); box-shadow: 0 8px 30px rgba(244,7,86,0.5) !important; }
        .btn-bounce:active { transform: scale(0.96); }

        .back-btn { transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); }
        .back-btn:hover { transform: translateX(-3px); background: rgba(244,7,86,0.15) !important; border-color: rgba(244,7,86,0.4) !important; }

        .reaction-btn { transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); }
        .reaction-btn:hover { transform: scale(1.12) translateY(-2px); }

        .tag-pill { transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1); }
        .tag-pill:hover { background: rgba(244,7,86,0.15) !important; color: #F40756 !important; transform: scale(1.05); }

        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.25); }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
        ::-webkit-scrollbar-thumb { background: rgba(244,7,86,0.4); border-radius: 3px; }

        @keyframes pulse { 0%,100% { opacity:1; transform: scale(1); } 50% { opacity:0.5; transform: scale(1.3); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeInUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
        .fade-in { animation: fadeInUp 0.5s ease forwards; }
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
                color: n === 'Home' ? '#F40756' : 'rgba(255,255,255,0.6)',
                fontSize: 13, fontWeight: 600,
                borderBottom: n === 'Home' ? '2px solid #F40756' : '2px solid transparent',
                paddingBottom: 4, letterSpacing: 0.3
              }}>{n}</Link>
            ))}
          </nav>

          <form onSubmit={handleSearch} style={{ display: 'flex', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, alignItems: 'center', padding: '6px 14px', gap: 8 }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search news, events..."
              style={{ background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 13, width: 180 }}
            />
            <button type="submit" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 14, display: 'flex' }}>🔍</button>
          </form>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
              <Link href="/profile" style={{ color: '#F40756', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>My Dashboard</Link>
              {user.role === 'admin' && (
                <Link href="/admin/articles" style={{
                  color: '#fff', fontSize: 12, fontWeight: 700,
                  background: 'linear-gradient(135deg, #F40756, #ff6b9d)',
                  padding: '6px 14px', borderRadius: 6, whiteSpace: 'nowrap',
                  boxShadow: '0 4px 12px rgba(244,7,86,0.3)'
                }}>Admin Panel</Link>
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

      {/* ── BREADCRUMB ── */}
      {article && (
        <div style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '10px 2rem' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
            <Link href="/" style={{ color: '#F40756', fontWeight: 600 }}>Home</Link>
            <span>›</span>
            <span style={{ textTransform: 'capitalize', color: 'rgba(255,255,255,0.5)' }}>{article.article_type?.replace('_', ' ')}</span>
            <span>›</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>{article.title?.slice(0, 50)}...</span>
          </div>
        </div>
      )}

      {/* ── MAIN ── */}
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }}>

        {loading ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '6rem', color: 'rgba(255,255,255,0.3)' }}>
            <div style={{ width: 44, height: 44, border: '3px solid rgba(244,7,86,0.2)', borderTopColor: '#F40756', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ fontSize: 14 }}>Loading article...</p>
          </div>
        ) : notFound ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '6rem' }}>
            <div style={{ fontSize: 64, marginBottom: 20, opacity: 0.4 }}>📰</div>
            <h2 style={{ color: '#fff', fontSize: 24, marginBottom: 12, fontWeight: 800 }}>Article not found</h2>
            <Link href="/" style={{ color: '#F40756', fontWeight: 700 }}>← Back to Homepage</Link>
          </div>
        ) : article ? (
          <>
            {/* LEFT — ARTICLE */}
            <div className="fade-in">
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 16, overflow: 'hidden',
                boxShadow: '0 8px 40px rgba(0,0,0,0.3)'
              }}>

                {/* COVER IMAGE */}
                {article.cover_image && (
                  <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <img src={article.cover_image} alt={article.title}
                      style={{ width: '100%', maxHeight: 420, objectFit: 'cover', display: 'block' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 60%, rgba(13,13,26,0.8))' }} />
                  </div>
                )}

                <div style={{ padding: '2rem' }}>
                  {/* CATEGORY + DATE */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                    <span style={{
                      background: `${categoryColor(article.article_type)}22`,
                      border: `1px solid ${categoryColor(article.article_type)}55`,
                      color: categoryColor(article.article_type),
                      fontSize: 10, fontWeight: 800,
                      padding: '3px 12px', borderRadius: 20, letterSpacing: 1
                    }}>{categoryLabel(article.article_type)}</span>
                    <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>📅 {formatDate(article.published_at)}</span>
                    <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>👁 {article.view_count} views</span>
                  </div>

                  {/* TITLE */}
                  <h1 style={{ color: '#fff', fontSize: 32, fontWeight: 900, lineHeight: 1.3, marginBottom: 20, letterSpacing: -0.5 }}>
                    {article.title}
                  </h1>

                  {/* AUTHOR */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <div style={{
                      width: 38, height: 38,
                      background: 'linear-gradient(135deg, #F40756, #ff6b9d)',
                      borderRadius: '50%', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14,
                      boxShadow: '0 0 12px rgba(244,7,86,0.3)', flexShrink: 0
                    }}>
                      {article.author_name?.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>By {article.author_name}</div>
                      {article.author_faculty && (
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{article.author_faculty}</div>
                      )}
                    </div>

                    {/* SHARE */}
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>Share:</span>
                      {['f', 'X', 'in', '🔗'].map(s => (
                        <button key={s} className="share-btn" style={{
                          width: 32, height: 32,
                          border: '1px solid rgba(255,255,255,0.12)',
                          background: 'rgba(255,255,255,0.06)',
                          borderRadius: 6, cursor: 'pointer',
                          fontSize: 12, fontWeight: 700,
                          color: 'rgba(255,255,255,0.6)'
                        }}>{s}</button>
                      ))}
                    </div>
                  </div>

                  {/* EXCERPT */}
                  {article.excerpt && (
                    <div style={{
                      borderLeft: '3px solid #F40756',
                      paddingLeft: 16, marginBottom: 28,
                      background: 'rgba(244,7,86,0.06)',
                      padding: '14px 18px',
                      borderRadius: '0 10px 10px 0'
                    }}>
                      <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 16, lineHeight: 1.8, fontStyle: 'italic' }}>
                        {article.excerpt}
                      </p>
                    </div>
                  )}

                  {/* CONTENT */}
                  <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 16, lineHeight: 1.9 }}>
                    {article.content?.split('\n').map((para, i) => (
                      para.trim() ? (
                        <p key={i} style={{ marginBottom: 16 }}>{para}</p>
                      ) : null
                    ))}
                  </div>

                  {/* TAGS */}
                  {article.tags && (
                    <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', fontWeight: 600 }}>Tags:</span>
                      {article.tags.split(',').map(tag => (
                        <span key={tag} className="tag-pill" style={{
                          background: 'rgba(255,255,255,0.07)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: 'rgba(255,255,255,0.55)',
                          padding: '4px 14px', borderRadius: 20,
                          fontSize: 12, fontWeight: 500, cursor: 'default'
                        }}>{tag.trim()}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* BACK BUTTON */}
              <div style={{ marginTop: 20 }}>
                <button onClick={() => router.back()} className="back-btn" style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.7)',
                  padding: '10px 24px', borderRadius: 8,
                  cursor: 'pointer', fontSize: 14, fontWeight: 600
                }}>← Back to News</button>
              </div>

              {/* REACTIONS */}
              <ReactionsSection articleId={article.id} user={user} />

              {/* COMMENTS */}
              <CommentsSection articleId={article.id} user={user} />
            </div>

            {/* RIGHT — SIDEBAR */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* RELATED NEWS */}
              <div style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 16, overflow: 'hidden',
                boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
              }}>
                <div style={{ background: 'rgba(244,7,86,0.1)', borderBottom: '1px solid rgba(244,7,86,0.15)', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#fff', fontWeight: 800, fontSize: 14, letterSpacing: 0.5 }}>Related News</span>
                  <div style={{ width: 6, height: 6, background: '#F40756', borderRadius: '50%', boxShadow: '0 0 8px rgba(244,7,86,0.6)' }} />
                </div>
                {related.length === 0 ? (
                  <div style={{ padding: '1.5rem', color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center' }}>
                    No related articles
                  </div>
                ) : (
                  related.map((a, i) => (
                    <Link key={a.id} href={`/articles/${a.slug}`} className="related-card" style={{
                      display: 'flex', gap: 10, padding: '12px',
                      borderBottom: i < related.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                      border: '1px solid transparent'
                    }}>
                      <div style={{ width: 80, height: 60, background: 'rgba(255,255,255,0.05)', borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                        {a.cover_image
                          ? <img src={a.cover_image} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📰</div>
                        }
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 600, lineHeight: 1.4, marginBottom: 5 }}>
                          {a.title.length > 60 ? a.title.slice(0, 60) + '...' : a.title}
                        </p>
                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>📅 {formatDate(a.published_at)}</span>
                      </div>
                    </Link>
                  ))
                )}
              </div>

              {/* STAY UPDATED */}
              <div style={{
                background: 'linear-gradient(135deg, #1a0a2e 0%, #2d1a4e 50%, #1a1a3e 100%)',
                border: '1px solid rgba(244,7,86,0.2)',
                borderRadius: 16, padding: '1.5rem',
                boxShadow: '0 0 40px rgba(244,7,86,0.08)'
              }}>
                <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 900, marginBottom: 8, letterSpacing: -0.3 }}>Stay Updated!</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
                  Subscribe to get the latest news and announcements.
                </p>
                <input
                  type="email"
                  placeholder="Enter your email"
                  style={{
                    width: '100%', padding: '10px 14px',
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'rgba(255,255,255,0.07)',
                    color: '#fff', borderRadius: 8,
                    fontSize: 13, marginBottom: 10,
                    fontFamily: 'inherit', outline: 'none'
                  }}
                />
                <button className="btn-bounce" style={{
                  width: '100%', padding: '11px',
                  background: 'linear-gradient(135deg, #F40756, #ff6b9d)',
                  color: '#fff', border: 'none', borderRadius: 8,
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 4px 20px rgba(244,7,86,0.4)'
                }}>Subscribe</button>
              </div>
            </div>
          </>
        ) : null}
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

function ReactionsSection({ articleId, user }) {
  const [reactions, setReactions] = useState({})
  const [userReaction, setUserReaction] = useState(null)
  const emojis = ['👍', '❤️', '🔥', '😮']

  useEffect(() => {
    if (!articleId) return
    fetchReactions()
  }, [articleId])

  const fetchReactions = async () => {
    try {
      const url = user
        ? `/api/articles/${articleId}/reactions?user_id=${user.id}`
        : `/api/articles/${articleId}/reactions`
      const res = await fetch(url)
      const data = await res.json()
      const map = {}
        ; (data.data || []).forEach(r => { map[r.emoji] = Number(r.count) })
      setReactions(map)
      setUserReaction(data.userReaction || null)
    } catch (err) {
      console.error(err)
    }
  }

  const handleReact = async (emoji) => {
    if (!user) return alert('Please login to react')
    try {
      if (userReaction === emoji) {
        await fetch(`/api/articles/${articleId}/reactions`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.id })
        })
        setReactions(prev => ({ ...prev, [emoji]: Math.max(0, (prev[emoji] || 1) - 1) }))
        setUserReaction(null)
      } else {
        await fetch(`/api/articles/${articleId}/reactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.id, emoji })
        })
        setReactions(prev => ({
          ...prev,
          [emoji]: (prev[emoji] || 0) + 1,
          ...(userReaction ? { [userReaction]: Math.max(0, (prev[userReaction] || 1) - 1) } : {})
        }))
        setUserReaction(emoji)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 16, padding: '1.5rem', marginTop: 16,
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
    }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 14, letterSpacing: 0.3 }}>Reactions</div>
      <div style={{ display: 'flex', gap: 12 }}>
        {emojis.map(emoji => (
          <button key={emoji} onClick={() => handleReact(emoji)} className="reaction-btn" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '10px 18px', borderRadius: 12, cursor: 'pointer',
            border: userReaction === emoji ? '1px solid rgba(244,7,86,0.5)' : '1px solid rgba(255,255,255,0.08)',
            background: userReaction === emoji ? 'rgba(244,7,86,0.15)' : 'rgba(255,255,255,0.05)',
            boxShadow: userReaction === emoji ? '0 0 16px rgba(244,7,86,0.2)' : 'none'
          }}>
            <span style={{ fontSize: 24 }}>{emoji}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: userReaction === emoji ? '#F40756' : 'rgba(255,255,255,0.5)', marginTop: 4 }}>
              {reactions[emoji] || 0}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

function CommentsSection({ articleId, user }) {
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!articleId) return
    fetchComments()
  }, [articleId])

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/articles/${articleId}/comments`)
      const data = await res.json()
      setComments(data.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async () => {
    if (!user) return alert('Please login to comment')
    if (!text.trim()) return
    console.log('user object:', user)
    console.log('user.id:', user.id)
    setSubmitting(true)
    try {
      await fetch(`/api/articles/${articleId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, content: text })
      })
      setText('')
      fetchComments()
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (comment_id) => {
    if (!user) return
    try {
      await fetch(`/api/articles/${articleId}/comments`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, comment_id })
      })
      fetchComments()
    } catch (err) {
      console.error(err)
    }
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })

  const initials = (name) => name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 16, padding: '1.5rem', marginTop: 16,
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
    }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 16, letterSpacing: 0.3 }}>
        Comments ({comments.length})
      </div>

      {/* INPUT */}
      {user ? (
        <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, #F40756, #ff6b9d)',
            borderRadius: '50%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13,
            flexShrink: 0, boxShadow: '0 0 10px rgba(244,7,86,0.3)'
          }}>
            {initials(user.full_name)}
          </div>
          <div style={{ flex: 1 }}>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
              style={{
                width: '100%', padding: '10px 14px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.06)',
                borderRadius: 10, fontSize: 14,
                fontFamily: 'inherit', resize: 'vertical',
                outline: 'none', color: '#fff'
              }}
            />
            <button onClick={handleSubmit} disabled={submitting} className="btn-bounce" style={{
              marginTop: 8,
              background: 'linear-gradient(135deg, #F40756, #ff6b9d)',
              color: '#fff', border: 'none', padding: '9px 22px',
              borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(244,7,86,0.35)',
              opacity: submitting ? 0.7 : 1
            }}>
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </div>
      ) : (
        <div style={{
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 10, padding: '1rem', marginBottom: 24, textAlign: 'center',
          fontSize: 13, color: 'rgba(255,255,255,0.4)'
        }}>
          Please <a href="/login" style={{ color: '#F40756', fontWeight: 700 }}>login</a> to leave a comment
        </div>
      )}

      {/* COMMENTS LIST */}
      {comments.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 13, padding: '1rem' }}>
          No comments yet. Be the first to comment!
        </div>
      ) : (
        comments.map(c => (
          <div key={c.id} style={{
            display: 'flex', gap: 10, marginBottom: 16,
            paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)'
          }}>
            <div style={{
              width: 36, height: 36,
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'rgba(255,255,255,0.7)',
              fontWeight: 700, fontSize: 13, flexShrink: 0, overflow: 'hidden'
            }}>
              {c.avatar_url
                ? <img src={c.avatar_url} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                : initials(c.full_name)
              }
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>{c.full_name}</span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{formatDate(c.created_at)}</span>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{c.content}</p>
              {user?.id === c.user_id && (
                <button onClick={() => handleDelete(c.id)} style={{
                  marginTop: 6, background: 'none', border: 'none',
                  color: '#F40756', fontSize: 12, cursor: 'pointer', fontWeight: 600
                }}>Delete</button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}