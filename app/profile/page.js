"use client"
import { useEffect, useState } from 'react'
import useAuthRedirect from '../../utils/useAuthRedirect'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, authChecked } = useAuthRedirect()
  const [articles, setArticles] = useState([])
  const [menuOpen, setMenuOpen] = useState(false)

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
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        button { font-family: inherit; }
        .nav-link { transition: color 0.2s; }
        .nav-link:hover { color: #F40756 !important; }
        .btn-primary { transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s; }
        .btn-primary:hover { transform: translateY(-2px) scale(1.03); box-shadow: 0 14px 36px rgba(244,7,86,0.5) !important; }
        .logout-btn { transition: background 0.2s, transform 0.2s; }
        .logout-btn:hover { background: rgba(244,7,86,0.18) !important; transform: translateY(-1px); }
        .article-row { transition: background 0.2s, transform 0.25s cubic-bezier(0.34,1.56,0.64,1); }
        .article-row:hover { background: rgba(255,255,255,0.05) !important; transform: translateX(3px); }
        .stat-card { transition: background 0.2s, transform 0.25s; }
        .stat-card:hover { background: rgba(244,7,86,0.07) !important; transform: translateY(-2px); }
        @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.4; transform:scale(1.4); } }
        @keyframes fadeInUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .fade-in   { animation: fadeInUp 0.45s cubic-bezier(0.34,1.2,0.64,1) forwards; }
        .fade-in-2 { animation: fadeInUp 0.45s cubic-bezier(0.34,1.2,0.64,1) 0.08s both; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: rgba(244,7,86,0.4); border-radius: 3px; }

        /* ── HEADER ── */
        .header-actions { display: flex; gap: 4px; align-items: center; }
        .header-home-link { display: flex; }
        .header-settings-link { display: flex; }
        .mobile-menu-btn { display: none !important; }
        .mobile-nav { display: none; flex-direction: column; background: rgba(10,10,20,0.98); border-bottom: 1px solid rgba(244,7,86,0.2); padding: 0.5rem 0; }
        .mobile-nav.open { display: flex; }
        .mobile-nav a, .mobile-nav button { padding: 12px 1.5rem; color: rgba(255,255,255,0.7); font-size: 14px; font-weight: 600; border: none; border-left: 3px solid transparent; background: none; cursor: pointer; text-align: left; width: 100%; transition: all 0.2s; }
        .mobile-nav a:hover, .mobile-nav button:hover { color: #F40756; border-left-color: #F40756; background: rgba(244,7,86,0.06); }

        /* ── PROFILE CARD ── */
        .profile-card-inner { padding: 60px 32px 28px; display: flex; justify-content: space-between; align-items: flex-start; }
        .cover-banner { height: 180px; }
        .avatar-pos { top: 136px; left: 28px; width: 88px; height: 88px; }
        .profile-name { font-size: 26px; }
        .stats-bar { display: flex; }
        .stat-item { flex: 1; padding: 22px 16px; text-align: center; }

        /* ── ARTICLE ROW ── */
        .article-thumb { width: 72px; height: 54px; }
        .article-title { font-size: 13.5px; }

        /* ══════════════════════════════════════════
           TABLET ≤ 768px
        ══════════════════════════════════════════ */
        @media (max-width: 767px) {
          .header-home-link { display: none !important; }
          .header-settings-link { display: none !important; }
          .header-divider { display: none !important; }
          .mobile-menu-btn { display: flex !important; }

          .profile-card-inner { padding: 52px 20px 20px; flex-direction: column; gap: 16px; align-items: flex-start; }
          .cover-banner { height: 140px; }
          .avatar-pos { top: 96px; left: 20px; width: 72px; height: 72px; }
          .profile-name { font-size: 20px; }
          .main-pad { padding: 0 1rem !important; }
          .main-margin { margin: 1.5rem auto !important; }
          .logo-text { display: none; }
        }

        /* ══════════════════════════════════════════
           MOBILE ≤ 480px
        ══════════════════════════════════════════ */
        @media (max-width: 480px) {
          .stats-bar { flex-direction: column; }
          .stat-item { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.06); padding: 16px; display: flex; align-items: center; gap: 16px; text-align: left; }
          .stat-item:last-child { border-bottom: none; }
          .stat-icon { margin-bottom: 0 !important; }
          .stat-num { font-size: 22px !important; }
          .article-thumb { width: 56px; height: 44px; }
          .article-title { font-size: 12.5px; }
          .btn-primary { padding: 9px 16px !important; font-size: 12px !important; }
          .cover-banner { height: 110px; }
          .avatar-pos { top: 70px; left: 16px; width: 60px; height: 60px; }
          .profile-card-inner { padding: 44px 16px 16px; }
        }
      `}</style>

      {/* STICKY HEADER + MOBILE NAV */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        <header style={{ background: 'rgba(10,10,20,0.94)', backdropFilter: 'blur(24px)', padding: '0 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 62 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #F40756, #ff5c8a)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 900, color: '#fff', boxShadow: '0 0 18px rgba(244,7,86,0.45)', flexShrink: 0 }}>U</div>
              <div>
                <div style={{ color: '#fff', fontSize: 13, fontWeight: 800, letterSpacing: 1.2 }}>UNIVERSITY</div>
                <div style={{ color: 'rgba(255,255,255,0.28)', fontSize: 9, letterSpacing: 2.5 }}>NEWS PLATFORM</div>
              </div>
            </Link>

            <div className="header-actions">
              <Link href="/" className="nav-link header-home-link" style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, fontWeight: 500, padding: '6px 14px', borderRadius: 8 }}>🏠 Home</Link>
              <Link href="/settings" className="nav-link header-settings-link" style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, fontWeight: 500, padding: '6px 14px', borderRadius: 8 }}>⚙️ Settings</Link>
              <div className="header-divider" style={{ width: 1, height: 26, background: 'rgba(255,255,255,0.09)', margin: '0 6px' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {user.avatar_url
                  ? <img src={user.avatar_url} alt="" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', border: '2px solid #F40756' }} />
                  : <div style={{ width: 34, height: 34, background: 'linear-gradient(135deg, #F40756, #ff5c8a)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{initials}</div>
                }
              </div>
              <button onClick={handleLogout} className="logout-btn" style={{ background: 'rgba(244,7,86,0.08)', border: '1px solid rgba(244,7,86,0.22)', color: '#F40756', padding: '7px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 700, marginLeft: 4, whiteSpace: 'nowrap' }}>Logout</button>

              {/* Hamburger */}
              <button onClick={() => setMenuOpen(o => !o)} className="mobile-menu-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, marginLeft: 4, flexDirection: 'column', gap: 5, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }} aria-label="Toggle menu">
                {[0,1,2].map(i => (
                  <span key={i} style={{ display: 'block', width: 22, height: 2, background: menuOpen && i === 1 ? 'transparent' : '#fff', borderRadius: 2, transition: 'all 0.25s', transform: menuOpen ? (i === 0 ? 'rotate(45deg) translate(5px, 5px)' : i === 2 ? 'rotate(-45deg) translate(5px, -5px)' : 'none') : 'none' }} />
                ))}
              </button>
            </div>
          </div>
        </header>

        <nav className={`mobile-nav${menuOpen ? ' open' : ''}`}>
          <Link href="/" onClick={() => setMenuOpen(false)}>🏠 Home</Link>
          <Link href="/settings" onClick={() => setMenuOpen(false)}>⚙️ Settings</Link>
          <button onClick={() => { setMenuOpen(false); handleLogout() }}>🚪 Logout</button>
        </nav>
      </div>

      <main className="main-pad main-margin" style={{ maxWidth: 860, margin: '2.5rem auto', padding: '0 1.5rem' }}>

        {/* PROFILE CARD */}
        <div className="fade-in" style={{ borderRadius: 20, overflow: 'visible', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.07)', background: '#111120', position: 'relative' }}>
          <div className="cover-banner" style={{ background: 'linear-gradient(135deg, #1a0a2e 0%, #3a1060 45%, #2a0a4a 75%, #1a1a3e 100%)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, #F40756 0%, #ff9de2 60%, transparent 100%)' }} />
            <div style={{ position: 'absolute', top: '-30%', right: '8%', width: 340, height: 340, background: 'radial-gradient(circle, rgba(244,7,86,0.18) 0%, transparent 65%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-40%', left: '15%', width: 260, height: 260, background: 'radial-gradient(circle, rgba(100,50,200,0.15) 0%, transparent 65%)', pointerEvents: 'none' }} />
          </div>

          <div className="avatar-pos" style={{ position: 'absolute', borderRadius: '50%', border: '4px solid #111120', boxShadow: '0 0 0 2.5px #F40756, 0 8px 28px rgba(244,7,86,0.4)', overflow: 'hidden', background: 'linear-gradient(135deg, #F40756, #ff6b9d)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3 }}>
            {user.avatar_url ? <img src={user.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: '#fff', fontSize: 26, fontWeight: 900 }}>{initials}</span>}
          </div>

          <div className="profile-card-inner">
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                <h1 className="profile-name" style={{ fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>{user.full_name}</h1>
                {user.is_verified && <span style={{ background: 'rgba(41,171,226,0.12)', color: '#29abe2', fontSize: 10, padding: '3px 10px', borderRadius: 20, fontWeight: 800, border: '1px solid rgba(41,171,226,0.22)', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>✓ VERIFIED</span>}
              </div>
              <div style={{ color: '#fff', fontSize: 13, marginBottom: 10, display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                {user.faculty && <span>📚 {user.faculty}</span>}
                <span style={{ color: 'rgba(255,255,255,0.12)' }}>·</span>
                <span>🎓 {user.role}</span>
              </div>
              {user.bio && <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13.5, lineHeight: 1.75, maxWidth: 480 }}>{user.bio}</p>}
              <div style={{ color: 'rgba(255,255,255,0.22)', fontSize: 11, marginTop: 10, letterSpacing: 0.3 }}>📅 Joined {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
            </div>
            <Link href="/settings" className="btn-primary" style={{ background: 'linear-gradient(135deg, #F40756, #ff5c8a)', color: '#fff', padding: '11px 24px', borderRadius: 50, fontSize: 13, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '0 6px 22px rgba(244,7,86,0.38)', flexShrink: 0, whiteSpace: 'nowrap' }}>✏️ Edit Profile</Link>
          </div>

          {/* Stats bar */}
          <div className="stats-bar" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {[
              { label: 'ARTICLES', value: articles.length, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg> },
              { label: 'BOOKMARKS', value: 3, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg> },
              { label: 'EVENTS SAVED', value: 5, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg> },
            ].map((s, i) => (
              <div key={s.label} className="stat-card stat-item" style={{ borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none', cursor: 'default' }}>
                <div className="stat-icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>{s.icon}</div>
                <div>
                  <div className="stat-num" style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: -1 }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)', marginTop: 3, fontWeight: 700, letterSpacing: 1.2 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ARTICLES */}
        <div className="fade-in-2" style={{ borderRadius: 18, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', background: '#111120' }}>
          <div style={{ padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 3, height: 18, background: 'linear-gradient(180deg, #F40756, #ff5c8a)', borderRadius: 2 }} />
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>My Articles</span>
            </div>
            <span style={{ background: 'rgba(244,7,86,0.1)', color: '#F40756', fontSize: 11, padding: '3px 12px', borderRadius: 20, fontWeight: 700, border: '1px solid rgba(244,7,86,0.2)' }}>{articles.length} total</span>
          </div>

          {articles.length === 0 ? (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
              <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>📰</div>
              <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 14 }}>No articles posted yet.</p>
            </div>
          ) : articles.map((a, i) => (
            <Link key={a.id} href={`/articles/${a.slug}`} className="article-row" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 1.25rem', borderBottom: i < articles.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', background: 'transparent' }}>
              <div className="article-thumb" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, overflow: 'hidden', flexShrink: 0, border: '1px solid rgba(255,255,255,0.07)' }}>
                {a.cover_image ? <img src={a.cover_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, opacity: 0.4 }}>📰</div>}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ color: categoryColor(a.article_type), fontSize: 9, fontWeight: 800, letterSpacing: 1.5, background: `${categoryColor(a.article_type)}18`, padding: '2px 9px', borderRadius: 20, border: `1px solid ${categoryColor(a.article_type)}30`, display: 'inline-block' }}>{categoryLabel(a.article_type)}</span>
                <p className="article-title" style={{ color: 'rgba(255,255,255,0.82)', fontWeight: 600, marginTop: 5, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</p>
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