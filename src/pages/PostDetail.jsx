import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { postsAPI, commentsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import AIBox from '../components/AIBox'
import CommentThread from '../components/CommentThread'
import Spinner from '../components/Spinner'

function timeAgo(d) {
  const s = (Date.now() - new Date(d)) / 1000
  if (s < 60)    return 'just now'
  if (s < 3600)  return `${Math.floor(s/60)}m ago`
  if (s < 86400) return `${Math.floor(s/3600)}h ago`
  return new Date(d).toLocaleDateString()
}
function initials(u) {
  if (!u) return '?'
  return `${(u.name||'')[0]}${(u.lastname||'')[0]}`.toUpperCase()
}
const LANG_HUE = { javascript:'#f0db4f',typescript:'#3178c6',python:'#3572A5',rust:'#dea584',go:'#00acd7',java:'#b07219',cpp:'#f34b7d',ruby:'#701516',php:'#4F5D95',html:'#e34c26',css:'#563d7c' }

export default function PostDetail() {
  const { id }   = useParams()
  const { user } = useAuth()

  const [post,     setPost]     = useState(null)
  const [comments, setComments] = useState([])
  const [liked,    setLiked]    = useState(false)
  const [likes,    setLikes]    = useState(0)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [newC,     setNewC]     = useState('')
  const [posting,  setPosting]  = useState(false)
  const [copied,   setCopied]   = useState(false)

  useEffect(() => {
    postsAPI.getPost(id)
      .then(d => {
        setPost(d.post)
        setComments(d.comments || [])
        setLikes(d.post.likes?.length || 0)
        setLiked(d.post.likes?.some(l => (l._id||l) === user?.id))
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleLike = async () => {
    if (!user) return
    try {
      const d = await postsAPI.like(post._id)
      setLiked(d.liked); setLikes(d.likes)
    } catch {}
  }

  const handleReply = (c) => {
    setComments(prev => [...prev, c])
    setPost(p => ({ ...p, comment_count: (p.comment_count||0)+1 }))
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!newC.trim() || posting) return
    setPosting(true)
    try {
      const d = await commentsAPI.add(post._id, { content: newC.trim() })
      setComments(prev => [...prev, d.comment])
      setPost(p => ({ ...p, comment_count: (p.comment_count||0)+1 }))
      setNewC('')
    } catch (err) { alert(err.message) }
    setPosting(false)
  }

  const copyCode = () => {
    navigator.clipboard?.writeText(post.code)
    setCopied(true); setTimeout(() => setCopied(false), 1800)
  }

  if (loading) return <div className="detail-loading"><Spinner size={32} full/></div>
  if (error)   return (
    <div className="page-wrap">
      <div className="alert-error">{error}</div>
      <Link to="/" className="back-link">← Back to feed</Link>
    </div>
  )
  if (!post) return null

  const author    = post.user_id
  const langColor = LANG_HUE[(post.language||'').toLowerCase()] || 'var(--v)'
  const aiComment = comments.find(c => c.is_ai)
  const userCmts  = comments.filter(c => !c.is_ai)

  return (
    <div className="detail-page">
      <div className="detail-wrap fade-in">
        <Link to="/" className="back-link">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to feed
        </Link>

        <article className="detail-card">
          {/* Author */}
          <div className="pc-header">
            <div className="pc-avatar">{initials(author)}</div>
            <div className="pc-meta">
              {author
                ? <Link to={`/profile/${author._id||author.id}`} className="pc-author">{author.name} {author.lastname}</Link>
                : <span className="pc-author">Unknown</span>
              }
              <span className="pc-time">{timeAgo(post.created_at)}</span>
            </div>
            {post.language && post.language !== 'plaintext' && (
              <span className="lang-tag" style={{ borderColor: langColor, color: langColor }}>
                {post.language}
              </span>
            )}
          </div>

          {post.title && <h1 className="detail-title">{post.title}</h1>}
          {post.description && <p className="detail-desc">{post.description}</p>}

          {/* Code */}
          <div className="code-frame">
            <div className="code-bar">
              <span className="code-dots"><i/><i/><i/></span>
              <span className="code-file">{post.language || 'code'}</span>
              <button className="copy-btn" onClick={copyCode}>
                {copied
                  ? <><svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-6" stroke="#4caf50" strokeWidth="1.8" strokeLinecap="round"/></svg> Copied!</>
                  : <><svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M3 11V3h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg> Copy</>
                }
              </button>
            </div>
            <pre className="code-body"><code>{post.code}</code></pre>
          </div>

          {/* Actions */}
          <div className="pc-actions">
            <button className={`act-btn ${liked?'liked':''}`} onClick={handleLike} disabled={!user}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 13s-5.5-3-5.5-7A3.5 3.5 0 0 1 8 4.2 3.5 3.5 0 0 1 13.5 6c0 4-5.5 7-5.5 7z"
                  fill={liked?'#c8a2ff':'none'} stroke={liked?'#c8a2ff':'currentColor'} strokeWidth="1.3"/>
              </svg>
              {likes > 0 ? likes : ''} {likes === 1 ? 'Like' : likes > 1 ? 'Likes' : 'Like'}
            </button>
            <span className="act-btn" style={{ cursor:'default', opacity:.7 }}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M2 3h12v7H9l-4 3V10H2V3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
              </svg>
              {post.comment_count || comments.length} Comments
            </span>
          </div>

          {/* AI box */}
          {aiComment && (
            <AIBox comment={aiComment} postId={post._id} onReply={handleReply}/>
          )}
          {!aiComment && (
            <div className="ai-pending">
              <div className="ai-pending-dot"/>
              AI is analysing your code — check back in a moment
            </div>
          )}

          {/* Comments */}
          <div className="comments-panel">
            <div className="comments-heading">
              {userCmts.length} {userCmts.length === 1 ? 'Comment' : 'Comments'}
            </div>
            <CommentThread comments={userCmts} postId={post._id} onReply={handleReply}/>
          </div>

          {/* New comment */}
          {user ? (
            <form className="new-comment-form" onSubmit={handleComment}>
              <div className="nc-avatar">{initials(user)}</div>
              <input
                className="nc-input"
                value={newC}
                onChange={e => setNewC(e.target.value)}
                placeholder="Add a comment…"
                maxLength={2000}
              />
              <button className="nc-send" type="submit" disabled={posting || !newC.trim()}>
                {posting
                  ? <Spinner size={14}/>
                  : <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M13 8L3 3l2 5-2 5 10-5z" fill="white"/></svg>
                }
              </button>
            </form>
          ) : (
            <div className="login-to-comment">
              <Link to="/login">Sign in</Link> to join the discussion
            </div>
          )}
        </article>
      </div>
    </div>
  )
}
