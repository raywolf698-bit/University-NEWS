"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingArticle, setEditingArticle] = useState(null)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState([])
  const [filterStatus, setFilterStatus] = useState('')
  const [form, setForm] = useState({
    title: '', excerpt: '', content: '', cover_image: '',
    article_type: 'news', status: 'draft', category_ids: []
  })

  useEffect(() => {
    fetchArticles()
    fetchCategories()
  }, [filterStatus])

  const fetchArticles = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ limit: 50 })
      if (filterStatus) params.append('status', filterStatus)
      const res = await fetch(`/api/articles?${params}`)
      const data = await res.json()
      setArticles(data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data.data || data || [])
    } catch (err) {
      console.error(err)
    }
  }

  const generateSlug = (title) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now()

  const resetForm = () => {
    setForm({
      title: '', excerpt: '', content: '', cover_image: '',
      article_type: 'news', status: 'draft', category_ids: []
    })
    setEditingArticle(null)
    setShowForm(false)
  }

  const handleEdit = async (article) => {
    try {
      const res = await fetch(`/api/articles/${article.id}`)
      const data = await res.json()
      const full = data.data || article

      const catRes = await fetch(`/api/articles/${article.id}/categories`)
      const catData = await catRes.json()
      const currentCatIds = (catData.data || []).map(c => String(c.id))

      setForm({
        title: full.title || '',
        excerpt: full.excerpt || '',
        content: full.content || '',
        cover_image: full.cover_image || '',
        article_type: full.article_type || 'news',
        status: full.status || 'draft',
        category_ids: currentCatIds
      })
      setEditingArticle(full)
      setShowForm(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      alert('Title and content are required')
      return
    }
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      const stored = localStorage.getItem('user')
      const user = stored ? JSON.parse(stored) : {}

      if (editingArticle) {
        await fetch(`/api/articles/${editingArticle.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            title: form.title,
            excerpt: form.excerpt,
            content: form.content,
            cover_image: form.cover_image,
            article_type: form.article_type,
            status: form.status,
            category_ids: form.category_ids.filter(id => id && id !== ''),
            published_at: form.status === 'published' ? new Date().toISOString() : null
          })
        })
      } else {
        await fetch('/api/articles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            author_id: user.id,
            title: form.title,
            slug: generateSlug(form.title),
            excerpt: form.excerpt,
            content: form.content,
            cover_image: form.cover_image,
            article_type: form.article_type,
            status: form.status,
            category_ids: form.category_ids.filter(id => id && id !== ''),
            published_at: form.status === 'published' ? new Date().toISOString() : null
          })
        })
      }
      resetForm()
      fetchArticles()
    } catch (err) {
      console.error(err)
      alert('Failed to save article')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this article?')) return
    try {
      const token = localStorage.getItem('token')
      await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchArticles()
    } catch (err) {
      console.error(err)
    }
  }

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'

  const statusBadge = (status) => {
    const map = {
      published: { bg: 'rgba(0,196,122,0.15)', color: '#00c47a', border: 'rgba(0,196,122,0.3)', label: 'Published' },
      draft:     { bg: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.45)', border: 'rgba(255,255,255,0.12)', label: 'Draft' },
      review:    { bg: 'rgba(255,149,0,0.15)', color: '#ff9500', border: 'rgba(255,149,0,0.3)', label: 'Pending' },
    }
    const s = map[status] || map.draft
    return (
      <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: 0.4 }}>
        {s.label}
      </span>
    )
  }

  const typeBadge = (type) => {
    const map = {
      news:          { bg: 'rgba(244,7,86,0.15)',   color: '#F40756',  border: 'rgba(244,7,86,0.3)' },
      research:      { bg: 'rgba(41,171,226,0.15)', color: '#29abe2',  border: 'rgba(41,171,226,0.3)' },
      event:         { bg: 'rgba(255,149,0,0.15)',  color: '#ff9500',  border: 'rgba(255,149,0,0.3)' },
      announcement:  { bg: 'rgba(244,7,86,0.15)',   color: '#F40756',  border: 'rgba(244,7,86,0.3)' },
      campus_update: { bg: 'rgba(0,196,122,0.15)',  color: '#00c47a',  border: 'rgba(0,196,122,0.3)' },
    }
    const t = map[type] || { bg: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.4)', border: 'rgba(255,255,255,0.1)' }
    return (
      <span style={{ background: t.bg, color: t.color, border: `1px solid ${t.border}`, padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: 0.4 }}>
        {type?.replace('_', ' ').toUpperCase()}
      </span>
    )
  }

  return (
    <div style={{ fontFamily: "'Inter', 'Sarabun', sans-serif", background: '#0d0d1a', minHeight: '100vh', padding: '2rem' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Sarabun:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        a { text-decoration: none; color: inherit; }
        textarea, input, select { font-family: 'Inter', 'Sarabun', sans-serif; }

        .row-hover { transition: background 0.15s; }
        .row-hover:hover { background: rgba(255,255,255,0.04) !important; }

        .filter-btn { transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); }
        .filter-btn:hover { transform: scale(1.05); }

        .action-btn { transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1); }
        .action-btn:hover { transform: translateY(-1px) scale(1.04); }
        .action-btn:active { transform: scale(0.96); }

        .primary-btn { transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); }
        .primary-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(244,7,86,0.5) !important; }
        .primary-btn:active { transform: scale(0.97); }

        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
        input:focus, textarea:focus, select:focus { border-color: rgba(244,7,86,0.5) !important; box-shadow: 0 0 0 3px rgba(244,7,86,0.1) !important; outline: none; }

        select option { background: #1a1a2e; color: #fff; }

        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── RESPONSIVE ── */

        /* Top bar */
        .page-topbar { flex-direction: row; align-items: center; }
        .page-title { font-size: 24px; }

        /* Form grid: 2 cols → 1 col on mobile */
        .form-grid { grid-template-columns: 1fr 1fr; }
        .form-full { grid-column: 1 / -1; }

        /* Filter buttons */
        .filter-row { flex-wrap: wrap; }

        /* Table scroll */
        .table-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }

        /* Hide less critical table cols */
        .col-author { display: table-cell; }
        .col-date   { display: table-cell; }
        .col-type   { display: table-cell; }
        .col-slug   { display: block; }

        /* Action buttons in table */
        .table-actions { flex-direction: row; }

        /* Page padding */
        .page-wrap { padding: 2rem; }

        /* ── TABLET (≤ 820px) ── */
        @media (max-width: 820px) {
          .col-author { display: none !important; }
          .col-date   { display: none !important; }
          .table-scroll table { min-width: 420px; }
        }

        /* ── MOBILE (≤ 600px) ── */
        @media (max-width: 600px) {
          .page-wrap { padding: 1rem !important; }

          .page-topbar { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; margin-bottom: 1.25rem !important; }
          .page-title { font-size: 20px !important; }
          .new-article-btn { width: 100% !important; justify-content: center !important; }

          .form-panel { padding: 1.25rem !important; }
          .form-grid { grid-template-columns: 1fr !important; }
          .form-full { grid-column: 1 !important; }

          .filter-row { gap: 6px !important; }
          .filter-btn { font-size: 11px !important; padding: 6px 14px !important; }

          .col-type   { display: none !important; }
          .col-slug   { display: none !important; }
          th, td { padding: 10px 10px !important; }

          .table-actions { flex-direction: column !important; gap: 4px !important; }
          .table-actions a, .table-actions button { width: 100% !important; text-align: center !important; justify-content: center !important; }

          .form-btns { flex-direction: column !important; }
          .form-btns button { width: 100% !important; justify-content: center !important; }
        }

        /* ── SMALL MOBILE (≤ 400px) ── */
        @media (max-width: 400px) {
          .page-title { font-size: 18px !important; }
        }
      `}</style>

      {/* ── TOP BAR ── */}
      <div className="page-topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{ width: 8, height: 32, borderRadius: 4, background: 'linear-gradient(180deg, #F40756, #ff6b9d)' }} />
            <h1 className="page-title" style={{ fontSize: 24, fontWeight: 900, color: '#fff', letterSpacing: -0.5 }}>
              Manage Articles
            </h1>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginLeft: 18 }}>
            {articles.length} articles total
          </p>
        </div>
        <button
          className="primary-btn new-article-btn"
          onClick={() => { setEditingArticle(null); setShowForm(!showForm) }}
          style={{
            background: showForm ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #F40756, #ff6b9d)',
            color: '#fff',
            border: showForm ? '1px solid rgba(255,255,255,0.15)' : 'none',
            padding: '10px 22px', borderRadius: 10,
            fontWeight: 700, fontSize: 14, cursor: 'pointer',
            boxShadow: showForm ? 'none' : '0 4px 20px rgba(244,7,86,0.4)',
            display: 'flex', alignItems: 'center', gap: 8
          }}
        >
          {showForm ? '✕  Cancel' : '+ New Article'}
        </button>
      </div>

      {/* ── CREATE / EDIT FORM ── */}
      {showForm && (
        <div className="form-panel" style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(244,7,86,0.35)',
          borderRadius: 16, padding: '2rem', marginBottom: '2rem',
          boxShadow: '0 0 40px rgba(244,7,86,0.08)',
          animation: 'slideDown 0.2s ease'
        }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: '#fff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ background: 'linear-gradient(135deg, #F40756, #ff6b9d)', borderRadius: 6, width: 28, height: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
              {editingArticle ? '✏️' : '✍️'}
            </span>
            {editingArticle ? 'Edit Article' : 'Create New Article'}
          </h2>

          <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            {/* Title */}
            <div className="form-full" style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Title *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Enter article title..." style={inputStyle} />
            </div>

            {/* Type */}
            <div>
              <label style={labelStyle}>Article Type *</label>
              <select value={form.article_type} onChange={e => setForm({ ...form, article_type: e.target.value })} style={inputStyle}>
                <option value="news">News</option>
                <option value="research">Research</option>
                <option value="event">Event</option>
                <option value="announcement">Announcement</option>
                <option value="campus_update">Campus Update</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label style={labelStyle}>Status *</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
                <option value="draft">Draft</option>
                <option value="review">Submit for Review</option>
                <option value="published">Published</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label style={labelStyle}>Faculty / Category</label>
              <select
                value={form.category_ids[0] || ''}
                onChange={e => setForm({ ...form, category_ids: e.target.value ? [e.target.value] : [] })}
                style={inputStyle}
              >
                <option value="">-- Select Faculty --</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Cover Image */}
            <div>
              <label style={labelStyle}>Cover Image URL</label>
              <input value={form.cover_image} onChange={e => setForm({ ...form, cover_image: e.target.value })}
                placeholder="https://..." style={inputStyle} />
            </div>

            {/* Excerpt */}
            <div className="form-full" style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Excerpt (short summary)</label>
              <textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })}
                placeholder="Brief summary of the article..." rows={2}
                style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            {/* Content */}
            <div className="form-full" style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Content *</label>
              <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                placeholder="Write the full article content here..." rows={10}
                style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
          </div>

          {/* Cover preview */}
          {form.cover_image && (
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Cover Preview</label>
              <img src={form.cover_image} alt="cover"
                style={{ height: 120, maxWidth: '100%', borderRadius: 10, objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }}
                onError={e => e.target.style.display = 'none'} />
            </div>
          )}

          <div className="form-btns" style={{ display: 'flex', gap: 10 }}>
            <button
              className="primary-btn"
              onClick={handleSubmit}
              disabled={saving}
              style={{
                background: 'linear-gradient(135deg, #F40756, #ff6b9d)',
                color: '#fff', border: 'none',
                padding: '11px 28px', borderRadius: 10, fontWeight: 700,
                fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.7 : 1,
                boxShadow: '0 4px 20px rgba(244,7,86,0.4)',
                display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              {saving ? 'Saving...' : editingArticle ? '💾  Save Changes' : '🚀  Publish Article'}
            </button>
            <button
              onClick={resetForm}
              style={{
                background: 'rgba(255,255,255,0.07)',
                color: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(255,255,255,0.12)',
                padding: '11px 22px', borderRadius: 10, fontWeight: 600,
                fontSize: 14, cursor: 'pointer'
              }}
            >Cancel</button>
          </div>
        </div>
      )}

      {/* ── FILTER ── */}
      <div className="filter-row" style={{ display: 'flex', gap: 8, marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {[['', 'All'], ['published', 'Published'], ['draft', 'Draft'], ['review', 'Pending']].map(([val, label]) => (
          <button key={val} className="filter-btn" onClick={() => setFilterStatus(val)} style={{
            padding: '7px 18px', borderRadius: 20, border: 'none', cursor: 'pointer',
            background: filterStatus === val ? 'linear-gradient(135deg, #F40756, #ff6b9d)' : 'rgba(255,255,255,0.07)',
            color: filterStatus === val ? '#fff' : 'rgba(255,255,255,0.5)',
            fontWeight: 700, fontSize: 12, letterSpacing: 0.5,
            boxShadow: filterStatus === val ? '0 4px 15px rgba(244,7,86,0.35)' : 'none',
          }}>{label}</button>
        ))}
      </div>

      {/* ── TABLE ── */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16, overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.3)' }}>
            <div style={{ width: 36, height: 36, border: '3px solid rgba(244,7,86,0.2)', borderTopColor: '#F40756', borderRadius: '50%', margin: '0 auto 14px', animation: 'spin 0.8s linear infinite' }} />
            Loading articles...
          </div>
        ) : articles.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>📰</div>
            <p style={{ fontSize: 15 }}>No articles yet. Click <strong style={{ color: '#F40756' }}>+ New Article</strong> to create one.</p>
          </div>
        ) : (
          <div className="table-scroll">
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 360 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <th style={thStyle}>Title</th>
                  <th className="col-type" style={thStyle}>Type</th>
                  <th className="col-author" style={thStyle}>Author</th>
                  <th className="col-date" style={thStyle}>Date</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map(a => (
                  <tr key={a.id} className="row-hover" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '14px 16px', maxWidth: 240 }}>
                      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 220, fontSize: 14, fontWeight: 600, color: '#fff' }}>
                        {a.title}
                      </div>
                      <div className="col-slug" style={{ color: 'rgba(255,255,255,0.25)', fontSize: 11, marginTop: 3 }}>/{a.slug}</div>
                    </td>
                    <td className="col-type" style={{ padding: '14px 16px' }}>{typeBadge(a.article_type)}</td>
                    <td className="col-author" style={{ padding: '14px 16px', fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{a.author_name}</td>
                    <td className="col-date" style={{ padding: '14px 16px', fontSize: 12, color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap' }}>{formatDate(a.published_at)}</td>
                    <td style={{ padding: '14px 16px' }}>{statusBadge(a.status)}</td>
                    <td style={{ padding: '14px 10px' }}>
                      <div className="table-actions" style={{ display: 'flex', gap: 6 }}>
                        <Link href={`/articles/${a.slug}`} className="action-btn" style={{
                          background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          padding: '5px 11px', borderRadius: 7, fontSize: 12, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4
                        }}>👁 View</Link>
                        <button onClick={() => handleEdit(a)} className="action-btn" style={{
                          background: 'rgba(255,149,0,0.12)', color: '#ff9500',
                          border: '1px solid rgba(255,149,0,0.25)',
                          padding: '5px 11px', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer'
                        }}>✏️ Edit</button>
                        <button onClick={() => handleDelete(a.id)} className="action-btn" style={{
                          background: 'rgba(244,7,86,0.1)', color: '#F40756',
                          border: '1px solid rgba(244,7,86,0.25)',
                          padding: '5px 11px', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer'
                        }}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

const thStyle = {
  padding: '14px 16px', textAlign: 'left',
  fontSize: 11, fontWeight: 700,
  color: 'rgba(255,255,255,0.3)',
  letterSpacing: 1, textTransform: 'uppercase',
  background: 'rgba(255,255,255,0.02)'
}

const labelStyle = {
  display: 'block', fontSize: 12, fontWeight: 700,
  color: 'rgba(255,255,255,0.5)', marginBottom: 6,
  letterSpacing: 0.5, textTransform: 'uppercase'
}

const inputStyle = {
  width: '100%', padding: '10px 14px', borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.1)',
  fontSize: 14, color: '#fff',
  outline: 'none',
  background: 'rgba(255,255,255,0.06)',
  transition: 'border-color 0.2s, box-shadow 0.2s'
}
