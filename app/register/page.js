"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm_password: '', role: 'student', faculty: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('')
    if (form.password !== form.confirm_password) { setError('Passwords do not match'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ full_name: form.full_name, email: form.email, password: form.password, role: form.role, faculty: form.faculty }) })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Registration failed'); return }
      setSuccess('Account created! Redirecting to login...')
      setTimeout(() => router.push('/login'), 2000)
    } catch { setError('Something went wrong. Please try again.') }
    finally { setLoading(false) }
  }

  const faculties = ['Business Administration', 'Engineering', 'Digital Innovation', 'Medicine', 'Liberal Arts', 'Communication Arts', 'Science & Technology', 'Law', 'Architecture', 'Education', 'Computer Science']

  const inputStyle = { width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 14, color: '#fff', transition: 'all 0.2s', fontFamily: 'inherit' }
  const labelStyle = { display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 8, letterSpacing: 0.5, textTransform: 'uppercase' }

  return (
    <div style={{ fontFamily: "'Inter', 'Sarabun', sans-serif", minHeight: '100vh', background: '#0d0d1a', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        button { font-family: inherit; }
        input:focus, select:focus { outline: none; border-color: rgba(244,7,86,0.6) !important; box-shadow: 0 0 0 3px rgba(244,7,86,0.12) !important; }
        input::placeholder { color: rgba(255,255,255,0.2); }
        select option { background: #1a1a2e; color: #fff; }
        .submit-btn { transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s; }
        .submit-btn:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 8px 30px rgba(244,7,86,0.5) !important; }
        .submit-btn:active { transform: scale(0.97); }
        @keyframes fadeInUp { from { opacity:0; transform: translateY(30px); } to { opacity:1; transform: translateY(0); } }
        @keyframes float1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(30px,-30px) scale(1.1); } }
        @keyframes float2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-20px,20px) scale(0.9); } }
        .card { animation: fadeInUp 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards; }

        .card-top { padding: 2.5rem 2rem 2rem; }
        .card-body { padding: 2rem; }
        .form-title { font-size: 28px; }
        .role-faculty-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem; }

        @media (max-width: 480px) {
          .card-top { padding: 1.75rem 1.25rem 1.5rem; }
          .card-body { padding: 1.25rem; }
          .form-title { font-size: 22px; }
          .main-wrap { padding: 2rem 1rem !important; }
          .role-faculty-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 360px) {
          .form-title { font-size: 20px; }
          .logo-text { display: none; }
        }
      `}</style>

      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '10%', right: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(244,7,86,0.12) 0%, transparent 70%)', animation: 'float1 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '10%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(100,7,244,0.1) 0%, transparent 70%)', animation: 'float2 10s ease-in-out infinite' }} />
      </div>

      <header style={{ background: 'rgba(13,13,26,0.8)', backdropFilter: 'blur(20px)', padding: '0 1.5rem', borderBottom: '1px solid rgba(244,7,86,0.15)', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', height: 64, gap: 12 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 42, height: 42, background: 'linear-gradient(135deg, #F40756, #ff6b9d)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: '#fff', boxShadow: '0 0 20px rgba(244,7,86,0.4)', flexShrink: 0 }}>U</div>
            <div className="logo-text">
              <div style={{ color: '#fff', fontSize: 14, fontWeight: 800, letterSpacing: 1 }}>UNIVERSITY</div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, letterSpacing: 2 }}>NEWS PLATFORM</div>
            </div>
          </Link>
        </div>
      </header>

      <div className="main-wrap" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', position: 'relative', zIndex: 10 }}>
        <div style={{ width: '100%', maxWidth: 520 }} className="card">
          <div style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(30px)', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 24px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(244,7,86,0.1)' }}>

            <div className="card-top" style={{ textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(135deg, rgba(244,7,86,0.1) 0%, rgba(100,7,244,0.05) 100%)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(244,7,86,0.15)', border: '1px solid rgba(244,7,86,0.3)', color: '#F40756', fontSize: 10, fontWeight: 800, padding: '4px 14px', borderRadius: 20, letterSpacing: 1.5, marginBottom: 16 }}>UNIVERSITY NEWS PLATFORM</div>
              <h1 className="form-title" style={{ color: '#fff', fontWeight: 900, letterSpacing: -0.5, marginBottom: 8 }}>Create Account 🎓</h1>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14 }}>Join the university community</p>
            </div>

            <div className="card-body">
              {error && <div style={{ background: 'rgba(244,7,86,0.1)', border: '1px solid rgba(244,7,86,0.3)', borderRadius: 10, padding: '12px 16px', color: '#ff6b9d', fontSize: 13, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>⚠️ {error}</div>}
              {success && <div style={{ background: 'rgba(0,196,122,0.1)', border: '1px solid rgba(0,196,122,0.3)', borderRadius: 10, padding: '12px 16px', color: '#00c47a', fontSize: 13, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: 8 }}>✅ {success}</div>}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={labelStyle}>Full Name</label>
                  <input type="text" name="full_name" value={form.full_name} onChange={handleChange} placeholder="Your full name" required style={inputStyle} />
                </div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={labelStyle}>Email Address</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@university.edu" required style={inputStyle} />
                </div>
                <div className="role-faculty-grid">
                  <div>
                    <label style={labelStyle}>Role</label>
                    <select name="role" value={form.role} onChange={handleChange} style={{ ...inputStyle, background: 'rgba(255,255,255,0.06)' }}>
                      <option value="student">Student</option>
                      <option value="staff">Staff</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Faculty</label>
                    <select name="faculty" value={form.faculty} onChange={handleChange} style={{ ...inputStyle, background: 'rgba(255,255,255,0.06)' }}>
                      <option value="">Select faculty</option>
                      {faculties.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={labelStyle}>Password</label>
                  <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" required style={inputStyle} />
                </div>
                <div style={{ marginBottom: '1.75rem' }}>
                  <label style={labelStyle}>Confirm Password</label>
                  <input type="password" name="confirm_password" value={form.confirm_password} onChange={handleChange} placeholder="Repeat your password" required style={inputStyle} />
                </div>
                <button type="submit" disabled={loading} className="submit-btn" style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #F40756, #ff6b9d)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 20px rgba(244,7,86,0.4)', letterSpacing: 0.3 }}>
                  {loading ? '✦ Creating account...' : 'Create Account →'}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
                Already have an account?{' '}<Link href="/login" style={{ color: '#F40756', fontWeight: 700 }}>Sign in</Link>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>← Back to Homepage</Link>
          </div>
        </div>
      </div>

      <footer style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '1rem', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>© {new Date().getFullYear()} University News Platform</p>
      </footer>
    </div>
  )
}