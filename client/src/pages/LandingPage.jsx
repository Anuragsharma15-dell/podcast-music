import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { WaveformBars } from '../components/Waveform.jsx'
import Antigravity from "../pages/Antigravity.jsx"

const features = [
  {
    icon: '🎙️',
    title: 'AI Narration',
    desc: 'Studio-quality voice generation from any text or article',
    color: 'from-indigo-900/40 to-indigo-800/20',
    border: 'border-indigo-700/30',
  },
  {
    icon: '🎵',
    title: 'Tone-Aware Music',
    desc: "Background music auto-matched to your content's mood",
    color: 'from-sky-900/40 to-sky-800/20',
    border: 'border-sky-700/30',
  },
  {
    icon: '🔊',
    title: 'Sound Design',
    desc: 'Professional intro, outro and transition effects',
    color: 'from-teal-900/40 to-teal-800/20',
    border: 'border-teal-700/30',
  },
  {
    icon: '📦',
    title: 'Instant Export',
    desc: 'Download ready-to-publish MP3 files instantly',
    color: 'from-emerald-900/40 to-emerald-800/20',
    border: 'border-emerald-700/30',
  },
]

const tones = ['tech', 'health', 'business', 'calm', 'dramatic', 'upbeat']

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#080c14]">

      {/* ── Antigravity full-screen background ── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <Antigravity
          count={300}
          magnetRadius={6}
          ringRadius={7}
          waveSpeed={0.4}
          waveAmplitude={1}
          particleSize={1.5}
          lerpSpeed={0.05}
          color="#5eead4"
          autoAnimate
          particleVariance={1}
          rotationSpeed={0}
          depthFactor={1}
          pulseSpeed={3}
          particleShape="capsule"
          fieldStrength={10}
        />
      </div>

      {/* ── All page content sits above the canvas ── */}
      <div className="relative z-10">

        {/* Hero */}
        <section className="relative pt-40 pb-24 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-sky-700/40 bg-sky-900/20 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-sky-300 font-medium font-display">
                Powered by Wubble AI
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display font-extrabold text-5xl md:text-7xl leading-[1.05] text-white mb-6"
            >
              Turn Any Article
              <br />
              Into a{' '}
              <span className="bg-gradient-to-r from-sky-400 to-teal-400 bg-clip-text text-transparent">
                Studio Podcast
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Paste a URL or text, choose your vibe, and PodcastForge generates a complete
              podcast episode with narration, music, and sound effects — in under 60 seconds.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex items-center justify-center gap-4 flex-wrap mt-10"
            >
              <Link to="/create">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary text-base py-3.5 px-8 shadow-lg shadow-sky-900/40"
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Start Creating Free
                  </span>
                </motion.button>
              </Link>
              <Link to="/library">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-ghost text-base py-3.5 px-8"
                >
                  View Library
                </motion.button>
              </Link>
            </motion.div>

            {/* Hero image */}
            <motion.div className="flex items-center justify-center mt-20 z-10 relative">
              <motion.img
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1  }}
                src="/audio.png"
                height="500"
                width="500"
                alt="PodcastForge"
              />
            </motion.div>

            {/* Demo waveform */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="mt-16 mx-auto max-w-xl glass-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-display font-semibold text-white text-sm">
                    The Future of AI Technology
                  </p>
                  <p className="text-xs text-forge-muted font-mono mt-0.5">tech • 4:32</p>
                </div>
                <motion.div
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-600 to-teal-600 flex items-center justify-center cursor-pointer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </motion.div>
              </div>
              <WaveformBars count={28} playing={true} />
            </motion.div>
          </div>
        </section>

        {/* Tones */}
        <section className="px-6 pb-16">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-3 flex-wrap"
            >
              <span className="text-sm text-forge-muted font-display">Auto-detects tone:</span>
              {tones.map((tone) => (
                <span
                  key={tone}
                  className="px-3 py-1.5 rounded-full text-xs font-mono border border-forge-border text-slate-400 capitalize"
                >
                  {tone}
                </span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 pb-24">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-3">
                Everything you need to go{' '}
                <span className="bg-gradient-to-r from-sky-400 to-teal-400 bg-clip-text text-transparent">
                  live
                </span>
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto">
                From raw text to a broadcast-ready episode, fully automated.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {features.map((f) => (
                <motion.div
                  key={f.title}
                  variants={itemVariants}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className={`glass-card glass-card-hover p-6 bg-gradient-to-br ${f.color} border ${f.border}`}
                >
                  <div className="text-3xl mb-4">{f.icon}</div>
                  <h3 className="font-display font-semibold text-white text-lg mb-2">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 pb-24">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-12 text-center border border-sky-700/30 bg-gradient-to-br from-sky-900/20 to-teal-900/10"
            >
              <h2 className="font-display font-extrabold text-4xl text-white mb-4">
                Ready to forge your first podcast?
              </h2>
              <p className="text-slate-400 mb-8">No equipment. No studio. Just your ideas.</p>
              <Link to="/create">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary text-base py-4 px-10 shadow-xl shadow-sky-900/50"
                >
                  <span>Create Your Podcast →</span>
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </section>

      </div>
    </div>
  )
}