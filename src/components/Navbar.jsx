import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Floating dev icons component for dark mode ambient layer
function AmbientDevLayer({ dark }) {
  const techIcons = [
    { glyph: '</>', pos: 't-2 l-[8%]' },
    { glyph: '{ }', pos: 't-[55px] l-[18%]' },
    { glyph: '() =>', pos: 't-3 l-[28%]' },
    { glyph: '[]', pos: 't-[48px] l-[42%]' },
    { glyph: '← →', pos: 't-4 l-[55%]' },
    { glyph: '⚛︎', pos: 't-[52px] l-[68%]' },
    { glyph: 'TS', pos: 't-5 l-[78%]' },
    { glyph: '🐳', pos: 't-[58px] l-[88%]' },
    { glyph: '📦', pos: 't-8 l-[15%]' },
    { glyph: '▲', pos: 't-[45px] l-[35%]' },
    { glyph: '⎔', pos: 't-6 l-[62%]' },
    { glyph: '◆', pos: 't-[50px] l-[82%]' },
    { glyph: '∞', pos: 't-10 l-[48%]' },
    { glyph: '▶', pos: 't-[60px] l-[12%]' },
    { glyph: '⎚', pos: 't-7 l-[72%]' },
  ]

  if (!dark) return null

  return (
    <div className="ambient-dev-layer">
      {techIcons.map((item, i) => (
        <div
          key={i}
          className={`dev-icon dev-icon-${(i % 8) + 1} ${item.pos}`}
        >
          {item.glyph}
        </div>
      ))}
      <style>{`
        .ambient-dev-layer {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
        }
        .dev-icon {
          position: absolute;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          font-weight: 500;
          color: rgba(139, 92, 246, 0.08);
          white-space: nowrap;
          opacity: 0;
        }
        .dark .dev-icon {
          opacity: 1;
        }
        @keyframes float1 {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
          12% { opacity: 0.12; }
          88% { opacity: 0.12; }
          100% { transform: translate(35px, -45px) rotate(12deg); opacity: 0; }
        }
        @keyframes float2 {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.1; }
          90% { opacity: 0.1; }
          100% { transform: translate(-30px, -55px) rotate(-8deg); opacity: 0; }
        }
        @keyframes float3 {
          0% { transform: translate(0, 0) scale(1); opacity: 0; }
          15% { opacity: 0.08; }
          85% { opacity: 0.08; }
          100% { transform: translate(45px, -38px) scale(0.85); opacity: 0; }
        }
        @keyframes float4 {
          0% { transform: translate(0, 0); opacity: 0; }
          12% { opacity: 0.11; }
          88% { opacity: 0.11; }
          100% { transform: translate(-40px, -50px) rotate(10deg); opacity: 0; }
        }
        .dev-icon-1 { animation: float1 16s ease-in-out infinite; }
        .dev-icon-2 { animation: float2 20s ease-in-out infinite; animation-delay: -4s; }
        .dev-icon-3 { animation: float3 18s ease-in-out infinite; animation-delay: -8s; }
        .dev-icon-4 { animation: float4 22s ease-in-out infinite; animation-delay: -2s; }
        .dev-icon-5 { animation: float1 24s ease-in-out infinite; animation-delay: -12s; }
        .dev-icon-6 { animation: float2 17s ease-in-out infinite; animation-delay: -6s; }
        .dev-icon-7 { animation: float3 21s ease-in-out infinite; animation-delay: -10s; }
        .dev-icon-8 { animation: float4 19s ease-in-out infinite; animation-delay: -14s; }
      `}</style>
    </div>
  )
}

// Dark mode hook with localStorage and system preference
function useDarkMode() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('nest59-theme')
      if (stored === 'dark') return true
      if (stored === 'light') return false
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('nest59-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('nest59-theme', 'light')
    }
  }, [dark])

  return { dark, toggle: () => setDark(d => !d) }
}

// Logo component
function Logo() {
  return (
    <Link to="/" className="logo-link group">
      <div className="logo-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      </div>
      <span className="logo-text">
        Nest<span>59</span>
      </span>
    </Link>
  )
}

// Theme toggle button
function ThemeToggle({ dark, toggle }) {
  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="theme-toggle"
    >
      <svg className="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
      <svg className="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  )
}

// Navigation link pill
function NavPill({ to, end, children, Icon, onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={({ isActive }) => `nav-pill ${isActive ? 'active' : ''} ${hovered ? 'hovered' : ''}`}
      style={({ isActive }) => ({
        '--pill-active': isActive || hovered ? '1' : '0',
      })}
    >
      {Icon && <Icon />}
      <span>{children}</span>
    </NavLink>
  )
}

// Icons
const Icons = {
  Home: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
      <polyline points="9 21 9 13 15 13 15 21" />
    </svg>
  ),
  Saves: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  ),
  Users: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
}

// Hamburger menu button
function Hamburger({ open, onClick }) {
  return (
    <button
      className="hamburger-btn"
      onClick={onClick}
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
    >
      <span className={`ham-line ${open ? 'open-1' : ''}`} />
      <span className={`ham-line ${open ? 'open-2' : ''}`} />
      <span className={`ham-line ${open ? 'open-3' : ''}`} />
    </button>
  )
}

// Main Navbar component
export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { dark, toggle: toggleDark } = useDarkMode()

  const handleLogout = () => {
    logout()
    navigate('/')
    setMobileOpen(false)
  }

  const closeMenu = () => setMobileOpen(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <>
      <AmbientDevLayer dark={dark} />

      <style>{`
        /* Navbar styles */
        .navbar-root {
          position: sticky;
          top: 0;
          z-index: 100;
          width: 100%;
          background: #ffffff;
          transition: box-shadow 0.3s ease, border-color 0.3s ease;
          border-bottom: 1px solid rgba(203, 213, 225, 0.5);
        }
        .navbar-root.scrolled {
          box-shadow: 0 4px 24px -12px rgba(0, 0, 0, 0.12);
          border-bottom-color: rgba(203, 213, 225, 0.8);
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(12px);
        }
        .dark .navbar-root {
          background: #ffffff;
          border-bottom-color: rgba(203, 213, 225, 0.5);
        }

        .dark .navbar-root.scrolled {
         background: rgba(255, 255, 255, 0.96);
         border-bottom-color: rgba(203, 213, 225, 0.8);
         }

        .navbar-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 20px 0 12px;
          height: 68px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* Logo */
        .logo-link {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .logo-icon {
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 20px -6px rgba(139, 92, 246, 0.45);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .logo-link:hover .logo-icon {
          transform: scale(1.03);
          box-shadow: 0 8px 28px -8px rgba(139, 92, 246, 0.6);
        }
        .logo-icon svg {
          width: 40px;
          height: 20px;
          color: white;
        }
        .logo-text {
          font-family: 'Open Sans', sans-serif;
          font-size: 38px;
          font-weight: 700;
          letter-spacing: -0.3px;
          color: #0f172a;
        }
        .logo-text span {
          background: linear-gradient(135deg, #8B5CF6 0%, #D946EF 100%);
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
        }
        .dark .logo-text {
          color: #0f172a;
        }

        /* Navigation pills */
        .nav-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px;
          border-radius: 999px;
          font-family: 'Open Sans', sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s ease;
          border: 1.5px solid transparent;
          color: #060107;
        }
        .nav-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  border-radius: 999px;
  font-family: 'Open Sans', sans-serif;
  font-size: 13.5px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  border: 1.5px solid transparent;
  color: #475569;
}

/* Active */
.nav-pill.active {
  border-color: #22088b;
  color: #010711;
  background: transparent;
  transform: translateY(-1px);
}

/* Hover */
.nav-pill:not(.active):hover {
  border-color: #22088b;
  color: #010711;
  background: transparent;
  transform: translateY(-1px);
}

/* Dark mode = SAME colors */
.dark .nav-pill {
  color: #475569;
}

.dark .nav-pill.active {
  border-color: #22088b;
  color: #010711;
  background: transparent;
  transform: translateY(-1px);
}

.dark .nav-pill:not(.active):hover {
  border-color: #22088b;
  color: #010711;
  background: transparent;
  transform: translateY(-1px);
}

        /* Desktop nav wrapper */
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* Right cluster */
        .navbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .divider {
          width: 1px;
          height: 28px;
          background: #e2e8f0;
          margin: 0 4px;
        }
        .dark .divider {
          background: rgba(255, 255, 255, 0.1);
        }

        /* Theme toggle */
        .theme-toggle {
          position: relative;
          width: 42px;
          height: 42px;
          border-radius: 12px;
          border: 1.5px solid #e2e8f0;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.25s ease;
          flex-shrink: 0;
        }
        .theme-toggle:hover {
          border-color: #c4b5fd;
          background: #f5f3ff;
          transform: scale(1.02);
        }
        .dark .theme-toggle {
          border-color: rgba(255, 255, 255, 0.12);
        }
        .dark .theme-toggle:hover {
          border-color: #8B5CF6;
          background: rgba(139, 92, 246, 0.1);
        }
        .theme-toggle svg {
          width: 18px;
          height: 18px;
          position: absolute;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          color: #475569;
        }
        .dark .theme-toggle svg {
          color: #94a3b8;
        }
        .theme-toggle .sun-icon {
          opacity: 1;
          transform: rotate(0deg) scale(1);
        }
        .theme-toggle .moon-icon {
          opacity: 0;
          transform: rotate(90deg) scale(0.5);
        }
        .dark .theme-toggle .sun-icon {
          opacity: 0;
          transform: rotate(-90deg) scale(0.5);
        }
        .dark .theme-toggle .moon-icon {
          opacity: 1;
          transform: rotate(0deg) scale(1);
        }

        /* Sign in button */
        .signin-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 42px;
          padding: 0 20px;
          border-radius: 12px;
          background: #0f172a;
          font-family: 'Open Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: white;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .signin-btn:hover {
          background: #1e293b;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px -8px rgba(15, 23, 42, 0.4);
        }
        .dark .signin-btn {
          background: #8B5CF6;
        }
        .dark .signin-btn:hover {
          background: #7C3AED;
          box-shadow: 0 8px 24px -8px rgba(139, 92, 246, 0.5);
        }

        /* Hamburger */
        .hamburger-btn {
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 5px;
          width: 42px;
          height: 42px;
          background: transparent;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .hamburger-btn:hover {
          border-color: #c4b5fd;
          background: #f5f3ff;
        }
        .dark .hamburger-btn {
          border-color: rgba(255, 255, 255, 0.12);
        }
        .dark .hamburger-btn:hover {
          border-color: #8B5CF6;
          background: rgba(139, 92, 246, 0.1);
        }
        .ham-line {
          width: 20px;
          height: 2px;
          background: #475569;
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        .dark .ham-line {
          background: #94a3b8;
        }
        .ham-line.open-1 {
          transform: translateY(7px) rotate(45deg);
        }
        .ham-line.open-2 {
          opacity: 0;
          transform: scaleX(0);
        }
        .ham-line.open-3 {
          transform: translateY(-7px) rotate(-45deg);
        }

        /* Mobile menu */
        .mobile-menu {
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          background: #ffffff;
          border-top: 1px solid #f1f5f9;
          transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
        }
        .mobile-menu.open {
          max-height: 400px;
          opacity: 1;
        }
        .dark .mobile-menu {
          background: #ffffff;
          border-top-color: rgba(255, 255, 255, 0.06);
        }
        .mobile-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 16px 20px;
        }
        .mobile-pill {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 14px;
          font-family: 'Open Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          color: #475569;
          transition: all 0.2s ease;
        }
        .mobile-pill.active {
          background: #f5f3ff;
          color: #6d28d9;
        }
        .mobile-pill:not(.active):hover {
          background: #f8fafc;
          color: #1e293b;
        }
        .dark .mobile-pill {
          color: #94a3b8;
        }
        .dark .mobile-pill.active {
          background: rgba(139, 92, 246, 0.12);
          color: #a78bfa;
        }
        .dark .mobile-pill:not(.active):hover {
          background: rgba(255, 255, 255, 0.04);
          color: #e2e8f0;
        }
        .mobile-signin {
          margin-top: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 46px;
          border-radius: 14px;
          background: #0f172a;
          font-family: 'Open Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: white;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .dark .mobile-signin {
          background: #8B5CF6;
        }
        .mobile-logout {
          margin-top: 8px;
          background: transparent;
          border: 1.5px solid #ef4444;
          color: #ef4444;
        }
        .dark .mobile-logout {
          border-color: rgba(239, 68, 68, 0.5);
          color: #f87171;
        }
        .mobile-logout:hover {
          background: rgba(239, 68, 68, 0.08);
        }

        @media (max-width: 768px) {
          .desktop-nav { display: none; }
          .desktop-only { display: none; }
          .hamburger-btn { display: flex; }
          .navbar-inner { padding: 0 16px 0 12px; height: 64px; }
        }

        @media (min-width: 769px) {
          .mobile-menu { display: none; }
        }
      `}</style>

      <header className={`navbar-root ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">
          <Logo />

          <div className="desktop-nav">
            <NavPill to="end={to === '/'}" end Icon={Icons.Home}>Home</NavPill>
            <NavPill to="/saves" Icon={Icons.Saves}>Saves</NavPill>
            <NavPill to="/users" Icon={Icons.Users}>Users</NavPill>
          </div>

          <div className="navbar-right">
            <div className="divider desktop-only" />
            <ThemeToggle dark={dark} toggle={toggleDark} />

            {user ? (
              <button
                onClick={handleLogout}
                className="signin-btn"
                style={{ background: '#ef4444' }}
                onMouseEnter={e => e.currentTarget.style.background = '#dc2626'}
                onMouseLeave={e => e.currentTarget.style.background = '#ef4444'}
              >
                Sign out
              </button>
            ) : (
              <Link to="/login" className="signin-btn desktop-only">
                Sign in
              </Link>
            )}

            <Hamburger open={mobileOpen} onClick={() => setMobileOpen(o => !o)} />
          </div>
        </div>

        <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
          <div className="mobile-nav">
            <NavLink
              to="/"
              end
              onClick={closeMenu}
              className={({ isActive }) => `mobile-pill ${isActive ? 'active' : ''}`}
            >
              <Icons.Home /> Home
            </NavLink>
            <NavLink
              to="/saves"
              onClick={closeMenu}
              className={({ isActive }) => `mobile-pill ${isActive ? 'active' : ''}`}
            >
              <Icons.Saves /> Saves
            </NavLink>
            <NavLink
              to="/users"
              onClick={closeMenu}
              className={({ isActive }) => `mobile-pill ${isActive ? 'active' : ''}`}
            >
              <Icons.Users /> Users
            </NavLink>

            {user ? (
              <>
                <button onClick={handleLogout} className="mobile-signin mobile-logout">
                  Sign out
                </button>
              </>
            ) : (
              <Link to="/login" onClick={closeMenu} className="mobile-signin">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  )
}