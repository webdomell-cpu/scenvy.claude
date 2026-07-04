import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { C, grad } from '../tokens.js'
import {
  Zap, QrCode, BarChart2, MapPin, Sparkles, Play,
  ArrowRight, Check, Star, Video, ChevronDown, Menu, X
} from 'lucide-react'

// ─── Reusable mini components ────────────────────────────
const Btn = ({ children, onClick, variant = 'primary', style = {} }) => (
  <button onClick={onClick} style={{
    padding: '13px 28px', borderRadius: 12, border: 'none', cursor: 'pointer',
    fontWeight: 700, fontSize: 15, transition: 'all .2s', fontFamily: 'inherit',
    ...(variant === 'primary'  ? { background: grad(C.purple, C.pink), color: C.white, boxShadow: `0 4px 24px ${C.purple}55` } : {}),
    ...(variant === 'outline'  ? { background: 'transparent', color: C.white, border: `1px solid ${C.border}` } : {}),
    ...(variant === 'ghost'    ? { background: 'transparent', color: C.muted } : {}),
    ...style
  }}>
    {children}
  </button>
)

const Glow = ({ color, x, y, size = 600 }) => (
  <div style={{
    position: 'absolute', width: size, height: size, borderRadius: '50%', pointerEvents: 'none',
    background: `radial-gradient(circle, ${color}33 0%, transparent 70%)`,
    left: x, top: y, transform: 'translate(-50%,-50%)'
  }} />
)

// ─── Navigation ──────────────────────────────────────────
function Nav() {
  const nav = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = ['Features', 'How it works', 'Pricing', 'Demo']

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(13,13,20,.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? `1px solid ${C.border}` : 'none',
      transition: 'all .3s', padding: '0 5%',
      display: 'flex', alignItems: 'center', height: 68
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 9,
          background: grad(C.purple, C.pink),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 900, fontSize: 16
        }}>S</div>
        <span style={{ fontWeight: 800, fontSize: 16, letterSpacing: 3 }}>SCENVY</span>
      </div>

      {/* Desktop links */}
      <div style={{ display: 'flex', gap: 32, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
        {links.map(l => (
          <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`} style={{
            color: C.muted, fontSize: 14, fontWeight: 500, textDecoration: 'none',
            transition: 'color .15s'
          }}
            onMouseEnter={e => e.target.style.color = C.white}
            onMouseLeave={e => e.target.style.color = C.muted}
          >{l}</a>
        ))}
      </div>

      {/* CTAs */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <Btn variant="ghost" onClick={() => nav('/login')} style={{ fontSize: 14, padding: '10px 18px' }}>Log in</Btn>
        <Btn onClick={() => nav('/login')} style={{ fontSize: 14, padding: '10px 20px' }}>Get Started Free →</Btn>
      </div>
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────
function Hero() {
  const nav = useNavigate()
  const [activeReel, setActiveReel] = useState(0)

  const miniReels = [
    { emoji: '🍹', label: 'Happy Hour', accent: C.purple, bg: 'linear-gradient(160deg,#1a0533,#3d1168)' },
    { emoji: '🌅', label: 'Sunset Terrace', accent: C.blue, bg: 'linear-gradient(160deg,#071433,#163a68)' },
    { emoji: '✨', label: 'Ladies Night', accent: C.pink, bg: 'linear-gradient(160deg,#33001a,#680d3d)' },
  ]

  useEffect(() => {
    const iv = setInterval(() => setActiveReel(r => (r + 1) % miniReels.length), 2500)
    return () => clearInterval(iv)
  }, [])

  const reel = miniReels[activeReel]

  return (
    <section style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      padding: '120px 5% 80px', position: 'relative', overflow: 'hidden'
    }}>
      <Glow color={C.purple} x="-5%" y="30%" size={700} />
      <Glow color={C.pink}   x="105%" y="60%" size={600} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 60, width: '100%', maxWidth: 1200, margin: '0 auto' }}>
        {/* Text */}
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: `${C.purple}22`, border: `1px solid ${C.purple}44`,
            borderRadius: 20, padding: '6px 14px', marginBottom: 24
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: C.green }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: C.purple, letterSpacing: 1 }}>
              THE FUTURE OF VENUE MARKETING
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 5vw, 62px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 22
          }}>
            Turn every place<br />
            into a{' '}
            <span style={{
              background: grad(C.purple, C.pink),
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>scrollable</span>
            {' '}experience.
          </h1>

          <p style={{ fontSize: 18, color: C.muted, lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
            SCENVY transforms your QR codes into TikTok-style vertical reels.
            Real-time offers, AI-generated content — no app download needed.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 48 }}>
            <Btn onClick={() => nav('/login')}>Start for free →</Btn>
            <Btn variant="outline" onClick={() => nav('/l/demo')}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Play size={15} fill={C.white} /> See demo
            </Btn>
          </div>

          {/* Trust */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={C.orange} color={C.orange} />)}
            <span style={{ fontSize: 13, color: C.muted, marginLeft: 8 }}>
              Trusted by <strong style={{ color: C.white }}>2,000+</strong> venues in 40 countries
            </span>
          </div>
        </div>

        {/* Phone mockup */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {/* Glow behind phone */}
          <div style={{
            position: 'absolute', inset: -60,
            background: `radial-gradient(circle, ${reel.accent}44 0%, transparent 70%)`,
            transition: 'background 1s', pointerEvents: 'none'
          }} />

          <div style={{
            width: 300, height: 560, borderRadius: 38, overflow: 'hidden',
            border: `2px solid ${C.border}`, position: 'relative',
            boxShadow: `0 40px 80px rgba(0,0,0,.7), 0 0 60px ${reel.accent}44`,
            transition: 'box-shadow 1s', background: reel.bg
          }}>
            {/* Progress bars */}
            <div style={{ position: 'absolute', top: 14, left: 12, right: 12, display: 'flex', gap: 4, zIndex: 5 }}>
              {miniReels.map((_, i) => (
                <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: 'rgba(255,255,255,.25)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', background: C.white, borderRadius: 2,
                    width: i < activeReel ? '100%' : i === activeReel ? '60%' : '0%',
                    transition: 'width .1s'
                  }} />
                </div>
              ))}
            </div>

            {/* Header */}
            <div style={{ position: 'absolute', top: 26, left: 12, right: 12, display: 'flex', alignItems: 'center', gap: 8, zIndex: 5 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: grad(C.purple, C.pink), display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13 }}>S</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700 }}>Marina Group</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,.6)' }}>Dubai Marina</div>
              </div>
            </div>

            {/* Glow orb */}
            <div style={{
              position: 'absolute', width: 240, height: 240, borderRadius: '50%',
              background: `radial-gradient(circle, ${reel.accent}55 0%, transparent 70%)`,
              top: '40%', left: '50%', transform: 'translate(-50%,-50%)',
              transition: 'background 1s', pointerEvents: 'none'
            }} />

            {/* Content */}
            <div style={{ position: 'absolute', bottom: 88, left: 16, right: 60, transition: 'opacity .4s' }}>
              <div style={{ fontSize: 32, marginBottom: 6 }}>{reel.emoji}</div>
              <div style={{ fontSize: 11, fontWeight: 800, color: reel.accent, letterSpacing: 2, marginBottom: 5, transition: 'color 1s' }}>
                LIMITED OFFER
              </div>
              <div style={{ fontSize: 19, fontWeight: 800, lineHeight: 1.25, marginBottom: 6 }}>{reel.label}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>Dubai Marina — Tonight only</div>
            </div>

            {/* Side actions */}
            <div style={{ position: 'absolute', right: 10, bottom: 100, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {['❤️', '💬', '↗️'].map((ic, i) => (
                <div key={i} style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{ic}</div>
              ))}
            </div>

            {/* CTA */}
            <div style={{ position: 'absolute', bottom: 20, left: 14, right: 14 }}>
              <div style={{
                padding: '12px 0', borderRadius: 14, textAlign: 'center',
                background: grad(reel.accent, C.pink), fontWeight: 700, fontSize: 14,
                transition: 'background 1s', boxShadow: `0 4px 20px ${reel.accent}66`
              }}>
                Explore Now →
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Stats Bar ───────────────────────────────────────────
function StatsBar() {
  const stats = [
    { value: '3.4×', label: 'More engagement' },
    { value: '80%',  label: 'Avg watch rate'  },
    { value: '5 min',label: 'Setup time'      },
    { value: '€0',   label: 'Setup cost'      },
  ]
  return (
    <section style={{ padding: '0 5%', position: 'relative' }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', background: C.card,
        borderRadius: 20, border: `1px solid ${C.border}`,
        display: 'grid', gridTemplateColumns: 'repeat(4,1fr)'
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            padding: '32px 24px', textAlign: 'center',
            borderRight: i < 3 ? `1px solid ${C.border}` : 'none'
          }}>
            <div style={{ fontSize: 38, fontWeight: 900,
              background: grad(C.purple, C.pink),
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              marginBottom: 6 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: C.muted }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Features ─────────────────────────────────────────────
function Features() {
  const features = [
    { icon: <Video size={24} color={C.purple} />,     title: 'Reel Experience',    desc: 'TikTok-style vertical stories that auto-play and loop. Guests swipe, engage, and act — just like social media.', color: C.purple },
    { icon: <Zap size={24} color={C.pink} />,         title: 'Live Offers',         desc: 'Push real-time deals with countdown timers. Happy hour? Event? Daily special? Live in under 60 seconds.', color: C.pink },
    { icon: <Sparkles size={24} color={C.blue} />,    title: 'AI Generator',        desc: 'Type your offer, Claude AI creates a complete reel — hook, copy, CTA, hashtags. No design skills needed.', color: C.blue },
    { icon: <MapPin size={24} color={C.green} />,     title: 'Multi-Location',      desc: 'Manage all your venues from one dashboard. Each location gets its own QR code and reel feed.', color: C.green },
    { icon: <BarChart2 size={24} color={C.orange} />, title: 'Analytics',           desc: 'Track scans, watch time, and CTA click-through rates. Know exactly which content drives revenue.', color: C.orange },
    { icon: <QrCode size={24} color={C.purple} />,    title: 'QR Code System',      desc: 'Every location gets a unique QR — app.scenvy.de/l/{id}. Print it, display it, and start scanning in minutes.', color: C.purple },
  ]

  return (
    <section id="features" style={{ padding: '100px 5%', position: 'relative' }}>
      <Glow color={C.purple} x="50%" y="50%" size={800} />
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontSize: 11, color: C.pink, fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>FEATURES</div>
          <h2 style={{ fontSize: 42, fontWeight: 900, marginBottom: 16 }}>Everything your venue needs</h2>
          <p style={{ fontSize: 17, color: C.muted, maxWidth: 500, margin: '0 auto' }}>
            One platform. All the tools to turn passive guests into active customers.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28,
              transition: 'border-color .2s, transform .2s', cursor: 'default'
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = f.color; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.transform = 'none' }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `${f.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                {f.icon}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{f.title}</div>
              <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.65 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── How it Works ─────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n: '01', title: 'Get your QR code',     desc: 'Sign up, create a location, and SCENVY generates your unique QR code instantly. Print it and display it anywhere guests can see it.', color: C.purple },
    { n: '02', title: 'Create your reels',    desc: 'Upload videos or images, or let our AI generate reels from a simple text description. Schedule them or push them live instantly.', color: C.pink },
    { n: '03', title: 'Guests scan & engage', desc: 'Guests scan and get a full-screen reel experience. They swipe, discover offers, and tap your CTA to order, reserve, or shop.', color: C.blue },
  ]

  return (
    <section id="how-it-works" style={{ padding: '100px 5%', background: `${C.card}66`, position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontSize: 11, color: C.pink, fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>HOW IT WORKS</div>
          <h2 style={{ fontSize: 42, fontWeight: 900, marginBottom: 16 }}>Up and running in 5 minutes</h2>
          <p style={{ fontSize: 17, color: C.muted }}>Three steps. No developer needed.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, position: 'relative' }}>
          {/* Connector line */}
          <div style={{ position: 'absolute', top: 56, left: '16.67%', right: '16.67%', height: 1, background: `linear-gradient(90deg, ${C.purple}, ${C.blue})`, opacity: 0.3 }} />

          {steps.map((s, i) => (
            <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 32, position: 'relative' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: grad(s.color, i === 2 ? C.purple : C.pink),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, fontWeight: 900, marginBottom: 24,
                boxShadow: `0 4px 20px ${s.color}44`
              }}>
                {s.n}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{s.title}</div>
              <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.65 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Demo Showcase ────────────────────────────────────────
function DemoShowcase() {
  const nav = useNavigate()
  const phones = [
    { emoji: '🍹', title: 'Happy Hour -50%', accent: C.purple, bg: 'linear-gradient(160deg,#1a0533,#3d1168)', cta: 'Order Now' },
    { emoji: '✨', title: 'Ladies Night',    accent: C.pink,   bg: 'linear-gradient(160deg,#33001a,#680d3d)', cta: 'RSVP Free' },
    { emoji: '🌅', title: 'Sunset Terrace',  accent: C.blue,   bg: 'linear-gradient(160deg,#071433,#163a68)', cta: 'Book Now' },
  ]

  return (
    <section id="demo" style={{ padding: '100px 5%', position: 'relative', overflow: 'hidden' }}>
      <Glow color={C.pink} x="20%" y="50%" size={700} />
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 80 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: C.pink, fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>LIVE DEMO</div>
          <h2 style={{ fontSize: 42, fontWeight: 900, marginBottom: 20, lineHeight: 1.1 }}>
            What your guests<br />
            <span style={{ background: grad(C.purple, C.pink), WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              will see.
            </span>
          </h2>
          <p style={{ fontSize: 17, color: C.muted, lineHeight: 1.7, marginBottom: 36 }}>
            Three reels. Three touchpoints. One seamless brand experience from first scan to order.
          </p>
          {['No app download needed', 'Works on any smartphone', 'Loads in under 1 second', 'Fully branded to your venue'].map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 14 }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: `${C.green}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Check size={12} color={C.green} />
              </div>
              <span style={{ fontSize: 14, color: C.muted }}>{f}</span>
            </div>
          ))}
          <Btn onClick={() => nav('/l/demo')} style={{ marginTop: 24 }}>
            Try live demo →
          </Btn>
        </div>

        {/* 3 phones */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {phones.map((p, i) => (
            <div key={i} style={{
              width: 160, height: i === 1 ? 360 : 310, borderRadius: 30, overflow: 'hidden',
              border: `2px solid ${i === 1 ? p.accent + '88' : C.border}`,
              background: p.bg, position: 'relative', flexShrink: 0,
              boxShadow: i === 1 ? `0 0 50px ${p.accent}44, 0 20px 40px rgba(0,0,0,.5)` : '0 10px 30px rgba(0,0,0,.4)',
              transform: i === 1 ? 'scale(1.05)' : 'none'
            }}>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 14 }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{p.emoji}</div>
                <div style={{ fontSize: 13, fontWeight: 800, lineHeight: 1.3, marginBottom: 10 }}>{p.title}</div>
                <div style={{ padding: '9px 0', borderRadius: 10, textAlign: 'center', background: grad(p.accent, C.pink), fontWeight: 700, fontSize: 12 }}>
                  {p.cta} →
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Pricing ──────────────────────────────────────────────
function Pricing() {
  const nav = useNavigate()
  const plans = [
    {
      name: 'Starter', price: '€0', period: 'forever',
      desc: 'Perfect to try SCENVY risk-free.',
      color: C.muted, popular: false,
      features: ['1 location', '5 reels', 'Basic analytics', 'QR code generator', 'Email support']
    },
    {
      name: 'Pro', price: '€79', period: '/month',
      desc: 'For growing venues serious about engagement.',
      color: C.purple, popular: true,
      features: ['5 locations', 'Unlimited reels', 'AI Reel Generator', 'Full analytics + CTR', 'Social import (IG, TikTok)', 'Priority support']
    },
    {
      name: 'Enterprise', price: '€299', period: '/month',
      desc: 'For groups and chains across multiple cities.',
      color: C.pink, popular: false,
      features: ['Unlimited locations', 'Unlimited reels', 'AI Generator + scheduling', 'White label branding', 'API access', 'Dedicated account manager']
    },
  ]

  return (
    <section id="pricing" style={{ padding: '100px 5%', position: 'relative' }}>
      <Glow color={C.blue} x="80%" y="40%" size={600} />
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontSize: 11, color: C.pink, fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>PRICING</div>
          <h2 style={{ fontSize: 42, fontWeight: 900, marginBottom: 16 }}>Simple, transparent pricing</h2>
          <p style={{ fontSize: 17, color: C.muted }}>No setup fees. No hidden costs. Cancel anytime.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {plans.map((p, i) => (
            <div key={i} style={{
              background: C.card, border: `2px solid ${p.popular ? p.color : C.border}`,
              borderRadius: 24, padding: '36px 28px', position: 'relative',
              transform: p.popular ? 'scale(1.03)' : 'none',
              boxShadow: p.popular ? `0 0 40px ${p.color}33` : 'none'
            }}>
              {p.popular && (
                <div style={{
                  position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                  background: grad(C.purple, C.pink), borderRadius: 20, padding: '5px 16px',
                  fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap'
                }}>
                  ⭐ Most Popular
                </div>
              )}

              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{p.name}</div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 42, fontWeight: 900, color: p.color }}>{p.price}</span>
                <span style={{ fontSize: 14, color: C.muted }}>{p.period}</span>
              </div>
              <div style={{ fontSize: 13, color: C.muted, marginBottom: 28, lineHeight: 1.5 }}>{p.desc}</div>

              <button onClick={() => nav('/login')} style={{
                width: '100%', padding: '13px 0', borderRadius: 12, border: 'none', cursor: 'pointer',
                background: p.popular ? grad(C.purple, C.pink) : `${p.color}22`,
                color: p.popular ? C.white : p.color,
                fontWeight: 700, fontSize: 14, fontFamily: 'inherit', marginBottom: 28,
                boxShadow: p.popular ? `0 4px 20px ${C.purple}44` : 'none'
              }}>
                {i === 0 ? 'Start for free' : 'Get started'} →
              </button>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {p.features.map((f, j) => (
                  <div key={j} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: `${p.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Check size={11} color={p.color} />
                    </div>
                    <span style={{ fontSize: 13, color: C.muted }}>{f}</span>
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

// ─── Testimonials ─────────────────────────────────────────
function Testimonials() {
  const quotes = [
    { quote: 'Our scan-to-order rate tripled in the first week. Guests love the reel format — it feels exactly like TikTok.', name: 'Khalid Al-Rashid', role: 'GM, Marina Walk Restaurant Group', initial: 'K' },
    { quote: "The AI generator is insane. I type 'happy hour tonight' and it creates a full reel with copy, emoji, hashtags — in seconds.", name: 'Sophie Laurent', role: 'Owner, Rooftop Bar 21', initial: 'S' },
    { quote: "We run 6 venues across Dubai. One dashboard, one login, full control. SCENVY is the missing piece in our tech stack.", name: 'Marcus Webb', role: 'Director, The Palm Events Group', initial: 'M' },
  ]

  return (
    <section style={{ padding: '80px 5%', background: `${C.card}44`, position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div style={{ fontSize: 11, color: C.pink, fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>TESTIMONIALS</div>
          <h2 style={{ fontSize: 36, fontWeight: 900 }}>Venues love SCENVY</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
          {quotes.map((q, i) => (
            <div key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 28 }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 18 }}>
                {[...Array(5)].map((_, j) => <Star key={j} size={14} fill={C.orange} color={C.orange} />)}
              </div>
              <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7, marginBottom: 24, fontStyle: 'italic' }}>
                "{q.quote}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: grad(C.purple, C.pink), display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>
                  {q.initial}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{q.name}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{q.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Final CTA ────────────────────────────────────────────
function FinalCTA() {
  const nav = useNavigate()
  return (
    <section style={{ padding: '100px 5%', position: 'relative', overflow: 'hidden' }}>
      <Glow color={C.purple} x="30%" y="50%" size={700} />
      <Glow color={C.pink}   x="70%" y="50%" size={600} />
      <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        <div style={{ fontSize: 11, color: C.pink, fontWeight: 700, letterSpacing: 2, marginBottom: 16 }}>GET STARTED</div>
        <h2 style={{ fontSize: 'clamp(32px, 5vw, 54px)', fontWeight: 900, lineHeight: 1.15, marginBottom: 20 }}>
          Ready to go{' '}
          <span style={{ background: grad(C.purple, C.pink), WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            scrollable?
          </span>
        </h2>
        <p style={{ fontSize: 17, color: C.muted, marginBottom: 40 }}>
          Join 2,000+ venues already using SCENVY to engage guests and drive more revenue.
        </p>
        <Btn onClick={() => nav('/login')} style={{ fontSize: 17, padding: '16px 40px' }}>
          Start your free trial →
        </Btn>
        <div style={{ marginTop: 16, fontSize: 13, color: C.dim }}>
          No credit card required · Setup in 5 minutes · Cancel anytime
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────
function Footer() {
  const cols = [
    { title: 'Product',  links: ['Features', 'How it works', 'Pricing', 'Changelog'] },
    { title: 'Company',  links: ['About', 'Blog', 'Careers', 'Press'] },
    { title: 'Legal',    links: ['Privacy Policy', 'Terms of Service', 'GDPR', 'Imprint'] },
    { title: 'Support',  links: ['Help Center', 'Contact', 'Status', 'API Docs'] },
  ]

  return (
    <footer style={{ padding: '60px 5% 32px', borderTop: `1px solid ${C.border}` }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: grad(C.purple, C.pink), display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>S</div>
              <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: 3 }}>SCENVY</span>
            </div>
            <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.65, marginBottom: 20 }}>
              Turn every place into a scrollable experience. The reel platform for hospitality.
            </p>
            <div style={{ fontSize: 12, color: C.dim }}>app.scenvy.de</div>
          </div>

          {cols.map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.white, letterSpacing: 1, marginBottom: 16 }}>{col.title.toUpperCase()}</div>
              {col.links.map(l => (
                <div key={l} style={{ fontSize: 13, color: C.muted, marginBottom: 10, cursor: 'pointer',
                  transition: 'color .15s' }}
                  onMouseEnter={e => e.target.style.color = C.white}
                  onMouseLeave={e => e.target.style.color = C.muted}>
                  {l}
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 13, color: C.dim }}>© 2026 SCENVY. All rights reserved.</div>
          <div style={{ fontSize: 13, color: C.dim }}>Made with ❤️ for hospitality</div>
        </div>
      </div>
    </footer>
  )
}

// ─── Main Export ──────────────────────────────────────────
export default function Landing() {
  return (
    <div style={{ background: C.bg, color: C.white, fontFamily: "'Inter','Segoe UI',sans-serif", overflowX: 'hidden' }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:none } }
        * { box-sizing: border-box }
        a { text-decoration: none }
      `}</style>
      <Nav />
      <Hero />
      <StatsBar />
      <Features />
      <HowItWorks />
      <DemoShowcase />
      <Pricing />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  )
}
