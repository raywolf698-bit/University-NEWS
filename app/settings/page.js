"use client"
import { useEffect, useState, useRef } from 'react'
import useAuthRedirect from '../../utils/useAuthRedirect'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const { user, authChecked } = useAuthRedirect()
  const fileRef = useRef()
  const [form, setForm] = useState({ full_name: '', bio: '', faculty: '' })
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' })
  const [saving, setSaving] = useState(false)
  const [savingPw, setSavingPw] = useState(false)
  const [msg, setMsg] = useState('')
  const [pwMsg, setPwMsg] = useState('')
  const [activeTab, setActiveTab] = useState('profile')
  const [avatarPreview, setAvatarPreview] = useState(null)
  const router = useRouter()

  const faculties = ['Business Administration', 'Engineering', 'Digital Innovation', 'Medicine', 'Liberal Arts', 'Communication Arts', 'Computer Science']

  useEffect(() => {
    if (authChecked && user) {
      setForm({ full_name: user.full_name || '', bio: user.bio || '', faculty: user.faculty || '' })
      setAvatarPreview(user.avatar_url || null)
    }
  }, [authChecked, user])

  const handleSaveProfile = async () => {
    setSaving(true); setMsg('')
    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, ...form })
      })
      const data = await res.json()
      if (res.ok) {
        const updated = { ...user, ...form }
        localStorage.setItem('user', JSON.stringify(updated))
        setMsg('✅ Profile updated successfully!')
        setTimeout(() => router.push('/profile'), 1000)
      } else {
        setMsg('❌ ' + (data.error || 'Update failed'))
      }
    } catch { setMsg('❌ Something went wrong') }
    finally { setSaving(false) }
  }

  const handleChangePassword = async () => {
    if (passwords.newPass !== passwords.confirm) { setPwMsg('❌ Passwords do not match'); return }
    setSavingPw(true); setPwMsg('')
    try {
      const res = await fetch('/api/users/me/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, current_password: passwords.current, new_password: passwords.newPass })
      })
      const data = await res.json()
      setPwMsg(res.ok ? '✅ Password changed successfully!' : '❌ ' + (data.error || 'Failed'))
      if (res.ok) setPasswords({ current: '', newPass: '', confirm: '' })
    } catch { setPwMsg('❌ Something went wrong') }
    finally { setSavingPw(false) }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setAvatarPreview(URL.createObjectURL(file))
    const formData = new FormData()
    formData.append('avatar', file)
    formData.append('user_id', user.id)
    console.log('uploading avatar for user:', user.id)
    const res = await fetch('/api/users/me/avatar', { method: 'POST', body: formData })
    console.log('avatar response status:', res.status)
    const data = await res.json()
    console.log('avatar response data:', data)
    if (res.ok) {
      const updated = { ...user, avatar_url: data.avatar_url }
      localStorage.setItem('user', JSON.stringify(updated))
      setMsg('✅ Avatar updated!')
    } else {
      setMsg('❌ ' + (data.error || 'Upload failed'))
    }
  }

  const initials = user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  if (!user) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0d0d1a', color: '#fff', fontFamily: 'sans-serif' }}>
      Loading...
    </div>
  )

  const tabStyle = (t) => ({
    padding: '12px 28px', border: 'none', cursor: 'pointer',
    fontSize: 13, fontWeight: 700, letterSpacing: 0.5,
    background: activeTab === t
      ? 'linear-gradient(135deg, #F40756, #ff6b9d)'
      : 'transparent',
    color: activeTab === t ? '#fff' : 'rgba(255,255,255,0.4)',
    borderRadius: activeTab === t ? 8 : 0,
    transition: 'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
    boxShadow: activeTab === t ? '0 4px 15px rgba(244,7,86,0.35)' : 'none',
  })

  const inputStyle = {
    width: '100%', padding: '13px 16px',
    background: 'rgba(255,255,255,0.06)',
    border: '1.5px solid rgba(255,255,255,0.1)',
    borderRadius: 10, fontSize: 14,
    color: '#fff', outline: 'none',
    fontFamily: 'inherit', transition: 'all 0.2s'
  }

  const labelStyle = {
    display: 'block', fontSize: 12,
    fontWeight: 700, color: 'rgba(255,255,255,0.5)',
    marginBottom: 8, letterSpacing: 0.5, textTransform: 'uppercase'
  }

  return (
    <div style={{ fontFamily: "'Inter', 'Sarabun', sans-serif", background: '#0d0d1a', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        input:focus, select:focus, textarea:focus { border-color: rgba(244,7,86,0.6) !important; box-shadow: 0 0 0 3px rgba(244,7,86,0.12) !important; outline: none; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
        select option { background: #1a1a2e; color: #fff; }
        .save-btn { transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s; }
        .save-btn:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 8px 30px rgba(244,7,86,0.5) !important; }
        .save-btn:active { transform: scale(0.97); }
        .avatar-btn:hover { opacity: 0.85; transform: scale(1.05); }
        .avatar-btn { transition: all 0.2s; }
        @keyframes fadeInUp { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
        @keyframes float1 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(20px,-20px); } }
        @keyframes float2 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-20px,20px); } }
        .fade-in { animation: fadeInUp 0.5s ease forwards; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: rgba(244,7,86,0.4); border-radius: 3px; }
      `}</style>

      {/* BG BLOBS */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '5%', right: '5%', width: 350, height: 350, background: 'radial-gradient(circle, rgba(244,7,86,0.1) 0%, transparent 70%)', animation: 'float1 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: 250, height: 250, background: 'radial-gradient(circle, rgba(100,7,244,0.08) 0%, transparent 70%)', animation: 'float2 10s ease-in-out infinite' }} />
      </div>

      {/* HEADER */}
      <header style={{ background: 'rgba(13,13,26,0.8)', backdropFilter: 'blur(20px)', padding: '0 2rem', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid rgba(244,7,86,0.15)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 42, height: 42, background: 'linear-gradient(135deg, #F40756, #ff6b9d)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 18, boxShadow: '0 0 20px rgba(244,7,86,0.4)' }}>U</div>
            <div>
              <div style={{ color: '#fff', fontSize: 14, fontWeight: 800, letterSpacing: 1 }}>UNIVERSITY</div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, letterSpacing: 2 }}>NEWS PLATFORM</div>
            </div>
          </Link>
          <Link href="/profile" style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
            ← Back to Profile
          </Link>
        </div>
      </header>

      <main style={{ maxWidth: 680, margin: '2.5rem auto', padding: '0 1.5rem', position: 'relative', zIndex: 10 }} className="fade-in">

        {/* TITLE */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: -0.5, marginBottom: 6 }}>
            Account <span style={{ background: 'linear-gradient(135deg, #F40756, #ff6b9d)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Settings</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>Manage your profile and security preferences</p>
        </div>

        {/* AVATAR SECTION */}
        <div style={{
          background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16,
          padding: '1.5rem', marginBottom: '1.5rem',
          display: 'flex', alignItems: 'center', gap: '1.5rem'
        }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            {avatarPreview
              ? <img src={avatarPreview} alt="" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '3px solid #F40756', boxShadow: '0 0 20px rgba(244,7,86,0.3)' }} />
              : <div style={{ width: 72, height: 72, background: 'linear-gradient(135deg, #F40756, #ff6b9d)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 24, boxShadow: '0 0 20px rgba(244,7,86,0.3)' }}>{initials}</div>
            }
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{user.full_name}</div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 12 }}>{user.email}</div>
            <button className="avatar-btn" onClick={() => fileRef.current?.click()} style={{
              background: 'rgba(244,7,86,0.15)', border: '1px solid rgba(244,7,86,0.3)',
              color: '#F40756', padding: '7px 18px', borderRadius: 8,
              fontSize: 12, fontWeight: 700, cursor: 'pointer', letterSpacing: 0.5
            }}>📷 Change Avatar</button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarUpload} />
          </div>
        </div>

        {/* TABS */}
        <div style={{
          background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16,
          overflow: 'hidden'
        }}>
          {/* TAB BUTTONS */}
          <div style={{ display: 'flex', gap: 8, padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
            <button style={tabStyle('profile')} onClick={() => setActiveTab('profile')}>👤 Profile Info</button>
            <button style={tabStyle('password')} onClick={() => setActiveTab('password')}>🔒 Password</button>
          </div>

          <div style={{ padding: '2rem' }}>
            {activeTab === 'profile' && (
              <>
                {msg && (
                  <div style={{
                    background: msg.startsWith('✅') ? 'rgba(0,196,122,0.1)' : 'rgba(244,7,86,0.1)',
                    border: `1px solid ${msg.startsWith('✅') ? 'rgba(0,196,122,0.3)' : 'rgba(244,7,86,0.3)'}`,
                    color: msg.startsWith('✅') ? '#00c47a' : '#ff6b9d',
                    borderRadius: 10, padding: '12px 16px', fontSize: 13, marginBottom: '1.5rem'
                  }}>{msg}</div>
                )}

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={labelStyle}>Full Name</label>
                  <input style={inputStyle} value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={labelStyle}>Bio</label>
                  <textarea style={{ ...inputStyle, height: 100, resize: 'vertical' }} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Tell us about yourself..." />
                </div>

                <div style={{ marginBottom: '1.75rem' }}>
                  <label style={labelStyle}>Faculty</label>
                  <select style={inputStyle} value={form.faculty} onChange={e => setForm({ ...form, faculty: e.target.value })}>
                    <option value="">Select Faculty</option>
                    {faculties.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>

                <button onClick={handleSaveProfile} disabled={saving} className="save-btn" style={{
                  width: '100%', padding: '14px',
                  background: saving ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #F40756, #ff6b9d)',
                  color: saving ? 'rgba(255,255,255,0.3)' : '#fff',
                  border: 'none', borderRadius: 10,
                  fontSize: 15, fontWeight: 800,
                  cursor: saving ? 'not-allowed' : 'pointer',
                  boxShadow: saving ? 'none' : '0 4px 20px rgba(244,7,86,0.4)',
                  letterSpacing: 0.3
                }}>
                  {saving ? '✦ Saving...' : 'Save Changes →'}
                </button>
              </>
            )}

            {activeTab === 'password' && (
              <>
                {pwMsg && (
                  <div style={{
                    background: pwMsg.startsWith('✅') ? 'rgba(0,196,122,0.1)' : 'rgba(244,7,86,0.1)',
                    border: `1px solid ${pwMsg.startsWith('✅') ? 'rgba(0,196,122,0.3)' : 'rgba(244,7,86,0.3)'}`,
                    color: pwMsg.startsWith('✅') ? '#00c47a' : '#ff6b9d',
                    borderRadius: 10, padding: '12px 16px', fontSize: 13, marginBottom: '1.5rem'
                  }}>{pwMsg}</div>
                )}

                {[['Current Password', 'current'], ['New Password', 'newPass'], ['Confirm New Password', 'confirm']].map(([label, key]) => (
                  <div key={key} style={{ marginBottom: '1.25rem' }}>
                    <label style={labelStyle}>{label}</label>
                    <input type="password" style={inputStyle} value={passwords[key]} onChange={e => setPasswords({ ...passwords, [key]: e.target.value })} placeholder="••••••••" />
                  </div>
                ))}

                <button onClick={handleChangePassword} disabled={savingPw} className="save-btn" style={{
                  width: '100%', padding: '14px',
                  background: savingPw ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #F40756, #ff6b9d)',
                  color: savingPw ? 'rgba(255,255,255,0.3)' : '#fff',
                  border: 'none', borderRadius: 10,
                  fontSize: 15, fontWeight: 800,
                  cursor: savingPw ? 'not-allowed' : 'pointer',
                  boxShadow: savingPw ? 'none' : '0 4px 20px rgba(244,7,86,0.4)',
                  letterSpacing: 0.3
                }}>
                  {savingPw ? '✦ Changing...' : 'Change Password →'}
                </button>
              </>
            )}
          </div>
        </div>
      </main>

      <footer style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '1.5rem', textAlign: 'center', marginTop: '3rem', position: 'relative', zIndex: 10 }}>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>© {new Date().getFullYear()} University News Platform</p>
      </footer>
    </div>
  )
}