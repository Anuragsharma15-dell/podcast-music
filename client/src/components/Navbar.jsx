import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const WaveIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <rect width="28" height="28" rx="8" fill="url(#grad)" />
    <defs>
      <linearGradient id="grad" x1="0" y1="0" x2="28" y2="28">
        <stop offset="0%" stopColor="#7c3aed" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
    </defs>
    {[4, 8, 12, 16, 20, 24].map((x, i) => (
      <rect
        key={i}
        x={x - 1}
        y={14 - [6, 10, 8, 12, 7, 5][i] / 2}
        width="2"
        height={[6, 10, 8, 12, 7, 5][i]}
        rx="1"
        fill="white"
        opacity={0.7 + i * 0.05}
      />
    ))}
  </svg>
)

export default function Navbar() {
  const location = useLocation()

  const links = [
    { href: '/', label: 'Home' },
    { href: '/create', label: 'Create' },
    { href: '/library', label: 'Library' },
  ]

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="glass-card flex items-center justify-between px-6 py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div whileHover={{ rotate: 5, scale: 1.05 }} transition={{ type: 'spring', stiffness: 400 }}>
              <WaveIcon />
            </motion.div>
            <span className="font-display font-bold text-lg text-white tracking-tight">
              Podcast<span className="gradient-text">Forge</span>
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {links.map(({ href, label }) => {
              const active = location.pathname === href || (href !== '/' && location.pathname.startsWith(href))
              return (
                <Link key={href} to={href}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`relative px-4 py-2 rounded-lg font-display text-sm font-medium transition-all duration-200 ${
                      active ? 'text-white' : 'text-forge-muted hover:text-forge-text'
                    }`}
                  >
                    {active && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-900/40 to-pink-900/30 border border-purple-700/30"
                      />
                    )}
                    <span className="relative z-10">{label}</span>
                  </motion.div>
                </Link>
              )
            })}
          </div>

          {/* CTA */}
          <Link to="/create">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary text-sm py-2 px-5"
            >
              <span>Start Creating</span>
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.nav>
  )
}
