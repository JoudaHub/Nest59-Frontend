import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { postsAPI } from '../services/api'

const LANGS = ['javascript','typescript','python','java','c','cpp','csharp','go','rust','php','ruby','swift','kotlin','html','css','sql','bash','json','yaml','plaintext']

export default function CreatePost() {
  const navigate = useNavigate()
  const [form,  setForm]  = useState({ title:'', description:'', code:'', language:'javascript' })
  const [error, setError] = useState('')
  const [busy,  setBusy]  = useState(false)

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.code.trim()) { setError('Code snippet is required.'); return }
    setError(''); setBusy(true)
    try {
      const d = await postsAPI.create(form)
      navigate(`/posts/${d.post._id}`)
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <div className="cp-page">
      <div className="cp-wrap fade-in">
        <div className="cp-header">
          <div className="cp-icon">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect width="22" height="22" rx="6" fill="#c8a2ff" opacity=".2"/>
              <path d="M6 8l5 3.5-5 3.5M13 15h4" stroke="#9b6de0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1>Create a post</h1>
            <p>Share your code and get an instant AI analysis</p>
          </div>
        </div>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="cp-form">
          <div className="cp-card">
            <div className="field">
              <label>Title <span className="opt">— optional but recommended</span></label>
              <input
                type="text"
                value={form.title}
                onChange={set('title')}
                placeholder="e.g. Array filter returns empty inside async…"
                maxLength={150}
              />
            </div>

            <div className="field">
              <label>Describe the problem <span className="opt">— optional</span></label>
              <textarea
                value={form.description}
                onChange={set('description')}
                placeholder="What did you expect? What happened? Any error messages?"
                rows={3}
                maxLength={2000}
              />
            </div>
          </div>

          <div className="cp-card">
            <div className="cp-code-head">
              <label>Code snippet <span className="req">*</span></label>
              <select value={form.language} onChange={set('language')} className="lang-picker">
                {LANGS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="code-editor">
              <div className="code-editor-bar">
                <span className="code-dots"><i/><i/><i/></span>
                <span className="code-file-name">{form.language}</span>
              </div>
              <textarea
                value={form.code}
                onChange={set('code')}
                placeholder={`// Paste your ${form.language} code here…`}
                className="code-ta"
                rows={14}
                spellCheck={false}
                required
              />
            </div>
          </div>

          <div className="ai-hint">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M8 1l1.8 3.6L14 5.5l-3 2.9.7 4.1L8 10.5l-3.7 2 .7-4.1L2 5.5l4.2-.9L8 1z" fill="#c8a2ff"/>
            </svg>
            After posting, AI will automatically analyse your code and leave a suggestion.
          </div>

          <div className="cp-actions">
            <button type="button" className="btn-ghost" onClick={() => navigate('/')}>Cancel</button>
            <button type="submit" className="btn-v" disabled={busy}>
              {busy ? (
                <><span className="btn-spinner"/> Submitting…</>
              ) : (
                <><svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M8 2v12M2 8h12" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg> Submit Post</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
