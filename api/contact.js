// api/contact.js — Contact form handler
// Set RESEND_API_KEY + CONTACT_EMAIL in Vercel env vars to enable real email sending
// Without config, logs the request and returns success

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { name, company, locations, contact, email, phone, message, type = 'enterprise' } = req.body

  if (!name || !email) return res.status(400).json({ error: 'name and email required' })

  const toEmail    = type === 'support' ? process.env.SUPPORT_EMAIL    : process.env.CONTACT_EMAIL
  const resendKey  = process.env.RESEND_API_KEY

  const subject = type === 'support'
    ? `SCENVY Support-Anfrage von ${name}`
    : `SCENVY Enterprise-Anfrage von ${company || name}`

  const html = `
    <h2>${subject}</h2>
    <table style="border-collapse:collapse;width:100%">
      <tr><td style="padding:8px;font-weight:bold">Name</td><td style="padding:8px">${name}</td></tr>
      ${company ? `<tr><td style="padding:8px;font-weight:bold">Unternehmen</td><td style="padding:8px">${company}</td></tr>` : ''}
      ${locations ? `<tr><td style="padding:8px;font-weight:bold">Anzahl Standorte</td><td style="padding:8px">${locations}</td></tr>` : ''}
      ${contact ? `<tr><td style="padding:8px;font-weight:bold">Ansprechpartner</td><td style="padding:8px">${contact}</td></tr>` : ''}
      <tr><td style="padding:8px;font-weight:bold">E-Mail</td><td style="padding:8px">${email}</td></tr>
      ${phone ? `<tr><td style="padding:8px;font-weight:bold">Telefon</td><td style="padding:8px">${phone}</td></tr>` : ''}
      ${message ? `<tr><td style="padding:8px;font-weight:bold">Nachricht</td><td style="padding:8px">${message}</td></tr>` : ''}
    </table>
    <p style="color:#666;font-size:12px">Gesendet über app.scenvy.de</p>
  `

  // Try Resend (https://resend.com — free tier: 3000 emails/month)
  if (resendKey && toEmail) {
    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'SCENVY <noreply@app.scenvy.de>',
          to: [toEmail],
          reply_to: email,
          subject,
          html,
        })
      })
      if (!r.ok) throw new Error(await r.text())
      return res.status(200).json({ success: true, method: 'resend' })
    } catch (err) {
      console.error('Resend error:', err)
    }
  }

  // Log & return success if no email configured
  console.log('Contact form submission:', { name, company, email, type })
  return res.status(200).json({
    success: true,
    method: 'logged',
    note: 'Set RESEND_API_KEY + CONTACT_EMAIL in Vercel env vars to enable email delivery'
  })
}
