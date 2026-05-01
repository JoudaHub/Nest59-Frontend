import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate     = useNavigate()

  const [form,  setForm]  = useState({ name:'', lastname:'', email:'', password:'' })
  const [error, setError] = useState('')
  const [busy,  setBusy]  = useState(false)

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setBusy(true)
    try {
      await register(form)
      navigate('/')
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
            <path d="M10 13l7 5-7 5M20 23h7" stroke="#9b6de0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>CodeShare</span>
        </div>

        <h1 className="auth-title">Create account</h1>
        <p className="auth-sub">Join and start sharing code today</p>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field-row">
            <div className="field">
              <label>First name</label>
              <input type="text" value={form.name} onChange={set('name')} placeholder="Ayoub" required minLength={2}/>
            </div>
            <div className="field">
              <label>Last name</label>
              <input type="text" value={form.lastname} onChange={set('lastname')} placeholder="Khalil" required minLength={2}/>
            </div>
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required/>
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={form.password} onChange={set('password')} placeholder="Min. 8 chars, 1 uppercase, 1 number" required minLength={8}/>
            <div className="field-hint">At least 8 characters, one uppercase letter, one number</div>
          </div>
          <button type="submit" className="btn-submit" disabled={busy}>
            {busy ? <span className="btn-spinner"/> : null}
            {busy ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
