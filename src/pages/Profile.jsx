import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { postsAPI, authAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import PostCard from '../components/PostCard'
import Spinner  from '../components/Spinner'

function initials(u) {
  if (!u) return '?'
  return `${(u.name||'')[0]}${(u.lastname||'')[0]}`.toUpperCase()
}

export default function Profile() {
  const { id }         = useParams()
  const { user, logout } = useAuth()
  const navigate       = useNavigate()

  const [profile, setProfile] = useState(null)
  const [posts,   setPosts]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  const isOwnProfile = user?.id === id

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('cs_token')}` }
      }).then(r => r.json()),
      postsAPI.getUserPosts(id)
    ])
      .then(([ud, pd]) => {
        if (!ud.success) throw new Error(ud.message)
        setProfile(ud.user)
        setPosts(pd.posts || [])
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  if (loading) return <div style={{display:'flex',justifyContent:'center',padding:'4rem'}}><Spinner size={32}/></div>
  if (error)   return (
    <div className="page-wrap">
      <div className="alert-error">{error}</div>
      <Link to="/" className="back-link">← Back</Link>
    </div>
  )

  const joinDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString(undefined, { year:'numeric', month:'long' })
    : ''

  return (
    <div className="profile-page">
      <div className="profile-wrap fade-in">

        {/* Profile card */}
        <div className="profile-card">
          <div className="profile-avatar-lg">{initials(profile)}</div>
          <div className="profile-info">
            <h1 className="profile-name">{profile?.name} {profile?.lastname}</h1>
            <div className="profile-email">{profile?.email}</div>
            {joinDate && <div className="profile-joined">Member since {joinDate}</div>}
          </div>
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-n">{posts.length}</span>
              <span className="stat-l">Posts</span>
            </div>
            <div className="stat">
              <span className="stat-n">{posts.reduce((sum, p) => sum + (p.likes?.length || 0), 0)}</span>
              <span className="stat-l">Likes</span>
            </div>
            <div className="stat">
              <span className="stat-n">{posts.reduce((sum, p) => sum + (p.comment_count || 0), 0)}</span>
              <span className="stat-l">Comments</span>
            </div>
          </div>
          {isOwnProfile && (
            <div className="profile-actions">
              <Link to="/create" className="btn-v">New Post</Link>
              <button className="btn-ghost" onClick={handleLogout}>Sign out</button>
            </div>
          )}
        </div>

        {/* Posts */}
        <div className="profile-posts">
          <h2 className="profile-posts-heading">
            {isOwnProfile ? 'Your posts' : `${profile?.name}'s posts`}
            <span className="posts-count">{posts.length}</span>
          </h2>

          {posts.length === 0 ? (
            <div className="empty-feed">
              <p>{isOwnProfile ? "You haven't posted anything yet." : "No posts yet."}</p>
              {isOwnProfile && <Link to="/create" className="btn-v">Create first post</Link>}
            </div>
          ) : (
            <div className="posts-stack">
              {posts.map(p => <PostCard key={p._id} post={p}/>)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
