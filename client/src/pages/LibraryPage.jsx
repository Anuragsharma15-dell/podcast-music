import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getAllMusic, deleteMusic } from '../services/api.js'

const toneColors = {
  tech: 'from-cyan-600 to-purple-600',
  health: 'from-emerald-600 to-cyan-600',
  business: 'from-blue-600 to-purple-600',
  calm: 'from-teal-500 to-blue-600',
  upbeat: 'from-yellow-500 to-orange-600',
  dramatic: 'from-red-600 to-purple-700',
  neutral: 'from-purple-600 to-pink-600',
}

const toneEmoji = {
  tech: '💻', health: '💚', business: '📊',
  calm: '🌊', upbeat: '⚡', dramatic: '🎭', neutral: '🎙️',
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export default function LibraryPage() {
  const [podcasts, setPodcasts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getAllMusic()
      .then(setPodcasts)
      .catch(() => setError('Failed to load library'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id, e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await deleteMusic(id)
      setPodcasts((prev) => prev.filter((p) => p._id !== id))
    } catch {
      // silent fail
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
      className="relative min-h-screen pt-32 pb-16 px-6"
    >
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-display font-extrabold text-3xl text-white">
              Your <span className="gradient-text">Library</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {podcasts.length} podcast{podcasts.length !== 1 ? 's' : ''} generated
            </p>
          </div>
          <Link to="/create">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary text-sm py-2.5 px-5"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Podcast
              </span>
            </motion.button>
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent"
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="glass-card p-6 border border-red-700/30 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && podcasts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🎙️</div>
            <h2 className="font-display font-bold text-2xl text-white mb-3">No podcasts yet</h2>
            <p className="text-slate-400 mb-8">Create your first podcast episode to get started.</p>
            <Link to="/create">
              <button className="btn-primary py-3 px-8 text-sm">
                <span>Create Your First Podcast</span>
              </button>
            </Link>
          </div>
        )}

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AnimatePresence>
            {podcasts.map((podcast, i) => (
              <motion.div
                key={podcast._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/studio/${podcast._id}`}>
                  <motion.div
                    whileHover={{ y: -3 }}
                    className="glass-card glass-card-hover p-5 cursor-pointer group"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${toneColors[podcast.tone] || toneColors.neutral} flex items-center justify-center text-xl flex-shrink-0`}>
                        {toneEmoji[podcast.tone] || '🎙️'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-semibold text-white text-sm leading-tight truncate group-hover:text-purple-300 transition-colors">
                          {podcast.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                            podcast.status === 'completed'
                              ? 'bg-emerald-900/40 text-emerald-400'
                              : podcast.status === 'failed'
                              ? 'bg-red-900/40 text-red-400'
                              : 'bg-purple-900/40 text-purple-400'
                          }`}>
                            {podcast.status}
                          </span>
                          <span className="text-xs text-forge-muted capitalize">{podcast.tone}</span>
                          <span className="text-xs text-forge-muted">{formatDate(podcast.createdAt)}</span>
                        </div>
                      </div>

                      {/* Delete button */}
                      <button
                        onClick={(e) => handleDelete(podcast._id, e)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-900/30 text-forge-muted hover:text-red-400"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    {/* Progress bar decoration for completed */}
                    {podcast.status === 'completed' && (
                      <div className="mt-4 flex items-center gap-2">
                        <div className="flex-1 h-1 rounded-full bg-forge-border overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${toneColors[podcast.tone] || toneColors.neutral}`}
                            style={{ width: '65%' }}
                          />
                        </div>
                        <svg className="w-4 h-4 text-forge-muted group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </motion.div>
  )
}