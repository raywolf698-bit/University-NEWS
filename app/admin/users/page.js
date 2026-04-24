"use client"
import React, { useState, useEffect } from 'react'

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [saving, setSaving] = useState(null)

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      setUsers(data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    setSaving(userId)
    try {
      await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, role: newRole })
      })
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
    } catch (err) {
      console.error(err)
      alert('Failed to update role')
    } finally {
      setSaving(null)
    }
  }

  const handleDelete = async (userId, name) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return
    try {
      await fetch('/api/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId })
      })
      setUsers(prev => prev.filter(u => u.id !== userId))
    } catch (err) {
      console.error(err)
      alert('Failed to delete user')
    }
  }

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'

  const filtered = users.filter(u => {
    const matchSearch = !search || u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
    const matchRole = !filterRole || u.role === filterRole
    return matchSearch && matchRole
  })

  const counts = {
    all: users.length,
    admin: users.filter(u => u.role === 'admin').length,
    student: users.filter(u => u.role === 'student').length,
  }

  return (
    <div style={{ fontFamily: "'Inter', 'Sarabun', sans-serif", color: '#fff' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Sarabun:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        a { text-decoration: none; color: inherit; }

        .user-row { transition: background 0.2s; }
        .user-row:hover { background: rgba(244,7,86,0.06) !important; }

        .filter-btn { transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); }
        .filter-btn:hover { transform: scale(1.05); }

        .delete-btn { transition: all 0.2s; }
        .delete-btn:hover { background: rgba(244,7,86,0.25) !important; transform: scale(1.04); }

        .stat-card { transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s; }
        .stat-card:hover { transform: translateY(-4px); box-shadow: 0 8px 30px rgba(244,7,86,0.18) !important; }

        select option { background: #1a1a2e; color: #fff; }
        select:focus { outline: none; border-color: #F40756 !important; box-shadow: 0 0 0 2px rgba(244,7,86,0.25); }
        input:focus { outline: none; border-color: rgba(244,7,86,0.5) !important; box-shadow: 0 0 0 2px rgba(244,7,86,0.15); }
        input::placeholder { color: rgba(255,255,255,0.25); }

        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); }
        ::-webkit-scrollbar-thumb { background: rgba(244,7,86,0.4); border-radius: 3px; }

        @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .fade-in { animation: fadeInUp 0.4s ease forwards; }
      `}</style>

      {/* TOP BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem' }} className="fade-in">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(244,7,86,0.12)', border: '1px solid rgba(244,7,86,0.25)', color: '#F40756', fontSize: 10, fontWeight: 800, padding: '3px 12px', borderRadius: 20, letterSpacing: 1, marginBottom: 10 }}>
            USER MANAGEMENT
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>Users</h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginTop: 3 }}>{users.length} registered users</p>
        </div>
      </div>

      {/* STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Users', value: counts.all,     accent: '#F40756', icon: '👥', glow: 'rgba(244,7,86,0.15)' },
          { label: 'Admins',      value: counts.admin,   accent: '#ff6b9d', icon: '🛡️', glow: 'rgba(255,107,157,0.12)' },
          { label: 'Students',    value: counts.student, accent: '#29abe2', icon: '🎓', glow: 'rgba(41,171,226,0.12)' },
        ].map((s, i) => (
          <div key={s.label} className="stat-card fade-in" style={{
            background: 'rgba(255,255,255,0.04)',
            border: `1px solid rgba(255,255,255,0.08)`,
            borderTop: `3px solid ${s.accent}`,
            borderRadius: 14, padding: '1.25rem 1.5rem',
            boxShadow: `0 4px 20px ${s.glow}`,
            animationDelay: `${i * 0.07}s`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.35)', letterSpacing: 1 }}>{s.label.toUpperCase()}</span>
              <span style={{ fontSize: 20 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 900, color: s.accent }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* FILTERS */}
      <div style={{ display: 'flex', gap: 10, marginBottom: '1.25rem', alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, pointerEvents: 'none' }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            style={{
              width: '100%', padding: '10px 14px 10px 36px',
              borderRadius: 10, border: '1.5px solid rgba(255,255,255,0.1)',
              fontSize: 13, background: 'rgba(255,255,255,0.05)',
              color: '#fff', transition: 'border-color 0.2s, box-shadow 0.2s'
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[['', 'All'], ['admin', 'Admin'], ['student', 'Student']].map(([val, label]) => (
            <button key={val} onClick={() => setFilterRole(val)} className="filter-btn" style={{
              padding: '9px 18px', borderRadius: 20, border: 'none', cursor: 'pointer',
              background: filterRole === val ? 'linear-gradient(135deg, #F40756, #ff6b9d)' : 'rgba(255,255,255,0.07)',
              color: filterRole === val ? '#fff' : 'rgba(255,255,255,0.5)',
              fontWeight: 700, fontSize: 12, letterSpacing: 0.4,
              boxShadow: filterRole === val ? '0 4px 15px rgba(244,7,86,0.35)' : 'none',
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16, overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
            <div style={{ width: 36, height: 36, border: '3px solid rgba(244,7,86,0.2)', borderTopColor: '#F40756', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
            Loading users...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.25)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
            <p style={{ fontSize: 14 }}>No users found</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                {['User', 'Email', 'Faculty', 'Role', 'Joined', 'Actions'].map(h => (
                  <th key={h} style={{
                    padding: '13px 16px', textAlign: 'left',
                    fontSize: 10, fontWeight: 800,
                    color: 'rgba(255,255,255,0.35)', letterSpacing: 1
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="user-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  {/* User */}
                  <td style={{ padding: '13px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{
                        width: 36, height: 36,
                        background: 'linear-gradient(135deg, #F40756, #ff6b9d)',
                        borderRadius: '50%', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: '#fff', fontWeight: 800,
                        fontSize: 14, flexShrink: 0,
                        boxShadow: '0 0 10px rgba(244,7,86,0.3)'
                      }}>
                        {u.full_name?.charAt(0)?.toUpperCase()}
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{u.full_name}</span>
                    </div>
                  </td>
                  {/* Email */}
                  <td style={{ padding: '13px 16px', fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{u.email}</td>
                  {/* Faculty */}
                  <td style={{ padding: '13px 16px', fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>{u.faculty || '-'}</td>
                  {/* Role */}
                  <td style={{ padding: '13px 16px' }}>
                    <select
                      value={u.role}
                      onChange={e => handleRoleChange(u.id, e.target.value)}
                      disabled={saving === u.id}
                      style={{
                        padding: '6px 12px', borderRadius: 8,
                        border: '1.5px solid rgba(255,255,255,0.12)',
                        fontSize: 12, fontWeight: 700, cursor: 'pointer',
                        background: u.role === 'admin'
                          ? 'rgba(244,7,86,0.15)'
                          : 'rgba(255,255,255,0.06)',
                        color: u.role === 'admin' ? '#F40756' : 'rgba(255,255,255,0.6)',
                        opacity: saving === u.id ? 0.5 : 1,
                        transition: 'all 0.2s'
                      }}
                    >
                      <option value="student">Student</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  {/* Joined */}
                  <td style={{ padding: '13px 16px', fontSize: 12, color: 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap' }}>
                    📅 {formatDate(u.created_at)}
                  </td>
                  {/* Actions */}
                  <td style={{ padding: '13px 16px' }}>
                    <button onClick={() => handleDelete(u.id, u.full_name)} className="delete-btn" style={{
                      background: 'rgba(244,7,86,0.12)',
                      color: '#F40756',
                      padding: '6px 14px', borderRadius: 8,
                      fontSize: 12, fontWeight: 700,
                      border: '1px solid rgba(244,7,86,0.2)',
                      cursor: 'pointer'
                    }}>🗑 Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}