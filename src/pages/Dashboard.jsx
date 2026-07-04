import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { C, grad } from '../tokens.js'
import { REELS_SEED, LOCATIONS_SEED, CHART_DATA } from '../data.js'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import {
  Home, Film, MapPin, BarChart2, Sparkles, Settings, Menu,
  QrCode, Eye, MousePointer, Video, Plus, Trash2, RefreshCw,
  Copy, LogOut
} from 'lucide-react'

// ─── Shared helpers ───────────────────────────────────────
const pill = (label, color) => (
  <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: `${color}28`, color, border: `1px solid ${color}44` }}>
    {label}
  </span>
)

function StatCard({ label, value, delta, icon, color }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontSize: 12, color: C.muted }}>{label}</span>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>{value}</div>
      {delta && <div style={{ fontSize: 12, color: C.green }}>{delta}</div>}
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────
function Sidebar({ page, setPage, open, setOpen }) {
  const nav = useNavigate()
  const navItems = [
    { id: 'overview',  label: 'Overview',     icon: <Home size={17} />,     badge: null  },
    { id: 'reels',     label: 'Reels',        icon: <Film size={17} />,     badge: null  },
    { id: 'locations', label: 'Locations',    icon: <MapPin size={17} />,   badge: null  },
    { id: 'analytics', label: 'Analytics',    icon: <BarChart2 size={17} />,badge: null  },
    { id: 'ai',        label: 'AI Generator', icon: <Sparkles size={17} />, badge: '✨'  },
    { id: 'settings',  label: 'Settings',     icon: <Settings size={17} />, badge: null  },
  ]

  const logout = () => { localStorage.removeItem('scenvy_user'); nav('/login') }

  return (
    <div style={{ width: open ? 220 : 58, background: C.card, borderRight: `1px solid ${C.border}`, flexShrink: 0, display: 'flex', flexDirection: 'column', transition: 'width .3s', overflow: 'hidden' }}>
      {open && (
        <div style={{ padding: '14px 14px 12px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 10, color: C.muted, marginBottom: 8, letterSpacing: 1 }}>TENANT</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 10px', background: C.card2, borderRadius: 9 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: grad(C.purple, C.pink), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0 }}>M</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700 }}>Marina Group</div>
              <div style={{ fontSize: 10, color: C.purple }}>Enterprise ✓</div>
            </div>
          </div>
        </div>
      )}

      <nav style={{ padding: '10px 10px', flex: 1 }}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => setPage(item.id)} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 10px', borderRadius: 9, border: 'none', cursor: 'pointer',
            background: page === item.id ? `${C.purple}22` : 'transparent',
            color: page === item.id ? C.white : C.muted, marginBottom: 2,
            justifyContent: open ? 'flex-start' : 'center', fontFamily: 'inherit'
          }}>
            <span style={{ color: page === item.id ? C.purple : C.muted, flexShrink: 0 }}>{item.icon}</span>
            {open && <>
              <span style={{ fontSize: 13, fontWeight: page === item.id ? 600 : 400, flex: 1, textAlign: 'left' }}>{item.label}</span>
              {item.badge && <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 10, background: `${C.pink}33`, color: C.pink }}>{item.badge}</span>}
            </>}
          </button>
        ))}
      </nav>

      <div style={{ padding: '0 10px 12px' }}>
        <button onClick={logout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 10px', borderRadius: 9, border: 'none', cursor: 'pointer', background: 'transparent', color: C.muted, justifyContent: open ? 'flex-start' : 'center', fontFamily: 'inherit' }}>
          <LogOut size={17} />
          {open && <span style={{ fontSize: 13 }}>Log out</span>}
        </button>
        <button onClick={() => setOpen(o => !o)} style={{ width: '100%', padding: 10, borderRadius: 8, border: `1px solid ${C.border}`, background: 'transparent', color: C.muted, cursor: 'pointer', display: 'flex', justifyContent: 'center', marginTop: 8, fontFamily: 'inherit' }}>
          <Menu size={16} />
        </button>
      </div>
    </div>
  )
}

// ─── Pages ────────────────────────────────────────────────
function Overview({ setPage, reels, locs }) {
  const liveReels = reels.filter(r => r.status === 'live').length
  return (
    <div>
      <div style={{ marginBottom: 26 }}>
        <div style={{ fontSize: 11, color: C.pink, fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>DASHBOARD</div>
        <div style={{ fontSize: 26, fontWeight: 800 }}>Good evening, Marina Group 👋</div>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Here's your performance for today.</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
        <StatCard label="Total Scans"    value="3,083" delta="+18% this week" icon={<QrCode size={18} color={C.purple} />}      color={C.purple} />
        <StatCard label="Avg Watch Rate" value="80%"   delta="+5% this week"  icon={<Eye size={18} color={C.pink} />}           color={C.pink}   />
        <StatCard label="CTA Clicks"     value="847"   delta="+31% this week" icon={<MousePointer size={18} color={C.blue} />}  color={C.blue}   />
        <StatCard label="Live Reels"     value={liveReels} delta="active now" icon={<Video size={18} color={C.green} />}        color={C.green}  />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: C.card, borderRadius: 16, padding: 20, border: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Recent Reels</span>
            <button onClick={() => setPage('reels')} style={{ fontSize: 12, color: C.purple, background: 'none', border: 'none', cursor: 'pointer' }}>View all →</button>
          </div>
          {reels.slice(0, 5).map(r => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: `${r.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>{r.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{r.title}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{r.loc}</div>
              </div>
              {pill(r.status === 'live' ? '● LIVE' : r.status.toUpperCase(), r.status === 'live' ? C.green : r.status === 'scheduled' ? C.orange : C.muted)}
            </div>
          ))}
        </div>

        <div style={{ background: C.card, borderRadius: 16, padding: 20, border: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontSize: 14, fontWeight: 700 }}>Locations</span>
            <button onClick={() => setPage('locations')} style={{ fontSize: 12, color: C.purple, background: 'none', border: 'none', cursor: 'pointer' }}>Manage →</button>
          </div>
          {locs.map(l => (
            <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.active ? C.green : C.dim, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{l.name}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{l.city}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{l.scans.toLocaleString()}</div>
                <div style={{ fontSize: 10, color: C.blue }}>{l.wr}% watch</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Reels({ reels, setReels, notify }) {
  const [filter, setFilter] = useState('all')
  const shown = filter === 'all' ? reels : reels.filter(r => r.status === filter)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, color: C.pink, fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>CONTENT</div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>Reels</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => notify('✨ Switch to AI Generator tab')} style={{ padding: '9px 16px', borderRadius: 9, border: `1px solid ${C.purple}`, background: `${C.purple}22`, color: C.purple, cursor: 'pointer', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'inherit' }}>
            <Sparkles size={14} /> AI Generate
          </button>
          <button onClick={() => notify('📤 Upload dialog — connect to Cloudflare Stream or S3')} style={{ padding: '9px 16px', borderRadius: 9, border: 'none', background: C.purple, color: C.white, cursor: 'pointer', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'inherit' }}>
            <Plus size={14} /> Add Reel
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['all', 'live', 'scheduled', 'draft'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 15px', borderRadius: 8, border: 'none', cursor: 'pointer', background: filter === f ? C.purple : C.card, color: filter === f ? C.white : C.muted, fontSize: 13, fontWeight: filter === f ? 600 : 400, textTransform: 'capitalize', fontFamily: 'inherit' }}>
            {f} ({f === 'all' ? reels.length : reels.filter(r => r.status === f).length})
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
        {shown.map(r => (
          <div key={r.id} style={{ background: C.card, borderRadius: 16, overflow: 'hidden', border: `1px solid ${C.border}` }}>
            <div style={{ height: 136, background: `linear-gradient(135deg,${r.color}44,${C.bg})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <div style={{ fontSize: 42 }}>{r.emoji}</div>
              <div style={{ position: 'absolute', top: 10, left: 10 }}>{pill(r.status === 'live' ? '● LIVE' : r.status.toUpperCase(), r.status === 'live' ? C.green : r.status === 'scheduled' ? C.orange : C.muted)}</div>
              <div style={{ position: 'absolute', top: 10, right: 10 }}>{pill(r.type, r.color)}</div>
            </div>
            <div style={{ padding: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{r.title}</div>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 12 }}>📍 {r.loc} · {r.ago}</div>
              {r.status === 'live' && (
                <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                  <div><div style={{ fontSize: 17, fontWeight: 800 }}>{r.views.toLocaleString()}</div><div style={{ fontSize: 10, color: C.muted }}>Views</div></div>
                  <div><div style={{ fontSize: 17, fontWeight: 800, color: C.pink }}>{r.ctr}%</div><div style={{ fontSize: 10, color: C.muted }}>CTR</div></div>
                  <div><div style={{ fontSize: 13, fontWeight: 700, color: C.blue }}>{r.cta}</div><div style={{ fontSize: 10, color: C.muted }}>CTA</div></div>
                </div>
              )}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => { setReels(rs => rs.map(x => x.id === r.id ? { ...x, status: x.status === 'live' ? 'draft' : 'live' } : x)); notify('Status updated'); }} style={{ flex: 1, padding: '7px 0', borderRadius: 8, border: 'none', cursor: 'pointer', background: r.status === 'live' ? `${C.orange}22` : `${C.green}22`, color: r.status === 'live' ? C.orange : C.green, fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}>
                  {r.status === 'live' ? 'Pause' : 'Publish'}
                </button>
                <button onClick={() => { setReels(rs => rs.filter(x => x.id !== r.id)); notify('Reel deleted'); }} style={{ width: 34, height: 34, borderRadius: 8, border: 'none', cursor: 'pointer', background: `${C.pink}22`, color: C.pink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Locations({ locs, setLocs, notify }) {
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [city, setCity] = useState('')

  const add = () => {
    if (!name.trim()) return
    setLocs(l => [...l, { id: 'l' + Date.now(), name, city: city || 'Dubai', scans: 0, wr: 0, active: true }])
    setName(''); setCity(''); setAdding(false)
    notify('📍 Location added — QR code generated!')
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, color: C.pink, fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>MANAGEMENT</div>
          <div style={{ fontSize: 24, fontWeight: 800 }}>Locations</div>
        </div>
        <button onClick={() => setAdding(true)} style={{ padding: '9px 16px', borderRadius: 9, border: 'none', background: C.purple, color: C.white, cursor: 'pointer', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 7, fontFamily: 'inherit' }}>
          <Plus size={14} /> Add Location
        </button>
      </div>

      {adding && (
        <div style={{ background: C.card, borderRadius: 16, padding: 20, border: `1px solid ${C.purple}`, marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>New Location</div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Location name" style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, color: C.white, fontSize: 13, outline: 'none', fontFamily: 'inherit' }} />
            <input value={city} onChange={e => setCity(e.target.value)} placeholder="City" style={{ width: 140, padding: '10px 14px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, color: C.white, fontSize: 13, outline: 'none', fontFamily: 'inherit' }} />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={add} style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: C.purple, color: C.white, cursor: 'pointer', fontWeight: 600, fontSize: 13, fontFamily: 'inherit' }}>Create & Generate QR</button>
            <button onClick={() => setAdding(false)} style={{ padding: '9px 20px', borderRadius: 8, border: `1px solid ${C.border}`, background: 'transparent', color: C.muted, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gap: 14 }}>
        {locs.map(l => (
          <div key={l.id} style={{ background: C.card, borderRadius: 16, padding: 20, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 80, height: 80, borderRadius: 12, background: C.white, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <QrCode size={42} color={C.bg} />
              <div style={{ fontSize: 7, color: C.bg, fontWeight: 700, marginTop: 3 }}>SCENVY</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 15, fontWeight: 700 }}>{l.name}</span>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.active ? C.green : C.dim }} />
                <span style={{ fontSize: 11, color: l.active ? C.green : C.muted }}>{l.active ? 'Active' : 'Inactive'}</span>
              </div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 9 }}>📍 {l.city}</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px', background: C.card2, borderRadius: 7, fontSize: 11, color: C.muted }}>
                🔗 scenvy.app/l/{l.id}
                <Copy size={11} color={C.purple} style={{ cursor: 'pointer' }} onClick={() => notify('URL copied!')} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 24, textAlign: 'center' }}>
              <div><div style={{ fontSize: 22, fontWeight: 800 }}>{l.scans.toLocaleString()}</div><div style={{ fontSize: 11, color: C.muted }}>Scans</div></div>
              <div><div style={{ fontSize: 22, fontWeight: 800, color: l.wr > 0 ? C.pink : C.dim }}>{l.wr > 0 ? `${l.wr}%` : '—'}</div><div style={{ fontSize: 11, color: C.muted }}>Watch Rate</div></div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button onClick={() => { setLocs(ls => ls.map(x => x.id === l.id ? { ...x, active: !x.active } : x)); notify('Status updated'); }} style={{ padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', background: l.active ? `${C.orange}22` : `${C.green}22`, color: l.active ? C.orange : C.green, fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}>
                {l.active ? 'Deactivate' : 'Activate'}
              </button>
              <button onClick={() => notify('QR downloaded!')} style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${C.border}`, background: 'transparent', color: C.muted, cursor: 'pointer', fontSize: 12, fontFamily: 'inherit' }}>Download QR</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Analytics({ reels }) {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: C.pink, fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>INSIGHTS</div>
        <div style={{ fontSize: 24, fontWeight: 800 }}>Analytics</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {[['Total Scans (7d)', '2,038', '+18%', C.purple], ['Avg Watch Time', '12.4s', '+3s', C.pink], ['CTA Clicks', '847', '+31%', C.blue], ['Conversion Rate', '41.5%', '+7%', C.green]].map(([l, v, d, c], i) => (
          <div key={i} style={{ background: C.card, borderRadius: 14, padding: 18, border: `1px solid ${C.border}` }}>
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 10 }}>{l}</div>
            <div style={{ fontSize: 26, fontWeight: 800 }}>{v}</div>
            <div style={{ fontSize: 12, color: C.green, marginTop: 4 }}>{d} vs last week</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}>
        <div style={{ background: C.card, borderRadius: 16, padding: 20, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Weekly Scans & Views</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={CHART_DATA}>
              <XAxis dataKey="day" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white }} />
              <Bar dataKey="scans" fill={C.purple} radius={[4, 4, 0, 0]} />
              <Bar dataKey="views" fill={C.pink} radius={[4, 4, 0, 0]} opacity={0.6} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: C.card, borderRadius: 16, padding: 20, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>CTR Trend</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={CHART_DATA}>
              <XAxis dataKey="day" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: C.card2, border: `1px solid ${C.border}`, borderRadius: 8, color: C.white }} />
              <Line dataKey="ctr" stroke={C.blue} strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{ background: C.card, borderRadius: 16, padding: 20, border: `1px solid ${C.border}` }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Top Performing Reels</div>
        {reels.filter(r => r.status === 'live').sort((a, b) => b.views - a.views).map((r, i) => (
          <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '11px 0', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: `${r.color}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{r.emoji}</div>
            <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 600 }}>{r.title}</div><div style={{ fontSize: 11, color: C.muted }}>{r.loc}</div></div>
            <div style={{ width: 76 }}><div style={{ fontSize: 13, fontWeight: 700 }}>{r.views.toLocaleString()}</div><div style={{ fontSize: 10, color: C.muted }}>views</div></div>
            <div style={{ width: 56 }}><div style={{ fontSize: 13, fontWeight: 700, color: C.pink }}>{r.ctr}%</div><div style={{ fontSize: 10, color: C.muted }}>CTR</div></div>
            <div style={{ width: 100 }}>
              <div style={{ height: 5, background: C.card2, borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${r.ctr * 2.4}%`, background: grad(C.purple, C.pink), borderRadius: 3 }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AIGenerator({ notify, setReels }) {
  const [form, setForm]     = useState({ venue: 'Marina Walk', offer: '', type: 'offer', tone: 'exciting' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    if (!form.offer.trim()) { notify('Enter your offer first'); return }
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      setResult(data)
    } catch {
      // Fallback if no API connected
      setResult({ hook: 'TONIGHT ONLY 🔥', headline: form.offer, subtext: `Available at ${form.venue} — don't miss out.`, cta: 'Grab It Now', hashtags: ['dubai', form.type, 'scenvy'], emoji: form.type === 'offer' ? '🍹' : '🎉', urgency: 'Limited time only', colorMood: 'purple' })
    }
    setLoading(false)
  }

  const save = () => {
    const cm = { purple: C.purple, pink: C.pink, blue: C.blue, orange: C.orange, green: C.green }
    setReels(r => [...r, { id: 'r' + Date.now(), title: result.headline, type: form.type, status: 'draft', views: 0, ctr: 0, loc: form.venue, color: cm[result.colorMood] || C.purple, emoji: result.emoji, cta: result.cta, ago: 'Just now' }])
    notify('✨ AI Reel saved to library!'); setResult(null); setForm(f => ({ ...f, offer: '' }))
  }

  const accent = result ? ({ purple: C.purple, pink: C.pink, blue: C.blue, orange: C.orange, green: C.green }[result.colorMood] || C.purple) : C.purple

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: C.pink, fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>AI POWERED</div>
        <div style={{ fontSize: 24, fontWeight: 800 }}>Reel Generator ✨</div>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>Describe your offer → Claude AI creates a publish-ready reel.</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={{ background: C.card, borderRadius: 16, padding: 24, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 20 }}>Your Input</div>
          {[{ label: 'VENUE', key: 'venue', ph: 'Marina Walk', multi: false }, { label: 'OFFER OR MESSAGE *', key: 'offer', ph: 'e.g. Happy hour 50% off cocktails until 8 PM', multi: true }].map(f => (
            <div key={f.key} style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: C.muted, display: 'block', marginBottom: 6, letterSpacing: 1 }}>{f.label}</label>
              {f.multi
                ? <textarea value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} rows={3} placeholder={f.ph} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, color: C.white, fontSize: 13, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />
                : <input value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.ph} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, color: C.white, fontSize: 13, outline: 'none', fontFamily: 'inherit' }} />
              }
            </div>
          ))}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 22 }}>
            {[{ key: 'type', label: 'TYPE', opts: [['offer', '🏷️ Offer'], ['event', '🎉 Event'], ['menu', '🍽️ Menu'], ['promo', '⚡ Promo']] }, { key: 'tone', label: 'TONE', opts: [['exciting', '🔥 Exciting'], ['luxurious', '✨ Luxurious'], ['friendly', '😊 Friendly'], ['urgent', '⚡ Urgent']] }].map(s => (
              <div key={s.key}>
                <label style={{ fontSize: 11, color: C.muted, display: 'block', marginBottom: 6, letterSpacing: 1 }}>{s.label}</label>
                <select value={form[s.key]} onChange={e => setForm(p => ({ ...p, [s.key]: e.target.value }))} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.card2, color: C.white, fontSize: 13, outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                  {s.opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            ))}
          </div>
          <button onClick={generate} disabled={loading} style={{ width: '100%', padding: '14px 0', borderRadius: 12, border: 'none', cursor: loading ? 'wait' : 'pointer', background: loading ? C.dim : grad(C.purple, C.pink), color: C.white, fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontFamily: 'inherit' }}>
            {loading ? <><RefreshCw size={18} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</> : <><Sparkles size={18} /> Generate Reel</>}
          </button>
        </div>

        <div>
          {!result
            ? <div style={{ background: C.card, borderRadius: 16, padding: 24, border: `2px dashed ${C.border}`, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <Sparkles size={44} color={C.dim} style={{ marginBottom: 16 }} />
                <div style={{ fontSize: 16, fontWeight: 600, color: C.muted }}>AI Preview appears here</div>
              </div>
            : <div>
                <div style={{ background: `linear-gradient(160deg,${accent}28,${C.bg} 70%)`, border: `2px solid ${accent}44`, borderRadius: 22, padding: 24, marginBottom: 14 }}>
                  <div style={{ background: `linear-gradient(180deg,${accent}33,${C.bg})`, borderRadius: 16, padding: '28px 20px', textAlign: 'center', marginBottom: 14, minHeight: 220, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: 44 }}>{result.emoji}</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: accent, letterSpacing: 2, marginBottom: 7 }}>{result.hook}</div>
                      <div style={{ fontSize: 18, fontWeight: 800, lineHeight: 1.28, marginBottom: 8 }}>{result.headline}</div>
                      <div style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', marginBottom: 8 }}>{result.subtext}</div>
                      {result.urgency && <div style={{ fontSize: 12, color: accent }}>⏱ {result.urgency}</div>}
                    </div>
                    <button style={{ padding: '11px 0', borderRadius: 13, border: 'none', background: accent, color: C.white, fontWeight: 700, fontSize: 15, fontFamily: 'inherit' }}>{result.cta} →</button>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {result.hashtags.map(h => <span key={h} style={{ fontSize: 11, color: accent, background: `${accent}22`, padding: '3px 9px', borderRadius: 7 }}>#{h}</span>)}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={save} style={{ flex: 1, padding: '12px 0', borderRadius: 10, border: 'none', cursor: 'pointer', background: accent, color: C.white, fontWeight: 700, fontSize: 14, fontFamily: 'inherit' }}>✓ Save to Library</button>
                  <button onClick={() => setResult(null)} style={{ padding: '12px 18px', borderRadius: 10, border: `1px solid ${C.border}`, background: 'transparent', color: C.muted, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>Retry</button>
                </div>
              </div>
          }
        </div>
      </div>
    </div>
  )
}

// ─── Main Dashboard Export ────────────────────────────────
export default function Dashboard() {
  const [page,    setPage]    = useState('overview')
  const [open,    setOpen]    = useState(true)
  const [reels,   setReels]   = useState(REELS_SEED)
  const [locs,    setLocs]    = useState(LOCATIONS_SEED)
  const [toast,   setToast]   = useState(null)

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  return (
    <div style={{ display: 'flex', height: '100vh', background: C.bg, fontFamily: "'Inter',sans-serif", color: C.white }}>
      <style>{`@keyframes spin { to { transform:rotate(360deg) } } @keyframes fadeUp { from { opacity:0;transform:translateY(12px) } to { opacity:1;transform:none } }`}</style>

      <Sidebar page={page} setPage={setPage} open={open} setOpen={setOpen} />

      {/* Top bar */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ height: 58, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', padding: '0 28px', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Marina Group Dashboard</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 12, color: C.muted }}>scenvy.app</div>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: grad(C.purple, C.pink), display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>M</div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
          {page === 'overview'  && <Overview   setPage={setPage} reels={reels} locs={locs} />}
          {page === 'reels'     && <Reels      reels={reels} setReels={setReels} notify={notify} />}
          {page === 'locations' && <Locations  locs={locs} setLocs={setLocs} notify={notify} />}
          {page === 'analytics' && <Analytics  reels={reels} />}
          {page === 'ai'        && <AIGenerator notify={notify} setReels={setReels} />}
          {page === 'settings'  && (
            <div>
              <div style={{ fontSize: 11, color: C.pink, fontWeight: 700, letterSpacing: 2, marginBottom: 16 }}>ACCOUNT</div>
              <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Settings</div>
              <div style={{ background: C.card, borderRadius: 14, padding: 20, border: `1px solid ${C.border}`, marginBottom: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Current Plan</div>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <span style={{ padding: '6px 14px', background: `${C.purple}33`, color: C.purple, borderRadius: 8, fontWeight: 700, fontSize: 13 }}>ENTERPRISE</span>
                  <span style={{ fontSize: 13, color: C.muted }}>4 Locations · Unlimited Reels · AI Features</span>
                </div>
              </div>
            </div>
          )}
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
