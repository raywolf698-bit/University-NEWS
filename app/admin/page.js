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
      published: { bg: '#dcfce7', color: '#16a34a', label: 'Published' },
      draft:     { bg: '#f3f4f6', color: '#6b7280', label: 'Draft' },
      review:    { bg: '#fef9c3', color: '#ca8a04', label: 'Pending' },
    }
    const s = map[status] || map.draft
    return <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>{s.label}</span>
  }

  const roleBadge = (role) => {
    const map = {
      admin:   { bg: '#fce7f3', color: '#f40756' },
      student: { bg: '#f3f4f6', color: '#6b7280' },
    }
    const r = map[role] || map.student
    return <span style={{ background: r.bg, color: r.color, padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, textTransform: 'capitalize' }}>{role}</span>
  }

  return (
    <div style={{ fontFamily: "'Sarabun', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600;700;800&display=swap'); * { box-sizing: border-box; } a { text-decoration: none; color: inherit; } .row:hover { background: #fafafa; }`}</style>

      {/* STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Articles', value: stats.total,     icon: '📰', color: '#f40756' },
          { label: 'Published',      value: stats.published, icon: '✅', color: '#16a34a' },
          { label: 'Pending Review', value: stats.pending,   icon: '⏳', color: '#ca8a04' },
          { label: 'Drafts',         value: stats.draft,     icon: '📝', color: '#6b7280' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: '1.25rem 1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderTop: `3px solid ${s.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#888', letterSpacing: 0.5 }}>{s.label.toUpperCase()}</span>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

        {/* RECENT ARTICLES */}
        <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ background: '#f40756', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>📰 Recent Articles</span>
            <Link href="/admin/articles" style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 600, background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: 4 }}>
              Manage All →
            </Link>
          </div>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Loading...</div>
          ) : articles.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#aaa' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>📰</div>
              <p style={{ fontSize: 13 }}>No articles yet</p>
              <Link href="/admin/articles" style={{ color: '#f40756', fontWeight: 700, fontSize: 13, marginTop: 8, display: 'inline-block' }}>+ Create Article</Link>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f8f8' }}>
                  {['Title', 'Date', 'Status'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#888' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {articles.map(a => (
                  <tr key={a.id} className="row" style={{ borderTop: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '10px 16px', fontSize: 13, fontWeight: 600, color: '#1a1a2e', maxWidth: 200 }}>
                      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180 }}>{a.title}</div>
                    </td>
                    <td style={{ padding: '10px 16px', fontSize: 12, color: '#888', whiteSpace: 'nowrap' }}>{formatDate(a.published_at)}</td>
                    <td style={{ padding: '10px 16px' }}>{statusBadge(a.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* USERS */}
        <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ background: '#1a1a2e', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>👥 Users</span>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{users.length} total</span>
          </div>
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>Loading...</div>
          ) : users.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#aaa' }}>No users found</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f8f8' }}>
                  {['Name', 'Faculty', 'Role'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#888' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="row" style={{ borderTop: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '10px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 28, height: 28, background: '#f40756', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                          {u.full_name?.charAt(0)}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>{u.full_name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px 16px', fontSize: 12, color: '#888' }}>{u.faculty || '-'}</td>
                    <td style={{ padding: '10px 16px' }}>{roleBadge(u.role)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div style={{ marginTop: '1.5rem', background: '#fff', borderRadius: 12, padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', marginBottom: '1rem' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/admin/articles" style={{ background: '#f40756', color: '#fff', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700 }}>
            + New Article
          </Link>
          <Link href="/admin/articles" style={{ background: '#f4f4f4', color: '#333', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
            📰 Manage Articles
          </Link>
          <Link href="/" style={{ background: '#f4f4f4', color: '#333', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
            🌐 View Site
          </Link>
        </div>
      </div>
    </div>
  )
}