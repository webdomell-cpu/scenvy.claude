// ╔══════════════════════════════════════════════════════╗
// ║           SCENVY — Full SaaS Platform                ║
// ║  Guest Experience · CMS Dashboard · Super Admin      ║
// ╚══════════════════════════════════════════════════════╝
import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import {
  Play, Heart, Share2, MessageCircle, QrCode, Plus, Settings,
  BarChart2, MapPin, Video, Zap, Users, TrendingUp, Eye,
  MousePointer, Crown, X, Sparkles, Upload, Film, ArrowRight,
  Trash2, Home, Activity, Copy, RefreshCw, Bell, Clock,
  Store, Tag, Edit2, LogOut, ChevronRight, Globe, Shield,
  Smartphone, Menu, Check, Info, Star, ShoppingCart
} from "lucide-react";

// ─── Brand Tokens ────────────────────────────────────────
const C = {
  bg:       "#0D0D14",
  card:     "#1A1A24",
  card2:    "#24243A",
  border:   "#2A2A3E",
  purple:   "#7C3AED",
  purpleL:  "#9F5EFF",
  pink:     "#FF2D8D",
  blue:     "#00D4FF",
  green:    "#00E676",
  orange:   "#FF9500",
  white:    "#FFFFFF",
  muted:    "#9C9CAE",
  dim:      "#4A4A5E",
};

const grad = (a, b) => `linear-gradient(135deg,${a},${b})`;

// ─── Demo Seed Data ──────────────────────────────────────
const TENANTS = [
  { id:"t1", name:"The Marina Group",   plan:"enterprise", locs:4, reels:28, mrr:299, status:"active", since:"2025-11" },
  { id:"t2", name:"Rooftop Bar 21",     plan:"pro",        locs:1, reels:12, mrr:79,  status:"active", since:"2025-12" },
  { id:"t3", name:"Souk Street Food",   plan:"pro",        locs:3, reels:19, mrr:79,  status:"active", since:"2026-01" },
  { id:"t4", name:"DIFC Lounge & Co.",  plan:"starter",    locs:1, reels:4,  mrr:0,   status:"trial",  since:"2026-06" },
  { id:"t5", name:"The Palm Events",    plan:"enterprise", locs:6, reels:41, mrr:299, status:"active", since:"2025-10" },
];

const LOCATIONS_SEED = [
  { id:"l1", name:"Marina Walk",      city:"Dubai Marina", scans:1247, wr:94, active:true  },
  { id:"l2", name:"JBR Terrace",      city:"JBR Beach",    scans:893,  wr:78, active:true  },
  { id:"l3", name:"DIFC Branch",      city:"DIFC",         scans:614,  wr:88, active:true  },
  { id:"l4", name:"Mall of Emirates", city:"Al Barsha",    scans:329,  wr:61, active:false },
];

const REELS_SEED = [
  { id:"r1", title:"Happy Hour Special",  type:"offer",   status:"live",      views:3241, ctr:18.4, loc:"Marina Walk",  color:C.purple, emoji:"🍹", cta:"Order Now",  ago:"2 days ago"  },
  { id:"r2", title:"Weekend Brunch",      type:"event",   status:"live",      views:2108, ctr:24.1, loc:"JBR Terrace",  color:C.pink,   emoji:"🥂", cta:"Reserve",    ago:"5 days ago"  },
  { id:"r3", title:"Chef's Special",      type:"menu",    status:"live",      views:1872, ctr:15.7, loc:"DIFC Branch",  color:C.blue,   emoji:"🍽️", cta:"View Menu",  ago:"1 week ago"  },
  { id:"r4", title:"Ladies Night Thu",    type:"event",   status:"scheduled", views:0,    ctr:0,    loc:"Marina Walk",  color:C.orange, emoji:"✨", cta:"RSVP",       ago:"Today"       },
  { id:"r5", title:"Sunset Cocktails",    type:"offer",   status:"live",      views:4156, ctr:31.2, loc:"JBR Terrace",  color:C.purple, emoji:"🌅", cta:"Book Now",   ago:"3 days ago"  },
  { id:"r6", title:"New: Wagyu Burger",   type:"menu",    status:"draft",     views:0,    ctr:0,    loc:"DIFC Branch",  color:C.green,  emoji:"🍔", cta:"Order",      ago:"Today"       },
];

const GUEST_REELS = [
  { id:1, hook:"TONIGHT ONLY 🔥",  title:"50% Off All Cocktails",    sub:"Only until 8 PM — Dubai Marina",  cta:"Order Now",    bg:`linear-gradient(160deg,#1a0533 0%,#3d1168 55%,#0d0d14 100%)`, accent:C.purple, tag:"LIMITED OFFER", emoji:"🍹" },
  { id:2, hook:"BEST VIEW 🌅",     title:"Sunset Terrace is Open",   sub:"Reserve your table for tonight",  cta:"Book Table",   bg:`linear-gradient(160deg,#071433 0%,#163a68 55%,#0d0d14 100%)`, accent:C.blue,   tag:"FEATURED",      emoji:"🌅" },
  { id:3, hook:"LADIES NIGHT ✨",  title:"Every Thursday from 9 PM", sub:"Free entry + welcome drink",      cta:"RSVP Free",    bg:`linear-gradient(160deg,#33001a 0%,#680d3d 55%,#0d0d14 100%)`, accent:C.pink,   tag:"THIS WEEK",     emoji:"✨" },
  { id:4, hook:"NEW ON MENU 🍔",   title:"Wagyu Smashburger",        sub:"Chef's latest — available daily", cta:"View Menu",    bg:`linear-gradient(160deg,#1a1400 0%,#3d3200 55%,#0d0d14 100%)`, accent:C.orange, tag:"NEW",           emoji:"🍔" },
  { id:5, hook:"POPULAR 🎉",       title:"Weekend Brunch",           sub:"Unlimited food & drinks, Fri–Sat",cta:"Reserve Now",  bg:`linear-gradient(160deg,#001a33 0%,#0d3d68 55%,#0d0d14 100%)`, accent:C.blue,   tag:"POPULAR",       emoji:"🎉" },
];

const CHART_DATA = [
  { day:"Mon", scans:142, views:310, ctr:18 },
  { day:"Tue", scans:189, views:421, ctr:22 },
  { day:"Wed", scans:201, views:498, ctr:19 },
  { day:"Thu", scans:287, views:694, ctr:31 },
  { day:"Fri", scans:412, views:988, ctr:38 },
  { day:"Sat", scans:489, views:1203, ctr:41 },
  { day:"Sun", scans:318, views:776, ctr:35 },
];

// ─── Helpers ─────────────────────────────────────────────
const pill = (label, color) => (
  <span style={{ fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:20,
    background:`${color}28`, color, border:`1px solid ${color}44` }}>
    {label}
  </span>
);

const statCard = (label, value, delta, icon, color) => (
  <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:16, padding:20 }}>
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
      <span style={{ fontSize:12, color:C.muted }}>{label}</span>
      <div style={{ width:36, height:36, borderRadius:10, background:`${color}22`,
        display:"flex", alignItems:"center", justifyContent:"center" }}>
        {icon}
      </div>
    </div>
    <div style={{ fontSize:28, fontWeight:800, marginBottom:4 }}>{value}</div>
    {delta && <div style={{ fontSize:12, color:C.green }}>{delta}</div>}
  </div>
);

// ─── ROOT ────────────────────────────────────────────────
export default function ScenvyApp() {
  const [view,    setView]    = useState("guest");   // guest | cms | admin
  const [cmsPage, setCmsPage] = useState("overview");
  const [reels,   setReels]   = useState(REELS_SEED);
  const [locs,    setLocs]    = useState(LOCATIONS_SEED);
  const [tenants, setTenants] = useState(TENANTS);
  const [toast,   setToast]   = useState(null);
  const [sideNav, setSideNav] = useState(true);
  const [aiModal, setAiModal] = useState(false);

  const notify = (msg, type="ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div style={{ background:C.bg, minHeight:"100vh", color:C.white,
      fontFamily:"'Inter','Segoe UI',sans-serif", overflow:"hidden" }}>
      <style>{`
        @keyframes spin { to { transform:rotate(360deg) } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:none } }
        ::-webkit-scrollbar { width:6px } ::-webkit-scrollbar-track { background:transparent }
        ::-webkit-scrollbar-thumb { background:${C.dim}; border-radius:3px }
        * { box-sizing:border-box }
      `}</style>

      {/* ── TOP NAV ── */}
      <TopNav view={view} setView={setView} />

      {/* ── VIEWS ── */}
      {view === "guest" && <GuestView />}
      {view === "cms"   && (
        <CMSLayout
          cmsPage={cmsPage} setCmsPage={setCmsPage}
          sideNav={sideNav} setSideNav={setSideNav}
          reels={reels} setReels={setReels}
          locs={locs}   setLocs={setLocs}
          notify={notify}
          aiModal={aiModal} setAiModal={setAiModal}
        />
      )}
      {view === "admin" && (
        <AdminView tenants={tenants} setTenants={setTenants} notify={notify} />
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div style={{
          position:"fixed", bottom:28, left:"50%", transform:"translateX(-50%)",
          background: toast.type === "ok" ? C.purple : C.pink,
          color:C.white, padding:"12px 24px", borderRadius:14,
          fontSize:13, fontWeight:600, zIndex:9999,
          boxShadow:"0 8px 32px rgba(0,0,0,.5)",
          animation:"fadeUp .25s ease"
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════
// TOP NAV
// ════════════════════════════════════════════════════════
function TopNav({ view, setView }) {
  const tabs = [
    { id:"guest", label:"🎬 Guest Experience" },
    { id:"cms",   label:"🧑‍💼 CMS Dashboard"  },
    { id:"admin", label:"🛠️ Super Admin"     },
  ];
  return (
    <div style={{
      background:"rgba(13,13,20,.96)", borderBottom:`1px solid ${C.border}`,
      backdropFilter:"blur(20px)", height:58,
      display:"flex", alignItems:"center", padding:"0 24px", gap:8,
      position:"sticky", top:0, zIndex:200
    }}>
      {/* Logo */}
      <div style={{ display:"flex", alignItems:"center", gap:9, marginRight:28 }}>
        <div style={{ width:30, height:30, borderRadius:8,
          background:grad(C.purple,C.pink),
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:15, fontWeight:900 }}>S</div>
        <span style={{ fontWeight:800, fontSize:15, letterSpacing:3 }}>SCENVY</span>
      </div>

      {/* Tabs */}
      {tabs.map(t => (
        <button key={t.id} onClick={() => setView(t.id)} style={{
          padding:"7px 18px", borderRadius:9, border:"none", cursor:"pointer",
          fontWeight:600, fontSize:13, transition:"all .2s",
          background: view===t.id ? C.purple : "transparent",
          color: view===t.id ? C.white : C.muted,
        }}>
          {t.label}
        </button>
      ))}

      <div style={{ flex:1 }} />
      <span style={{ fontSize:11, color:C.dim }}>scenvy.app</span>
      <div style={{ width:30, height:30, borderRadius:"50%",
        background:grad(C.purple,C.pink),
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:13, fontWeight:700, marginLeft:8 }}>D</div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// GUEST REEL EXPERIENCE
// ════════════════════════════════════════════════════════
function GuestView() {
  const [idx, setIdx]     = useState(0);
  const [prog, setProg]   = useState(0);
  const [liked, setLiked] = useState({});
  const [anim, setAnim]   = useState(false);

  useEffect(() => {
    setProg(0);
    const iv = setInterval(() => setProg(p => {
      if (p >= 100) { goNext(); return 0; }
      return p + 0.45;
    }), 40);
    return () => clearInterval(iv);
  }, [idx]);

  const goNext = () => {
    if (idx < GUEST_REELS.length - 1) { setAnim(true); setTimeout(() => { setIdx(i=>i+1); setAnim(false); }, 200); }
  };
  const goPrev = () => {
    if (idx > 0) { setAnim(true); setTimeout(() => { setIdx(i=>i-1); setAnim(false); }, 200); }
  };

  const reel = GUEST_REELS[idx];

  return (
    <div style={{ display:"flex", justifyContent:"center", alignItems:"center",
      height:"calc(100vh - 58px)", gap:48, padding:"20px" }}>

      {/* Phone */}
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
        <div style={{
          fontSize:12, color:C.muted, background:C.card, border:`1px solid ${C.border}`,
          borderRadius:10, padding:"7px 16px", letterSpacing:.5
        }}>
          🔒 scenvy.app/l/<span style={{ color:C.blue }}>marina-dubai</span>
        </div>

        <div style={{
          width:345, height:620, borderRadius:42, overflow:"hidden",
          border:`2px solid ${C.border}`, position:"relative",
          background:reel.bg,
          boxShadow:`0 0 70px ${reel.accent}44, 0 40px 80px rgba(0,0,0,.7)`,
          transition:"box-shadow .5s",
        }}>
          {/* Progress bars */}
          <div style={{ position:"absolute", top:16, left:14, right:14, display:"flex", gap:4, zIndex:10 }}>
            {GUEST_REELS.map((_, i) => (
              <div key={i} style={{ flex:1, height:3, borderRadius:2, background:"rgba(255,255,255,.2)", overflow:"hidden" }}>
                <div style={{
                  height:"100%", borderRadius:2, background:C.white,
                  width: i<idx?"100%": i===idx?`${prog}%`:"0%",
                  transition: i===idx?"none":"width .2s"
                }} />
              </div>
            ))}
          </div>

          {/* Header */}
          <div style={{ position:"absolute", top:28, left:14, right:14, zIndex:10,
            display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:34, height:34, borderRadius:"50%",
                background:grad(C.purple,C.pink),
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:14, fontWeight:800 }}>S</div>
              <div>
                <div style={{ fontSize:12, fontWeight:700 }}>Marina Group</div>
                <div style={{ fontSize:10, color:"rgba(255,255,255,.6)" }}>Dubai Marina</div>
              </div>
            </div>
            <div style={{ background:reel.accent, borderRadius:6, padding:"3px 9px",
              fontSize:9, fontWeight:700, letterSpacing:1 }}>
              {reel.tag}
            </div>
          </div>

          {/* Glow orb */}
          <div style={{
            position:"absolute", width:280, height:280, borderRadius:"50%",
            background:`radial-gradient(circle, ${reel.accent}44 0%, transparent 70%)`,
            top:"35%", left:"50%", transform:"translate(-50%,-50%)",
            pointerEvents:"none"
          }} />

          {/* Content */}
          <div style={{
            position:"absolute", bottom:108, left:18, right:72,
            opacity: anim ? 0 : 1, transition:"opacity .2s",
            transform: anim ? "translateY(-14px)" : "none",
          }}>
            <div style={{ fontSize:34, marginBottom:6 }}>{reel.emoji}</div>
            <div style={{ fontSize:13, fontWeight:800, color:reel.accent,
              letterSpacing:2, marginBottom:6 }}>{reel.hook}</div>
            <div style={{ fontSize:22, fontWeight:800, lineHeight:1.25, marginBottom:7 }}>{reel.title}</div>
            <div style={{ fontSize:13, color:"rgba(255,255,255,.65)" }}>{reel.sub}</div>
          </div>

          {/* Side actions */}
          <div style={{ position:"absolute", right:12, bottom:120,
            display:"flex", flexDirection:"column", gap:18, alignItems:"center" }}>
            {[
              { icon:Heart, label:liked[idx]?"1.2k":"1.1k", action:()=>setLiked(l=>({...l,[idx]:!l[idx]})), color:liked[idx]?C.pink:C.white },
              { icon:MessageCircle, label:"48",    action:()=>{}, color:C.white },
              { icon:Share2,        label:"Share",  action:()=>{}, color:C.white },
              { icon:QrCode,        label:"QR",     action:()=>{}, color:C.white },
            ].map((a,i) => (
              <div key={i} style={{ textAlign:"center" }}>
                <button onClick={a.action} style={{
                  width:44, height:44, borderRadius:"50%",
                  border:"none", cursor:"pointer",
                  background:"rgba(255,255,255,.15)",
                  backdropFilter:"blur(12px)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  color:a.color, transition:"all .15s"
                }}>
                  <a.icon size={20} fill={a.color===C.pink?C.pink:"none"} color={a.color} />
                </button>
                <div style={{ fontSize:10, color:"rgba(255,255,255,.6)", marginTop:3 }}>{a.label}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ position:"absolute", bottom:30, left:16, right:16 }}>
            <button style={{
              width:"100%", padding:"14px 0", borderRadius:16, border:"none", cursor:"pointer",
              background:grad(reel.accent, C.pink),
              color:C.white, fontWeight:700, fontSize:16,
              boxShadow:`0 4px 24px ${reel.accent}66`
            }}>
              {reel.cta} →
            </button>
          </div>

          {/* Tap zones */}
          <button onClick={goPrev} style={{ position:"absolute", top:"25%", left:0, width:"45%", height:"35%", background:"transparent", border:"none", cursor:"pointer", zIndex:5 }} />
          <button onClick={goNext} style={{ position:"absolute", top:"25%", right:0, width:"45%", height:"35%", background:"transparent", border:"none", cursor:"pointer", zIndex:5 }} />
        </div>

        {/* Nav buttons */}
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <button onClick={goPrev} disabled={idx===0} style={{
            padding:"8px 18px", borderRadius:8, border:`1px solid ${C.border}`,
            background:idx===0?"transparent":C.card, color:idx===0?C.dim:C.white,
            cursor:idx===0?"default":"pointer", fontSize:13
          }}>↑ Prev</button>
          <span style={{ fontSize:12, color:C.muted, minWidth:40, textAlign:"center" }}>{idx+1}/{GUEST_REELS.length}</span>
          <button onClick={goNext} disabled={idx===GUEST_REELS.length-1} style={{
            padding:"8px 18px", borderRadius:8, border:"none",
            background:idx===GUEST_REELS.length-1?C.card:C.purple,
            color:idx===GUEST_REELS.length-1?C.dim:C.white,
            cursor:idx===GUEST_REELS.length-1?"default":"pointer", fontSize:13
          }}>↓ Next</button>
        </div>
      </div>

      {/* Info panel */}
      <div style={{ width:300, animation:"fadeUp .4s ease" }}>
        <div style={{ fontSize:11, color:C.pink, fontWeight:700, letterSpacing:2, marginBottom:10 }}>GUEST EXPERIENCE</div>
        <div style={{ fontSize:26, fontWeight:800, lineHeight:1.25, marginBottom:12 }}>
          Your guests scroll<br />like <span style={{ color:C.purple }}>TikTok.</span>
        </div>
        <div style={{ fontSize:14, color:C.muted, lineHeight:1.7, marginBottom:26 }}>
          This is what guests see when they scan a SCENVY QR code. No app download. Full-screen, swipeable, instant.
        </div>

        {[
          { icon:<Zap size={15} color={C.purple}/>,       label:"Auto-advances every 8 seconds",  c:C.purple },
          { icon:<Heart size={15} color={C.pink}/>,       label:"Tap to like and share reels",     c:C.pink   },
          { icon:<ArrowRight size={15} color={C.blue}/>,  label:"CTA drives direct action",        c:C.blue   },
          { icon:<QrCode size={15} color={C.green}/>,     label:"No app download required (PWA)",  c:C.green  },
        ].map((f,i) => (
          <div key={i} style={{ display:"flex", gap:12, alignItems:"center", marginBottom:14 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:`${f.c}22`,
              display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              {f.icon}
            </div>
            <span style={{ fontSize:13, color:C.muted }}>{f.label}</span>
          </div>
        ))}

        <div style={{ marginTop:24, padding:18, background:C.card, borderRadius:14, border:`1px solid ${C.border}` }}>
          <div style={{ fontSize:10, color:C.muted, marginBottom:10, letterSpacing:1 }}>LIVE STATS — THIS REEL</div>
          <div style={{ display:"flex", gap:20 }}>
            {[
              { v:"94%",  l:"Watch Rate", c:C.pink   },
              { v:"31%",  l:"CTR",        c:C.purple },
              { v:"4.1k", l:"Views",      c:C.blue   },
            ].map((s,i) => (
              <div key={i}>
                <div style={{ fontSize:22, fontWeight:800, color:s.c }}>{s.v}</div>
                <div style={{ fontSize:10, color:C.muted }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════
// CMS LAYOUT
// ════════════════════════════════════════════════════════
function CMSLayout({ cmsPage, setCmsPage, sideNav, setSideNav, reels, setReels, locs, setLocs, notify, aiModal, setAiModal }) {
  const nav = [
    { id:"overview",   label:"Overview",      icon:<Home size={17}/>,     badge:null },
    { id:"reels",      label:"Reels",         icon:<Film size={17}/>,     badge:reels.length },
    { id:"locations",  label:"Locations",     icon:<MapPin size={17}/>,   badge:locs.length  },
    { id:"analytics",  label:"Analytics",     icon:<BarChart2 size={17}/>,badge:null },
    { id:"ai",         label:"AI Generator",  icon:<Sparkles size={17}/>, badge:"✨" },
    { id:"settings",   label:"Settings",      icon:<Settings size={17}/>, badge:null },
  ];

  return (
    <div style={{ display:"flex", height:"calc(100vh - 58px)" }}>
      {/* Sidebar */}
      <div style={{
        width:sideNav?220:58, background:C.card, borderRight:`1px solid ${C.border}`,
        transition:"width .3s", flexShrink:0, display:"flex", flexDirection:"column", overflow:"hidden"
      }}>
        {sideNav && (
          <div style={{ padding:"14px 14px 10px", borderBottom:`1px solid ${C.border}` }}>
            <div style={{ fontSize:10, color:C.muted, marginBottom:7, letterSpacing:1 }}>TENANT</div>
            <div style={{ display:"flex", alignItems:"center", gap:9, padding:"8px 10px",
              background:C.card2, borderRadius:9, cursor:"pointer" }}>
              <div style={{ width:28, height:28, borderRadius:6, background:grad(C.purple,C.pink),
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:12, fontWeight:800, flexShrink:0 }}>M</div>
              <div>
                <div style={{ fontSize:12, fontWeight:700 }}>Marina Group</div>
                <div style={{ fontSize:10, color:C.purple }}>Enterprise ✓</div>
              </div>
            </div>
          </div>
        )}

        <nav style={{ padding:"10px 10px", flex:1 }}>
          {nav.map(item => (
            <button key={item.id} onClick={() => setCmsPage(item.id)} style={{
              width:"100%", display:"flex", alignItems:"center",
              gap:10, padding:"10px 10px", borderRadius:9, border:"none", cursor:"pointer",
              background: cmsPage===item.id ? `${C.purple}22` : "transparent",
              color: cmsPage===item.id ? C.white : C.muted,
              marginBottom:2, transition:"all .15s",
              justifyContent: sideNav ? "flex-start" : "center"
            }}>
              <span style={{ color:cmsPage===item.id?C.purple:C.muted, flexShrink:0 }}>{item.icon}</span>
              {sideNav && <>
                <span style={{ fontSize:13, fontWeight:cmsPage===item.id?600:400, flex:1, textAlign:"left" }}>
                  {item.label}
                </span>
                {item.badge !== null && (
                  <span style={{
                    fontSize:10, padding:"1px 6px", borderRadius:10,
                    background: item.badge==="✨" ? `${C.pink}33` : C.card2,
                    color: item.badge==="✨" ? C.pink : C.muted
                  }}>{item.badge}</span>
                )}
              </>}
            </button>
          ))}
        </nav>

        <button onClick={() => setSideNav(o=>!o)} style={{
          margin:10, padding:10, borderRadius:8, border:`1px solid ${C.border}`,
          background:"transparent", color:C.muted, cursor:"pointer",
          display:"flex", justifyContent:"center"
        }}>
          <Menu size={16} />
        </button>
      </div>

      {/* Main area */}
      <div style={{ flex:1, overflowY:"auto", padding:28 }}>
        {cmsPage==="overview"  && <CMSOverview   setPage={setCmsPage} reels={reels} locs={locs} />}
        {cmsPage==="reels"     && <CMSReels      reels={reels} setReels={setReels} notify={notify} setAiModal={setAiModal} />}
        {cmsPage==="locations" && <CMSLocations  locs={locs} setLocs={setLocs} notify={notify} />}
        {cmsPage==="analytics" && <CMSAnalytics  reels={reels} />}
        {cmsPage==="ai"        && <AIGenerator   notify={notify} setReels={setReels} />}
        {cmsPage==="settings"  && <CMSSettings   />}
      </div>

      {/* AI quick-modal from Reels page */}
      {aiModal && (
        <div style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,.75)",
          backdropFilter:"blur(12px)", zIndex:500,
          display:"flex", alignItems:"center", justifyContent:"center"
        }}>
          <div style={{ background:C.card, border:`1px solid ${C.border}`,
            borderRadius:22, width:680, maxHeight:"90vh", overflowY:"auto" }}>
            <div style={{ padding:"18px 24px", borderBottom:`1px solid ${C.border}`,
              display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontWeight:700, fontSize:16 }}>✨ AI Reel Generator</span>
              <button onClick={() => setAiModal(false)} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer" }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ padding:24 }}>
              <AIGenerator notify={(m) => { notify(m); setAiModal(false); }} setReels={setReels} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CMS Overview ────────────────────────────────────────
function CMSOverview({ setPage, reels, locs }) {
  return (
    <div style={{ animation:"fadeUp .3s ease" }}>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, color:C.pink, fontWeight:700, letterSpacing:2, marginBottom:6 }}>DASHBOARD</div>
        <div style={{ fontSize:26, fontWeight:800 }}>Good evening, Marina Group 👋</div>
        <div style={{ fontSize:13, color:C.muted, marginTop:4 }}>Here's your performance overview for today.</div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:28 }}>
        {statCard("Total Scans",    "3,083", "+18% this week", <QrCode size={18} color={C.purple}/>, C.purple)}
        {statCard("Avg Watch Rate", "80%",   "+5% this week",  <Eye size={18} color={C.pink}/>,    C.pink)}
        {statCard("CTA Clicks",     "847",   "+31% this week", <MousePointer size={18} color={C.blue}/>, C.blue)}
        {statCard("Live Reels",     reels.filter(r=>r.status==="live").length, "active now", <Video size={18} color={C.green}/>, C.green)}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        {/* Recent reels */}
        <div style={{ background:C.card, borderRadius:16, padding:20, border:`1px solid ${C.border}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
            <span style={{ fontSize:14, fontWeight:700 }}>Recent Reels</span>
            <button onClick={()=>setPage("reels")} style={{ fontSize:12, color:C.purple, background:"none", border:"none", cursor:"pointer" }}>View all →</button>
          </div>
          {reels.slice(0,5).map(r => (
            <div key={r.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"9px 0", borderBottom:`1px solid ${C.border}` }}>
              <div style={{ width:34, height:34, borderRadius:8, background:`${r.color}28`,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:17 }}>{r.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600 }}>{r.title}</div>
                <div style={{ fontSize:11, color:C.muted }}>{r.loc}</div>
              </div>
              {pill(r.status==="live"?"● LIVE":r.status.toUpperCase(),
                r.status==="live"?C.green:r.status==="scheduled"?C.orange:C.muted)}
            </div>
          ))}
        </div>

        {/* Locations */}
        <div style={{ background:C.card, borderRadius:16, padding:20, border:`1px solid ${C.border}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
            <span style={{ fontSize:14, fontWeight:700 }}>Locations</span>
            <button onClick={()=>setPage("locations")} style={{ fontSize:12, color:C.purple, background:"none", border:"none", cursor:"pointer" }}>Manage →</button>
          </div>
          {locs.map(l => (
            <div key={l.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"9px 0", borderBottom:`1px solid ${C.border}` }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:l.active?C.green:C.dim, flexShrink:0 }} />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600 }}>{l.name}</div>
                <div style={{ fontSize:11, color:C.muted }}>{l.city}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:13, fontWeight:700 }}>{l.scans.toLocaleString()}</div>
                <div style={{ fontSize:10, color:C.blue }}>{l.wr}% watch</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── CMS Reels ───────────────────────────────────────────
function CMSReels({ reels, setReels, notify, setAiModal }) {
  const [filter, setFilter] = useState("all");
  const shown = filter==="all" ? reels : reels.filter(r=>r.status===filter);

  const del    = id => { setReels(r=>r.filter(x=>x.id!==id)); notify("Reel deleted"); };
  const toggle = id => { setReels(r=>r.map(x=>x.id===id?{...x,status:x.status==="live"?"draft":"live"}:x)); notify("Status updated"); };

  return (
    <div style={{ animation:"fadeUp .3s ease" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
        <div>
          <div style={{ fontSize:11, color:C.pink, fontWeight:700, letterSpacing:2, marginBottom:6 }}>CONTENT</div>
          <div style={{ fontSize:24, fontWeight:800 }}>Reels</div>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={()=>setAiModal(true)} style={{
            padding:"9px 16px", borderRadius:9, border:`1px solid ${C.purple}`,
            background:`${C.purple}22`, color:C.purple, cursor:"pointer",
            fontWeight:600, fontSize:13, display:"flex", alignItems:"center", gap:7
          }}>
            <Sparkles size={14}/> AI Generate
          </button>
          <button onClick={()=>notify("Upload dialog — connect to your media storage")} style={{
            padding:"9px 16px", borderRadius:9, border:"none",
            background:C.purple, color:C.white, cursor:"pointer",
            fontWeight:600, fontSize:13, display:"flex", alignItems:"center", gap:7
          }}>
            <Plus size={14}/> Add Reel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display:"flex", gap:8, marginBottom:20 }}>
        {["all","live","scheduled","draft"].map(f => (
          <button key={f} onClick={()=>setFilter(f)} style={{
            padding:"6px 15px", borderRadius:8, border:"none", cursor:"pointer",
            background: filter===f ? C.purple : C.card,
            color: filter===f ? C.white : C.muted,
            fontSize:13, fontWeight: filter===f ? 600 : 400, textTransform:"capitalize"
          }}>
            {f} ({f==="all"?reels.length:reels.filter(r=>r.status===f).length})
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
        {shown.map(r => (
          <div key={r.id} style={{ background:C.card, borderRadius:16, overflow:"hidden", border:`1px solid ${C.border}` }}>
            {/* Preview */}
            <div style={{
              height:136, background:`linear-gradient(135deg,${r.color}44,${C.bg})`,
              display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
              position:"relative"
            }}>
              <div style={{ fontSize:42 }}>{r.emoji}</div>
              <div style={{ position:"absolute", top:10, left:10 }}>
                {pill(r.status==="live"?"● LIVE":r.status.toUpperCase(),
                  r.status==="live"?C.green:r.status==="scheduled"?C.orange:C.muted)}
              </div>
              <div style={{ position:"absolute", top:10, right:10 }}>
                {pill(r.type, r.color)}
              </div>
            </div>

            <div style={{ padding:14 }}>
              <div style={{ fontSize:14, fontWeight:700, marginBottom:4 }}>{r.title}</div>
              <div style={{ fontSize:11, color:C.muted, marginBottom:12 }}>📍 {r.loc} · {r.ago}</div>

              {r.status==="live" && (
                <div style={{ display:"flex", gap:16, marginBottom:12 }}>
                  <div>
                    <div style={{ fontSize:17, fontWeight:800 }}>{r.views.toLocaleString()}</div>
                    <div style={{ fontSize:10, color:C.muted }}>Views</div>
                  </div>
                  <div>
                    <div style={{ fontSize:17, fontWeight:800, color:C.pink }}>{r.ctr}%</div>
                    <div style={{ fontSize:10, color:C.muted }}>CTR</div>
                  </div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:C.blue }}>{r.cta}</div>
                    <div style={{ fontSize:10, color:C.muted }}>CTA</div>
                  </div>
                </div>
              )}

              <div style={{ display:"flex", gap:8 }}>
                <button onClick={()=>toggle(r.id)} style={{
                  flex:1, padding:"7px 0", borderRadius:8, border:"none", cursor:"pointer",
                  background: r.status==="live" ? `${C.orange}22` : `${C.green}22`,
                  color: r.status==="live" ? C.orange : C.green,
                  fontSize:12, fontWeight:600
                }}>
                  {r.status==="live"?"Pause":"Publish"}
                </button>
                <button onClick={()=>del(r.id)} style={{
                  width:34, height:34, borderRadius:8, border:"none", cursor:"pointer",
                  background:`${C.pink}22`, color:C.pink,
                  display:"flex", alignItems:"center", justifyContent:"center"
                }}>
                  <Trash2 size={13}/>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CMS Locations ───────────────────────────────────────
function CMSLocations({ locs, setLocs, notify }) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");

  const add = () => {
    if (!name.trim()) return;
    setLocs(l => [...l, { id:"l"+Date.now(), name, city:city||"Dubai", scans:0, wr:0, active:true }]);
    setName(""); setCity(""); setAdding(false);
    notify("📍 Location added — QR code generated!");
  };

  return (
    <div style={{ animation:"fadeUp .3s ease" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
        <div>
          <div style={{ fontSize:11, color:C.pink, fontWeight:700, letterSpacing:2, marginBottom:6 }}>MANAGEMENT</div>
          <div style={{ fontSize:24, fontWeight:800 }}>Locations</div>
        </div>
        <button onClick={()=>setAdding(true)} style={{
          padding:"9px 16px", borderRadius:9, border:"none",
          background:C.purple, color:C.white, cursor:"pointer",
          fontWeight:600, fontSize:13, display:"flex", alignItems:"center", gap:7
        }}>
          <Plus size={14}/> Add Location
        </button>
      </div>

      {adding && (
        <div style={{ background:C.card, borderRadius:16, padding:20,
          border:`1px solid ${C.purple}`, marginBottom:20, animation:"fadeUp .2s ease" }}>
          <div style={{ fontSize:14, fontWeight:700, marginBottom:14 }}>New Location</div>
          <div style={{ display:"flex", gap:12, marginBottom:14 }}>
            <input value={name} onChange={e=>setName(e.target.value)}
              placeholder="Location name (e.g. Marina Walk)"
              style={{ flex:1, padding:"10px 14px", borderRadius:8,
                border:`1px solid ${C.border}`, background:C.bg,
                color:C.white, fontSize:13, outline:"none" }}/>
            <input value={city} onChange={e=>setCity(e.target.value)}
              placeholder="City"
              style={{ width:140, padding:"10px 14px", borderRadius:8,
                border:`1px solid ${C.border}`, background:C.bg,
                color:C.white, fontSize:13, outline:"none" }}/>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={add} style={{ padding:"9px 20px", borderRadius:8, border:"none",
              background:C.purple, color:C.white, cursor:"pointer", fontWeight:600, fontSize:13 }}>
              Create & Generate QR
            </button>
            <button onClick={()=>setAdding(false)} style={{ padding:"9px 20px", borderRadius:8,
              border:`1px solid ${C.border}`, background:"transparent",
              color:C.muted, cursor:"pointer", fontSize:13 }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={{ display:"grid", gap:14 }}>
        {locs.map(l => (
          <div key={l.id} style={{ background:C.card, borderRadius:16, padding:20,
            border:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:20 }}>
            {/* QR */}
            <div style={{ width:80, height:80, borderRadius:12, background:C.white,
              display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
              flexShrink:0, gap:4 }}>
              <QrCode size={40} color={C.bg}/>
              <div style={{ fontSize:7, color:C.bg, fontWeight:700 }}>SCENVY</div>
            </div>

            <div style={{ flex:1 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                <div style={{ fontSize:15, fontWeight:700 }}>{l.name}</div>
                <div style={{ width:8, height:8, borderRadius:"50%", background:l.active?C.green:C.dim }}/>
                <div style={{ fontSize:11, color:l.active?C.green:C.muted }}>{l.active?"Active":"Inactive"}</div>
              </div>
              <div style={{ fontSize:12, color:C.muted, marginBottom:9 }}>📍 {l.city}</div>
              <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"5px 10px",
                background:C.card2, borderRadius:7, fontSize:11, color:C.muted }}>
                🔗 scenvy.app/l/{l.id}
                <Copy size={11} color={C.purple} style={{ cursor:"pointer" }}
                  onClick={()=>notify("URL copied!")}/>
              </div>
            </div>

            <div style={{ display:"flex", gap:24, textAlign:"center" }}>
              <div>
                <div style={{ fontSize:22, fontWeight:800 }}>{l.scans.toLocaleString()}</div>
                <div style={{ fontSize:11, color:C.muted }}>Scans</div>
              </div>
              <div>
                <div style={{ fontSize:22, fontWeight:800, color:l.wr>0?C.pink:C.dim }}>
                  {l.wr>0?`${l.wr}%`:"—"}
                </div>
                <div style={{ fontSize:11, color:C.muted }}>Watch Rate</div>
              </div>
            </div>

            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              <button onClick={()=>{ setLocs(ls=>ls.map(x=>x.id===l.id?{...x,active:!x.active}:x)); notify("Status updated"); }} style={{
                padding:"7px 14px", borderRadius:8, border:"none", cursor:"pointer",
                background: l.active?`${C.orange}22`:`${C.green}22`,
                color: l.active?C.orange:C.green, fontSize:12, fontWeight:600
              }}>
                {l.active?"Deactivate":"Activate"}
              </button>
              <button onClick={()=>notify("QR downloaded!")} style={{
                padding:"7px 14px", borderRadius:8, border:`1px solid ${C.border}`,
                background:"transparent", color:C.muted, cursor:"pointer", fontSize:12
              }}>
                Download QR
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CMS Analytics ───────────────────────────────────────
function CMSAnalytics({ reels }) {
  return (
    <div style={{ animation:"fadeUp .3s ease" }}>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, color:C.pink, fontWeight:700, letterSpacing:2, marginBottom:6 }}>INSIGHTS</div>
        <div style={{ fontSize:24, fontWeight:800 }}>Analytics</div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14, marginBottom:24 }}>
        {[
          { l:"Total Scans (7d)",  v:"2,038",  d:"+18%", c:C.purple },
          { l:"Avg Watch Time",    v:"12.4s",  d:"+3s",  c:C.pink   },
          { l:"CTA Clicks",        v:"847",    d:"+31%", c:C.blue   },
          { l:"Conversion Rate",   v:"41.5%",  d:"+7%",  c:C.green  },
        ].map((s,i) => (
          <div key={i} style={{ background:C.card, borderRadius:14, padding:18, border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:11, color:C.muted, marginBottom:10 }}>{s.l}</div>
            <div style={{ fontSize:26, fontWeight:800 }}>{s.v}</div>
            <div style={{ fontSize:12, color:C.green, marginTop:4 }}>{s.d} vs last week</div>
          </div>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:20, marginBottom:20 }}>
        <div style={{ background:C.card, borderRadius:16, padding:20, border:`1px solid ${C.border}` }}>
          <div style={{ fontSize:14, fontWeight:700, marginBottom:16 }}>Weekly Scans & Views</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={CHART_DATA} barGap={4}>
              <XAxis dataKey="day" tick={{ fill:C.muted, fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:C.muted, fontSize:11 }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{ background:C.card2, border:`1px solid ${C.border}`, borderRadius:8, color:C.white }}/>
              <Bar dataKey="scans" fill={C.purple} radius={[4,4,0,0]}/>
              <Bar dataKey="views" fill={C.pink}   radius={[4,4,0,0]} opacity={0.6}/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background:C.card, borderRadius:16, padding:20, border:`1px solid ${C.border}` }}>
          <div style={{ fontSize:14, fontWeight:700, marginBottom:16 }}>CTR Trend</div>
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
        <div style={{ fontSize:14, fontWeight:700, marginBottom:16 }}>Top Performing Reels</div>
        {reels.filter(r=>r.status==="live").sort((a,b)=>b.views-a.views).map((r,i) => (
          <div key={r.id} style={{ display:"flex", alignItems:"center", gap:14, padding:"11px 0", borderBottom:`1px solid ${C.border}` }}>
            <div style={{ width:28, height:28, borderRadius:7, background:`${r.color}28`,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>{r.emoji}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:600 }}>{r.title}</div>
              <div style={{ fontSize:11, color:C.muted }}>{r.loc}</div>
            </div>
            <div style={{ width:76 }}>
              <div style={{ fontSize:13, fontWeight:700 }}>{r.views.toLocaleString()}</div>
              <div style={{ fontSize:10, color:C.muted }}>views</div>
            </div>
            <div style={{ width:56 }}>
              <div style={{ fontSize:13, fontWeight:700, color:C.pink }}>{r.ctr}%</div>
              <div style={{ fontSize:10, color:C.muted }}>CTR</div>
            </div>
            <div style={{ width:100 }}>
              <div style={{ height:5, background:C.card2, borderRadius:3, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${r.ctr*2.4}%`,
                  background:grad(C.purple,C.pink), borderRadius:3 }}/>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── AI Reel Generator (real Claude API) ─────────────────
function AIGenerator({ notify, setReels }) {
  const [form, setForm]     = useState({ venue:"Marina Walk", offer:"", type:"offer", tone:"exciting" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!form.offer.trim()) { notify("Enter your offer or message first"); return; }
    setLoading(true); setResult(null);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-6",
          max_tokens:1000,
          messages:[{
            role:"user",
            content:`You are the creative director for SCENVY, a platform making TikTok-style vertical reels for hospitality venues.

Build a reel content package for:
- Venue: ${form.venue}
- Message/Offer: ${form.offer}
- Type: ${form.type}
- Tone: ${form.tone}

Reply ONLY with valid compact JSON (no markdown, no backticks, no explanation):
{"hook":"ATTENTION LINE MAX 6 WORDS ALL CAPS","headline":"compelling main message max 8 words","subtext":"one short supporting sentence","cta":"2-3 word button text","hashtags":["tag1","tag2","tag3"],"emoji":"single emoji","urgency":"short scarcity line or empty string","colorMood":"purple|pink|blue|orange|green"}`
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "";
      setResult(JSON.parse(text.replace(/```json|```/g,"")));
    } catch {
      // Graceful fallback
      const moodMap = { offer:"purple", event:"pink", menu:"blue", promo:"orange" };
      setResult({
        hook:"TONIGHT ONLY 🔥",
        headline: form.offer.length > 40 ? form.offer.slice(0,40)+"…" : form.offer,
        subtext:"Available exclusively at "+form.venue+" — don't miss out.",
        cta:"Grab It Now",
        hashtags:["dubai", form.type, "scenvy"],
        emoji: form.type==="offer"?"🍹":form.type==="event"?"🎉":"🍽️",
        urgency:"Limited time only",
        colorMood: moodMap[form.type] || "purple"
      });
    }
    setLoading(false);
  };

  const save = () => {
    const cm = { purple:C.purple, pink:C.pink, blue:C.blue, orange:C.orange, green:C.green };
    setReels(r => [...r, {
      id:"r"+Date.now(), title:result.headline, type:form.type, status:"draft",
      views:0, ctr:0, loc:form.venue, color:cm[result.colorMood]||C.purple,
      emoji:result.emoji, cta:result.cta, ago:"Just now"
    }]);
    notify("✨ AI Reel saved to your library!");
    setResult(null);
    setForm(f => ({...f, offer:""}));
  };

  const accent = result ? ({purple:C.purple,pink:C.pink,blue:C.blue,orange:C.orange,green:C.green}[result.colorMood]||C.purple) : C.purple;

  return (
    <div style={{ animation:"fadeUp .3s ease" }}>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, color:C.pink, fontWeight:700, letterSpacing:2, marginBottom:6 }}>AI POWERED</div>
        <div style={{ fontSize:24, fontWeight:800 }}>Reel Generator ✨</div>
        <div style={{ fontSize:13, color:C.muted, marginTop:4 }}>
          Describe your offer → Claude creates a publish-ready reel in seconds.
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
        {/* Form */}
        <div style={{ background:C.card, borderRadius:16, padding:24, border:`1px solid ${C.border}` }}>
          <div style={{ fontSize:14, fontWeight:700, marginBottom:20 }}>Your Input</div>

          {[
            { label:"VENUE / LOCATION", key:"venue", ph:"e.g. Marina Walk", multi:false },
            { label:"YOUR OFFER OR MESSAGE *", key:"offer", ph:"e.g. Happy hour 50% off cocktails until 8 PM", multi:true },
          ].map(f => (
            <div key={f.key} style={{ marginBottom:16 }}>
              <label style={{ fontSize:11, color:C.muted, display:"block", marginBottom:6, letterSpacing:1 }}>{f.label}</label>
              {f.multi
                ? <textarea value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))}
                    rows={3} placeholder={f.ph}
                    style={{ width:"100%", padding:"10px 14px", borderRadius:8,
                      border:`1px solid ${C.border}`, background:C.bg, color:C.white,
                      fontSize:13, outline:"none", resize:"vertical", fontFamily:"inherit" }}/>
                : <input value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))}
                    placeholder={f.ph}
                    style={{ width:"100%", padding:"10px 14px", borderRadius:8,
                      border:`1px solid ${C.border}`, background:C.bg, color:C.white,
                      fontSize:13, outline:"none" }}/>
              }
            </div>
          ))}

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:22 }}>
            {[
              { key:"type",  label:"TYPE", opts:[["offer","🏷️ Offer"],["event","🎉 Event"],["menu","🍽️ Menu"],["promo","⚡ Promo"]] },
              { key:"tone",  label:"TONE", opts:[["exciting","🔥 Exciting"],["luxurious","✨ Luxurious"],["friendly","😊 Friendly"],["urgent","⚡ Urgent"]] },
            ].map(s => (
              <div key={s.key}>
                <label style={{ fontSize:11, color:C.muted, display:"block", marginBottom:6, letterSpacing:1 }}>{s.label}</label>
                <select value={form[s.key]} onChange={e=>setForm(p=>({...p,[s.key]:e.target.value}))}
                  style={{ width:"100%", padding:"10px 14px", borderRadius:8,
                    border:`1px solid ${C.border}`, background:C.card2, color:C.white,
                    fontSize:13, outline:"none", cursor:"pointer" }}>
                  {s.opts.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            ))}
          </div>

          <button onClick={generate} disabled={loading} style={{
            width:"100%", padding:"14px 0", borderRadius:12, border:"none",
            cursor:loading?"wait":"pointer",
            background:loading ? C.dim : grad(C.purple,C.pink),
            color:C.white, fontWeight:700, fontSize:15,
            display:"flex", alignItems:"center", justifyContent:"center", gap:10,
            transition:"all .2s"
          }}>
            {loading
              ? <><RefreshCw size={18} style={{ animation:"spin 1s linear infinite" }}/> Generating with Claude AI...</>
              : <><Sparkles size={18}/> Generate Reel</>
            }
          </button>
        </div>

        {/* Preview */}
        <div>
          {!result ? (
            <div style={{
              background:C.card, borderRadius:16, padding:24,
              border:`2px dashed ${C.border}`, height:"100%",
              display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center"
            }}>
              <Sparkles size={44} color={C.dim} style={{ marginBottom:16 }}/>
              <div style={{ fontSize:16, fontWeight:600, color:C.muted, marginBottom:8 }}>AI Preview</div>
              <div style={{ fontSize:13, color:C.dim }}>
                Fill in your offer and hit Generate.<br/>Your reel content appears here instantly.
              </div>
            </div>
          ) : (
            <div style={{ animation:"fadeUp .3s ease" }}>
              {/* Reel mock */}
              <div style={{
                background:`linear-gradient(160deg,${accent}28,${C.bg} 70%)`,
                border:`2px solid ${accent}44`, borderRadius:22, padding:24, marginBottom:14,
                boxShadow:`0 0 50px ${accent}22`
              }}>
                <div style={{ fontSize:10, color:C.muted, marginBottom:14, letterSpacing:1 }}>REEL PREVIEW</div>

                <div style={{
                  background:`linear-gradient(180deg,${accent}33 0%,${C.bg} 100%)`,
                  borderRadius:16, padding:"28px 20px", textAlign:"center", marginBottom:14,
                  minHeight:230, display:"flex", flexDirection:"column", justifyContent:"space-between"
                }}>
                  <div style={{ fontSize:44 }}>{result.emoji}</div>
                  <div>
                    <div style={{ fontSize:12, fontWeight:800, color:accent, letterSpacing:2, marginBottom:7 }}>{result.hook}</div>
                    <div style={{ fontSize:20, fontWeight:800, lineHeight:1.28, marginBottom:9 }}>{result.headline}</div>
                    <div style={{ fontSize:13, color:"rgba(255,255,255,.6)", marginBottom:10 }}>{result.subtext}</div>
                    {result.urgency && <div style={{ fontSize:12, color:accent, fontWeight:600 }}>⏱ {result.urgency}</div>}
                  </div>
                  <button style={{ padding:"11px 28px", borderRadius:13, border:"none",
                    background:accent, color:C.white, fontWeight:700, fontSize:15 }}>
                    {result.cta} →
                  </button>
                </div>

                <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                  {result.hashtags.map(h => (
                    <span key={h} style={{ fontSize:11, color:accent,
                      background:`${accent}22`, padding:"3px 9px", borderRadius:7 }}>#{h}</span>
                  ))}
                </div>
              </div>

              <div style={{ display:"flex", gap:10 }}>
                <button onClick={save} style={{
                  flex:1, padding:"12px 0", borderRadius:10, border:"none", cursor:"pointer",
                  background:accent, color:C.white, fontWeight:700, fontSize:14
                }}>✓ Save to Library</button>
                <button onClick={()=>setResult(null)} style={{
                  padding:"12px 18px", borderRadius:10,
                  border:`1px solid ${C.border}`, background:"transparent",
                  color:C.muted, cursor:"pointer", fontSize:13
                }}>Retry</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── CMS Settings ────────────────────────────────────────
function CMSSettings() {
  return (
    <div style={{ animation:"fadeUp .3s ease" }}>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, color:C.pink, fontWeight:700, letterSpacing:2, marginBottom:6 }}>ACCOUNT</div>
        <div style={{ fontSize:24, fontWeight:800 }}>Settings</div>
      </div>
      {[
        { title:"Current Plan", content:<div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <span style={{ padding:"6px 14px", background:`${C.purple}33`, color:C.purple, borderRadius:8, fontWeight:700, fontSize:13 }}>ENTERPRISE</span>
            <span style={{ fontSize:13, color:C.muted }}>4 Locations · Unlimited Reels · AI Features · White Label</span>
          </div>
        },
        { title:"Brand Settings", content:<div style={{ fontSize:13, color:C.muted }}>Logo, brand colors, and CTA customization — connect to your backend to enable.</div> },
        { title:"Social Import", content:<div style={{ fontSize:13, color:C.muted }}>Link Instagram & TikTok to auto-import your best performing content as reels.</div> },
        { title:"Notifications", content:<div style={{ fontSize:13, color:C.muted }}>Weekly performance digest · Low scan alerts · New milestone celebrations.</div> },
      ].map((s,i) => (
        <div key={i} style={{ background:C.card, borderRadius:14, padding:20, border:`1px solid ${C.border}`, marginBottom:12 }}>
          <div style={{ fontSize:14, fontWeight:700, marginBottom:12 }}>{s.title}</div>
          {s.content}
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════
// SUPER ADMIN
// ════════════════════════════════════════════════════════
function AdminView({ tenants, setTenants, notify }) {
  const mrr    = tenants.reduce((s,t)=>s+t.mrr,0);
  const locs   = tenants.reduce((s,t)=>s+t.locs,0);
  const reels  = tenants.reduce((s,t)=>s+t.reels,0);

  const PLAN_C = { enterprise:C.purple, pro:C.blue, starter:C.muted };

  const setPlan = (id, plan) => {
    setTenants(t=>t.map(x=>x.id===id?{...x,plan}:x));
    notify(`Plan updated to ${plan}`);
  };

  const FLAGS = [
    { n:"AI Generator",   on:true,  c:C.purple },
    { n:"Social Import",  on:true,  c:C.blue   },
    { n:"Geo Targeting",  on:false, c:C.pink   },
    { n:"Gamification",   on:false, c:C.orange },
    { n:"White Label",    on:true,  c:C.purple },
    { n:"API Access",     on:false, c:C.blue   },
    { n:"Analytics Pro",  on:true,  c:C.green  },
    { n:"Scheduling AI",  on:false, c:C.pink   },
  ];
  const [flags, setFlags] = useState(FLAGS);

  return (
    <div style={{ padding:28, overflowY:"auto", height:"calc(100vh - 58px)", animation:"fadeUp .3s ease" }}>
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:11, color:C.pink, fontWeight:700, letterSpacing:2, marginBottom:6 }}>SUPER ADMIN</div>
        <div style={{ fontSize:26, fontWeight:800 }}>Global Overview 🛠️</div>
      </div>

      {/* Global stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:14, marginBottom:28 }}>
        {[
          { l:"Tenants",   v:tenants.length,      c:C.purple, i:<Users size={17} color={C.purple}/>   },
          { l:"MRR",       v:`€${mrr}`,            c:C.green,  i:<TrendingUp size={17} color={C.green}/>},
          { l:"Locations", v:locs,                c:C.blue,   i:<MapPin size={17} color={C.blue}/>   },
          { l:"Reels",     v:reels,               c:C.pink,   i:<Film size={17} color={C.pink}/>    },
          { l:"Uptime",    v:"99.9%",             c:C.green,  i:<Activity size={17} color={C.green}/>},
        ].map((s,i) => (
          <div key={i} style={{ background:C.card, borderRadius:14, padding:18, border:`1px solid ${C.border}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
              <span style={{ fontSize:11, color:C.muted }}>{s.l}</span>
              {s.i}
            </div>
            <div style={{ fontSize:26, fontWeight:800, color:s.c }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Tenant table + plan breakdown */}
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:20, marginBottom:24 }}>
        <div style={{ background:C.card, borderRadius:16, padding:20, border:`1px solid ${C.border}` }}>
          <div style={{ fontSize:14, fontWeight:700, marginBottom:16 }}>All Tenants</div>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 0.7fr 0.7fr 0.7fr",
            gap:0, borderBottom:`1px solid ${C.border}`, paddingBottom:9, marginBottom:4 }}>
            {["Tenant","Plan","Locs","Reels","MRR"].map(h=>(
              <div key={h} style={{ fontSize:10, color:C.muted, fontWeight:700, letterSpacing:1 }}>{h}</div>
            ))}
          </div>
          {tenants.map(t => (
            <div key={t.id} style={{ display:"grid", gridTemplateColumns:"2fr 1fr 0.7fr 0.7fr 0.7fr",
              gap:0, padding:"12px 0", borderBottom:`1px solid ${C.border}`, alignItems:"center" }}>
              <div>
                <div style={{ fontSize:13, fontWeight:600 }}>{t.name}</div>
                <div style={{ fontSize:10, color:C.muted }}>{t.status==="trial"?"⏳ Trial":"✓ Active"} · {t.since}</div>
              </div>
              <div>
                <select value={t.plan} onChange={e=>setPlan(t.id,e.target.value)} style={{
                  fontSize:10, fontWeight:700, padding:"3px 7px", borderRadius:6,
                  border:"none", cursor:"pointer",
                  background:`${PLAN_C[t.plan]}28`, color:PLAN_C[t.plan], outline:"none"
                }}>
                  <option value="starter">STARTER</option>
                  <option value="pro">PRO</option>
                  <option value="enterprise">ENT.</option>
                </select>
              </div>
              <div style={{ fontSize:13, fontWeight:700, color:C.blue }}>{t.locs}</div>
              <div style={{ fontSize:13, fontWeight:700 }}>{t.reels}</div>
              <div style={{ fontSize:13, fontWeight:700, color:C.green }}>
                {t.mrr>0?`€${t.mrr}`:<span style={{ color:C.dim }}>—</span>}
              </div>
            </div>
          ))}
        </div>

        <div style={{ background:C.card, borderRadius:16, padding:20, border:`1px solid ${C.border}` }}>
          <div style={{ fontSize:14, fontWeight:700, marginBottom:16 }}>Plan Breakdown</div>
          {[
            { label:"Enterprise", key:"enterprise", color:C.purple },
            { label:"Pro",        key:"pro",        color:C.blue   },
            { label:"Starter",    key:"starter",    color:C.muted  },
          ].map(row => {
            const count = tenants.filter(t=>t.plan===row.key).length;
            const rowMrr = tenants.filter(t=>t.plan===row.key).reduce((s,t)=>s+t.mrr,0);
            return (
              <div key={row.key} style={{ marginBottom:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span style={{ fontSize:13, fontWeight:600, color:row.color }}>{row.label}</span>
                  <span style={{ fontSize:11, color:C.muted }}>{count} · €{rowMrr}/mo</span>
                </div>
                <div style={{ height:6, background:C.card2, borderRadius:3, overflow:"hidden" }}>
                  <div style={{ height:"100%",
                    width:`${(count/tenants.length)*100}%`,
                    background:row.color, borderRadius:3, transition:"width .5s" }}/>
                </div>
              </div>
            );
          })}

          <div style={{ marginTop:24, padding:14, background:C.card2, borderRadius:10 }}>
            <div style={{ fontSize:10, color:C.muted, marginBottom:5, letterSpacing:1 }}>MONTHLY RECURRING REVENUE</div>
            <div style={{ fontSize:28, fontWeight:800, color:C.green }}>€{mrr}</div>
            <div style={{ fontSize:11, color:C.muted, marginTop:4 }}>
              +€{Math.round(mrr*.18)} vs last month
            </div>
          </div>
        </div>
      </div>

      {/* Feature flags */}
      <div style={{ background:C.card, borderRadius:16, padding:20, border:`1px solid ${C.border}` }}>
        <div style={{ fontSize:14, fontWeight:700, marginBottom:16 }}>Feature Flags</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
          {flags.map((f,i) => (
            <div key={i} style={{
              display:"flex", justifyContent:"space-between", alignItems:"center",
              padding:"10px 14px", background:C.card2, borderRadius:10,
              border:`1px solid ${f.on?f.c+"44":C.border}`,
              cursor:"pointer", transition:"border .2s"
            }} onClick={() => { setFlags(fs=>fs.map((x,j)=>i===j?{...x,on:!x.on}:x)); notify(`${f.n} ${!f.on?"enabled":"disabled"}`); }}>
              <span style={{ fontSize:12, fontWeight:600, color:f.on?C.white:C.muted }}>{f.n}</span>
              <div style={{
                width:36, height:20, borderRadius:10,
                background:f.on?f.c:C.dim, position:"relative", transition:"background .2s"
              }}>
                <div style={{
                  width:14, height:14, borderRadius:"50%", background:C.white,
                  position:"absolute", top:3, left:f.on?18:4, transition:"left .2s"
                }}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
