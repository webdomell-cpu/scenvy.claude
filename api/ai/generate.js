// api/ai/generate.js — Vercel Serverless Function
// Claude API proxy — keeps your API key safe on the server
//
// ⚠️  SETUP REQUIRED:
// 1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
// 2. Add: ANTHROPIC_API_KEY = your_key_from_console.anthropic.com
// 3. Redeploy

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { venue, offer, type, tone } = req.body

  if (!offer) return res.status(400).json({ error: 'offer is required' })

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    // Fallback for demo when API key not set
    return res.status(200).json({
      hook:       'TONIGHT ONLY 🔥',
      headline:   offer.length > 50 ? offer.slice(0, 50) + '…' : offer,
      subtext:    `Available exclusively at ${venue || 'your venue'} — don't miss out.`,
      cta:        'Grab It Now',
      hashtags:   ['dubai', type || 'offer', 'scenvy'],
      emoji:      type === 'event' ? '🎉' : type === 'menu' ? '🍽️' : '🍹',
      urgency:    'Limited time only',
      colorMood:  'purple',
      _note:      'Add ANTHROPIC_API_KEY env var in Vercel for real AI generation'
    })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-6',
        max_tokens: 800,
        messages: [{
          role:    'user',
          content: `You are the creative director for SCENVY, a TikTok-style reel platform for hospitality venues.

Create a reel content package for:
- Venue: ${venue || 'the venue'}
- Message/Offer: ${offer}
- Type: ${type || 'offer'}
- Tone: ${tone || 'exciting'}

Reply ONLY with compact valid JSON (no markdown, no explanation):
{"hook":"ATTENTION MAX 6 WORDS ALL CAPS","headline":"compelling main message max 8 words","subtext":"one short supporting sentence","cta":"2-3 word button text","hashtags":["tag1","tag2","tag3"],"emoji":"single emoji","urgency":"short scarcity line or empty string","colorMood":"purple|pink|blue|orange|green"}`
        }]
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || 'Claude API error')
    }

    const text = data.content?.[0]?.text || ''
    const parsed = JSON.parse(text.replace(/```json|```/g, '').trim())

    return res.status(200).json(parsed)

  } catch (err) {
    console.error('AI generate error:', err)
    // Graceful fallback
    return res.status(200).json({
      hook:      'TONIGHT ONLY 🔥',
      headline:  offer,
      subtext:   `Don't miss out at ${venue || 'your venue'}.`,
      cta:       'See More',
      hashtags:  ['dubai', 'scenvy'],
      emoji:     '✨',
      urgency:   '',
      colorMood: 'purple'
    })
  }
}
