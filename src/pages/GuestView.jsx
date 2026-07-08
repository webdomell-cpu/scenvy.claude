import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { C, grad } from '../tokens.js'
import { REELS_SEED, LOCATIONS_SEED } from '../data.js'
import { storage, toGuestReel } from '../storage.js'
import { Heart, Share2, MessageCircle, QrCode, ExternalLink } from 'lucide-react'

export default function GuestView() {
  const { locationId } = useParams()
  const nav = useNavigate()

  // Load real data from storage (set by Dashboard)
  const allReels = storage.load('reels', REELS_SEED)
  const allLocs  = storage.load('locs',  LOCATIONS_SEED)

  // Find location
  const location = allLocs.find(l => l.id === locationId)

  // Filter live reels for this location → transform to guest format
  const liveReels = allReels
    .filter(r => r.status === 'live' && r.locationId === locationId)
    .map(toGuestReel)

  // Fallback: if location has no assigned reels, show all live reels
  const REELS = liveReels.length > 0
    ? liveReels
    : allReels.filter(r => r.status === 'live').slice(0, 5).map(toGuestReel)

  const [idx,   setIdx]   = useState(0)
  const [prog,  setProg]  = useState(0)
  const [liked, setLiked] = useState({})
  const [anim,  setAnim]  = useState(false)

  useEffect(() => {
    if (!REELS.length) return
    setProg(0)
    const iv = setInterval(() => setProg(p => {
      if (p >= 100) { goNext(); return 0 }
      return p + 0.45
    }), 40)
    return () => clearInterval(iv)
  }, [idx, REELS.length])

  if (!REELS.length) {
    return (
      <div style={{ height:'100vh', background:C.bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:"'Inter',sans-serif", color:C.white }}>
        <div style={{ fontSize:48, marginBottom:16 }}>📍</div>
        <div style={{ fontSize:20, fontWeight:700, marginBottom:8 }}>Keine Reels verfügbar</div>
        <div style={{ fontSize:14, color:C.muted }}>Dieser Standort hat noch keine Inhalte.</div>
      </div>
    )
  }

  const goNext = () => {
    if (idx < REELS.length - 1) {
      setAnim(true); setTimeout(() => { setIdx(i=>i+1); setAnim(false) }, 200)
    }
  }
  const goPrev = () => {
    if (idx > 0) {
      setAnim(true); setTimeout(() => { setIdx(i=>i-1); setAnim(false) }, 200)
    }
  }

  const reel = REELS[idx]

  const handleCTA = () => {
    if (reel.ctaUrl) window.open(reel.ctaUrl, '_blank')
  }

  return (
    <div style={{
      height:'100vh', width:'100vw',
      background: reel.mediaUrl ? `#0d0d14` : reel.bg,
      display:'flex', alignItems:'center', justifyContent:'center',
      fontFamily:"'Inter',sans-serif", position:'relative', overflow:'hidden',
      transition:'background 0.5s'
    }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}`}</style>

      {/* Background image/video */}
      {reel.mediaUrl && (
        <div style={{ position:'absolute', inset:0 }}>
          <img src={reel.mediaUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,rgba(0,0,0,.3) 0%,rgba(0,0,0,.05) 40%,rgba(0,0,0,.75) 100%)' }}/>
        </div>
      )}

      {/* Glow (only without image) */}
      {!reel.mediaUrl && (
        <div style={{
          position:'absolute', width:'70vw', height:'70vh', borderRadius:'50%',
          background:`radial-gradient(circle,${reel.accent}44 0%,transparent 70%)`,
          top:'40%', left:'50%', transform:'translate(-50%,-50%)', pointerEvents:'none'
        }}/>
      )}

      {/* Progress bars */}
      <div style={{ position:'absolute', top:16, left:16, right:16, display:'flex', gap:4, zIndex:10 }}>
        {REELS.map((_,i) => (
          <div key={i} style={{ flex:1, height:3, borderRadius:2, background:'rgba(255,255,255,.25)', overflow:'hidden' }}>
            <div style={{ height:'100%', background:C.white, borderRadius:2,
              width:i<idx?'100%':i===idx?`${prog}%`:'0%',
              transition:i===idx?'none':'width .2s' }}/>
          </div>
        ))}
      </div>

      {/* Header */}
      <div style={{ position:'absolute', top:28, left:16, right:16, display:'flex', justifyContent:'space-between', alignItems:'center', zIndex:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:'50%', background:grad(C.purple,C.pink), display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:16 }}>S</div>
          <div>
            <div style={{ fontSize:13, fontWeight:700 }}>{location?.name || 'SCENVY'}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,.6)' }}>📍 {location?.city || 'Dubai'}</div>
          </div>
        </div>
        <div style={{ background:reel.accent, borderRadius:8, padding:'4px 10px', fontSize:10, fontWeight:700, letterSpacing:1 }}>
          {reel.tag}
        </div>
      </div>

      {/* Content */}
      <div style={{
        position:'absolute', bottom:130, left:20, right:80,
        opacity:anim?0:1, transition:'opacity .2s',
        transform:anim?'translateY(-14px)':'none', zIndex:5
      }}>
        <div style={{ fontSize:'min(18vw,80px)', maxWidth:80, lineHeight:1, marginBottom:10 }}>{reel.emoji}</div>
        <div style={{ fontSize:13, fontWeight:800, color:reel.accent, letterSpacing:2, marginBottom:8, transition:'color .5s' }}>{reel.hook}</div>
        <div style={{ fontSize:'clamp(20px,5vw,30px)', fontWeight:900, lineHeight:1.2, marginBottom:10 }}>{reel.title}</div>
        <div style={{ fontSize:14, color:'rgba(255,255,255,.75)' }}>{reel.sub}</div>
      </div>

      {/* Side actions */}
      <div style={{ position:'absolute', right:16, bottom:150, display:'flex', flexDirection:'column', gap:22, alignItems:'center', zIndex:10 }}>
        {[
          { icon:Heart,         label:liked[idx]?'1.2k':'1.1k', action:()=>setLiked(l=>({...l,[idx]:!l[idx]})), color:liked[idx]?C.pink:C.white },
          { icon:MessageCircle, label:'48',   action:()=>{},       color:C.white },
          { icon:Share2,        label:'Share', action:()=>{ if(navigator.share) navigator.share({ title:reel.title, url:window.location.href }) }, color:C.white },
          { icon:QrCode,        label:'QR',    action:()=>nav('/'), color:C.white },
        ].map((a,i) => (
          <div key={i} style={{ textAlign:'center' }}>
            <button onClick={a.action} style={{ width:48, height:48, borderRadius:'50%', border:'none', cursor:'pointer', background:'rgba(255,255,255,.15)', backdropFilter:'blur(12px)', display:'flex', alignItems:'center', justifyContent:'center', color:a.color }}>
              <a.icon size={22} fill={a.color===C.pink?C.pink:'none'} color={a.color}/>
            </button>
            <div style={{ fontSize:10, color:'rgba(255,255,255,.65)', marginTop:4 }}>{a.label}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ position:'absolute', bottom:40, left:20, right:20, zIndex:10 }}>
        <button onClick={handleCTA} style={{
          width:'100%', padding:'16px 0', borderRadius:18, border:'none', cursor:'pointer',
          background:grad(reel.accent, C.pink), color:C.white, fontWeight:700,
          fontSize:18, fontFamily:'inherit',
          boxShadow:`0 6px 28px ${reel.accent}66`
        }}>
          {reel.cta} →
        </button>
      </div>

      {/* Tap zones */}
      <button onClick={goPrev} style={{ position:'absolute', top:'25%', left:0, width:'45%', height:'40%', background:'transparent', border:'none', cursor:'pointer', zIndex:4 }}/>
      <button onClick={goNext} style={{ position:'absolute', top:'25%', right:0, width:'45%', height:'40%', background:'transparent', border:'none', cursor:'pointer', zIndex:4 }}/>

      {/* Powered by */}
      <div style={{ position:'absolute', bottom:10, left:'50%', transform:'translateX(-50%)', fontSize:10, color:'rgba(255,255,255,.3)', whiteSpace:'nowrap' }}>
        Powered by SCENVY · app.scenvy.de
      </div>
    </div>
  )
}
