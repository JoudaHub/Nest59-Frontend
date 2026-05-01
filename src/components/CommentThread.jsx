import { useState } from 'react'
import { commentsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

function initials(u) {
  if (!u) return '?'
  return `${(u.name||'')[0]}${(u.lastname||'')[0]}`.toUpperCase()
}

function CommentItem({ comment, postId, onReply, depth = 0 }) {
  const { user } = useAuth()
  const [liked,  setLiked]  = useState(false)
  const [likes,  setLikes]  = useState(comment.likes?.length || 0)
  const [open,   setOpen]   = useState(false)
  const [reply,  setReply]  = useState('')
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

  const u = comment.user_id
  const name = u ? `${u.name} ${u.lastname}` : 'Unknown'
  const ts = new Date(comment.created_at).toLocaleString([], { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })

  return (
    <div className={`ci ${depth > 0 ? 'ci-reply' : ''}`}>
      <div className="ci-avatar">{initials(u)}</div>
      <div className="ci-body">
        <div className="ci-meta">
          <span className="ci-name">{name}</span>
          <span className="ci-time">{ts}</span>
        </div>
        <p className="ci-text">{comment.content}</p>
        <div className="ci-actions">
          <button className={`act-btn ${liked?'liked':''}`} onClick={handleLike} disabled={!user}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M8 13s-5.5-3-5.5-7A3.5 3.5 0 0 1 8 4.2 3.5 3.5 0 0 1 13.5 6c0 4-5.5 7-5.5 7z"
                fill={liked?'#c8a2ff':'none'} stroke={liked?'#c8a2ff':'currentColor'} strokeWidth="1.2"/>
            </svg>
            {likes > 0 && likes}
          </button>
          {depth === 0 && user && (
            <button className="act-btn" onClick={() => setOpen(o=>!o)}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M2 3h12v7H9l-4 3V10H2V3z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
              </svg>
              Reply
            </button>
          )}
        </div>
        {open && (
          <form className="inline-reply" onSubmit={handleReply}>
            <input
              className="nc-input"
              value={reply}
              onChange={e=>setReply(e.target.value)}
              placeholder={`Reply to ${u?.name || 'this comment'}…`}
            />
            <button type="submit" className="nc-send" disabled={busy||!reply.trim()}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><path d="M13 8L3 3l2 5-2 5 10-5z" fill="white"/></svg>
            </button>
            <button type="button" className="btn-ghost-sm" onClick={()=>setOpen(false)}>✕</button>
          </form>
        )}
      </div>
    </div>
  )
}

export default function CommentThread({ comments, postId, onReply }) {
  const top     = comments.filter(c => !c.parent_id)
  const replies = comments.filter(c => !!c.parent_id)
  const getReplies = id => replies.filter(r => (r.parent_id?._id || r.parent_id) === id)

  if (top.length === 0) return null

  return (
    <div className="comment-thread">
      {top.map(c => (
        <div key={c._id}>
          <CommentItem comment={c} postId={postId} onReply={onReply} depth={0}/>
          {getReplies(c._id).map(r => (
            <CommentItem key={r._id} comment={r} postId={postId} onReply={onReply} depth={1}/>
          ))}
        </div>
      ))}
    </div>
  )
}
