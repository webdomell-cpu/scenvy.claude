import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { C, grad } from '../tokens.js'
import { T } from '../i18n.js'
import { Check, Star, Play, Video, Zap, Sparkles, MapPin, BarChart2, QrCode, ArrowRight } from 'lucide-react'

// ─── Image pool for animated reels ──────────────────────
const REEL_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=80', accent: '#7C3AED', tag: 'HAPPY HOUR', title: '50% Off Cocktails', cta: 'Order Now'  },
  { url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80', accent: '#FF2D8D', tag: 'NEW MENU',    title: "Chef's Special",  cta: 'View Menu'  },
  { url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&q=80', accent: '#00D4FF', tag: 'THIS WEEK',  title: 'Ladies Night ✨', cta: 'RSVP Free'  },
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80', accent: '#FF9500', tag: 'FEATURED',   title: 'Sunset Terrace',  cta: 'Book Table' },
]

const Glow = ({ color, x, y, size = 600 }) => (
  <div style={{ position:'absolute', width:size, height:size, borderRadius:'50%', pointerEvents:'none',
    background:`radial-gradient(circle,${color}33 0%,transparent 70%)`,
    left:x, top:y, transform:'translate(-50%,-50%)' }} />
)

const Btn = ({ children, onClick, variant='primary', style={} }) => (
  <button onClick={onClick} style={{
    padding:'13px 28px', borderRadius:12, border:'none', cursor:'pointer',
    fontWeight:700, fontSize:15, transition:'all .2s', fontFamily:'inherit',
    ...(variant==='primary' ? { background:grad(C.purple,C.pink), color:C.white, boxShadow:`0 4px 24px ${C.purple}55` } : {}),
    ...(variant==='outline' ? { background:'transparent', color:C.white, border:`1px solid ${C.border}` } : {}),
    ...(variant==='ghost'   ? { background:'transparent', color:C.muted } : {}),
    ...style
  }}>{children}</button>
)

// ─── Animated Phone Reel ─────────────────────────────────
function AnimatedPhone({ size = 'large' }) {
  const [idx, setIdx] = useState(0)
  const [prog, setProg] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    setProg(0)
    const iv = setInterval(() => setProg(p => {
      if (p >= 100) {
        setFade(false)
        setTimeout(() => { setIdx(i => (i+1) % REEL_IMAGES.length); setFade(true) }, 300)
        return 0
      }
      return p + 0.4
    }), 40)
    return () => clearInterval(iv)
  }, [idx])

  const r = REEL_IMAGES[idx]
  const isLarge = size === 'large'
  const w = isLarge ? 300 : 160
  const h = isLarge ? 560 : 320

  return (
    <div style={{
      width:w, height:h, borderRadius:isLarge?38:26, overflow:'hidden',
      border:`2px solid ${C.border}`, position:'relative',
      boxShadow:`0 0 ${isLarge?70:40}px ${r.accent}55, 0 ${isLarge?40:20}px ${isLarge?80:40}px rgba(0,0,0,.7)`,
      transition:'box-shadow .8s', flexShrink:0
    }}>
      {/* Background image */}
      <img src={r.url} alt="" style={{
        position:'absolute', inset:0, width:'100%', height:'100%',
        objectFit:'cover', opacity: fade ? 1 : 0, transition:'opacity .3s'
      }} />
      {/* Dark overlay */}
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,rgba(0,0,0,.3) 0%,rgba(0,0,0,.1) 40%,rgba(0,0,0,.7) 100%)' }} />

      {/* Progress bars */}
      <div style={{ position:'absolute', top:12, left:10, right:10, display:'flex', gap:3, zIndex:5 }}>
        {REEL_IMAGES.map((_,i) => (
          <div key={i} style={{ flex:1, height:2.5, borderRadius:2, background:'rgba(255,255,255,.3)', overflow:'hidden' }}>
            <div style={{ height:'100%', background:C.white, borderRadius:2,
              width: i<idx?'100%': i===idx?`${prog}%`:'0%', transition:i===idx?'none':'width .2s' }} />
          </div>
        ))}
      </div>

      {/* Header */}
      <div style={{ position:'absolute', top:22, left:10, right:10, display:'flex', justifyContent:'space-between', alignItems:'center', zIndex:5 }}>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <div style={{ width:28, height:28, borderRadius:'50%', background:grad(C.purple,C.pink), display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:12 }}>S</div>
          <div style={{ fontSize:isLarge?11:9, fontWeight:700 }}>Marina Group</div>
        </div>
        <div style={{ background:r.accent, borderRadius:5, padding:'2px 7px', fontSize:isLarge?9:8, fontWeight:700, letterSpacing:.8, opacity:fade?1:0, transition:'opacity .3s' }}>
          {r.tag}
        </div>
      </div>

      {/* Content */}
      <div style={{ position:'absolute', bottom:isLarge?90:60, left:12, right:isLarge?56:44,
        opacity:fade?1:0, transition:'opacity .3s' }}>
        <div style={{ fontSize:isLarge?20:13, fontWeight:800, lineHeight:1.25, marginBottom:isLarge?6:4, textShadow:'0 2px 8px rgba(0,0,0,.8)' }}>{r.title}</div>
        <div style={{ fontSize:isLarge?11:9, color:'rgba(255,255,255,.7)' }}>Dubai Marina · Tonight</div>
      </div>

      {/* Side actions */}
      {isLarge && (
        <div style={{ position:'absolute', right:10, bottom:100, display:'flex', flexDirection:'column', gap:14, alignItems:'center' }}>
          {['❤️','💬','↗️','📲'].map((ic,i) => (
            <div key={i} style={{ width:38, height:38, borderRadius:'50%', background:'rgba(255,255,255,.2)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>{ic}</div>
          ))}
        </div>
      )}

      {/* CTA */}
      <div style={{ position:'absolute', bottom:isLarge?20:12, left:10, right:10 }}>
        <div style={{ padding:`${isLarge?12:8}px 0`, borderRadius:isLarge?14:10, textAlign:'center',
          background:grad(r.accent,C.pink), fontWeight:700, fontSize:isLarge?14:11,
          transition:'background .8s', boxShadow:`0 4px 16px ${r.accent}66`,
          opacity:fade?1:0 }}>
          {r.cta} →
        </div>
      </div>
    </div>
  )
}

// ─── Nav ────────────────────────────────────────────────
function Nav({ lang, setLang, t }) {
  const nav = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav style={{
      position:'fixed', top:0, left:0, right:0, zIndex:100, height:66,
      background: scrolled ? 'rgba(13,13,20,.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? `1px solid ${C.border}` : 'none',
      transition:'all .3s', padding:'0 5%',
      display:'flex', alignItems:'center', gap:12
    }}>
      {/* Logo */}
      <div style={{ display:'flex', alignItems:'center', gap:9, flex:1 }}>
        <div style={{ width:32, height:32, borderRadius:9, background:grad(C.purple,C.pink), display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:16 }}>S</div>
        <span style={{ fontWeight:800, fontSize:16, letterSpacing:3 }}>SCENVY</span>
      </div>

      {/* Links */}
      <div style={{ display:'flex', gap:28, position:'absolute', left:'50%', transform:'translateX(-50%)' }}>
        {[['features', t.nav.features], ['how-it-works', t.nav.howItWorks], ['pricing', t.nav.pricing], ['demo', t.nav.demo]].map(([id, label]) => (
          <a key={id} href={`#${id}`} style={{ color:C.muted, fontSize:14, fontWeight:500, textDecoration:'none', transition:'color .15s' }}
            onMouseEnter={e => e.target.style.color=C.white}
            onMouseLeave={e => e.target.style.color=C.muted}>
            {label}
          </a>
        ))}
      </div>

      {/* Right side */}
      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
        {/* Language switcher */}
        <div style={{ display:'flex', gap:4, background:C.card, border:`1px solid ${C.border}`, borderRadius:8, padding:3 }}>
          {[['de','🇩🇪'],['en','🇬🇧']].map(([l, flag]) => (
            <button key={l} onClick={() => setLang(l)} style={{
              padding:'4px 8px', borderRadius:6, border:'none', cursor:'pointer',
              background: lang===l ? C.purple : 'transparent',
              fontSize:16, lineHeight:1, fontFamily:'inherit'
            }}>{flag}</button>
          ))}
        </div>
        <Btn variant="ghost" onClick={() => nav('/login')} style={{ fontSize:14, padding:'9px 16px' }}>{t.nav.login}</Btn>
        <Btn onClick={() => nav('/login?mode=register')} style={{ fontSize:14, padding:'9px 18px' }}>{t.nav.cta}</Btn>
      </div>
    </nav>
  )
}

// ─── Hero ───────────────────────────────────────────────
function Hero({ lang, t }) {
  const nav = useNavigate()
  return (
    <section style={{ minHeight:'100vh', display:'flex', alignItems:'center', padding:'120px 5% 80px', position:'relative', overflow:'hidden' }}>
      <Glow color={C.purple} x="-5%"  y="30%" size={700} />
      <Glow color={C.pink}   x="105%" y="60%" size={600} />
      <style>{`@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }`}</style>

      <div style={{ display:'flex', alignItems:'center', gap:60, width:'100%', maxWidth:1200, margin:'0 auto' }}>
        {/* Text */}
        <div style={{ flex:1 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:`${C.purple}22`, border:`1px solid ${C.purple}44`, borderRadius:20, padding:'6px 14px', marginBottom:24 }}>
            <div style={{ width:6, height:6, borderRadius:'50%', background:C.green }} />
            <span style={{ fontSize:11, fontWeight:700, color:C.purple, letterSpacing:1 }}>{t.hero.kicker}</span>
          </div>

          <h1 style={{ fontSize:'clamp(32px,4.5vw,58px)', fontWeight:900, lineHeight:1.1, marginBottom:22 }}>
            {t.hero.h1a}<br />{t.hero.h1b}{' '}
            <span style={{ background:grad(C.purple,C.pink), WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              {t.hero.scrollable}
            </span>{' '}{t.hero.h1c}
          </h1>

          <p style={{ fontSize:17, color:C.muted, lineHeight:1.7, marginBottom:36, maxWidth:480 }}>{t.hero.sub}</p>

          <div style={{ display:'flex', gap:14, flexWrap:'wrap', marginBottom:48 }}>
            <Btn onClick={() => nav('/login?mode=register')}>{t.hero.cta1}</Btn>
            <Btn variant="outline" onClick={() => nav('/l/demo')} style={{ display:'flex', alignItems:'center', gap:8 }}>
              <Play size={14} fill={C.white} />{t.hero.cta2}
            </Btn>
          </div>

          <div style={{ display:'flex', gap:6, alignItems:'center' }}>
            {[...Array(5)].map((_,i) => <Star key={i} size={14} fill="#FF9500" color="#FF9500" />)}
            <span style={{ fontSize:13, color:C.muted, marginLeft:8 }}>{t.hero.trust}</span>
          </div>
        </div>

        {/* Phone with animation */}
        <div style={{ position:'relative', animation:'float 4s ease-in-out infinite', flexShrink:0 }}>
          <AnimatedPhone size="large" />
        </div>
      </div>
    </section>
  )
}

// ─── Stats Bar ──────────────────────────────────────────
function StatsBar({ t }) {
  return (
    <section style={{ padding:'0 5%' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', background:C.card, borderRadius:20, border:`1px solid ${C.border}`, display:'grid', gridTemplateColumns:'repeat(4,1fr)' }}>
        {t.stats.map((s,i) => (
          <div key={i} style={{ padding:'32px 24px', textAlign:'center', borderRight: i<3?`1px solid ${C.border}`:'none' }}>
            <div style={{ fontSize:38, fontWeight:900, background:grad(C.purple,C.pink), WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:6 }}>{s.value}</div>
            <div style={{ fontSize:13, color:C.muted }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Features ───────────────────────────────────────────
function Features({ t }) {
  const icons = [<Video size={24} color={C.purple}/>, <Zap size={24} color={C.pink}/>, <Sparkles size={24} color={C.blue}/>, <MapPin size={24} color={C.green}/>, <BarChart2 size={24} color="#FF9500"/>, <QrCode size={24} color={C.purple}/>]
  const colors = [C.purple, C.pink, C.blue, C.green, "#FF9500", C.purple]
  return (
    <section id="features" style={{ padding:'100px 5%', position:'relative' }}>
      <Glow color={C.purple} x="50%" y="50%" size={800} />
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:64 }}>
          <div style={{ fontSize:11, color:C.pink, fontWeight:700, letterSpacing:2, marginBottom:12 }}>{t.features.kicker}</div>
          <h2 style={{ fontSize:42, fontWeight:900, marginBottom:16 }}>{t.features.title}</h2>
          <p style={{ fontSize:17, color:C.muted, maxWidth:500, margin:'0 auto' }}>{t.features.sub}</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
          {t.features.items.map((f,i) => (
            <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:20, padding:28, transition:'border-color .2s, transform .2s', cursor:'default' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=colors[i]; e.currentTarget.style.transform='translateY(-3px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.transform='none' }}>
              <div style={{ width:48, height:48, borderRadius:14, background:`${colors[i]}22`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18 }}>{icons[i]}</div>
              <div style={{ fontSize:18, fontWeight:700, marginBottom:10 }}>{f.title}</div>
              <div style={{ fontSize:14, color:C.muted, lineHeight:1.65 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── How It Works ───────────────────────────────────────
function HowItWorks({ t }) {
  const colors = [C.purple, C.pink, C.blue]
  return (
    <section id="how-it-works" style={{ padding:'100px 5%', background:`${C.card}66` }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:64 }}>
          <div style={{ fontSize:11, color:C.pink, fontWeight:700, letterSpacing:2, marginBottom:12 }}>{t.how.kicker}</div>
          <h2 style={{ fontSize:42, fontWeight:900, marginBottom:16 }}>{t.how.title}</h2>
          <p style={{ fontSize:17, color:C.muted }}>{t.how.sub}</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24, position:'relative' }}>
          <div style={{ position:'absolute', top:56, left:'16.67%', right:'16.67%', height:1, background:`linear-gradient(90deg,${C.purple},${C.blue})`, opacity:.3 }} />
          {t.how.steps.map((s,i) => (
            <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:20, padding:32, position:'relative' }}>
              <div style={{ width:56, height:56, borderRadius:'50%', background:grad(colors[i], i===2?C.purple:C.pink), display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:900, marginBottom:24, boxShadow:`0 4px 20px ${colors[i]}44` }}>{s.n}</div>
              <div style={{ fontSize:20, fontWeight:700, marginBottom:12 }}>{s.title}</div>
              <div style={{ fontSize:14, color:C.muted, lineHeight:1.65 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Demo Showcase ──────────────────────────────────────
function DemoShowcase({ t }) {
  const nav = useNavigate()
  return (
    <section id="demo" style={{ padding:'100px 5%', position:'relative', overflow:'hidden' }}>
      <Glow color={C.pink} x="20%" y="50%" size={700} />
      <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', gap:80 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:11, color:C.pink, fontWeight:700, letterSpacing:2, marginBottom:12 }}>{t.demo.kicker}</div>
          <h2 style={{ fontSize:42, fontWeight:900, marginBottom:20, lineHeight:1.1 }}>
            {t.demo.title1}<br />
            <span style={{ background:grad(C.purple,C.pink), WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{t.demo.title2}</span>
          </h2>
          <p style={{ fontSize:17, color:C.muted, lineHeight:1.7, marginBottom:36 }}>{t.demo.sub}</p>
          {t.demo.checks.map((f,i) => (
            <div key={i} style={{ display:'flex', gap:12, alignItems:'center', marginBottom:14 }}>
              <div style={{ width:20, height:20, borderRadius:'50%', background:`${C.green}22`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Check size={12} color={C.green}/></div>
              <span style={{ fontSize:14, color:C.muted }}>{f}</span>
            </div>
          ))}
          <Btn onClick={() => nav('/l/demo')} style={{ marginTop:24 }}>{t.demo.cta}</Btn>
        </div>

        {/* 3 animated phones */}
        <div style={{ display:'flex', gap:14, alignItems:'center', flexShrink:0 }}>
          {[0,1,2].map(offset => (
            <div key={offset} style={{ transform: offset===1?'scale(1.06)':'none', marginTop: offset===1?0:24 }}>
              <AnimatedPhone size="small" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Pricing ────────────────────────────────────────────
function Pricing({ t }) {
  const nav = useNavigate()
  const colors = [C.muted, C.purple, C.pink]
  const popular = [false, true, false]
  return (
    <section id="pricing" style={{ padding:'100px 5%', position:'relative' }}>
      <Glow color={C.blue} x="80%" y="40%" size={600} />
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:64 }}>
          <div style={{ fontSize:11, color:C.pink, fontWeight:700, letterSpacing:2, marginBottom:12 }}>{t.pricing.kicker}</div>
          <h2 style={{ fontSize:42, fontWeight:900, marginBottom:16 }}>{t.pricing.title}</h2>
          <p style={{ fontSize:17, color:C.muted }}>{t.pricing.sub}</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
          {t.pricing.plans.map((p,i) => (
            <div key={i} style={{ background:C.card, border:`2px solid ${popular[i]?colors[i]:C.border}`, borderRadius:24, padding:'36px 28px', position:'relative', transform:popular[i]?'scale(1.03)':'none', boxShadow:popular[i]?`0 0 40px ${colors[i]}33`:'none' }}>
              {popular[i] && <div style={{ position:'absolute', top:-14, left:'50%', transform:'translateX(-50%)', background:grad(C.purple,C.pink), borderRadius:20, padding:'5px 16px', fontSize:11, fontWeight:700, whiteSpace:'nowrap' }}>⭐ Most Popular</div>}
              <div style={{ fontSize:16, fontWeight:700, marginBottom:6 }}>{p.name}</div>
              <div style={{ marginBottom:8 }}>
                <span style={{ fontSize:42, fontWeight:900, color:colors[i] }}>{p.price}</span>
                <span style={{ fontSize:14, color:C.muted }}>{p.period}</span>
              </div>
              <div style={{ fontSize:13, color:C.muted, marginBottom:28, lineHeight:1.5 }}>{p.desc}</div>
              <button onClick={() => nav('/login?mode=register')} style={{ width:'100%', padding:'13px 0', borderRadius:12, border:'none', cursor:'pointer', background:popular[i]?grad(C.purple,C.pink):`${colors[i]}22`, color:popular[i]?C.white:colors[i], fontWeight:700, fontSize:14, fontFamily:'inherit', marginBottom:28, boxShadow:popular[i]?`0 4px 20px ${C.purple}44`:'none' }}>
                {p.cta} →
              </button>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {p.features.map((f,j) => (
                  <div key={j} style={{ display:'flex', gap:10, alignItems:'center' }}>
                    <div style={{ width:18, height:18, borderRadius:'50%', background:`${colors[i]}22`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><Check size={11} color={colors[i]}/></div>
                    <span style={{ fontSize:13, color:C.muted }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials ───────────────────────────────────────
function Testimonials({ t }) {
  return (
    <section style={{ padding:'80px 5%', background:`${C.card}44` }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:52 }}>
          <div style={{ fontSize:11, color:C.pink, fontWeight:700, letterSpacing:2, marginBottom:12 }}>{t.testimonials.kicker}</div>
          <h2 style={{ fontSize:36, fontWeight:900 }}>{t.testimonials.title}</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
          {t.testimonials.items.map((q,i) => (
            <div key={i} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:20, padding:28 }}>
              <div style={{ display:'flex', gap:2, marginBottom:18 }}>
                {[...Array(5)].map((_,j) => <Star key={j} size={14} fill="#FF9500" color="#FF9500" />)}
              </div>
              <p style={{ fontSize:15, color:C.muted, lineHeight:1.7, marginBottom:24, fontStyle:'italic' }}>"{q.quote}"</p>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:40, height:40, borderRadius:'50%', background:grad(C.purple,C.pink), display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:16 }}>{q.name[0]}</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:700 }}>{q.name}</div>
                  <div style={{ fontSize:12, color:C.muted }}>{q.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Final CTA ──────────────────────────────────────────
function FinalCTA({ t }) {
  const nav = useNavigate()
  return (
    <section style={{ padding:'100px 5%', position:'relative', overflow:'hidden' }}>
      <Glow color={C.purple} x="30%" y="50%" size={700} />
      <Glow color={C.pink}   x="70%" y="50%" size={600} />
      <div style={{ maxWidth:700, margin:'0 auto', textAlign:'center', position:'relative' }}>
        <div style={{ fontSize:11, color:C.pink, fontWeight:700, letterSpacing:2, marginBottom:16 }}>{t.cta.kicker}</div>
        <h2 style={{ fontSize:'clamp(30px,5vw,52px)', fontWeight:900, lineHeight:1.15, marginBottom:20 }}>
          {t.cta.title1}{' '}
          <span style={{ background:grad(C.purple,C.pink), WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>{t.cta.title2}</span>
        </h2>
        <p style={{ fontSize:17, color:C.muted, marginBottom:40 }}>{t.cta.sub}</p>
        <Btn onClick={() => nav('/login?mode=register')} style={{ fontSize:17, padding:'16px 40px' }}>{t.cta.btn}</Btn>
        <div style={{ marginTop:16, fontSize:13, color:C.dim }}>{t.cta.note}</div>
      </div>
    </section>
  )
}

// ─── Footer ─────────────────────────────────────────────
function Footer({ t }) {
  const cols = [
    { title: 'Product', links: ['Features', 'How it works', 'Pricing', 'Changelog'] },
    { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
    { title: 'Legal',   links: ['Privacy Policy', 'Terms', 'GDPR', 'Imprint'] },
    { title: 'Support', links: ['Help Center', 'Contact', 'Status', 'API Docs'] },
  ]
  return (
    <footer style={{ padding:'60px 5% 32px', borderTop:`1px solid ${C.border}` }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr', gap:40, marginBottom:48 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16 }}>
              <div style={{ width:30, height:30, borderRadius:8, background:grad(C.purple,C.pink), display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900 }}>S</div>
              <span style={{ fontWeight:800, fontSize:15, letterSpacing:3 }}>SCENVY</span>
            </div>
            <p style={{ fontSize:13, color:C.muted, lineHeight:1.65, marginBottom:12 }}>{t.footer.tagline}</p>
            <div style={{ fontSize:12, color:C.dim }}>app.scenvy.de</div>
          </div>
          {cols.map(col => (
            <div key={col.title}>
              <div style={{ fontSize:11, fontWeight:700, color:C.white, letterSpacing:1, marginBottom:14 }}>{col.title.toUpperCase()}</div>
              {col.links.map(l => (
                <div key={l} style={{ fontSize:13, color:C.muted, marginBottom:10, cursor:'pointer' }}
                  onMouseEnter={e=>e.target.style.color=C.white}
                  onMouseLeave={e=>e.target.style.color=C.muted}>{l}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:24, display:'flex', justifyContent:'space-between' }}>
          <div style={{ fontSize:13, color:C.dim }}>{t.footer.copy}</div>
          <div style={{ fontSize:13, color:C.dim }}>{t.footer.made}</div>
        </div>
      </div>
    </footer>
  )
}

// ─── Main Export ─────────────────────────────────────────
export default function Landing() {
  const [lang, setLang] = useState(() => navigator.language?.startsWith('de') ? 'de' : 'en')
  const t = T[lang]
  return (
    <div style={{ background:C.bg, color:C.white, fontFamily:"'Inter','Segoe UI',sans-serif", overflowX:'hidden' }}>
      <style>{`* { box-sizing:border-box } a { text-decoration:none } @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }`}</style>
      <Nav lang={lang} setLang={setLang} t={t} />
      <Hero lang={lang} t={t} />
      <StatsBar t={t} />
      <Features t={t} />
      <HowItWorks t={t} />
      <DemoShowcase t={t} />
      <Pricing t={t} />
      <Testimonials t={t} />
      <FinalCTA t={t} />
      <Footer t={t} />
    </div>
  )
}
