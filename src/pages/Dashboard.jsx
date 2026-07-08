import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { C, grad } from '../tokens.js'
import { REELS_SEED, LOCATIONS_SEED, CHART_DATA } from '../data.js'
import { storage, copyToClipboard, downloadQR, qrImageUrl } from '../storage.js'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import {
  Home, Film, MapPin, BarChart2, Sparkles, Settings, Menu,
  QrCode, Eye, MousePointer, Video, Plus, Trash2, RefreshCw,
  Copy, LogOut, Upload, Link, X, Image, ExternalLink, Edit2,
  Download, Globe, Check, Smartphone
} from 'lucide-react'

// ─── Admin i18n ──────────────────────────────────────────
const ADM = {
  de: {
    nav: { overview:'Übersicht', reels:'Reels', locations:'Standorte', analytics:'Analytics', ai:'KI-Generator', qr:'QR-Codes', settings:'Einstellungen' },
    overview: { kicker:'DASHBOARD', greeting:'Guten Abend', sub:'Deine Performance heute auf einen Blick.', scans:'Scans gesamt', watchRate:'Ø Watch-Rate', cta:'CTA-Klicks', live:'Live Reels', activeNow:'aktiv', thisWeek:'diese Woche', recentReels:'Aktuelle Reels', viewAll:'Alle →', locations:'Standorte', manage:'Verwalten →', watch:'Watch' },
    reels: { kicker:'CONTENT', title:'Reels', addBtn:'Reel erstellen', aiBtn:'KI generieren', all:'Alle', live:'Live', scheduled:'Geplant', draft:'Entwurf', pause:'Pausieren', publish:'Veröffentlichen', edit:'Bearbeiten', delete:'Löschen', views:'Views', cta:'CTA' },
    locations: { kicker:'VERWALTUNG', title:'Standorte', addBtn:'Standort hinzufügen', active:'Aktiv', inactive:'Inaktiv', scans:'Scans', watchRate:'Watch Rate', deactivate:'Deaktivieren', activate:'Aktivieren', downloadQR:'QR Download', edit:'Bearbeiten', delete:'Löschen', newLoc:'Neuer Standort', name:'Name', city:'Stadt', create:'Erstellen & QR generieren', cancel:'Abbrechen', save:'Speichern' },
    qr: { kicker:'QR-CODES', title:'QR-Code Verwaltung', sub:'Jeder Standort hat seine eigene URL und seinen eigenen QR-Code.', download:'Herunterladen', preview:'Vorschau', copy:'URL kopieren' },
    ai: { kicker:'KI-GESTÜTZT', title:'Reel Generator ✨', sub:'Beschreibe dein Angebot oder lade ein Bild hoch → Claude KI erstellt den fertigen Reel.', textMode:'✏️ Text beschreiben', imageMode:'📸 Bild + Beschreibung', venueLabel:'VENUE / STANDORT', offerLabel:'ANGEBOT / NACHRICHT *', offerPh:'z.B. Happy Hour: 50% auf alle Cocktails bis 20 Uhr', imageLabel:'BILD HOCHLADEN', imageDesc:'BILD BESCHREIBEN / ANGEBOT *', imageDescPh:'z.B. Zeigt unsere Rooftop-Bar — erstelle einen Happy-Hour-Reel', typeLabel:'TYP', toneLabel:'STIL', generate:'Reel generieren', generating:'Wird generiert...', save:'In Library speichern', retry:'Nochmal', preview:'KI-Vorschau erscheint hier', fillIn:'Gib dein Angebot ein und klicke auf Generieren.', ctaTarget:'CTA-ZIEL (URL)' },
    settings: { kicker:'ACCOUNT', title:'Einstellungen', plan:'Aktueller Plan', media:'Media-Speicher', mediaNote:'Für Cloud-Uploads verbinde deinen Speicher-Anbieter.' },
    common: { save:'Speichern', cancel:'Abbrechen', logout:'Abmelden', copied:'✅ URL kopiert!', deleted:'Gelöscht', updated:'Aktualisiert', saved:'Gespeichert' }
  },
  en: {
    nav: { overview:'Overview', reels:'Reels', locations:'Locations', analytics:'Analytics', ai:'AI Generator', qr:'QR Codes', settings:'Settings' },
    overview: { kicker:'DASHBOARD', greeting:'Good evening', sub:"Your performance today at a glance.", scans:'Total Scans', watchRate:'Avg Watch Rate', cta:'CTA Clicks', live:'Live Reels', activeNow:'active', thisWeek:'this week', recentReels:'Recent Reels', viewAll:'View all →', locations:'Locations', manage:'Manage →', watch:'watch' },
    reels: { kicker:'CONTENT', title:'Reels', addBtn:'Add Reel', aiBtn:'AI Generate', all:'All', live:'Live', scheduled:'Scheduled', draft:'Draft', pause:'Pause', publish:'Publish', edit:'Edit', delete:'Delete', views:'Views', cta:'CTA' },
    locations: { kicker:'MANAGEMENT', title:'Locations', addBtn:'Add Location', active:'Active', inactive:'Inactive', scans:'Scans', watchRate:'Watch Rate', deactivate:'Deactivate', activate:'Activate', downloadQR:'Download QR', edit:'Edit', delete:'Delete', newLoc:'New Location', name:'Name', city:'City', create:'Create & Generate QR', cancel:'Cancel', save:'Save' },
    qr: { kicker:'QR CODES', title:'QR Code Management', sub:'Every location has its own URL and QR code.', download:'Download', preview:'Preview', copy:'Copy URL' },
    ai: { kicker:'AI POWERED', title:'Reel Generator ✨', sub:'Describe your offer or upload an image → Claude AI creates a publish-ready reel.', textMode:'✏️ Describe in text', imageMode:'📸 Image + description', venueLabel:'VENUE / LOCATION', offerLabel:'YOUR OFFER / MESSAGE *', offerPh:'e.g. Happy hour: 50% off all cocktails until 8 PM', imageLabel:'UPLOAD IMAGE', imageDesc:'DESCRIBE IMAGE / OFFER *', imageDescPh:'e.g. Shows our rooftop bar at sunset — create a happy hour reel', typeLabel:'TYPE', toneLabel:'TONE', generate:'Generate Reel', generating:'Generating...', save:'Save to Library', retry:'Retry', preview:'AI Preview appears here', fillIn:'Fill in your offer and click Generate.', ctaTarget:'CTA TARGET (URL)' },
    settings: { kicker:'ACCOUNT', title:'Settings', plan:'Current Plan', media:'Media Storage', mediaNote:'Connect your storage provider to enable cloud uploads.' },
    common: { save:'Save', cancel:'Cancel', logout:'Log out', copied:'✅ URL copied!', deleted:'Deleted', updated:'Updated', saved:'Saved' }
  }
}

const pill = (label, color) => (
  <span style={{ fontSize:10, fontWeight:700, padding:'3px 9px', borderRadius:20, background:`${color}28`, color, border:`1px solid ${color}44` }}>{label}</span>
)

function StatCard({ label, value, delta, icon, color }) {
  return (
    <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:20 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14 }}>
        <span style={{ fontSize:12, color:C.muted }}>{label}</span>
        <div style={{ width:36, height:36, borderRadius:10, background:`${color}22`, display:'flex', alignItems:'center', justifyContent:'center' }}>{icon}</div>
      </div>
      <div style={{ fontSize:28, fontWeight:800, marginBottom:4 }}>{value}</div>
      {delta && <div style={{ fontSize:12, color:C.green }}>{delta}</div>}
    </div>
  )
}

// ─── Add/Edit Reel Modal ──────────────────────────────────
function ReelModal({ reel, locs, onClose, onSave, notify, t }) {
  const isEdit = !!reel
  const [title,     setTitle]     = useState(reel?.title     || '')
  const [type,      setType]      = useState(reel?.type      || 'offer')
  const [locationId,setLocationId]= useState(reel?.locationId|| locs[0]?.id || '')
  const [ctaText,   setCtaText]   = useState(reel?.cta       || 'Order Now')
  const [ctaUrl,    setCtaUrl]    = useState(reel?.ctaUrl    || '')
  const [ctaAction, setCtaAction] = useState(reel?.ctaAction || 'url')
  const [emoji,     setEmoji]     = useState(reel?.emoji     || '🍹')
  const [file,      setFile]      = useState(null)
  const [preview,   setPreview]   = useState(reel?.mediaUrl  || null)
  const fileRef = useRef()

  const handleFile = e => {
    const f = e.target.files?.[0]; if (!f) return
    setFile(f); setPreview(URL.createObjectURL(f))
  }
  const handleDrop = e => {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]; if (!f) return
    setFile(f); setPreview(URL.createObjectURL(f))
  }

  const loc = locs.find(l => l.id === locationId)
  const colorMap = { offer:C.purple, event:C.pink, menu:C.blue, promo:C.orange }

  const save = () => {
    if (!title.trim()) { notify('Bitte Titel eingeben'); return }
    onSave({
      ...(reel || {}),
      id:         reel?.id || 'r'+Date.now(),
      title, type, locationId,
      loc:        loc?.name || '',
      cta:        ctaText,
      ctaUrl,     ctaAction,
      emoji,
      color:      colorMap[type] || C.purple,
      status:     reel?.status || 'draft',
      views:      reel?.views  || 0,
      ctr:        reel?.ctr    || 0,
      mediaUrl:   preview,
      mediaType:  file?.type?.startsWith('video') ? 'video' : 'image',
      ago:        reel?.ago    || 'Gerade eben',
    })
    notify(isEdit ? '✅ Reel aktualisiert' : '✅ Reel erstellt')
    onClose()
  }

  const ctaActions = [
    ['url','🔗 Externer Link'],['phone','📞 Anruf'],['menu','🍽️ Menü'],
    ['reserve','📅 Reservieren'],['order','🛒 Bestellen'],
  ]

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.8)', backdropFilter:'blur(12px)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:22, width:'100%', maxWidth:800, maxHeight:'90vh', overflow:'auto' }}>
        <div style={{ padding:'20px 24px', borderBottom:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center', position:'sticky', top:0, background:C.card, zIndex:10 }}>
          <div style={{ fontWeight:700, fontSize:17 }}>{isEdit ? '✏️ Reel bearbeiten' : '➕ Reel erstellen'}</div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:C.muted, cursor:'pointer' }}><X size={20}/></button>
        </div>

        <div style={{ padding:24, display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
          {/* Left */}
          <div>
            {/* Media upload */}
            <div style={{ marginBottom:18 }}>
              <label style={{ fontSize:11, color:C.muted, display:'block', marginBottom:7, fontWeight:600, letterSpacing:1 }}>FOTO / VIDEO</label>
              <div onDrop={handleDrop} onDragOver={e=>e.preventDefault()} onClick={()=>fileRef.current?.click()}
                style={{ border:`2px dashed ${preview?C.purple:C.border}`, borderRadius:12, overflow:'hidden', cursor:'pointer', minHeight:110, display:'flex', alignItems:'center', justifyContent:'center', background:`${C.purple}08`, position:'relative' }}>
                {preview
                  ? <><img src={preview} style={{ width:'100%', maxHeight:160, objectFit:'cover' }} alt=""/>
                      <button onClick={e=>{e.stopPropagation();setFile(null);setPreview(null)}} style={{ position:'absolute', top:6, right:6, background:C.pink, border:'none', borderRadius:'50%', width:24, height:24, color:C.white, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><X size={11}/></button></>
                  : <div style={{ textAlign:'center', padding:20 }}><Upload size={26} color={C.purple} style={{ marginBottom:8 }}/><div style={{ fontSize:13, color:C.muted }}>Hier klicken oder reinziehen</div><div style={{ fontSize:11, color:C.dim, marginTop:3 }}>MP4, MOV, JPG, PNG</div></div>
                }
                <input ref={fileRef} type="file" accept="video/*,image/*" onChange={handleFile} style={{ display:'none' }}/>
              </div>
            </div>

            {/* Title + Emoji */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:10, marginBottom:14 }}>
              <div>
                <label style={{ fontSize:11, color:C.muted, display:'block', marginBottom:6, letterSpacing:1, fontWeight:600 }}>TITEL *</label>
                <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="z.B. Happy Hour Special"
                  style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:`1px solid ${C.border}`, background:C.bg, color:C.white, fontSize:13, outline:'none', fontFamily:'inherit' }}/>
              </div>
              <div>
                <label style={{ fontSize:11, color:C.muted, display:'block', marginBottom:6, letterSpacing:1, fontWeight:600 }}>EMOJI</label>
                <input value={emoji} onChange={e=>setEmoji(e.target.value)}
                  style={{ width:54, padding:'10px 0', borderRadius:8, border:`1px solid ${C.border}`, background:C.bg, color:C.white, fontSize:22, outline:'none', textAlign:'center', fontFamily:'inherit' }}/>
              </div>
            </div>

            {/* Type + Location */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <label style={{ fontSize:11, color:C.muted, display:'block', marginBottom:6, letterSpacing:1, fontWeight:600 }}>TYP</label>
                <select value={type} onChange={e=>setType(e.target.value)}
                  style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:`1px solid ${C.border}`, background:C.card2, color:C.white, fontSize:13, outline:'none', fontFamily:'inherit' }}>
                  <option value="offer">🏷️ Angebot</option>
                  <option value="event">🎉 Event</option>
                  <option value="menu">🍽️ Menü</option>
                  <option value="promo">⚡ Promo</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize:11, color:C.muted, display:'block', marginBottom:6, letterSpacing:1, fontWeight:600 }}>STANDORT</label>
                <select value={locationId} onChange={e=>setLocationId(e.target.value)}
                  style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:`1px solid ${C.border}`, background:C.card2, color:C.white, fontSize:13, outline:'none', fontFamily:'inherit' }}>
                  {locs.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Right: CTA */}
          <div>
            <div style={{ background:`${C.purple}11`, border:`1px solid ${C.purple}33`, borderRadius:14, padding:18, marginBottom:14 }}>
              <div style={{ fontSize:13, fontWeight:700, marginBottom:14, display:'flex', alignItems:'center', gap:8 }}><Link size={15} color={C.purple}/>CTA-Button</div>
              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:11, color:C.muted, display:'block', marginBottom:6, letterSpacing:1, fontWeight:600 }}>BUTTON-TEXT</label>
                <input value={ctaText} onChange={e=>setCtaText(e.target.value)} placeholder="z.B. Jetzt bestellen"
                  style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:`1px solid ${C.border}`, background:C.bg, color:C.white, fontSize:13, outline:'none', fontFamily:'inherit' }}/>
              </div>
              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:11, color:C.muted, display:'block', marginBottom:6, letterSpacing:1, fontWeight:600 }}>AKTION</label>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                  {ctaActions.map(([v,l])=>(
                    <button key={v} onClick={()=>setCtaAction(v)} style={{ padding:'7px 10px', borderRadius:8, border:`1px solid ${ctaAction===v?C.purple:C.border}`, background:ctaAction===v?`${C.purple}22`:'transparent', color:ctaAction===v?C.white:C.muted, fontSize:11, cursor:'pointer', fontFamily:'inherit', textAlign:'left' }}>{l}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize:11, color:C.muted, display:'block', marginBottom:6, letterSpacing:1, fontWeight:600 }}>ZIEL-URL / TELEFON</label>
                <input value={ctaUrl} onChange={e=>setCtaUrl(e.target.value)} placeholder={ctaAction==='phone'?'+49 123 456789':'https://...'}
                  style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:`1px solid ${C.border}`, background:C.bg, color:C.white, fontSize:13, outline:'none', fontFamily:'inherit' }}/>
              </div>
            </div>

            {/* Preview */}
            <div style={{ background:C.card2, borderRadius:12, padding:14, border:`1px solid ${C.border}` }}>
              <div style={{ fontSize:10, color:C.muted, marginBottom:8, letterSpacing:1 }}>VORSCHAU</div>
              <div style={{ background:`linear-gradient(160deg,${colorMap[type]||C.purple}44,${C.bg})`, borderRadius:10, padding:14, textAlign:'center' }}>
                <div style={{ fontSize:28, marginBottom:6 }}>{emoji}</div>
                <div style={{ fontSize:14, fontWeight:700, marginBottom:8 }}>{title||'Reel-Titel'}</div>
                {ctaUrl && <div style={{ fontSize:10, color:C.blue, marginBottom:6, display:'flex', alignItems:'center', justifyContent:'center', gap:4 }}><ExternalLink size={9}/>{ctaUrl}</div>}
                <div style={{ padding:'8px 0', borderRadius:8, background:grad(colorMap[type]||C.purple,C.pink), fontSize:12, fontWeight:700 }}>{ctaText||'Button'} →</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding:'14px 24px', borderTop:`1px solid ${C.border}`, display:'flex', gap:12, justifyContent:'flex-end' }}>
          <button onClick={onClose} style={{ padding:'10px 22px', borderRadius:10, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, cursor:'pointer', fontSize:14, fontFamily:'inherit' }}>Abbrechen</button>
          <button onClick={save} style={{ padding:'10px 28px', borderRadius:10, border:'none', background:grad(C.purple,C.pink), color:C.white, cursor:'pointer', fontWeight:700, fontSize:14, fontFamily:'inherit' }}>
            {isEdit ? '✓ Änderungen speichern' : 'Reel speichern →'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Edit Location Modal ──────────────────────────────────
function LocationModal({ loc, onClose, onSave, notify }) {
  const [name, setName] = useState(loc?.name || '')
  const [city, setCity] = useState(loc?.city || '')
  const isEdit = !!loc

  const save = () => {
    if (!name.trim()) { notify('Bitte Namen eingeben'); return }
    onSave({ ...(loc||{}), id: loc?.id||'l'+Date.now(), name, city:city||'Dubai', scans:loc?.scans||0, wr:loc?.wr||0, active:loc?.active??true })
    notify(isEdit ? '✅ Standort aktualisiert' : '📍 Standort erstellt — QR generiert!')
    onClose()
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.75)', backdropFilter:'blur(10px)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ background:C.card, border:`1px solid ${C.purple}`, borderRadius:20, padding:28, width:460 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <div style={{ fontSize:16, fontWeight:700 }}>{isEdit ? '✏️ Standort bearbeiten' : '📍 Neuer Standort'}</div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:C.muted, cursor:'pointer' }}><X size={18}/></button>
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={{ fontSize:11, color:C.muted, display:'block', marginBottom:6, fontWeight:600, letterSpacing:1 }}>STANDORT-NAME *</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="z.B. Marina Walk"
            style={{ width:'100%', padding:'11px 14px', borderRadius:9, border:`1px solid ${C.border}`, background:C.bg, color:C.white, fontSize:14, outline:'none', fontFamily:'inherit' }}/>
        </div>
        <div style={{ marginBottom:22 }}>
          <label style={{ fontSize:11, color:C.muted, display:'block', marginBottom:6, fontWeight:600, letterSpacing:1 }}>STADT / BEREICH</label>
          <input value={city} onChange={e=>setCity(e.target.value)} placeholder="z.B. Dubai Marina"
            style={{ width:'100%', padding:'11px 14px', borderRadius:9, border:`1px solid ${C.border}`, background:C.bg, color:C.white, fontSize:14, outline:'none', fontFamily:'inherit' }}/>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onClose} style={{ flex:1, padding:'11px 0', borderRadius:10, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, cursor:'pointer', fontSize:14, fontFamily:'inherit' }}>Abbrechen</button>
          <button onClick={save} style={{ flex:2, padding:'11px 0', borderRadius:10, border:'none', background:grad(C.purple,C.pink), color:C.white, cursor:'pointer', fontWeight:700, fontSize:14, fontFamily:'inherit' }}>
            {isEdit ? 'Speichern' : 'Erstellen & QR generieren'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Sidebar ─────────────────────────────────────────────
function Sidebar({ page, setPage, open, setOpen, t }) {
  const nav = useNavigate()
  const navItems = [
    { id:'overview',   icon:<Home size={17}/>,     badge:null },
    { id:'reels',      icon:<Film size={17}/>,     badge:null },
    { id:'locations',  icon:<MapPin size={17}/>,   badge:null },
    { id:'analytics',  icon:<BarChart2 size={17}/>,badge:null },
    { id:'ai',         icon:<Sparkles size={17}/>, badge:'✨' },
    { id:'qr',         icon:<QrCode size={17}/>,   badge:null },
    { id:'settings',   icon:<Settings size={17}/>, badge:null },
  ]
  const logout = () => { localStorage.removeItem('scenvy_user'); nav('/login') }
  return (
    <div style={{ width:open?220:58, background:C.card, borderRight:`1px solid ${C.border}`, flexShrink:0, display:'flex', flexDirection:'column', transition:'width .3s', overflow:'hidden' }}>
      {open && (
        <div style={{ padding:'14px 14px 12px', borderBottom:`1px solid ${C.border}` }}>
          <div style={{ fontSize:10, color:C.muted, marginBottom:8, letterSpacing:1 }}>TENANT</div>
          <div style={{ display:'flex', alignItems:'center', gap:9, padding:'8px 10px', background:C.card2, borderRadius:9 }}>
            <div style={{ width:28, height:28, borderRadius:6, background:grad(C.purple,C.pink), display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, flexShrink:0 }}>M</div>
            <div><div style={{ fontSize:12, fontWeight:700 }}>Marina Group</div><div style={{ fontSize:10, color:C.purple }}>Enterprise ✓</div></div>
          </div>
        </div>
      )}
      <nav style={{ padding:'10px 10px', flex:1 }}>
        {navItems.map(item=>(
          <button key={item.id} onClick={()=>setPage(item.id)} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 10px', borderRadius:9, border:'none', cursor:'pointer', background:page===item.id?`${C.purple}22`:'transparent', color:page===item.id?C.white:C.muted, marginBottom:2, justifyContent:open?'flex-start':'center', fontFamily:'inherit' }}>
            <span style={{ color:page===item.id?C.purple:C.muted, flexShrink:0 }}>{item.icon}</span>
            {open&&<><span style={{ fontSize:13, fontWeight:page===item.id?600:400, flex:1, textAlign:'left' }}>{t.nav[item.id]}</span>
            {item.badge&&<span style={{ fontSize:9, padding:'2px 6px', borderRadius:10, background:`${C.pink}33`, color:C.pink }}>{item.badge}</span>}</>}
          </button>
        ))}
      </nav>
      <div style={{ padding:'0 10px 12px' }}>
        <button onClick={logout} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 10px', borderRadius:9, border:'none', cursor:'pointer', background:'transparent', color:C.muted, justifyContent:open?'flex-start':'center', fontFamily:'inherit' }}>
          <LogOut size={17}/>{open&&<span style={{ fontSize:13 }}>{t.common.logout}</span>}
        </button>
        <button onClick={()=>setOpen(o=>!o)} style={{ width:'100%', padding:10, borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, cursor:'pointer', display:'flex', justifyContent:'center', marginTop:8, fontFamily:'inherit' }}><Menu size={16}/></button>
      </div>
    </div>
  )
}

// ─── Overview ────────────────────────────────────────────
function Overview({ setPage, reels, locs, t }) {
  return (
    <div>
      <div style={{ marginBottom:26 }}>
        <div style={{ fontSize:11, color:C.pink, fontWeight:700, letterSpacing:2, marginBottom:6 }}>{t.overview.kicker}</div>
        <div style={{ fontSize:26, fontWeight:800 }}>{t.overview.greeting}, Marina Group 👋</div>
        <div style={{ fontSize:13, color:C.muted, marginTop:4 }}>{t.overview.sub}</div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:28 }}>
        <StatCard label={t.overview.scans}     value="3.083" delta={`+18% ${t.overview.thisWeek}`} icon={<QrCode size={18} color={C.purple}/>}     color={C.purple}/>
        <StatCard label={t.overview.watchRate} value="80%"   delta={`+5% ${t.overview.thisWeek}`}  icon={<Eye size={18} color={C.pink}/>}           color={C.pink}/>
        <StatCard label={t.overview.cta}       value="847"   delta={`+31% ${t.overview.thisWeek}`} icon={<MousePointer size={18} color={C.blue}/>}  color={C.blue}/>
        <StatCard label={t.overview.live}      value={reels.filter(r=>r.status==='live').length} delta={t.overview.activeNow} icon={<Video size={18} color={C.green}/>} color={C.green}/>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <div style={{ background:C.card, borderRadius:16, padding:20, border:`1px solid ${C.border}` }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
            <span style={{ fontSize:14, fontWeight:700 }}>{t.overview.recentReels}</span>
            <button onClick={()=>setPage('reels')} style={{ fontSize:12, color:C.purple, background:'none', border:'none', cursor:'pointer' }}>{t.overview.viewAll}</button>
          </div>
          {reels.slice(0,5).map(r=>(
            <div key={r.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'9px 0', borderBottom:`1px solid ${C.border}` }}>
              <div style={{ width:36, height:36, borderRadius:8, background:`${r.color}28`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, overflow:'hidden', flexShrink:0 }}>
                {r.mediaUrl?<img src={r.mediaUrl} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:8 }} alt=""/>:r.emoji}
              </div>
              <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:600 }}>{r.title}</div><div style={{ fontSize:11, color:C.muted }}>{r.loc}</div></div>
              {pill(r.status==='live'?'● LIVE':r.status.toUpperCase(), r.status==='live'?C.green:r.status==='scheduled'?C.orange:C.muted)}
            </div>
          ))}
        </div>
        <div style={{ background:C.card, borderRadius:16, padding:20, border:`1px solid ${C.border}` }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16 }}>
            <span style={{ fontSize:14, fontWeight:700 }}>{t.overview.locations}</span>
            <button onClick={()=>setPage('locations')} style={{ fontSize:12, color:C.purple, background:'none', border:'none', cursor:'pointer' }}>{t.overview.manage}</button>
          </div>
          {locs.map(l=>(
            <div key={l.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'9px 0', borderBottom:`1px solid ${C.border}` }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:l.active?C.green:C.dim, flexShrink:0 }}/>
              <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:600 }}>{l.name}</div><div style={{ fontSize:11, color:C.muted }}>{l.city}</div></div>
              <div style={{ textAlign:'right' }}><div style={{ fontSize:13, fontWeight:700 }}>{l.scans.toLocaleString()}</div><div style={{ fontSize:10, color:C.blue }}>{l.wr}% {t.overview.watch}</div></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Reels ────────────────────────────────────────────────
function ReelsPage({ reels, setReels, locs, notify, t }) {
  const [filter, setFilter] = useState('all')
  const [editReel, setEditReel] = useState(null)  // null = closed, false = new, obj = edit
  const shown = filter==='all'?reels:reels.filter(r=>r.status===filter)

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:24 }}>
        <div><div style={{ fontSize:11, color:C.pink, fontWeight:700, letterSpacing:2, marginBottom:6 }}>{t.reels.kicker}</div><div style={{ fontSize:24, fontWeight:800 }}>{t.reels.title}</div></div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={()=>setEditReel(false)} style={{ padding:'9px 16px', borderRadius:9, border:`1px solid ${C.purple}`, background:`${C.purple}22`, color:C.purple, cursor:'pointer', fontWeight:600, fontSize:13, display:'flex', alignItems:'center', gap:7, fontFamily:'inherit' }}><Sparkles size={14}/>{t.reels.aiBtn}</button>
          <button onClick={()=>setEditReel(false)} style={{ padding:'9px 16px', borderRadius:9, border:'none', background:C.purple, color:C.white, cursor:'pointer', fontWeight:600, fontSize:13, display:'flex', alignItems:'center', gap:7, fontFamily:'inherit' }}><Plus size={14}/>{t.reels.addBtn}</button>
        </div>
      </div>
      <div style={{ display:'flex', gap:8, marginBottom:20 }}>
        {['all','live','scheduled','draft'].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{ padding:'6px 15px', borderRadius:8, border:'none', cursor:'pointer', background:filter===f?C.purple:C.card, color:filter===f?C.white:C.muted, fontSize:13, fontWeight:filter===f?600:400, textTransform:'capitalize', fontFamily:'inherit' }}>
            {f==='all'?t.reels.all:f==='live'?t.reels.live:f==='scheduled'?t.reels.scheduled:t.reels.draft} ({f==='all'?reels.length:reels.filter(r=>r.status===f).length})
          </button>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
        {shown.map(r=>(
          <div key={r.id} style={{ background:C.card, borderRadius:16, overflow:'hidden', border:`1px solid ${C.border}` }}>
            <div style={{ height:140, background:r.mediaUrl?'transparent':`linear-gradient(135deg,${r.color}44,${C.bg})`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
              {r.mediaUrl?<img src={r.mediaUrl} style={{ width:'100%', height:'100%', objectFit:'cover' }} alt=""/>:<div style={{ fontSize:42 }}>{r.emoji}</div>}
              <div style={{ position:'absolute', top:8, left:8 }}>{pill(r.status==='live'?'● LIVE':r.status.toUpperCase(), r.status==='live'?C.green:r.status==='scheduled'?C.orange:C.muted)}</div>
              <div style={{ position:'absolute', top:8, right:8 }}>{pill(r.type, r.color)}</div>
              {r.mediaUrl&&<div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,transparent 50%,rgba(0,0,0,.5))' }}/>}
            </div>
            <div style={{ padding:14 }}>
              <div style={{ fontSize:14, fontWeight:700, marginBottom:3 }}>{r.title}</div>
              <div style={{ fontSize:11, color:C.muted, marginBottom:4 }}>📍 {r.loc} · {r.ago}</div>
              {r.ctaUrl&&<div style={{ fontSize:10, color:C.blue, marginBottom:8, display:'flex', alignItems:'center', gap:3 }}><ExternalLink size={9}/><span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:160 }}>{r.ctaUrl}</span></div>}
              {r.status==='live'&&(
                <div style={{ display:'flex', gap:14, marginBottom:12 }}>
                  <div><div style={{ fontSize:16, fontWeight:800 }}>{r.views.toLocaleString()}</div><div style={{ fontSize:10, color:C.muted }}>{t.reels.views}</div></div>
                  <div><div style={{ fontSize:16, fontWeight:800, color:C.pink }}>{r.ctr}%</div><div style={{ fontSize:10, color:C.muted }}>CTR</div></div>
                  <div><div style={{ fontSize:12, fontWeight:700, color:C.blue }}>{r.cta}</div><div style={{ fontSize:10, color:C.muted }}>{t.reels.cta}</div></div>
                </div>
              )}
              <div style={{ display:'flex', gap:6 }}>
                <button onClick={()=>setReels(rs=>rs.map(x=>x.id===r.id?{...x,status:x.status==='live'?'draft':'live'}:x))} style={{ flex:1, padding:'7px 0', borderRadius:8, border:'none', cursor:'pointer', background:r.status==='live'?`${C.orange}22`:`${C.green}22`, color:r.status==='live'?C.orange:C.green, fontSize:12, fontWeight:600, fontFamily:'inherit' }}>
                  {r.status==='live'?t.reels.pause:t.reels.publish}
                </button>
                <button onClick={()=>setEditReel(r)} style={{ width:34, height:34, borderRadius:8, border:'none', cursor:'pointer', background:`${C.blue}22`, color:C.blue, display:'flex', alignItems:'center', justifyContent:'center' }}><Edit2 size={13}/></button>
                <button onClick={()=>setReels(rs=>rs.filter(x=>x.id!==r.id))} style={{ width:34, height:34, borderRadius:8, border:'none', cursor:'pointer', background:`${C.pink}22`, color:C.pink, display:'flex', alignItems:'center', justifyContent:'center' }}><Trash2 size={13}/></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editReel !== null && (
        <ReelModal
          reel={editReel||null} locs={locs}
          onClose={()=>setEditReel(null)}
          onSave={saved => {
            if (editReel) setReels(rs=>rs.map(x=>x.id===saved.id?saved:x))
            else setReels(rs=>[saved,...rs])
            setEditReel(null)
          }}
          notify={notify} t={t}
        />
      )}
    </div>
  )
}

// ─── Locations ───────────────────────────────────────────
function LocationsPage({ locs, setLocs, notify, t }) {
  const [editLoc, setEditLoc] = useState(null) // null=closed, false=new, obj=edit

  const doSave = saved => {
    if (saved.id && locs.find(l=>l.id===saved.id)) setLocs(ls=>ls.map(l=>l.id===saved.id?saved:l))
    else setLocs(ls=>[...ls, saved])
  }

  const copy = async (text) => {
    await copyToClipboard(text)
    notify('✅ URL kopiert!')
  }

  const dlQR = async (l) => {
    notify('⏳ QR-Code wird heruntergeladen...')
    await downloadQR(l.id, l.name)
    notify('✅ QR-Code gespeichert!')
  }

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:24 }}>
        <div><div style={{ fontSize:11, color:C.pink, fontWeight:700, letterSpacing:2, marginBottom:6 }}>{t.locations.kicker}</div><div style={{ fontSize:24, fontWeight:800 }}>{t.locations.title}</div></div>
        <button onClick={()=>setEditLoc(false)} style={{ padding:'9px 16px', borderRadius:9, border:'none', background:C.purple, color:C.white, cursor:'pointer', fontWeight:600, fontSize:13, display:'flex', alignItems:'center', gap:7, fontFamily:'inherit' }}><Plus size={14}/>{t.locations.addBtn}</button>
      </div>

      <div style={{ display:'grid', gap:14 }}>
        {locs.map(l=>(
          <div key={l.id} style={{ background:C.card, borderRadius:16, padding:20, border:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:20 }}>
            {/* QR via API */}
            <div style={{ width:80, height:80, borderRadius:12, background:C.white, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flexShrink:0, overflow:'hidden', cursor:'pointer' }} onClick={()=>dlQR(l)}>
              <img src={qrImageUrl(l.id, 80)} alt="QR" style={{ width:70, height:70 }}/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                <span style={{ fontSize:15, fontWeight:700 }}>{l.name}</span>
                <div style={{ width:8, height:8, borderRadius:'50%', background:l.active?C.green:C.dim }}/>
                <span style={{ fontSize:11, color:l.active?C.green:C.muted }}>{l.active?t.locations.active:t.locations.inactive}</span>
              </div>
              <div style={{ fontSize:12, color:C.muted, marginBottom:9 }}>📍 {l.city}</div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'5px 10px', background:C.card2, borderRadius:7, fontSize:11, color:C.muted, cursor:'pointer' }} onClick={()=>copy(`https://app.scenvy.de/l/${l.id}`)}>
                🔗 app.scenvy.de/l/{l.id}
                <Copy size={11} color={C.purple}/>
              </div>
            </div>
            <div style={{ display:'flex', gap:20, textAlign:'center' }}>
              <div><div style={{ fontSize:20, fontWeight:800 }}>{l.scans.toLocaleString()}</div><div style={{ fontSize:11, color:C.muted }}>{t.locations.scans}</div></div>
              <div><div style={{ fontSize:20, fontWeight:800, color:l.wr>0?C.pink:C.dim }}>{l.wr>0?`${l.wr}%`:'—'}</div><div style={{ fontSize:11, color:C.muted }}>{t.locations.watchRate}</div></div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
              <button onClick={()=>setEditLoc(l)} style={{ padding:'7px 14px', borderRadius:8, border:`1px solid ${C.blue}`, background:`${C.blue}11`, color:C.blue, cursor:'pointer', fontSize:12, fontWeight:600, fontFamily:'inherit', display:'flex', alignItems:'center', gap:5 }}><Edit2 size={11}/>{t.locations.edit}</button>
              <button onClick={()=>{setLocs(ls=>ls.map(x=>x.id===l.id?{...x,active:!x.active}:x));notify(t.common.updated)}} style={{ padding:'7px 14px', borderRadius:8, border:'none', cursor:'pointer', background:l.active?`${C.orange}22`:`${C.green}22`, color:l.active?C.orange:C.green, fontSize:12, fontWeight:600, fontFamily:'inherit' }}>
                {l.active?t.locations.deactivate:t.locations.activate}
              </button>
              <button onClick={()=>dlQR(l)} style={{ padding:'7px 14px', borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, cursor:'pointer', fontSize:12, fontFamily:'inherit', display:'flex', alignItems:'center', gap:5 }}><Download size={11}/>{t.locations.downloadQR}</button>
            </div>
          </div>
        ))}
      </div>

      {editLoc !== null && (
        <LocationModal loc={editLoc||null} onClose={()=>setEditLoc(null)} onSave={saved=>{doSave(saved);setEditLoc(null)}} notify={notify}/>
      )}
    </div>
  )
}

// ─── QR Codes Page ────────────────────────────────────────
function QRPage({ locs, notify, t }) {
  const copy = async (id) => { await copyToClipboard(`https://app.scenvy.de/l/${id}`); notify('✅ URL kopiert!') }
  const dl   = async (l)  => { notify('⏳ Wird heruntergeladen...'); await downloadQR(l.id, l.name); notify('✅ QR-Code gespeichert!') }

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, color:C.pink, fontWeight:700, letterSpacing:2, marginBottom:6 }}>{t.qr.kicker}</div>
        <div style={{ fontSize:24, fontWeight:800 }}>{t.qr.title}</div>
        <div style={{ fontSize:13, color:C.muted, marginTop:4 }}>{t.qr.sub}</div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:20 }}>
        {locs.map(l=>(
          <div key={l.id} style={{ background:C.card, borderRadius:20, padding:28, border:`1px solid ${C.border}`, display:'flex', gap:24, alignItems:'center' }}>
            {/* Large QR */}
            <div style={{ background:C.white, borderRadius:14, padding:10, flexShrink:0 }}>
              <img src={qrImageUrl(l.id, 160)} alt="QR" style={{ width:160, height:160, display:'block' }}/>
              <div style={{ textAlign:'center', fontSize:10, fontWeight:800, color:C.bg, marginTop:6, letterSpacing:2 }}>SCENVY</div>
            </div>
            {/* Info */}
            <div style={{ flex:1 }}>
              <div style={{ fontSize:17, fontWeight:800, marginBottom:4 }}>{l.name}</div>
              <div style={{ fontSize:13, color:C.muted, marginBottom:12 }}>📍 {l.city}</div>
              <div style={{ fontSize:11, color:C.blue, marginBottom:16, display:'flex', alignItems:'center', gap:5 }}><Globe size={11}/>app.scenvy.de/l/{l.id}</div>
              <div style={{ display:'flex', gap:8 }}>
                <button onClick={()=>dl(l)} style={{ flex:1, padding:'9px 0', borderRadius:9, border:'none', background:grad(C.purple,C.pink), color:C.white, cursor:'pointer', fontWeight:600, fontSize:13, fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}><Download size={14}/>{t.qr.download}</button>
                <button onClick={()=>copy(l.id)} style={{ flex:1, padding:'9px 0', borderRadius:9, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, cursor:'pointer', fontSize:13, fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}><Copy size={13}/>{t.qr.copy}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Analytics ───────────────────────────────────────────
function Analytics({ reels }) {
  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, color:C.pink, fontWeight:700, letterSpacing:2, marginBottom:6 }}>INSIGHTS</div>
        <div style={{ fontSize:24, fontWeight:800 }}>Analytics</div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        {[['Scans (7 Tage)','2.038','+18%',C.purple],['Ø Watch-Time','12,4s','+3s',C.pink],['CTA-Klicks','847','+31%',C.blue],['Conversion','41,5%','+7%',C.green]].map(([l,v,d,c],i)=>(
          <div key={i} style={{ background:C.card, borderRadius:14, padding:18, border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:11, color:C.muted, marginBottom:10 }}>{l}</div>
            <div style={{ fontSize:26, fontWeight:800 }}>{v}</div>
            <div style={{ fontSize:12, color:C.green, marginTop:4 }}>{d} vs. Vorwoche</div>
          </div>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:20, marginBottom:20 }}>
        <div style={{ background:C.card, borderRadius:16, padding:20, border:`1px solid ${C.border}` }}>
          <div style={{ fontSize:14, fontWeight:700, marginBottom:16 }}>Scans & Views pro Woche</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={CHART_DATA}>
              <XAxis dataKey="day" tick={{ fill:C.muted, fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:C.muted, fontSize:11 }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ background:C.card2, border:`1px solid ${C.border}`, borderRadius:8, color:C.white }}/>
              <Bar dataKey="scans" fill={C.purple} radius={[4,4,0,0]}/><Bar dataKey="views" fill={C.pink} radius={[4,4,0,0]} opacity={0.6}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background:C.card, borderRadius:16, padding:20, border:`1px solid ${C.border}` }}>
          <div style={{ fontSize:14, fontWeight:700, marginBottom:16 }}>CTR-Verlauf</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={CHART_DATA}>
              <XAxis dataKey="day" tick={{ fill:C.muted, fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:C.muted, fontSize:11 }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ background:C.card2, border:`1px solid ${C.border}`, borderRadius:8, color:C.white }}/>
              <Line dataKey="ctr" stroke={C.blue} strokeWidth={2.5} dot={false}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{ background:C.card, borderRadius:16, padding:20, border:`1px solid ${C.border}` }}>
        <div style={{ fontSize:14, fontWeight:700, marginBottom:16 }}>Top Reels</div>
        {reels.filter(r=>r.status==='live').sort((a,b)=>b.views-a.views).map(r=>(
          <div key={r.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'11px 0', borderBottom:`1px solid ${C.border}` }}>
            <div style={{ width:36, height:36, borderRadius:8, background:`${r.color}28`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, overflow:'hidden', flexShrink:0 }}>
              {r.mediaUrl?<img src={r.mediaUrl} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:8 }} alt=""/>:r.emoji}
            </div>
            <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:600 }}>{r.title}</div><div style={{ fontSize:11, color:C.muted }}>{r.loc}</div></div>
            <div style={{ width:76 }}><div style={{ fontSize:13, fontWeight:700 }}>{r.views.toLocaleString()}</div><div style={{ fontSize:10, color:C.muted }}>Views</div></div>
            <div style={{ width:56 }}><div style={{ fontSize:13, fontWeight:700, color:C.pink }}>{r.ctr}%</div><div style={{ fontSize:10, color:C.muted }}>CTR</div></div>
            <div style={{ width:100 }}><div style={{ height:5, background:C.card2, borderRadius:3, overflow:'hidden' }}><div style={{ height:'100%', width:`${r.ctr*2.4}%`, background:grad(C.purple,C.pink), borderRadius:3 }}/></div></div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── AI Generator ────────────────────────────────────────
function AIGenerator({ notify, setReels, locs, t }) {
  const [inputMode, setInputMode] = useState('text')
  const [form, setForm] = useState({ venue:'Marina Walk', offer:'', type:'offer', tone:'exciting', ctaUrl:'' })
  const [imgFile, setImgFile] = useState(null)
  const [imgPreview, setImgPreview] = useState(null)
  const [imgDesc, setImgDesc] = useState('')
  const [locationId, setLocationId] = useState(locs[0]?.id||'l1')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef()

  const handleImgFile = e => { const f=e.target.files?.[0];if(!f)return;setImgFile(f);setImgPreview(URL.createObjectURL(f)) }

  const generate = async () => {
    const offerText = inputMode==='image'?imgDesc:form.offer
    if (!offerText.trim()) { notify('Bitte Beschreibung eingeben'); return }
    setLoading(true); setResult(null)
    try {
      const res = await fetch('/api/ai/generate', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({...form,offer:offerText}) })
      setResult(await res.json())
    } catch {
      const moodMap={offer:'purple',event:'pink',menu:'blue',promo:'orange'}
      setResult({ hook:'TONIGHT ONLY 🔥', headline:offerText.length>40?offerText.slice(0,40)+'…':offerText, subtext:`Exklusiv bei ${form.venue} — jetzt sichern!`, cta:'Jetzt sichern', hashtags:['dubai',form.type,'scenvy'], emoji:form.type==='offer'?'🍹':form.type==='event'?'🎉':'🍽️', urgency:'Nur für begrenzte Zeit', colorMood:moodMap[form.type]||'purple' })
    }
    setLoading(false)
  }

  const save = () => {
    const cm={purple:C.purple,pink:C.pink,blue:C.blue,orange:C.orange,green:C.green}
    const loc = locs.find(l=>l.id===locationId)
    setReels(r=>[...r,{ id:'r'+Date.now(), title:result.headline, type:form.type, status:'draft', views:0, ctr:0, loc:loc?.name||form.venue, locationId, color:cm[result.colorMood]||C.purple, emoji:result.emoji, cta:result.cta, ctaUrl:form.ctaUrl, ctaAction:'url', ago:'Gerade eben', mediaUrl:imgPreview, mediaType:'image' }])
    notify('✨ KI-Reel in der Library gespeichert!')
    setResult(null); setImgFile(null); setImgPreview(null); setImgDesc(''); setForm(f=>({...f,offer:'',ctaUrl:''}))
  }

  const accent = result?({purple:C.purple,pink:C.pink,blue:C.blue,orange:C.orange,green:C.green}[result.colorMood]||C.purple):C.purple

  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontSize:11, color:C.pink, fontWeight:700, letterSpacing:2, marginBottom:6 }}>{t.ai.kicker}</div>
        <div style={{ fontSize:24, fontWeight:800 }}>{t.ai.title}</div>
        <div style={{ fontSize:13, color:C.muted, marginTop:4 }}>{t.ai.sub}</div>
      </div>
      <div style={{ display:'flex', background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:4, marginBottom:20, width:'fit-content' }}>
        {[['text',t.ai.textMode],['image',t.ai.imageMode]].map(([m,label])=>(
          <button key={m} onClick={()=>setInputMode(m)} style={{ padding:'8px 18px', borderRadius:9, border:'none', cursor:'pointer', background:inputMode===m?C.purple:'transparent', color:inputMode===m?C.white:C.muted, fontWeight:inputMode===m?700:400, fontSize:13, fontFamily:'inherit' }}>{label}</button>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
        <div style={{ background:C.card, borderRadius:16, padding:24, border:`1px solid ${C.border}` }}>
          <div style={{ fontSize:14, fontWeight:700, marginBottom:18 }}>Eingabe</div>
          {inputMode==='image'&&(
            <div style={{ marginBottom:14 }}>
              <label style={{ fontSize:11, color:C.muted, display:'block', marginBottom:6, letterSpacing:1, fontWeight:600 }}>{t.ai.imageLabel}</label>
              <div onClick={()=>fileRef.current?.click()} style={{ border:`2px dashed ${imgPreview?C.purple:C.border}`, borderRadius:12, overflow:'hidden', cursor:'pointer', minHeight:100, display:'flex', alignItems:'center', justifyContent:'center', background:`${C.purple}08`, position:'relative' }}>
                {imgPreview?<><img src={imgPreview} style={{ width:'100%', maxHeight:150, objectFit:'cover' }} alt=""/><button onClick={e=>{e.stopPropagation();setImgFile(null);setImgPreview(null)}} style={{ position:'absolute', top:6, right:6, background:C.pink, border:'none', borderRadius:'50%', width:24, height:24, color:C.white, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}><X size={11}/></button></>:<div style={{ textAlign:'center', padding:16 }}><Image size={24} color={C.purple} style={{ marginBottom:6 }}/><div style={{ fontSize:12, color:C.muted }}>Foto hochladen</div></div>}
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImgFile} style={{ display:'none' }}/>
              </div>
              <div style={{ marginTop:12, marginBottom:14 }}>
                <label style={{ fontSize:11, color:C.muted, display:'block', marginBottom:6, letterSpacing:1, fontWeight:600 }}>{t.ai.imageDesc}</label>
                <textarea value={imgDesc} onChange={e=>setImgDesc(e.target.value)} rows={3} placeholder={t.ai.imageDescPh} style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:`1px solid ${C.border}`, background:C.bg, color:C.white, fontSize:13, outline:'none', resize:'vertical', fontFamily:'inherit' }}/>
              </div>
            </div>
          )}
          {inputMode==='text'&&(
            <>
              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:11, color:C.muted, display:'block', marginBottom:6, letterSpacing:1, fontWeight:600 }}>{t.ai.venueLabel}</label>
                <input value={form.venue} onChange={e=>setForm(p=>({...p,venue:e.target.value}))} style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:`1px solid ${C.border}`, background:C.bg, color:C.white, fontSize:13, outline:'none' }}/>
              </div>
              <div style={{ marginBottom:12 }}>
                <label style={{ fontSize:11, color:C.muted, display:'block', marginBottom:6, letterSpacing:1, fontWeight:600 }}>{t.ai.offerLabel}</label>
                <textarea value={form.offer} onChange={e=>setForm(p=>({...p,offer:e.target.value}))} rows={3} placeholder={t.ai.offerPh} style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:`1px solid ${C.border}`, background:C.bg, color:C.white, fontSize:13, outline:'none', resize:'vertical', fontFamily:'inherit' }}/>
              </div>
            </>
          )}
          {/* Standort + CTA URL */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
            <div>
              <label style={{ fontSize:11, color:C.muted, display:'block', marginBottom:6, letterSpacing:1, fontWeight:600 }}>STANDORT</label>
              <select value={locationId} onChange={e=>setLocationId(e.target.value)} style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:`1px solid ${C.border}`, background:C.card2, color:C.white, fontSize:13, outline:'none', fontFamily:'inherit' }}>
                {locs.map(l=><option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:11, color:C.muted, display:'block', marginBottom:6, letterSpacing:1, fontWeight:600 }}>{t.ai.typeLabel}</label>
              <select value={form.type} onChange={e=>setForm(p=>({...p,type:e.target.value}))} style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:`1px solid ${C.border}`, background:C.card2, color:C.white, fontSize:13, outline:'none', fontFamily:'inherit' }}>
                <option value="offer">🏷️ Angebot</option><option value="event">🎉 Event</option><option value="menu">🍽️ Menü</option><option value="promo">⚡ Promo</option>
              </select>
            </div>
          </div>
          <div style={{ marginBottom:18 }}>
            <label style={{ fontSize:11, color:C.muted, display:'block', marginBottom:6, letterSpacing:1, fontWeight:600 }}>{t.ai.ctaTarget}</label>
            <input value={form.ctaUrl} onChange={e=>setForm(p=>({...p,ctaUrl:e.target.value}))} placeholder="https://..." style={{ width:'100%', padding:'10px 14px', borderRadius:8, border:`1px solid ${C.border}`, background:C.bg, color:C.white, fontSize:13, outline:'none' }}/>
          </div>
          <button onClick={generate} disabled={loading} style={{ width:'100%', padding:'14px 0', borderRadius:12, border:'none', cursor:loading?'wait':'pointer', background:loading?C.dim:grad(C.purple,C.pink), color:C.white, fontWeight:700, fontSize:15, display:'flex', alignItems:'center', justifyContent:'center', gap:10, fontFamily:'inherit' }}>
            {loading?<><RefreshCw size={18} style={{ animation:'spin 1s linear infinite' }}/>{t.ai.generating}</>:<><Sparkles size={18}/>{t.ai.generate}</>}
          </button>
        </div>
        <div>
          {!result
            ?<div style={{ background:C.card, borderRadius:16, padding:24, border:`2px dashed ${C.border}`, height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center' }}>
               <Sparkles size={44} color={C.dim} style={{ marginBottom:16 }}/><div style={{ fontSize:16, fontWeight:600, color:C.muted, marginBottom:8 }}>{t.ai.preview}</div><div style={{ fontSize:13, color:C.dim }}>{t.ai.fillIn}</div>
             </div>
            :<div>
               <div style={{ background:`linear-gradient(160deg,${accent}28,${C.bg} 70%)`, border:`2px solid ${accent}44`, borderRadius:22, padding:24, marginBottom:14, boxShadow:`0 0 50px ${accent}22` }}>
                 {imgPreview&&<img src={imgPreview} style={{ width:'100%', borderRadius:14, maxHeight:140, objectFit:'cover', marginBottom:14 }} alt=""/>}
                 <div style={{ background:`linear-gradient(180deg,${accent}33,${C.bg})`, borderRadius:16, padding:'24px 20px', textAlign:'center', marginBottom:14, display:'flex', flexDirection:'column', justifyContent:'space-between', minHeight:200 }}>
                   <div style={{ fontSize:40 }}>{result.emoji}</div>
                   <div>
                     <div style={{ fontSize:12, fontWeight:800, color:accent, letterSpacing:2, marginBottom:7 }}>{result.hook}</div>
                     <div style={{ fontSize:18, fontWeight:800, lineHeight:1.28, marginBottom:9 }}>{result.headline}</div>
                     <div style={{ fontSize:13, color:'rgba(255,255,255,.6)', marginBottom:10 }}>{result.subtext}</div>
                     {result.urgency&&<div style={{ fontSize:12, color:accent, fontWeight:600 }}>⏱ {result.urgency}</div>}
                     {form.ctaUrl&&<div style={{ fontSize:10, color:C.blue, marginTop:6, display:'flex', alignItems:'center', justifyContent:'center', gap:4 }}><ExternalLink size={9}/>{form.ctaUrl}</div>}
                   </div>
                   <button style={{ padding:'11px 28px', borderRadius:13, border:'none', background:accent, color:C.white, fontWeight:700, fontSize:15 }}>{result.cta} →</button>
                 </div>
                 <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                   {result.hashtags.map(h=><span key={h} style={{ fontSize:11, color:accent, background:`${accent}22`, padding:'3px 9px', borderRadius:7 }}>#{h}</span>)}
                 </div>
               </div>
               <div style={{ display:'flex', gap:10 }}>
                 <button onClick={save} style={{ flex:1, padding:'12px 0', borderRadius:10, border:'none', cursor:'pointer', background:accent, color:C.white, fontWeight:700, fontSize:14, fontFamily:'inherit' }}>✓ {t.ai.save}</button>
                 <button onClick={()=>setResult(null)} style={{ padding:'12px 18px', borderRadius:10, border:`1px solid ${C.border}`, background:'transparent', color:C.muted, cursor:'pointer', fontSize:13, fontFamily:'inherit' }}>{t.ai.retry}</button>
               </div>
             </div>
          }
        </div>
      </div>
    </div>
  )
}

// ─── Main Export ─────────────────────────────────────────
export default function Dashboard() {
  const [page, setPage] = useState('overview')
  const [open, setOpen] = useState(true)
  const [lang, setLang] = useState(() => storage.load('lang','de'))

  // Persistent state
  const [reels, setReels] = useState(() => storage.load('reels', REELS_SEED))
  const [locs,  setLocs]  = useState(() => storage.load('locs',  LOCATIONS_SEED))

  // Auto-save to localStorage on every change
  useEffect(() => { storage.save('reels', reels) }, [reels])
  useEffect(() => { storage.save('locs',  locs)  }, [locs])
  useEffect(() => { storage.save('lang',  lang)  }, [lang])

  const [toast, setToast] = useState(null)
  const notify = msg => { setToast(msg); setTimeout(()=>setToast(null), 3000) }
  const t = ADM[lang]

  return (
    <div style={{ display:'flex', height:'100vh', background:C.bg, fontFamily:"'Inter',sans-serif", color:C.white }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}`}</style>

      <Sidebar page={page} setPage={setPage} open={open} setOpen={setOpen} t={t}/>

      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {/* Top bar */}
        <div style={{ height:58, borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', padding:'0 28px', justifyContent:'space-between', flexShrink:0 }}>
          <div style={{ fontWeight:700, fontSize:14 }}>Marina Group Dashboard</div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            {/* Lang toggle */}
            <div style={{ display:'flex', background:C.card2, border:`1px solid ${C.border}`, borderRadius:8, padding:3 }}>
              {[['de','🇩🇪'],['en','🇬🇧']].map(([l,f])=>(
                <button key={l} onClick={()=>setLang(l)} style={{ padding:'3px 8px', borderRadius:5, border:'none', cursor:'pointer', background:lang===l?C.purple:'transparent', fontSize:15, fontFamily:'inherit' }}>{f}</button>
              ))}
            </div>
            <div style={{ fontSize:12, color:C.muted }}>app.scenvy.de</div>
            <div style={{ width:30, height:30, borderRadius:'50%', background:grad(C.purple,C.pink), display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>M</div>
          </div>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:28 }}>
          {page==='overview'  && <Overview    setPage={setPage} reels={reels} locs={locs} t={t}/>}
          {page==='reels'     && <ReelsPage   reels={reels} setReels={setReels} locs={locs} notify={notify} t={t}/>}
          {page==='locations' && <LocationsPage locs={locs} setLocs={setLocs} notify={notify} t={t}/>}
          {page==='analytics' && <Analytics   reels={reels}/>}
          {page==='ai'        && <AIGenerator notify={notify} setReels={setReels} locs={locs} t={t}/>}
          {page==='qr'        && <QRPage      locs={locs} notify={notify} t={t}/>}
          {page==='settings'  && (
            <div>
              <div style={{ fontSize:11, color:C.pink, fontWeight:700, letterSpacing:2, marginBottom:16 }}>{t.settings.kicker}</div>
              <div style={{ fontSize:24, fontWeight:800, marginBottom:24 }}>{t.settings.title}</div>
              <div style={{ background:C.card, borderRadius:14, padding:20, border:`1px solid ${C.border}`, marginBottom:12 }}>
                <div style={{ fontSize:14, fontWeight:700, marginBottom:12 }}>{t.settings.plan}</div>
                <div style={{ display:'flex', gap:14, alignItems:'center' }}>
                  <span style={{ padding:'6px 14px', background:`${C.purple}33`, color:C.purple, borderRadius:8, fontWeight:700, fontSize:13 }}>ENTERPRISE</span>
                  <span style={{ fontSize:13, color:C.muted }}>4 Standorte · Unbegrenzte Reels · KI · Analytics</span>
                </div>
              </div>
              <div style={{ background:C.card, borderRadius:14, padding:20, border:`1px solid ${C.border}` }}>
                <div style={{ fontSize:14, fontWeight:700, marginBottom:12 }}>{t.settings.media}</div>
                <div style={{ fontSize:13, color:C.muted, marginBottom:12 }}>{t.settings.mediaNote}</div>
                <div style={{ display:'flex', gap:10 }}>
                  {['☁️ Cloudflare Stream','🪣 AWS S3','🟢 Supabase Storage'].map(s=>(
                    <button key={s} style={{ padding:'8px 14px', borderRadius:8, border:`1px solid ${C.border}`, background:C.card2, color:C.muted, cursor:'pointer', fontSize:12, fontFamily:'inherit' }}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {toast&&(
        <div style={{ position:'fixed', bottom:28, left:'50%', transform:'translateX(-50%)', background:C.purple, color:C.white, padding:'12px 24px', borderRadius:14, fontSize:13, fontWeight:600, zIndex:9999, animation:'fadeUp .25s ease' }}>{toast}</div>
      )}
    </div>
  )
}
