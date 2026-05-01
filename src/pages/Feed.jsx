import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { postsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import PostCard from '../components/PostCard'
import Spinner  from '../components/Spinner'

export default function Feed() {
  const { user } = useAuth()
  const [posts,  setPosts]  = useState([])
  const [page,   setPage]   = useState(1)
  const [hasMore,setMore]   = useState(false)
  const [loading,setLoading]= useState(true)
  const [loadingMore, setLM]= useState(false)
  const [error,  setError]  = useState('')

  const load = async (p, reset = false) => {
    p === 1 ? setLoading(true) : setLM(true)
    setError('')
    try {
      const d = await postsAPI.getFeed(p)
      setPosts(prev => reset ? d.posts : [...prev, ...d.posts])
      setMore(d.pagination.hasNext)
      setPage(p)
    } catch (err) { setError(err.message) }
    p === 1 ? setLoading(false) : setLM(false)
  }

  useEffect(() => { load(1, true) }, [])

  return (
    <div className="feed-page">
      <div className="feed-wrap">

        {/* Main column */}
        <div className="feed-col">
          <div className="feed-top">
            <h1 className="feed-heading">Latest Posts</h1>
            {user && (
              <Link to="/create" className="btn-v">
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <path d="M8 2v12M2 8h12" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                New Post
              </Link>
            )}
          </div>

          {error && <div className="alert-error">{error}</div>}

          {loading ? (
            <div className="feed-skeletons">
              {[1,2,3].map(i => <div key={i} className="skel-card"/>)}
            </div>
          ) : posts.length === 0 ? (
            <div className="empty-feed">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <rect x="4" y="4" width="48" height="48" rx="14" fill="#ede3ff"/>
                <path d="M18 24l10 7-10 7M34 38h10" stroke="#c8a2ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p>No posts yet. Be the first!</p>
              {user
                ? <Link to="/create" className="btn-v">Create post</Link>
                : <Link to="/register" className="btn-v">Join to post</Link>
              }
            </div>
          ) : (
            <div className="posts-stack">
              {posts.map(p => <PostCard key={p._id} post={p}/>)}
              {hasMore && (
                <button className="load-more" onClick={() => load(page+1)} disabled={loadingMore}>
                  {loadingMore ? <Spinner size={18}/> : 'Load more'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="feed-sidebar">
          {!user ? (
            <div className="side-card">
              <h3>Join CodeShare</h3>
              <p>Post code, get AI feedback instantly, and help others debug faster.</p>
              <div className="side-btns">
                <Link to="/register" className="btn-v">Register free</Link>
                <Link to="/login"    className="btn-outline-sm">Sign in</Link>
              </div>
            </div>
          ) : (
            <div className="side-card side-card-user">
              <div className="side-avatar">{(user.name||'')[0]}{(user.lastname||'')[0]}</div>
              <div>
                <div className="side-name">{user.name} {user.lastname}</div>
                <div className="side-email">{user.email}</div>
              </div>
              <Link to="/create" className="btn-v side-new">+ New Post</Link>
            </div>
          )}

          <div className="side-card">
            <h3>How it works</h3>
            <div className="how-steps">
              {['Post your broken code','AI analyses it instantly','Community adds tips','You ship the fix '].map((s,i) => (
                <div key={i} className="how-step">
                  <span className="step-num">{i+1}</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
