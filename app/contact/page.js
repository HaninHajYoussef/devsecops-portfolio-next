'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ ok: true, text: data.message });
        setForm({ name: '', email: '', message: '' });
      } else {
        const text = data.details
          ? data.details.map((d) => `${d.field} : ${d.message}`).join(' | ')
          : data.error;
        setResult({ ok: false, text });
      }
    } catch {
      setResult({ ok: false, text: 'Erreur réseau' });
    }
    setLoading(false);
  }

  return (
    <main style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif', padding: 16 }}>
      <h1>Contact</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <input name="name" placeholder="Nom" value={form.name} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <textarea name="message" placeholder="Message" rows={5} value={form.message} onChange={handleChange} />
        <button type="submit" disabled={loading}>
          {loading ? 'Envoi...' : 'Envoyer'}
        </button>
      </form>
      {result && (
        <p style={{ color: result.ok ? 'limegreen' : 'tomato' }}>{result.text}</p>
      )}
    </main>
  );
}
