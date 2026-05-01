import { useState } from 'react'
import { Link } from 'react-router-dom'
import { postsAPI, commentsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import AIBox from './AIBox'
import CommentThread from './CommentThread'
import Spinner from './Spinner'

const LANG_HUE = { javascript:'#f0db4f', typescript:'#3178c6', python:'#3572A5', rust:'#dea584', go:'#00acd7', java:'#b07219', cpp:'#f34b7d', ruby:'#701516', php:'#4F5D95', html:'#e34c26', css:'#563d7c' }

function timeAgo(d) {
  const s = (Date.now() - new Date(d)) / 1000
  if (s < 60)    return 'just now'
  if (s < 3600)  return `${Math.floor(s/60)}m ago`
  if (s < 86400) return `${Math.floor(s/3600)}h ago`
  return `${Math.floor(s/86400)}d ago`
}

function initials(u) {
  if (!u) return '?'
  return `${(u.name||'')[0]}${(u.lastname||'')[0]}`.toUpperCase()
}

export default function PostCard({ post: init, defaultOpen = false }) {
  const { user }   = useAuth()
  const [post, setPost]   = useState(init)
  const [liked, setLiked] = useState(() =>
    init.likes?.some(id => (id._id || id) === user?.id)
  )
  const [likeCount, setLikeCount] = useState(init.likes?.length || 0)
  const [comments,  setComments]  = useState([])
  const [expanded,  setExpanded]  = useState(defaultOpen)
  const [loadingC,  setLoadingC]  = useState(false)
  const [newComment, setNew]      = useState('')
  const [posting,   setPosting]   = useState(false)
  const [loadedOnce, setLoadedOnce] = useState(false)
  const [deleting,  setDeleting]  = useState(false)

  const author    = post.user_id
  const langColor = LANG_HUE[(post.language||'').toLowerCase()] || 'var(--v)'

  const toggleComments = async () => {
    if (!expanded && !loadedOnce) {
      setLoadingC(true)
      try {
        const d = await postsAPI.getPost(post._id)
        setComments(d.comments || [])
        setLoadedOnce(true)
      } catch {}
      setLoadingC(false)
    }
    setExpanded(e => !e)
  }

  const handleLike = async () => {
    if (!user) return
    try {
      const d = await postsAPI.like(post._id)
      setLiked(d.liked)
      setLikeCount(d.likes)
    } catch {}
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || posting) return
    setPosting(true)
    try {
      const d = await commentsAPI.add(post._id, { content: newComment.trim() })
      setComments(c => [...c, d.comment])
      setPost(p => ({ ...p, comment_count: (p.comment_count||0)+1 }))
      setNew('')
    } catch (err) { alert(err.message) }
    setPosting(false)
  }

  const handleReply = (reply) => {
    setComments(c => [...c, reply])
    setPost(p => ({ ...p, comment_count: (p.comment_count||0)+1 }))
  }

  const handleDelete = async () => {
    if (!confirm('Delete this post?')) return
    setDeleting(true)
    try {
      await postsAPI.delete(post._id)
      setPost(null)
    } catch (err) { alert(err.message); setDeleting(false) }
  }

  if (!post) return null

  const aiComment    = comments.find(c => c.is_ai)
  const userComments = comments.filter(c => !c.is_ai)

  return (
    <article className="post-card fade-in">
      {/* Header */}
      <div className="pc-header">
        <div className="pc-avatar">{initials(author)}</div>
        <div className="pc-meta">
          {author
            ? <Link to={`/profile/${author._id || author.id}`} className="pc-author">{author.name} {author.lastname}</Link>
            : <span className="pc-author">Unknown</span>
          }
          <span className="pc-time">{timeAgo(post.created_at)}</span>
        </div>
        <div className="pc-right">
          {post.language && post.language !== 'plaintext' && (
            <span className="lang-tag" style={{ borderColor: langColor, color: langColor }}>
              {post.language}
            </span>
          )}
          {user?.id === (author?._id || author?.id) && (
            <button className="icon-btn danger-btn" onClick={handleDelete} disabled={deleting} title="Delete post">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 4h10M5 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1M6 7v5M10 7v5M4 4l1 9h6l1-9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Title & description */}
      {post.title && (
        <Link to={`/posts/${post._id}`} className="pc-title">{post.title}</Link>
      )}
      {post.description && <p className="pc-desc">{post.description}</p>}

      {/* Code block */}
      <div className="code-frame">
        <div className="code-bar">
          <span className="code-dots"><i/><i/><i/></span>
          <span className="code-file">{post.language || 'code'}</span>
          <button className="copy-btn" onClick={() => navigator.clipboard?.writeText(post.code)} title="Copy">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M3 11V3h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            Copy
          </button>
        </div>
        <pre className="code-body"><code>{post.code}</code></pre>
      </div>

      {/* Action bar */}
      <div className="pc-actions">
        <button className={`act-btn ${liked ? 'liked' : ''}`} onClick={handleLike} disabled={!user}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M8 13s-5.5-3-5.5-7A3.5 3.5 0 0 1 8 4.2 3.5 3.5 0 0 1 13.5 6c0 4-5.5 7-5.5 7z"
              fill={liked ? '#c8a2ff' : 'none'} stroke={liked ? '#c8a2ff' : 'currentColor'} strokeWidth="1.3"/>
          </svg>
          {likeCount > 0 ? likeCount : 'Like'}
        </button>

        <button className={`act-btn ${expanded ? 'active' : ''}`} onClick={toggleComments}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M2 3h12v7H9l-4 3V10H2V3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
          </svg>
          {loadingC ? '…' : `${post.comment_count || 0} Comments`}
        </button>

        <Link to={`/posts/${post._id}`} className="act-btn">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M8 2.5A5.5 5.5 0 1 0 13.5 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            <path d="M10 1l3 2-3 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          View
        </Link>
      </div>

      {/* Comments panel */}
      {expanded && (
        <div className="comments-panel slide-down">
          {loadingC
            ? <div className="comment-loading"><Spinner size={20}/><span>Loading comments…</span></div>
            : null
          }

          {!loadingC && loadedOnce && !aiComment && (
            <div className="ai-pending">
              <div className="ai-pending-dot" />
              AI is analysing this code…
            </div>
          )}

          {aiComment && (
            <AIBox
              comment={aiComment}
              postId={post._id}
              onReply={handleReply}
            />
          )}

          <CommentThread
            comments={userComments}
            postId={post._id}
            onReply={handleReply}
          />

          {user && (
            <form className="new-comment-form" onSubmit={handleComment}>
              <div className="nc-avatar">{initials(user)}</div>
              <input
                className="nc-input"
                value={newComment}
                onChange={e => setNew(e.target.value)}
                placeholder="Add a comment…"
                maxLength={2000}
              />
              <button className="nc-send" type="submit" disabled={posting || !newComment.trim()}>
                {posting
                  ? <Spinner size={14}/>
                  : <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13 8L3 3l2 5-2 5 10-5z" fill="white"/></svg>
                }
              </button>
            </form>
          )}
        </div>
      )}
    </article>
  )
}
