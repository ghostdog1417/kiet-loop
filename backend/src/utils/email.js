const nodemailer = require('nodemailer')

let transporter = null

if (process.env.SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
  })
}

async function sendMail({ to, subject, text, html }) {
  if (!transporter) {
    console.log('nodemailer not configured; skipping sendMail', { to, subject })
    return false
  }
  const info = await transporter.sendMail({ from: process.env.SMTP_FROM || 'no-reply@kietloop.in', to, subject, text, html })
  return info
}

module.exports = { sendMail }
