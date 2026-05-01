import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar    from './components/Navbar'
import Feed      from './pages/Feed'
import Login     from './pages/Login'
import Register  from './pages/Register'
import CreatePost from './pages/CreatePost'
import PostDetail from './pages/PostDetail'
import Profile   from './pages/Profile'
import Spinner   from './components/Spinner'

const Protected = ({ children }) => {
  const { user, ready } = useAuth()
  if (!ready) return <Spinner full />
  return user ? children : <Navigate to="/login" replace />
}

const AppRoutes = () => {
  const { ready } = useAuth()
  if (!ready) return <Spinner full />
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/"           element={<Feed />} />
          <Route path="/login"      element={<Login />} />
          <Route path="/register"   element={<Register />} />
          <Route path="/posts/:id"  element={<PostDetail />} />
          <Route path="/profile/:id" element={<Protected><Profile /></Protected>} />
          <Route path="/create"     element={<Protected><CreatePost /></Protected>} />
          <Route path="*"           element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
