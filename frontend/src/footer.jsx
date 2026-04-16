import { useState } from 'react'
import { Link } from 'react-router-dom'

const supportLinks = [
  { to: '/privacy-policy', label: 'Privacy Policy' },
  { to: '/terms-of-service', label: 'Terms of Service' },
  { to: '/consumer-support', label: 'Consumer Support' },
  { to: '/contact-us', label: 'Contact Us' },
]

function saveFooterMessage(payload) {
  const key = 'fa_footer_messages'
  const existing = JSON.parse(localStorage.getItem(key) || '[]')
  localStorage.setItem(key, JSON.stringify([...existing, payload]))
}

export function Footer() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    setStatus('')
    setError('')
  }

  function handleSubmit(e) {
    e.preventDefault()

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
      submittedAt: new Date().toISOString(),
    }

    if (!payload.name || !payload.email || !payload.message) {
      setError('Please fill in your name, email, and message.')
      return
    }

    saveFooterMessage(payload)
    setForm({ name: '', email: '', message: '' })
    setStatus('Thanks! Your message has been saved and our team will review it.')
  }

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <section className="site-footer__about" aria-label="About Financial Advisor">
          <h2 className="site-footer__brand">Financial Advisor</h2>
          <p>
            Plan smarter with income tracking, budget alerts, monthly reports,
            AI guidance, and practical ITR learning tools built for everyday
            financial decisions.
          </p>
        </section>

        <section className="site-footer__support" aria-label="Support links">
          <h2>Support</h2>
          <ul>
            {supportLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="site-footer__message" aria-label="Send a message">
          <h2>Send a Message</h2>
          <form className="site-footer__form" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
            />
            <input
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
            />
            <textarea
              rows={4}
              placeholder="Your Message"
              value={form.message}
              onChange={(e) => updateField('message', e.target.value)}
            />
            {error ? <p className="site-footer__error">{error}</p> : null}
            {status ? <p className="site-footer__success">{status}</p> : null}
            <button type="submit">Send</button>
          </form>
        </section>
      </div>
      <div className="site-footer__bottom">
        <p>&copy; 2026 Financial Advisor. All rights reserved.</p>
      </div>
    </footer>
  )
}
