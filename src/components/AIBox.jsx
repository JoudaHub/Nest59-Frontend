import { useState } from 'react'
import { commentsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

// Lightweight markdown renderer (bold, code, bullets, line breaks)
function renderMD(text) {
  if (!text) return ''
  return text
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code class="ic">$1</code>')
    .replace(/```[\w]*\n?([\s\S]*?)```/g, '<pre class="ai-code-block"><code>$1</code></pre>')
    .replace(/^[-*] (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')
}

export default function AIBox({ comment, postId, onReply }) {
  const { user } = useAuth()
  const [liked,  setLiked]  = useState(false)
  const [likes,  setLikes]  = useState(comment.likes?.length || 0)
  const [reply,  setReply]  = useState('')
  const [open,   setOpen]   = useState(false)
  const [busy,   setBusy]   = useState(false)

  const handleLike = async () => {
    if (!user) return
    try {
      const d = await commentsAPI.like(comment._id)
      setLiked(d.liked); setLikes(d.likes)
    } catch {}
  }

  const handleReply = async (e) => {
    e.preventDefault()
    if (!reply.trim() || busy) return
    setBusy(true)
    try {
      const d = await commentsAPI.add(postId, { content: reply.trim(), parent_id: comment._id })
      onReply?.(d.comment)
      setReply(''); setOpen(false)
    } catch (err) { alert(err.message) }
    setBusy(false)
  }

  return (
    <div className="ai-box">
      <div className="ai-shimmer" />
      <div className="ai-head">
        <div className="ai-badge">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M8 1l1.8 3.6L14 5.5l-3 2.9.7 4.1L8 10.5l-3.7 2 .7-4.1L2 5.5l4.2-.9L8 1z" fill="#c8a2ff"/>
          </svg>
          AI Suggestion
        </div>
        <span className="ai-gem">Gemini</span>
      </div>

      <div
        className="ai-body"
        dangerouslySetInnerHTML={{ __html: '<p>' + renderMD(comment.content) + '</p>' }}
      />

      <div className="ai-foot">
        <button className={`act-btn ${liked ? 'liked' : ''}`} onClick={handleLike} disabled={!user}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path d="M8 13s-5.5-3-5.5-7A3.5 3.5 0 0 1 8 4.2 3.5 3.5 0 0 1 13.5 6c0 4-5.5 7-5.5 7z"
              fill={liked?'#c8a2ff':'none'} stroke={liked?'#c8a2ff':'currentColor'} strokeWidth="1.2"/>
          </svg>
          {likes > 0 && likes}
        </button>
        {user && (
          <button className="act-btn" onClick={() => setOpen(o => !o)}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M2 3h12v7H9l-4 3V10H2V3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
            </svg>
            Reply to AI
          </button>
        )}
        <span className="ai-ts">
          {new Date(comment.created_at).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}
        </span>
      </div>

      {open && (
        <form className="ai-reply-form" onSubmit={handleReply}>
          <textarea
            className="ai-reply-ta"
            value={reply}
            onChange={e => setReply(e.target.value)}
            placeholder="Reply to the AI suggestion…"
            rows={2}
          />
          <div className="ai-reply-actions">
            <button type="button" className="btn-ghost-sm" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" className="btn-v-sm" disabled={busy || !reply.trim()}>
              {busy ? 'Posting…' : 'Reply'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
