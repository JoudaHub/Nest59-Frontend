import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from || '/'

  const [form,   setForm]   = useState({ email:'', password:'' })
  const [error,  setError]  = useState('')
  const [busy,   setBusy]   = useState(false)

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setBusy(true)
    try {
      await login(form.email, form.password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message)
    }
    setBusy(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-card fade-in">
        <div className="auth-brand">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="10" fill="#c8a2ff" opacity=".18"/>
            <path d="M10 13l7 5-7 5M20 23h7" stroke="#8847eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Nest59</span>
        </div>

        <h1 className="auth-title">Sign in to your account</h1>
        <p className="auth-sub">Log in to Nest59 to start connecting with the community.</p>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={set('email')}
              placeholder="you@example.com"
              required
              autoFocus
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={set('password')}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="btn-submit" disabled={busy}>
            {busy ? <span className="btn-spinner"/> : null}
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}
