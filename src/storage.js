// src/storage.js — Persistent localStorage layer
// Replace with Supabase/Postgres calls for production

const KEYS = {
  reels:    'scenvy_reels_v2',
  locs:     'scenvy_locs_v2',
  settings: 'scenvy_settings_v2',
  lang:     'scenvy_lang',
}

export const storage = {
  load: (key, fallback) => {
    try {
      const v = localStorage.getItem(KEYS[key])
      return v ? JSON.parse(v) : fallback
    } catch { return fallback }
  },
  save: (key, data) => {
    try { localStorage.setItem(KEYS[key], JSON.stringify(data)) } catch {}
  },
  clear: (key) => {
    try { localStorage.removeItem(KEYS[key]) } catch {}
  }
}

// ─── Clipboard helper ────────────────────────────────────
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback for older browsers / HTTP
    const el = document.createElement('textarea')
    el.value = text
    el.style.cssText = 'position:fixed;opacity:0;top:0;left:0'
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    return true
  }
}

// ─── QR Download helper ──────────────────────────────────
export async function downloadQR(locationId, locationName) {
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(`https://app.scenvy.de/l/${locationId}`)}&format=png&margin=30&color=000000&bgcolor=ffffff`
  try {
    const res = await fetch(url)
    const blob = await res.blob()
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `SCENVY-QR-${locationName.replace(/\s+/g,'-')}.png`
    link.click()
    URL.revokeObjectURL(link.href)
  } catch {
    window.open(url, '_blank')
  }
}

// ─── QR Image URL ────────────────────────────────────────
export function qrImageUrl(locationId, size = 200) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(`https://app.scenvy.de/l/${locationId}`)}&margin=10`
}

// ─── Transform CMS reel → Guest reel format ─────────────
export function toGuestReel(r) {
  const hookMap = {
    offer: 'JETZT SICHERN 🔥',
    event: 'HEUTE ABEND ✨',
    menu:  'NEU AUF DER KARTE 🍽️',
    promo: 'SONDERAKTION ⚡',
  }
  const bgMap = {
    '#7C3AED': 'linear-gradient(160deg,#1a0533 0%,#3d1168 55%,#0d0d14 100%)',
    '#FF2D8D': 'linear-gradient(160deg,#33001a 0%,#680d3d 55%,#0d0d14 100%)',
    '#00D4FF': 'linear-gradient(160deg,#071433 0%,#163a68 55%,#0d0d14 100%)',
    '#FF9500': 'linear-gradient(160deg,#1a1400 0%,#3d3200 55%,#0d0d14 100%)',
    '#00E676': 'linear-gradient(160deg,#001a0d 0%,#003d1a 55%,#0d0d14 100%)',
  }
  return {
    id:       r.id,
    hook:     hookMap[r.type] || 'ENTDECKE MEHR ✨',
    title:    r.title,
    sub:      r.loc + (r.ctaUrl ? ' — Jetzt ansehen' : ' — Heute verfügbar'),
    cta:      r.cta || 'Mehr erfahren',
    ctaUrl:   r.ctaUrl || '',
    bg:       bgMap[r.color] || bgMap['#7C3AED'],
    accent:   r.color || '#7C3AED',
    tag:      r.type?.toUpperCase() || 'ANGEBOT',
    emoji:    r.emoji || '✨',
    mediaUrl: r.mediaUrl || null,
  }
}
