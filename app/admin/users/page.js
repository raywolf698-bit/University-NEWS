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

  const roleBadge = (role) => {
    const map = {
      admin:   { bg: '#fce7f3', color: '#f40756' },
      student: { bg: '#f3f4f6', color: '#6b7280' },
    }
    const r = map[role] || map.student
    return <span style={{ background: r.bg, color: r.color, padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, textTransform: 'capitalize' }}>{role}</span>
  }

  const counts = {
    all: users.length,
    admin: users.filter(u => u.role === 'admin').length,
    student: users.filter(u => u.role === 'student').length,
  }

  return (
    <div style={{ fontFamily: "'Sarabun', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600;700;800&display=swap'); * { box-sizing: border-box; } a { text-decoration: none; color: inherit; } .row:hover { background: #fafafa; } select:focus, input:focus { outline: 2px solid #f40756; border-color: #f40756; }`}</style>

      {/* TOP BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e' }}>Users</h1>
          <p style={{ color: '#888', fontSize: 13, marginTop: 2 }}>{users.length} registered users</p>
        </div>
      </div>

      {/* STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Users', value: counts.all,     color: '#fb055f', icon: '👥' },
          { label: 'Admins',      value: counts.admin,   color: '#ee0c5f', icon: '🛡️' },
          { label: 'Students',    value: counts.student, color: '#6b7280', icon: '🎓' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 12, padding: '1rem 1.25rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderTop: `3px solid ${s.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#888' }}>{s.label.toUpperCase()}</span>
              <span style={{ fontSize: 18 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* FILTERS */}
      <div style={{ display: 'flex', gap: 10, marginBottom: '1rem', alignItems: 'center' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search by name or email..."
          style={{ flex: 1, padding: '9px 14px', borderRadius: 8, border: '1.5px solid #e0e0e0', fontSize: 13, background: '#fff' }}
        />
        <div style={{ display: 'flex', gap: 6 }}>
          {[['', 'All'], ['admin', 'Admin'], ['student', 'Student']].map(([val, label]) => (
            <button key={val} onClick={() => setFilterRole(val)} style={{
              padding: '8px 16px', borderRadius: 20, border: 'none', cursor: 'pointer',
              background: filterRole === val ? '#f4075e' : '#fff',
              color: filterRole === val ? '#fff' : '#555',
              fontWeight: 600, fontSize: 13,
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#888' }}>Loading users...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#aaa' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
            <p>No users found</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f8f8', borderBottom: '2px solid #eee' }}>
                {['User', 'Email', 'Faculty', 'Role', 'Joined', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#888', letterSpacing: 0.5 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="row" style={{ borderBottom: '1px solid #f0f0f0' }}>
                  {/* User */}
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, background: '#f40756', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
                        {u.full_name?.charAt(0)?.toUpperCase()}
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>{u.full_name}</span>
                    </div>
                  </td>
                  {/* Email */}
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#555' }}>{u.email}</td>
                  {/* Faculty */}
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#888' }}>{u.faculty || '-'}</td>
                  {/* Role — inline dropdown to change */}
                  <td style={{ padding: '12px 16px' }}>
                    <select
                      value={u.role}
                      onChange={e => handleRoleChange(u.id, e.target.value)}
                      disabled={saving === u.id}
                      style={{
                        padding: '5px 10px', borderRadius: 6, border: '1.5px solid #e0e0e0',
                        fontSize: 12, fontWeight: 600, cursor: 'pointer', background: '#fafafa',
                        opacity: saving === u.id ? 0.6 : 1
                      }}
                    >
                      <option value="student">Student</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  {/* Joined */}
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#aaa', whiteSpace: 'nowrap' }}>{formatDate(u.created_at)}</td>
                  {/* Actions */}
                  <td style={{ padding: '12px 16px' }}>
                    <button onClick={() => handleDelete(u.id, u.full_name)} style={{
                      background: '#fee2e2', color: '#991b1b', padding: '5px 12px',
                      borderRadius: 6, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer'
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