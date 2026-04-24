"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [articles, setArticles] = useState([])
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({ total: 0, published: 0, pending: 0, draft: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [pubRes, draftRes, reviewRes, usersRes] = await Promise.all([
        fetch('/api/articles?status=published&limit=50'),
        fetch('/api/articles?status=draft&limit=50'),
        fetch('/api/articles?status=review&limit=50'),
        fetch('/api/users'),
      ])
      const [pubData, draftData, reviewData, usersData] = await Promise.all([
        pubRes.json(), draftRes.json(), reviewRes.json(), usersRes.json()
      ])

      const published = pubData.pagination?.total || 0
      const draft = draftData.pagination?.total || 0
      const pending = reviewData.pagination?.total || 0
      setStats({ total: published + draft + pending, published, pending, draft })

      const recent = [
        ...(pubData.data || []),
        ...(draftData.data || []),
        ...(reviewData.data || [])
      ].sort((a, b) => new Date(b.published_at) - new Date(a.published_at)).slice(0, 6)
      setArticles(recent)
      setUsers(usersData.data || usersData || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'

  const statusBadge = (status) => {
    const map = {
      published: { bg: 'rgba(0,196,122,0.15)',  color: '#00c47a', border: 'rgba(0,196,122,0.3)',  label: 'Published' },
      draft:     { bg: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.45)', border: 'rgba(255,255,255,0.12)', label: 'Draft' },
      review:    { bg: 'rgba(255,149,0,0.15)',   color: '#ff9500', border: 'rgba(255,149,0,0.3)',  label: 'Pending' },
    }
    const s = map[status] || map.draft
    return (
      <span style={{
        background: s.bg, color: s.color,
        border: `1px solid ${s.border}`,
        padding: '3px 10px', borderRadius: 999,
        fontSize: 11, fontWeight: 700, letterSpacing: 0.3
      }}>{s.label}</span>
    )
  }

  const roleBadge = (role) => {
    const isAdmin = role === 'admin'
    return (
      <span style={{
        background: isAdmin ? 'rgba(244,7,86,0.15)' : 'rgba(255,255,255,0.07)',
        color: isAdmin ? '#F40756' : 'rgba(255,255,255,0.45)',
        border: `1px solid ${isAdmin ? 'rgba(244,7,86,0.3)' : 'rgba(255,255,255,0.1)'}`,
        padding: '3px 10px', borderRadius: 999,
        fontSize: 11, fontWeight: 700, textTransform: 'capitalize'
      }}>{role}</span>
    )
  }

  return (
    <div style={{ fontFamily: "'Inter', 'Sarabun', sans-serif", color: '#fff' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Sarabun:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        a { text-decoration: none; color: inherit; }

        .row-hover { transition: background 0.15s; }
        .row-hover:hover { background: rgba(244,7,86,0.05) !important; }

        .stat-card { transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s; }
        .stat-card:hover { transform: translateY(-5px); }

        .action-link { transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); }
        .action-link:hover { transform: translateY(-2px) scale(1.03); }

        .manage-link { transition: all 0.2s; }
        .manage-link:hover { background: rgba(255,255,255,0.2) !important; }

        @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .fade-in { animation: fadeInUp 0.4s ease forwards; }
      `}</style>

      {/* ── STAT CARDS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Articles', value: stats.total,     icon: '📰', accent: '#F40756', glow: 'rgba(244,7,86,0.15)' },
          { label: 'Published',      value: stats.published, icon: '✅', accent: '#00c47a', glow: 'rgba(0,196,122,0.12)' },
          { label: 'Pending Review', value: stats.pending,   icon: '⏳', accent: '#ff9500', glow: 'rgba(255,149,0,0.12)' },
          { label: 'Drafts',         value: stats.draft,     icon: '📝', accent: 'rgba(255,255,255,0.4)', glow: 'rgba(255,255,255,0.05)' },
        ].map((s, i) => (
          <div key={s.label} className="stat-card fade-in" style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderTop: `3px solid ${s.accent}`,
            borderRadius: 14, padding: '1.25rem 1.5rem',
            boxShadow: `0 4px 24px ${s.glow}`,
            animationDelay: `${i * 0.07}s`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.35)', letterSpacing: 1 }}>
                {s.label.toUpperCase()}
              </span>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 34, fontWeight: 900, color: s.accent }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* ── ARTICLES + USERS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

        {/* RECENT ARTICLES */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16, overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #F40756, #ff6b9d)',
            padding: '1rem 1.5rem',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            boxShadow: '0 4px 20px rgba(244,7,86,0.3)'
          }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 14, letterSpacing: 0.3 }}>📰 Recent Articles</span>
            <Link href="/admin/articles" className="manage-link" style={{
              color: '#fff', fontSize: 12, fontWeight: 700,
              background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.25)',
              padding: '4px 14px', borderRadius: 20
            }}>
              Manage All →
            </Link>
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
              <div style={{ width: 32, height: 32, border: '3px solid rgba(244,7,86,0.2)', borderTopColor: '#F40756', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }} />
              Loading...
            </div>
          ) : articles.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.25)' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>📰</div>
              <p style={{ fontSize: 13, marginBottom: 12 }}>No articles yet</p>
              <Link href="/admin/articles" style={{ color: '#F40756', fontWeight: 700, fontSize: 13 }}>+ Create Article</Link>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  {['Title', 'Date', 'Status'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.3)', letterSpacing: 1 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {articles.map(a => (
                  <tr key={a.id} className="row-hover" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '11px 16px', maxWidth: 200 }}>
                      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180, fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
                        {a.title}
                      </div>
                    </td>
                    <td style={{ padding: '11px 16px', fontSize: 12, color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>
                      {formatDate(a.published_at)}
                    </td>
                    <td style={{ padding: '11px 16px' }}>{statusBadge(a.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* USERS */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16, overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
        }}>
          {/* Header */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            padding: '1rem 1.5rem',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 14, letterSpacing: 0.3 }}>👥 Users</span>
            <span style={{
              color: '#F40756', fontSize: 12, fontWeight: 700,
              background: 'rgba(244,7,86,0.1)',
              border: '1px solid rgba(244,7,86,0.2)',
              padding: '3px 12px', borderRadius: 20
            }}>{users.length} total</span>
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
              <div style={{ width: 32, height: 32, border: '3px solid rgba(244,7,86,0.2)', borderTopColor: '#F40756', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }} />
              Loading...
            </div>
          ) : users.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>No users found</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  {['Name', 'Faculty', 'Role'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.3)', letterSpacing: 1 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="row-hover" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '11px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <div style={{
                          width: 30, height: 30,
                          background: 'linear-gradient(135deg, #F40756, #ff6b9d)',
                          borderRadius: '50%', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', color: '#fff',
                          fontSize: 12, fontWeight: 800, flexShrink: 0,
                          boxShadow: '0 0 8px rgba(244,7,86,0.3)'
                        }}>
                          {u.full_name?.charAt(0)?.toUpperCase()}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{u.full_name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '11px 16px', fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{u.faculty || '-'}</td>
                    <td style={{ padding: '11px 16px' }}>{roleBadge(u.role)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16, padding: '1.5rem',
        boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
          <div style={{ width: 4, height: 18, borderRadius: 2, background: 'linear-gradient(180deg, #F40756, #ff6b9d)' }} />
          <h3 style={{ fontSize: 14, fontWeight: 800, color: '#fff', letterSpacing: 0.3 }}>Quick Actions</h3>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/admin/articles" className="action-link" style={{
            background: 'linear-gradient(135deg, #F40756, #ff6b9d)',
            color: '#fff', padding: '10px 22px', borderRadius: 10,
            fontSize: 13, fontWeight: 800,
            boxShadow: '0 4px 18px rgba(244,7,86,0.4)',
            display: 'inline-block'
          }}>
            + New Article
          </Link>
          <Link href="/admin/articles" className="action-link" style={{
            background: 'rgba(255,255,255,0.07)',
            color: 'rgba(255,255,255,0.65)',
            border: '1px solid rgba(255,255,255,0.12)',
            padding: '10px 22px', borderRadius: 10,
            fontSize: 13, fontWeight: 600, display: 'inline-block'
          }}>
            📰 Manage Articles
          </Link>
          <Link href="/" className="action-link" style={{
            background: 'rgba(255,255,255,0.07)',
            color: 'rgba(255,255,255,0.65)',
            border: '1px solid rgba(255,255,255,0.12)',
            padding: '10px 22px', borderRadius: 10,
            fontSize: 13, fontWeight: 600, display: 'inline-block'
          }}>
            🌐 View Site
          </Link>
        </div>
      </div>
    </div>
  )
}