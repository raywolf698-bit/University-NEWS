"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState(1) // 1=email, 2=new password, 3=success
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // Password strength
  const getStrength = (p) => {
    if (!p) return { score: 0, label: '', color: 'transparent' }
    let score = 0
    if (p.length >= 8) score++
    if (/[A-Z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    if (score <= 1) return { score, label: 'Weak', color: '#F40756' }
    if (score <= 2) return { score, label: 'Fair', color: '#ff9500' }
    if (score <= 3) return { score, label: 'Good', color: '#29abe2' }
    return { score, label: 'Strong', color: '#00c47a' }
  }
  const strength = getStrength(newPassword)

  // Step 1: check email exists
  const handleCheckEmail = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 1, email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Email not found.')
        return
      }
      setStep(2)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: reset password
  const handleReset = async (e) => {
    e.preventDefault()
    setError('')
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 2, email, newPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Reset failed.')
        return
      }
      setStep(3)
      setTimeout(() => router.push('/login'), 3000)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      fontFamily: "'Inter', 'Sarabun', sans-serif",
      minHeight: '100vh',
      background: '#0d0d1a',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { text-decoration: none; color: inherit; }
        input:focus { outline: none; border-color: rgba(244,7,86,0.6) !important; box-shadow: 0 0 0 3px rgba(244,7,86,0.12) !important; }
        input::placeholder { color: rgba(255,255,255,0.2); }
        .submit-btn { transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s; }
        .submit-btn:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 8px 30px rgba(244,7,86,0.5) !important; }
        .submit-btn:active { transform: scale(0.97); }
        .eye-btn { background: none; border: none; cursor: pointer; color: rgba(255,255,255,0.3); font-size: 16px; padding: 0 4px; transition: color 0.2s; }
        .eye-btn:hover { color: rgba(255,255,255,0.7); }
        @keyframes fadeInUp { from { opacity:0; transform: translateY(30px); } to { opacity:1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity:0; transform: translateX(30px); } to { opacity:1; transform: translateX(0); } }
        @keyframes float1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(30px,-30px) scale(1.1); } }
        @keyframes float2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-20px,20px) scale(0.9); } }
        @keyframes successPop { 0% { transform: scale(0.5); opacity:0; } 70% { transform: scale(1.15); } 100% { transform: scale(1); opacity:1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .card { animation: fadeInUp 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .step-slide { animation: slideIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .success-icon { animation: successPop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
      `}</style>

      {/* BG BLOBS */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '10%', left: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(244,7,86,0.12) 0%, transparent 70%)', animation: 'float1 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(100,7,244,0.1) 0%, transparent 70%)', animation: 'float2 10s ease-in-out infinite' }} />
      </div>

      {/* HEADER */}
      <header style={{ background: 'rgba(13,13,26,0.8)', backdropFilter: 'blur(20px)', padding: '0 2rem', borderBottom: '1px solid rgba(244,7,86,0.15)', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', height: 64, gap: 12 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 42, height: 42, background: 'linear-gradient(135deg, #F40756, #ff6b9d)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: '#fff', boxShadow: '0 0 20px rgba(244,7,86,0.4)' }}>U</div>
            <div>
              <div style={{ color: '#fff', fontSize: 14, fontWeight: 800, letterSpacing: 1 }}>UNIVERSITY</div>
              <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, letterSpacing: 2 }}>NEWS PLATFORM</div>
            </div>
          </Link>
        </div>
      </header>

      {/* MAIN */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1rem', position: 'relative', zIndex: 10 }}>
        <div style={{ width: '100%', maxWidth: 440 }} className="card">

          {/* STEP INDICATOR */}
          {step < 3 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
              {[1, 2].map((s) => (
                <React.Fragment key={s}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: step >= s ? 'linear-gradient(135deg, #F40756, #ff6b9d)' : 'rgba(255,255,255,0.08)',
                    border: step >= s ? 'none' : '1px solid rgba(255,255,255,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 800,
                    color: step >= s ? '#fff' : 'rgba(255,255,255,0.3)',
                    boxShadow: step >= s ? '0 4px 12px rgba(244,7,86,0.4)' : 'none',
                    transition: 'all 0.3s',
                  }}>{s}</div>
                  {s < 2 && (
                    <div style={{ width: 40, height: 2, borderRadius: 1, background: step > s ? 'linear-gradient(90deg, #F40756, #ff6b9d)' : 'rgba(255,255,255,0.1)', transition: 'all 0.3s' }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* CARD */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(30px)',
            borderRadius: 20,
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(244,7,86,0.1)',
          }}>

            {/* ── STEP 1: EMAIL ── */}
            {step === 1 && (
              <>
                <div style={{ padding: '2.5rem 2rem 2rem', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(135deg, rgba(244,7,86,0.1) 0%, rgba(100,7,244,0.05) 100%)' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(244,7,86,0.15)', border: '1px solid rgba(244,7,86,0.3)', color: '#F40756', fontSize: 10, fontWeight: 800, padding: '4px 14px', borderRadius: 20, letterSpacing: 1.5, marginBottom: 16 }}>
                    UNIVERSITY NEWS PLATFORM
                  </div>
                  <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 900, letterSpacing: -0.5, marginBottom: 8 }}>
                    Forgot Password 🔑
                  </h1>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 1.6 }}>
                    Enter your registered email address and we'll let you reset your password directly.
                  </p>
                </div>

                <div style={{ padding: '2rem' }}>
                  {error && (
                    <div style={{ background: 'rgba(244,7,86,0.1)', border: '1px solid rgba(244,7,86,0.3)', borderRadius: 10, padding: '12px 16px', color: '#ff6b9d', fontSize: 13, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                      ⚠️ {error}
                    </div>
                  )}
                  <form onSubmit={handleCheckEmail}>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 8, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@university.edu"
                        required
                        style={{ width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 14, color: '#fff', transition: 'all 0.2s', fontFamily: 'inherit' }}
                      />
                    </div>
                    <button type="submit" disabled={loading} className="submit-btn" style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #F40756, #ff6b9d)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 20px rgba(244,7,86,0.4)', letterSpacing: 0.3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      {loading
                        ? <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Checking...</>
                        : 'Continue →'}
                    </button>
                  </form>

                  <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
                    Remember your password?{' '}
                    <Link href="/login" style={{ color: '#F40756', fontWeight: 700 }}>Sign in</Link>
                  </div>
                </div>
              </>
            )}

            {/* ── STEP 2: NEW PASSWORD ── */}
            {step === 2 && (
              <div className="step-slide">
                <div style={{ padding: '2.5rem 2rem 2rem', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'linear-gradient(135deg, rgba(244,7,86,0.1) 0%, rgba(100,7,244,0.05) 100%)' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(0,196,122,0.15)', border: '1px solid rgba(0,196,122,0.3)', color: '#00c47a', fontSize: 10, fontWeight: 800, padding: '4px 14px', borderRadius: 20, letterSpacing: 1.5, marginBottom: 16 }}>
                    ✓ EMAIL VERIFIED
                  </div>
                  <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 900, letterSpacing: -0.5, marginBottom: 8 }}>
                    New Password 🔒
                  </h1>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14 }}>
                    Set a new password for <span style={{ color: '#F40756', fontWeight: 600 }}>{email}</span>
                  </p>
                </div>

                <div style={{ padding: '2rem' }}>
                  {error && (
                    <div style={{ background: 'rgba(244,7,86,0.1)', border: '1px solid rgba(244,7,86,0.3)', borderRadius: 10, padding: '12px 16px', color: '#ff6b9d', fontSize: 13, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                      ⚠️ {error}
                    </div>
                  )}
                  <form onSubmit={handleReset}>
                    {/* New Password */}
                    <div style={{ marginBottom: '1.25rem' }}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 8, letterSpacing: 0.5, textTransform: 'uppercase' }}>New Password</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showNew ? 'text' : 'password'}
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          style={{ width: '100%', padding: '13px 44px 13px 16px', background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 10, fontSize: 14, color: '#fff', transition: 'all 0.2s', fontFamily: 'inherit' }}
                        />
                        <button type="button" className="eye-btn" onClick={() => setShowNew(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', fontSize: 16 }}>
                          {showNew ? '🙈' : '👁️'}
                        </button>
                      </div>
                      {/* Strength bar */}
                      {newPassword && (
                        <div style={{ marginTop: 8 }}>
                          <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                            {[1,2,3,4].map(i => (
                              <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength.score ? strength.color : 'rgba(255,255,255,0.1)', transition: 'all 0.3s' }} />
                            ))}
                          </div>
                          <span style={{ fontSize: 11, color: strength.color, fontWeight: 700 }}>{strength.label}</span>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div style={{ marginBottom: '1.75rem' }}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', marginBottom: 8, letterSpacing: 0.5, textTransform: 'uppercase' }}>Confirm Password</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showConfirm ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          style={{ width: '100%', padding: '13px 44px 13px 16px', background: 'rgba(255,255,255,0.06)', border: `1.5px solid ${confirmPassword && confirmPassword !== newPassword ? 'rgba(244,7,86,0.5)' : confirmPassword && confirmPassword === newPassword ? 'rgba(0,196,122,0.5)' : 'rgba(255,255,255,0.1)'}`, borderRadius: 10, fontSize: 14, color: '#fff', transition: 'all 0.2s', fontFamily: 'inherit' }}
                        />
                        <button type="button" onClick={() => setShowConfirm(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', fontSize: 16 }}>
                          {showConfirm ? '🙈' : '👁️'}
                        </button>
                      </div>
                      {confirmPassword && confirmPassword === newPassword && (
                        <p style={{ fontSize: 11, color: '#00c47a', marginTop: 6, fontWeight: 700 }}>✓ Passwords match</p>
                      )}
                      {confirmPassword && confirmPassword !== newPassword && (
                        <p style={{ fontSize: 11, color: '#F40756', marginTop: 6, fontWeight: 700 }}>✗ Passwords do not match</p>
                      )}
                    </div>

                    <button type="submit" disabled={loading} className="submit-btn" style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #F40756, #ff6b9d)', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 20px rgba(244,7,86,0.4)', letterSpacing: 0.3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                      {loading
                        ? <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Updating...</>
                        : 'Reset Password →'}
                    </button>
                  </form>

                  <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
                    <button onClick={() => { setStep(1); setError('') }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 13, cursor: 'pointer' }}>
                      ← Use a different email
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 3: SUCCESS ── */}
            {step === 3 && (
              <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                <div className="success-icon" style={{ fontSize: 64, marginBottom: 20, display: 'block' }}>✅</div>
                <h2 style={{ color: '#fff', fontSize: 26, fontWeight: 900, marginBottom: 10 }}>Password Updated!</h2>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
                  Your password has been reset successfully.<br />
                  Redirecting you to login...
                </p>
                <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#F40756', animation: `pulse 1s ${i * 0.2}s ease-in-out infinite` }} />
                  ))}
                </div>
                <style>{`@keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.2)} }`}</style>
                <Link href="/login" style={{ display: 'inline-block', marginTop: 24, color: '#F40756', fontSize: 13, fontWeight: 700 }}>
                  Go to Login now →
                </Link>
              </div>
            )}
          </div>

          {/* BACK */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>
              ← Back to Homepage
            </Link>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '1rem', textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>© {new Date().getFullYear()} University News Platform</p>
      </footer>
    </div>
  )
}