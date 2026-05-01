/* -----------------------------------------------------------------
 * File:    frontend/src/pages/Contact.jsx
 * Purpose: Contact form — POSTs to POST /api/contact
 *
 * Changes from original:
 *   - axios.post('/api/contact', form) is now active (not commented out)
 *   - Button is disabled while the request is in-flight to prevent
 *     duplicate submissions
 *   - Form fields are cleared on successful submission
 *   - Error message is more descriptive
 * ----------------------------------------------------------------- */

import React, { useState } from 'react'
import axios from 'axios'

// Initial empty form state — defined outside the component so it can
// be reused when resetting the form after a successful submission.
const EMPTY_FORM = { name: '', email: '', org: '', message: '' }

export default function Contact() {
  const [form, setForm]     = useState(EMPTY_FORM)
  const [status, setStatus] = useState(null) // null | 'sending' | 'sent' | 'error'

  // ── Controlled input helper ─────────────────────────────────────
  // Single onChange handler for all text inputs. Spreads the previous
  // state and overwrites only the field that changed.
  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  // ── Form submission ─────────────────────────────────────────────
  async function submit(e) {
    e.preventDefault()
    setStatus('sending')

    try {
      // POST to /api/contact — the Vite proxy forwards this to
      // http://localhost:8000/api/contact in development.
      // In production the request goes directly to the Render backend.
      await axios.post('/api/contact', form)

      setStatus('sent')
      setForm(EMPTY_FORM) // clear the form so it's ready for another message
    } catch (err) {
      // Log to console for debugging; show a friendly message in the UI
      console.error('Contact form error:', err)
      setStatus('error')
    }
  }

  // ── Render ──────────────────────────────────────────────────────
  return (
    <section className="py-12">
      <div className="container max-w-2xl">
        <h1 className="text-2xl font-heading text-cognifer_blue">Contact Us</h1>
        <p className="text-gray-600 mt-2">
          Request a demo or ask a question — we'll respond within 2 business days.
        </p>

        <form
          className="mt-6 bg-white p-6 rounded shadow-sm"
          onSubmit={submit}
          noValidate
        >
          {/* Name + email row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              required
              name="name"
              placeholder="Your name"
              className="p-2 border rounded"
              value={form.name}
              onChange={handleChange}
            />
            <input
              required
              type="email"
              name="email"
              placeholder="Email"
              className="p-2 border rounded"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          {/* Organisation (optional) */}
          <input
            name="org"
            placeholder="Organisation (optional)"
            className="mt-4 p-2 border rounded w-full"
            value={form.org}
            onChange={handleChange}
          />

          {/* Message */}
          <textarea
            required
            name="message"
            placeholder="Message"
            className="mt-4 p-2 border rounded w-full"
            rows="5"
            value={form.message}
            onChange={handleChange}
          />

          {/* Submit button + status feedback */}
          <div className="mt-4 flex items-center gap-3">
            <button
              type="submit"
              disabled={status === 'sending'}
              className="px-4 py-2 rounded bg-cognifer_sky text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'sending' ? 'Sending…' : 'Send'}
            </button>

            {status === 'sent' && (
              <span className="text-sm text-green-600">
                Sent — thanks! We'll be in touch soon.
              </span>
            )}
            {status === 'error' && (
              <span className="text-sm text-red-600">
                Something went wrong. Please try again or email us directly at{' '}
                <a href="mailto:info@cognifer.co.ke" className="underline">
                  info@cognifer.co.ke
                </a>
              </span>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}
