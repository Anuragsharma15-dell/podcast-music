import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import AudioPlayer from '../components/AudioPlayer.jsx'
import { getMusicStatus } from '../services/api.js'

const toneEmoji = {
  tech: '💻', health: '💚', business: '📊',
  calm: '🌊', upbeat: '⚡', dramatic: '🎭', neutral: '🎙️',
}

export default function StudioPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [podcast, setPodcast] = useState(null)
  const [loading, setLoading] = useState(true)
  const [polling, setPolling] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let interval = null

    const fetchStatus = async () => {
      try {
        const data = await getMusicStatus(id)
        setPodcast(data)
        setLoading(false)

        if (data.status === 'generating') {
          // Start polling every 5 seconds
          if (!interval) {
            setPolling(true)
            interval = setInterval(async () => {
              try {
                const updated = await getMusicStatus(id)
                setPodcast(updated)
                if (updated.status !== 'generating') {
                  clearInterval(interval)
                  interval = null
                  setPolling(false)
                }
              } catch (e) {
                console.error('Poll error:', e)
              }
            }, 5000)
          }
        }
      } catch (e) {
        setError('Could not load podcast')
        setLoading(false)
      }
    }

    fetchStatus()

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen pt-40 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 rounded-full border-2 border-purple-500 border-t-transparent"
        />
      </div>
    )
  }

  if (error || !podcast) {
    return (
      <div className="min-h-screen pt-40 flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error || 'Podcast not found'}</p>
          <Link to="/create" className="btn-primary py-2 px-6 text-sm">
            <span>Create New</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.4 }}
      className="relative min-h-screen pt-32 pb-16 px-6"
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/create"
            className="flex items-center gap-2 text-forge-muted hover:text-white transition-colors text-sm font-display"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          <span className={`text-xs font-mono px-3 py-1 rounded-full ${
            podcast.status === 'completed'
              ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-700/40'
              : podcast.status === 'failed'
              ? 'bg-red-900/40 text-red-400 border border-red-700/40'
              : 'bg-purple-900/40 text-purple-400 border border-purple-700/40'
          }`}>
            {podcast.status === 'generating' && <span className="mr-1.5">⏳</span>}
            {podcast.status === 'completed' && <span className="mr-1.5">✅</span>}
            {podcast.status === 'failed' && <span className="mr-1.5">❌</span>}
            {podcast.status}
          </span>
        </div>

        {/* Podcast info card */}
        <div className="glass-card p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-2xl flex-shrink-0">
              {toneEmoji[podcast.tone] || '🎙️'}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="font-display font-bold text-xl text-white leading-tight truncate">
                {podcast.title}
              </h1>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <span className="text-xs text-forge-muted font-mono capitalize">{podcast.tone} tone</span>
                <span className="w-1 h-1 rounded-full bg-forge-muted" />
                <span className="text-xs text-forge-muted font-mono capitalize">
                  {podcast.voice?.replace('_', ' ')}
                </span>
                {podcast.duration && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-forge-muted" />
                    <span className="text-xs text-forge-muted font-mono">
                      {Math.floor(podcast.duration / 60)}:{String(Math.floor(podcast.duration % 60)).padStart(2, '0')}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Generating state */}
        {podcast.status === 'generating' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-8 text-center border border-purple-700/30"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent"
              />
              <span className="font-display font-medium text-white">Generating your music...</span>
            </div>
            <p className="text-sm text-forge-muted">
              {polling ? 'Checking status every 5 seconds...' : 'Starting up...'}
            </p>
          </motion.div>
        )}

        {/* ✅ Real Audio Player — only shown when completed + audioUrl exists */}
        {podcast.status === 'completed' && podcast.audioUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AudioPlayer
              src={podcast.audioUrl}
              title={podcast.title}
              tone={podcast.tone}
            />
          </motion.div>
        )}

        {/* Completed but no audioUrl — edge case */}
        {podcast.status === 'completed' && !podcast.audioUrl && (
          <div className="glass-card p-6 border border-amber-700/30 bg-amber-900/10 text-center">
            <p className="text-amber-400 text-sm">
              ⚠️ Generation completed but audio URL was not returned. Please try generating again.
            </p>
          </div>
        )}

        {/* Failed state */}
        {podcast.status === 'failed' && (
          <div className="glass-card p-6 border border-red-700/30 bg-red-900/10 text-center">
            <p className="text-red-400 mb-4">
              Generation failed. The Wubble API may have encountered an issue.
            </p>
            <button
              onClick={() => navigate('/create')}
              className="btn-primary py-2 px-6 text-sm"
            >
              <span>Try Again</span>
            </button>
          </div>
        )}

        {/* Action buttons — only when completed */}
        {podcast.status === 'completed' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex gap-3"
          >
            <Link to="/create" className="flex-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-primary py-3 text-sm"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Another
                </span>
              </motion.button>
            </Link>

            <Link to="/library">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-ghost py-3 px-5 text-sm"
              >
                Library
              </motion.button>
            </Link>

            {podcast.audioUrl && (
              <a href={podcast.audioUrl} download target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-ghost py-3 px-5 text-sm"
                  title="Download MP3"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </motion.button>
              </a>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}