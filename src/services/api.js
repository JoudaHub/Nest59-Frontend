const BASE = '/api'

const token = () => localStorage.getItem('cs_token')

const h = (extra = {}) => ({
  'Content-Type': 'application/json',
  ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
  ...extra,
})

const handle = async (res) => {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || `Error ${res.status}`)
  return data
}

// ── Auth ─────────────────────────────────────────────────────────────
export const authAPI = {
  register: (body)  => fetch(`${BASE}/auth/register`, { method:'POST', headers:h(), body:JSON.stringify(body) }).then(handle),
  login:    (body)  => fetch(`${BASE}/auth/login`,    { method:'POST', headers:h(), body:JSON.stringify(body) }).then(handle),
  me:       ()      => fetch(`${BASE}/auth/me`,        { headers:h() }).then(handle),
}

// ── Posts ─────────────────────────────────────────────────────────────
export const postsAPI = {
  getFeed:      (page = 1) => fetch(`${BASE}/posts?page=${page}&limit=8`, { headers:h() }).then(handle),
  getPost:      (id)       => fetch(`${BASE}/posts/${id}`,                 { headers:h() }).then(handle),
  getUserPosts: (uid)      => fetch(`${BASE}/posts/user/${uid}`,           { headers:h() }).then(handle),
  create:       (body)     => fetch(`${BASE}/posts`, { method:'POST', headers:h(), body:JSON.stringify(body) }).then(handle),
  like:         (id)       => fetch(`${BASE}/posts/${id}/like`, { method:'POST', headers:h() }).then(handle),
  delete:       (id)       => fetch(`${BASE}/posts/${id}`,      { method:'DELETE', headers:h() }).then(handle),
}

// ── Comments ──────────────────────────────────────────────────────────
export const commentsAPI = {
  add:    (postId, body) => fetch(`${BASE}/posts/${postId}/comments`, { method:'POST', headers:h(), body:JSON.stringify(body) }).then(handle),
  like:   (id)           => fetch(`${BASE}/comments/${id}/like`,      { method:'POST', headers:h() }).then(handle),
  delete: (id)           => fetch(`${BASE}/comments/${id}`,           { method:'DELETE', headers:h() }).then(handle),
}
