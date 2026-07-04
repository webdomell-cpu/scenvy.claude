import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { C, grad } from '../tokens.js'
import { Eye, EyeOff } from 'lucide-react'

// Demo accounts — replace with real auth (Clerk, Firebase, Supabase, etc.)
const DEMO_ACCOUNTS = [
  { email: 'admin@scenvy.app',     password: 'admin123',  role: 'admin',  name: 'Dominik' },
  { email: 'venue@scenvy.app',     password: 'venue123',  role: 'tenant', name: 'Marina Group' },
]

export default function Login() {
  const nav = useNavigate()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleLogin = async () => {
    setError(''); setLoading(true)
    await new Promise(r => setTimeout(r, 600))

    const user = DEMO_ACCOUNTS.find(u => u.email === email && u.password === password)
    if (user) {
      localStorage.setItem('scenvy_user', JSON.stringify(user))
      nav(user.role === 'admin' ? '/admin' : '/dashboard')
    } else {
      setError('Invalid email or password.')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', background: C.bg, display: 'flex',
      alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter',sans-serif",
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Glows */}
      <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle,${C.purple}33 0%,transparent 70%)`, top: '-10%', left: '-10%', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle,${C.pink}22 0%,transparent 70%)`, bottom: '-10%', right: '-10%', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: 420, padding: '0 20px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: grad(C.purple, C.pink), display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 24, margin: '0 auto 14px' }}>S</div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2 }}>SCENVY</div>
          <div style={{ fontSize: 14, color: C.muted, marginTop: 6 }}>Sign in to your account</div>
        </div>

        {/* Card */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 22, padding: 32 }}>
          {/* Demo hint */}
          <div style={{ background: `${C.purple}18`, border: `1px solid ${C.purple}44`, borderRadius: 10, padding: '10px 14px', marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: C.purple, fontWeight: 700, marginBottom: 4 }}>DEMO ACCOUNTS</div>
            <div style={{ fontSize: 12, color: C.muted }}>Admin: admin@scenvy.app / admin123</div>
            <div style={{ fontSize: 12, color: C.muted }}>Venue: venue@scenvy.app / venue123</div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: C.muted, display: 'block', marginBottom: 6, fontWeight: 600 }}>EMAIL</label>
            <input
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@venue.com" type="email"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `1px solid ${C.border}`, background: C.bg, color: C.white, fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 12, color: C.muted, display: 'block', marginBottom: 6, fontWeight: 600 }}>PASSWORD</label>
            <div style={{ position: 'relative' }}>
              <input
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" type={showPw ? 'text' : 'password'}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                style={{ width: '100%', padding: '12px 44px 12px 14px', borderRadius: 10, border: `1px solid ${C.border}`, background: C.bg, color: C.white, fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
              />
              <button onClick={() => setShowPw(s => !s)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: C.muted, cursor: 'pointer' }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <div style={{ fontSize: 13, color: C.pink, marginBottom: 16, padding: '10px 14px', background: `${C.pink}18`, borderRadius: 8 }}>{error}</div>}

          <button onClick={handleLogin} disabled={loading} style={{
            width: '100%', padding: '13px 0', borderRadius: 12, border: 'none', cursor: loading ? 'wait' : 'pointer',
            background: loading ? C.dim : grad(C.purple, C.pink),
            color: C.white, fontWeight: 700, fontSize: 15, fontFamily: 'inherit',
            transition: 'all .2s'
          }}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <span style={{ fontSize: 13, color: C.muted }}>No account? </span>
            <span style={{ fontSize: 13, color: C.purple, cursor: 'pointer', fontWeight: 600 }}>Start free →</span>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <span onClick={() => nav('/')} style={{ fontSize: 13, color: C.muted, cursor: 'pointer' }}>← Back to scenvy.app</span>
        </div>
      </div>
    </div>
  )
}
