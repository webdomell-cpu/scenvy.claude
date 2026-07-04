import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { C, grad } from '../tokens.js'
import { TENANTS } from '../data.js'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Users, TrendingUp, MapPin, Film, Activity, LogOut, Crown, Shield, Globe, Bell, RefreshCw } from 'lucide-react'

const PLAN_C = { enterprise: C.purple, pro: C.blue, starter: C.muted }

const MRR_TREND = [
  { month: 'Jan', mrr: 498  },
  { month: 'Feb', mrr: 577  },
  { month: 'Mar', mrr: 656  },
  { month: 'Apr', mrr: 735  },
  { month: 'May', mrr: 756  },
  { month: 'Jun', mrr: 956  },
]

const FEATURE_FLAGS = [
  { n: 'AI Generator',   on: true,  c: C.purple },
  { n: 'Social Import',  on: true,  c: C.blue   },
  { n: 'Geo Targeting',  on: false, c: C.pink   },
  { n: 'Gamification',   on: false, c: C.orange },
  { n: 'White Label',    on: true,  c: C.purple },
  { n: 'API Access',     on: false, c: C.blue   },
  { n: 'Analytics Pro',  on: true,  c: C.green  },
  { n: 'Scheduling AI',  on: false, c: C.pink   },
]

export default function Admin() {
  const nav = useNavigate()
  const [tenants, setTenants] = useState(TENANTS)
  const [flags,   setFlags]   = useState(FEATURE_FLAGS)
  const [toast,   setToast]   = useState(null)

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const setPlan = (id, plan) => {
    setTenants(t => t.map(x => x.id === id ? { ...x, plan } : x))
    notify(`Plan updated to ${plan}`)
  }

  const toggleFlag = (i) => {
    const f = flags[i]
    setFlags(fs => fs.map((x, j) => i === j ? { ...x, on: !x.on } : x))
    notify(`${f.n} ${!f.on ? 'enabled' : 'disabled'}`)
  }

  const logout = () => { localStorage.removeItem('scenvy_user'); nav('/login') }

  const mrr   = tenants.reduce((s, t) => s + t.mrr,   0)
  const locs  = tenants.reduce((s, t) => s + t.locs,  0)
  const reels = tenants.reduce((s, t) => s + t.reels, 0)

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter',sans-serif", color: C.white }}>
      <style>{`@keyframes fadeUp { from { opacity:0;transform:translateY(12px) } to { opacity:1;transform:none } }`}</style>

      {/* Top Bar */}
      <div style={{ height: 58, background: C.card, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', padding: '0 28px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: grad(C.purple, C.pink), display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14 }}>S</div>
          <span style={{ fontWeight: 800, fontSize: 14, letterSpacing: 2 }}>SCENVY</span>
          <span style={{ fontSize: 11, color: C.muted, marginLeft: 4 }}>/ Super Admin</span>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: C.muted }}>Dominik · Admin</span>
          <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: `1px solid ${C.border}`, background: 'transparent', color: C.muted, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      <div style={{ padding: 28, maxWidth: 1300, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, color: C.pink, fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>SUPER ADMIN</div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>Global Overview 🛠️</div>
          <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>All tenants, billing, and platform settings in one place.</div>
        </div>

        {/* Global KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14, marginBottom: 28 }}>
          {[
            { l: 'Tenants',   v: tenants.length,     c: C.purple, i: <Users size={17} color={C.purple} />      },
            { l: 'MRR',       v: `€${mrr}`,          c: C.green,  i: <TrendingUp size={17} color={C.green} />  },
            { l: 'Locations', v: locs,               c: C.blue,   i: <MapPin size={17} color={C.blue} />       },
            { l: 'Reels',     v: reels,              c: C.pink,   i: <Film size={17} color={C.pink} />         },
            { l: 'Uptime',    v: '99.9%',            c: C.green,  i: <Activity size={17} color={C.green} />    },
          ].map((s, i) => (
            <div key={i} style={{ background: C.card, borderRadius: 14, padding: 18, border: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: C.muted }}>{s.l}</span>
                {s.i}
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, color: s.c }}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* MRR Chart + Plan Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 24 }}>
          <div style={{ background: C.card, borderRadius: 16, padding: 20, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>MRR Growth</div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={MRR_TREND}>
                <XAxis dataKey="month" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white }} formatter={(v) => [`€${v}`, 'MRR']} />
                <Line dataKey="mrr" stroke={C.green} strokeWidth={2.5} dot={{ fill: C.green, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: C.card, borderRadius: 16, padding: 20, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 18 }}>Plan Breakdown</div>
            {[
              { label: 'Enterprise', key: 'enterprise', color: C.purple },
              { label: 'Pro',        key: 'pro',        color: C.blue   },
              { label: 'Starter',    key: 'starter',    color: C.muted  },
            ].map(row => {
              const count  = tenants.filter(t => t.plan === row.key).length
              const rowMrr = tenants.filter(t => t.plan === row.key).reduce((s, t) => s + t.mrr, 0)
              return (
                <div key={row.key} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: row.color }}>{row.label}</span>
                    <span style={{ fontSize: 11, color: C.muted }}>{count} · €{rowMrr}/mo</span>
                  </div>
                  <div style={{ height: 6, background: C.card2, borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(count / tenants.length) * 100}%`, background: row.color, borderRadius: 3, transition: 'width .5s' }} />
                  </div>
                </div>
              )
            })}

            <div style={{ marginTop: 24, padding: 14, background: C.card2, borderRadius: 10 }}>
              <div style={{ fontSize: 10, color: C.muted, marginBottom: 5, letterSpacing: 1 }}>MONTHLY RECURRING REVENUE</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: C.green }}>€{mrr}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>+€{Math.round(mrr * 0.18)} vs last month</div>
            </div>
          </div>
        </div>

        {/* Tenant Table */}
        <div style={{ background: C.card, borderRadius: 16, padding: 24, border: `1px solid ${C.border}`, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>All Tenants</div>
            <button onClick={() => notify('Invite flow — connect to your auth provider')} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: C.purple, color: C.white, cursor: 'pointer', fontWeight: 600, fontSize: 13, fontFamily: 'inherit' }}>
              + Invite Tenant
            </button>
          </div>

          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 0.7fr 0.7fr 0.8fr 0.8fr', gap: 0, paddingBottom: 10, borderBottom: `1px solid ${C.border}`, marginBottom: 4 }}>
            {['Tenant', 'Plan', 'Locs', 'Reels', 'MRR', 'Status'].map(h => (
              <div key={h} style={{ fontSize: 10, color: C.muted, fontWeight: 700, letterSpacing: 1 }}>{h}</div>
            ))}
          </div>

          {tenants.map(t => (
            <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 0.7fr 0.7fr 0.8fr 0.8fr', gap: 0, padding: '13px 0', borderBottom: `1px solid ${C.border}`, alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{t.name}</div>
                <div style={{ fontSize: 10, color: C.muted }}>since {t.since}</div>
              </div>

              <div>
                <select value={t.plan} onChange={e => setPlan(t.id, e.target.value)} style={{
                  fontSize: 10, fontWeight: 700, padding: '4px 8px', borderRadius: 7, border: 'none',
                  cursor: 'pointer', background: `${PLAN_C[t.plan]}28`, color: PLAN_C[t.plan],
                  outline: 'none', fontFamily: 'inherit'
                }}>
                  <option value="starter">STARTER</option>
                  <option value="pro">PRO</option>
                  <option value="enterprise">ENT.</option>
                </select>
              </div>

              <div style={{ fontSize: 13, fontWeight: 700, color: C.blue }}>{t.locs}</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{t.reels}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.green }}>
                {t.mrr > 0 ? `€${t.mrr}` : <span style={{ color: C.dim }}>—</span>}
              </div>

              <div>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20,
                  background: t.status === 'active' ? `${C.green}22` : `${C.orange}22`,
                  color: t.status === 'active' ? C.green : C.orange,
                  border: `1px solid ${t.status === 'active' ? C.green : C.orange}44`
                }}>
                  {t.status === 'active' ? '● Active' : '⏳ Trial'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Flags + System Health */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
          {/* Feature flags */}
          <div style={{ background: C.card, borderRadius: 16, padding: 24, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 18 }}>Feature Flags</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
              {flags.map((f, i) => (
                <div key={i} onClick={() => toggleFlag(i)} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 14px', background: C.card2, borderRadius: 10, cursor: 'pointer',
                  border: `1px solid ${f.on ? f.c + '44' : C.border}`, transition: 'border .2s'
                }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: f.on ? C.white : C.muted }}>{f.n}</span>
                  <div style={{ width: 36, height: 20, borderRadius: 10, background: f.on ? f.c : C.dim, position: 'relative', transition: 'background .2s', flexShrink: 0 }}>
                    <div style={{ width: 14, height: 14, borderRadius: '50%', background: C.white, position: 'absolute', top: 3, left: f.on ? 18 : 4, transition: 'left .2s' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System health */}
          <div style={{ background: C.card, borderRadius: 16, padding: 24, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 18 }}>System Health</div>
            {[
              { label: 'API Response',   value: '48ms',  status: 'good'    },
              { label: 'CDN (Videos)',    value: '99.9%', status: 'good'    },
              { label: 'AI Generator',   value: 'Online',status: 'good'    },
              { label: 'Auth Service',   value: 'Online',status: 'good'    },
              { label: 'DB (Postgres)',  value: '12ms',  status: 'good'    },
              { label: 'Email Service',  value: 'Online',status: 'good'    },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 5 ? `1px solid ${C.border}` : 'none' }}>
                <span style={{ fontSize: 13, color: C.muted }}>{s.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.status === 'good' ? C.green : C.orange }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: s.status === 'good' ? C.green : C.orange }}>{s.value}</span>
                </div>
              </div>
            ))}

            <button onClick={() => notify('Health check refreshed')} style={{ width: '100%', marginTop: 16, padding: '9px 0', borderRadius: 9, border: `1px solid ${C.border}`, background: 'transparent', color: C.muted, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'inherit' }}>
              <RefreshCw size={13} /> Refresh Status
            </button>
          </div>
        </div>

        {/* Global Actions */}
        <div style={{ marginTop: 24, background: C.card, borderRadius: 16, padding: 24, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 18 }}>Global Actions</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { label: '📧 Send Announcement',  action: () => notify('Email modal — connect to SendGrid or Resend')    },
              { label: '💾 Export All Data',     action: () => notify('CSV export — connect to your DB')                },
              { label: '🔑 Reset API Keys',      action: () => notify('API key rotation — implement in your backend')   },
              { label: '📊 Full Analytics',      action: () => notify('Connect Mixpanel, Amplitude or PostHog')         },
              { label: '🌍 CDN Purge',           action: () => notify('CDN cache purged')                               },
              { label: '⚙️  Maintenance Mode',  action: () => notify('Maintenance mode toggled')                       },
            ].map((a, i) => (
              <button key={i} onClick={a.action} style={{ padding: '10px 18px', borderRadius: 9, border: `1px solid ${C.border}`, background: C.card2, color: C.muted, cursor: 'pointer', fontSize: 13, fontWeight: 500, fontFamily: 'inherit', transition: 'color .15s, border-color .15s' }}
                onMouseEnter={e => { e.currentTarget.style.color = C.white; e.currentTarget.style.borderColor = C.purple }}
                onMouseLeave={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = C.border }}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', background: C.purple, color: C.white, padding: '12px 24px', borderRadius: 14, fontSize: 13, fontWeight: 600, zIndex: 9999, animation: 'fadeUp .25s ease' }}>
          {toast}
        </div>
      )}
    </div>
  )
}
