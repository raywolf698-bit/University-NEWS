"use client"
import { useEffect, useState } from 'react'
import useAuthRedirect from '../../utils/useAuthRedirect'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, authChecked } = useAuthRedirect()
  const [articles, setArticles] = useState([])

  useEffect(() => {
    if (authChecked && user) {
      fetch(`/api/articles?author_id=${user.id}&limit=10`)
        .then(r => r.json())
        .then(d => setArticles(d.data || []))
    }
  }, [authChecked, user])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    window.location.href = '/login'
  }

  const categoryColor = (type) => ({ news: '#F40756', event: '#f7941d', research: '#29abe2', campus_update: '#00a651' })[type] || '#F40756'
  const categoryLabel = (type) => ({ news: 'NEWS', event: 'EVENT', research: 'RESEARCH', campus_update: 'CAMPUS' })[type] || type?.toUpperCase()
  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''
  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  if (!user) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0a0a14', color: '#fff', fontFamily: 'sans-serif', gap: 12 }}>
      <div style={{ width: 8, height: 8, background: '#F40756', borderRadius: '50%', animation: 'pulse 1s infinite' }} />
      Loading...
    </div>
  )

  return (
    <div style={{ fontFamily: "'Inter', 'Sarabun', sans-serif", background: '#0a0a14', minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Sarabun:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }

        .nav-link { transition: color 0.2s; }
        .nav-link:hover { color: #F40756 !important; }

        .btn-primary {
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s;
        }
        .btn-primary:hover { transform: translateY(-2px) scale(1.03); box-shadow: 0 14px 36px rgba(244,7,86,0.5) !important; }
        .btn-primary:active { transform: scale(0.97); }

        .logout-btn {
          transition: background 0.2s, transform 0.2s;
        }
        .logout-btn:hover { background: rgba(244,7,86,0.18) !important; transform: translateY(-1px); }

        .article-row {
          transition: background 0.2s, transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }
        .article-row:hover { background: rgba(255,255,255,0.05) !important; transform: translateX(3px); }

        .stat-card {
          transition: background 0.2s, transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }
        .stat-card:hover { background: rgba(244,7,86,0.07) !important; transform: translateY(-2px); }

        @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.4; transform:scale(1.4); } }
        @keyframes fadeInUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }

        .fade-in   { animation: fadeInUp 0.45s cubic-bezier(0.34,1.2,0.64,1) forwards; }
        .fade-in-2 { animation: fadeInUp 0.45s cubic-bezier(0.34,1.2,0.64,1) 0.08s both; }
        .fade-in-3 { animation: fadeInUp 0.45s cubic-bezier(0.34,1.2,0.64,1) 0.16s both; }

        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); }
        ::-webkit-scrollbar-thumb { background: rgba(244,7,86,0.4); border-radius: 3px; }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{
        background: 'rgba(10,10,20,0.94)',
        backdropFilter: 'blur(24px)',
        padding: '0 2rem',
        position: 'sticky', top: 0, zIndex: 100,
        borderBottom: '1px solid rgba(255,255,255,0.07)'
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 62 }}>

          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 40, height: 40,
              background: 'linear-gradient(135deg, #F40756, #ff5c8a)',
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 17, fontWeight: 900, color: '#fff',
              boxShadow: '0 0 18px rgba(244,7,86,0.45)'
            }}>U</div>
            <div>
              <div style={{ color: '#fff', fontSize: 13, fontWeight: 800, letterSpacing: 1.2 }}>UNIVERSITY</div>
              <div style={{ color: 'rgba(255,255,255,0.28)', fontSize: 9, letterSpacing: 2.5 }}>NEWS PLATFORM</div>
            </div>
          </Link>

          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <Link href="/" className="nav-link" style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, fontWeight: 500, padding: '6px 14px', borderRadius: 8 }}>🏠 Home</Link>
            <Link href="/settings" className="nav-link" style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, fontWeight: 500, padding: '6px 14px', borderRadius: 8 }}>⚙️ Settings</Link>

            <div style={{ width: 1, height: 26, background: 'rgba(255,255,255,0.09)', margin: '0 6px' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {user.avatar_url
                ? <img src={user.avatar_url} alt="" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '2px solid #F40756' }} />
                : <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg, #F40756, #ff5c8a)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12 }}>{initials}</div>
              }
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 600 }}>{user.full_name?.split(' ')[0]}</span>
            </div>

            <button onClick={handleLogout} className="logout-btn" style={{
              background: 'rgba(244,7,86,0.08)',
              border: '1px solid rgba(244,7,86,0.22)',
              color: '#F40756', padding: '7px 16px',
              borderRadius: 8, cursor: 'pointer',
              fontSize: 13, fontWeight: 700, marginLeft: 6
            }}>Logout</button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 860, margin: '2.5rem auto', padding: '0 1.5rem' }}>

        {/* ── PROFILE CARD ── */}
        <div className="fade-in" style={{
          borderRadius: 20, overflow: 'visible', marginBottom: '1.5rem',
          border: '1px solid rgba(255,255,255,0.07)',
          background: '#111120',
          position: 'relative',
        }}>

          {/* Cover banner — taller so avatar sits fully inside */}
          <div style={{
            height: 180,
            background: 'linear-gradient(135deg, #1a0a2e 0%, #3a1060 45%, #2a0a4a 75%, #1a1a3e 100%)',
            position: 'relative', overflow: 'hidden'
          }}>
            {/* Accent line top */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #F40756 0%, #ff9de2 60%, transparent 100%)' }} />
            {/* Glow blobs */}
            <div style={{ position: 'absolute', top: '-30%', right: '8%', width: 340, height: 340, background: 'radial-gradient(circle, rgba(244,7,86,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-40%', left: '15%', width: 260, height: 260, background: 'radial-gradient(circle, rgba(100,50,200,0.15) 0%, transparent 65%)', pointerEvents: 'none' }} />


          </div>

          {/* Avatar — between cover and info */}
          <div style={{
            position: 'absolute',
            top: 136,
            left: 28,
            width: 88, height: 88,
            borderRadius: '50%',
            border: '4px solid #111120',
            boxShadow: '0 0 0 2.5px #F40756, 0 8px 28px rgba(244,7,86,0.4)',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #F40756, #ff6b9d)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 3,
          }}>
            {user.avatar_url
              ? <img src={user.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ color: '#fff', fontSize: 30, fontWeight: 900 }}>{initials}</span>
            }
          </div>

          {/* Info — padding-top = 44px (avatar overhang) + 16px gap */}
          <div style={{ padding: '60px 32px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>{user.full_name}</h1>
                {user.is_verified && (
                  <span style={{
                    background: 'rgba(41,171,226,0.12)', color: '#29abe2',
                    fontSize: 10, padding: '3px 10px', borderRadius: 20,
                    fontWeight: 800, border: '1px solid rgba(41,171,226,0.22)', letterSpacing: 0.5
                  }}>✓ VERIFIED</span>
                )}
              </div>
              <div style={{ color: '#ffff', fontSize: 13, marginBottom: 10, display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                {user.faculty && <span>📚 {user.faculty}</span>}
                <span style={{ color: 'rgba(255,255,255,0.12)' }}>·</span>
                <span>🎓 {user.role}</span>
              </div>
              {user.bio && (
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13.5, lineHeight: 1.75, maxWidth: 480 }}>{user.bio}</p>
              )}
              <div style={{ color: 'rgba(255,255,255,0.22)', fontSize: 11, marginTop: 10, letterSpacing: 0.3 }}>
                📅 Joined {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            </div>

            <Link href="/settings" className="btn-primary" style={{
              background: 'linear-gradient(135deg, #F40756, #ff5c8a)',
              color: '#fff', padding: '11px 24px', borderRadius: 50,
              fontSize: 13, fontWeight: 700,
              display: 'inline-flex', alignItems: 'center', gap: 6,
              boxShadow: '0 6px 22px rgba(244,7,86,0.38)',
              flexShrink: 0, whiteSpace: 'nowrap'
            }}>✏️ Edit Profile</Link>
          </div>

          {/* Stats bar */}
          <div style={{ display: 'flex', borderTop: '1px solid rgba(255,255,255,0.06)', margin: '0 0 0 0' }}>
            {[
              {
                label: 'ARTICLES', value: articles.length, icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>
                )
              },
              {
                label: 'BOOKMARKS', value: 3, icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
                )
              },
              {
                label: 'EVENTS SAVED', value: 5, icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                )
              },
            ].map((s, i) => (
              <div key={s.label} className="stat-card" style={{
                flex: 1, padding: '22px 16px', textAlign: 'center',
                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                cursor: 'default',
              }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: -1 }}>{s.value}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', marginTop: 3, fontWeight: 700, letterSpacing: 1.2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── MY ARTICLES ── */}
        <div className="fade-in-2" style={{
          borderRadius: 18,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
          background: '#111120',
        }}>
          <div style={{
            padding: '1rem 1.5rem',
            background: 'rgba(255,255,255,0.02)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 3, height: 18, background: 'linear-gradient(180deg, #F40756, #ff5c8a)', borderRadius: 2 }} />
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>My Articles</span>
            </div>
            <span style={{
              background: 'rgba(244,7,86,0.1)', color: '#F40756',
              fontSize: 11, padding: '3px 12px', borderRadius: 20,
              fontWeight: 700, border: '1px solid rgba(244,7,86,0.2)'
            }}>{articles.length} total</span>
          </div>

          {articles.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>📰</div>
              <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 14 }}>No articles posted yet.</p>
            </div>
          ) : articles.map((a, i) => (
            <Link key={a.id} href={`/articles/${a.slug}`} className="article-row" style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 1.5rem',
              borderBottom: i < articles.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              background: 'transparent'
            }}>
              <div style={{ width: 72, height: 54, background: 'rgba(255,255,255,0.05)', borderRadius: 10, overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(255,255,255,0.07)' }}>
                {a.cover_image
                  ? <img src={a.cover_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, opacity: 0.4 }}>📰</div>
                }
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{
                  color: categoryColor(a.article_type), fontSize: 9,
                  fontWeight: 800, letterSpacing: 1.5,
                  background: `${categoryColor(a.article_type)}18`,
                  padding: '2px 9px', borderRadius: 20,
                  border: `1px solid ${categoryColor(a.article_type)}30`,
                  display: 'inline-block'
                }}>{categoryLabel(a.article_type)}</span>
                <p style={{ color: 'rgba(255,255,255,0.82)', fontSize: 13.5, fontWeight: 600, marginTop: 5, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</p>
                <span style={{ color: 'rgba(255,255,255,0.22)', fontSize: 11, marginTop: 3, display: 'block' }}>📅 {formatDate(a.published_at)}</span>
              </div>

              <div style={{ color: 'rgba(244,7,86,0.45)', fontSize: 20, flexShrink: 0, fontWeight: 300 }}>›</div>
            </Link>
          ))}
        </div>

      </main>

      <footer style={{ background: 'transparent', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', textAlign: 'center', marginTop: '2rem' }}>
        <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: 12 }}>© {new Date().getFullYear()} University News Platform</p>
      </footer>
    </div>
  )
}