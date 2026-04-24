"use client"
import React from 'react'
import Link from 'next/link'
import useAuthRedirect from '@/utils/useAuthRedirect'

export default function FacultiesPage() {
  const { user, authChecked } = useAuthRedirect()

  const faculties = [
    { name: 'Business Administration', icon: '💼', color: '#F40756', desc: 'Business, management, marketing and entrepreneurship news.', slug: 'business-administration' },
    { name: 'Engineering', icon: '⚙️', color: '#29abe2', desc: 'Engineering innovations, research and student projects.', slug: 'engineering' },
    { name: 'Digital Innovation', icon: '💡', color: '#f7941d', desc: 'Tech, AI, software and digital transformation updates.', slug: 'digital-innovation' },
    { name: 'Medicine', icon: '🏥', color: '#00c47a', desc: 'Medical research, health news and clinical achievements.', slug: 'medicine' },
    { name: 'Liberal Arts', icon: '📚', color: '#9c27b0', desc: 'Arts, humanities, culture and social science stories.', slug: 'liberal-arts' },
    { name: 'Communication Arts', icon: '🎬', color: '#ff5722', desc: 'Media, journalism, film and communication updates.', slug: 'communication-arts' },
    { name: 'Science & Technology', icon: '🔬', color: '#00bcd4', desc: 'Scientific discoveries and technology breakthroughs.', slug: 'science-technology' },
    { name: 'Law', icon: '⚖️', color: '#795548', desc: 'Legal studies, moot court and law faculty news.', slug: 'law' },
    { name: 'Architecture', icon: '🏛️', color: '#607d8b', desc: 'Design, urban planning and architecture projects.', slug: 'architecture' },
    { name: 'Education', icon: '🎓', color: '#F40756', desc: 'Teaching, learning and education research updates.', slug: 'education' },
  ]

  if (!authChecked) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0d0d1a', color: '#fff', fontFamily: 'sans-serif' }}>Loading...</div>
  )

  return (
    <div style={{ fontFamily: "'Inter', 'Sarabun', sans-serif", background: '#0d0d1a', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        .fac-card { transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s, border-color 0.2s; }
        .fac-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 24px 48px rgba(0,0,0,0.4) !important; }
        .nav-link:hover { color: #F40756 !important; }
        @keyframes float1 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(30px,-30px); } }
        @keyframes float2 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-20px,20px); } }
        @keyframes fadeInUp { from { opacity:0; transform: translateY(24px); } to { opacity:1; transform: translateY(0); } }
        .fade-in { animation: fadeInUp 0.5s ease forwards; }
      `}</style>

      {/* BG BLOBS */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '5%', right: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(244,7,86,0.1) 0%, transparent 70%)', animation: 'float1 8s ease-in-out infinite' }} />
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

      {/* HERO */}
      <div style={{ padding: '4rem 2rem', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(244,7,86,0.15)', border: '1px solid rgba(244,7,86,0.3)', color: '#F40756', fontSize: 10, fontWeight: 800, padding: '4px 16px', borderRadius: 20, letterSpacing: 2, marginBottom: 16 }}>
          EXPLORE
        </div>
        <h1 style={{ color: '#fff', fontSize: 48, fontWeight: 900, marginBottom: 16, letterSpacing: -1 }}>
          Our <span style={{ background: 'linear-gradient(135deg, #F40756, #ff6b9d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Faculties</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
          Discover news, achievements and updates from each faculty across the university.
        </p>
      </div>

      {/* GRID */}
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem 4rem', position: 'relative', zIndex: 10 }} className="fade-in">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {faculties.map(f => (
            <Link key={f.slug} href={`/faculties/${f.slug}`} className="fac-card" style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${f.color}33`,
              borderTop: `3px solid ${f.color}`,
              borderRadius: 16, overflow: 'hidden', display: 'block',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ width: 52, height: 52, background: `${f.color}22`, border: `1px solid ${f.color}44`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ color: '#fff', fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{f.name}</h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>{f.desc}</p>
                <span style={{ color: f.color, fontSize: 13, fontWeight: 700 }}>View News →</span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>© {new Date().getFullYear()} University News Platform</p>
      </footer>
    </div>
  )
}