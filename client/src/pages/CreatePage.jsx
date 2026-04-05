import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { generatePodcast, pollUntilDone } from '../services/api.js'

const voices = [
  { id: 'deep_narrator', label: 'Deep Narrator', desc: 'Authoritative, broadcast-quality', emoji: '🎙️' },
  { id: 'friendly', label: 'Friendly Host', desc: 'Warm, conversational tone', emoji: '😊' },
  { id: 'professional', label: 'Professional', desc: 'Corporate, polished delivery', emoji: '💼' },
]

const tones = [
  { id: 'auto', label: 'Auto Detect', emoji: '🤖' },
  { id: 'tech', label: 'Tech', emoji: '💻' },
  { id: 'health', label: 'Health', emoji: '💚' },
  { id: 'business', label: 'Business', emoji: '📊' },
  { id: 'calm', label: 'Calm', emoji: '🌊' },
  { id: 'upbeat', label: 'Upbeat', emoji: '⚡' },
  { id: 'dramatic', label: 'Dramatic', emoji: '🎭' },
]

const generatingMessages = [
  'Extracting your content...',
  'Detecting tone and mood...',
  'Composing background music...',
  'Mixing the final track...',
  'Almost ready...',
]

export default function CreatePage() {
  const navigate = useNavigate()
  const [input, setInput] = useState('')
  const [selectedVoice, setSelectedVoice] = useState('deep_narrator')
  const [selectedTone, setSelectedTone] = useState('auto')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatingStep, setGeneratingStep] = useState(0)
  const [generatingMsg, setGeneratingMsg] = useState(generatingMessages[0])
  const [error, setError] = useState('')

  const isUrl = input.startsWith('http://') || input.startsWith('https://')
  const charCount = input.length
  const isValid = charCount >= 20 || isUrl

  const handleGenerate = async () => {
    if (!isValid || isGenerating) return
    setError('')
    setIsGenerating(true)
    setGeneratingStep(0)
    setGeneratingMsg(generatingMessages[0])

    try {
      // Step 1: Kick off generation
      const response = await generatePodcast({
        input,
        voice: selectedVoice,
        tone: selectedTone === 'auto' ? undefined : selectedTone,
      })

      // Step 2: Poll until done, updating message each attempt
      await pollUntilDone(response.id, (status, attempt) => {
        const step = Math.min(Math.floor(attempt / 4) + 1, generatingMessages.length - 1)
        setGeneratingStep(step)
        setGeneratingMsg(generatingMessages[step])
      })

      // Step 3: Navigate to studio
      navigate(`/studio/${response.id}`)
    } catch (err) {
      setError(err.message || 'Generation failed. Please try again.')
      setIsGenerating(false)
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
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-extrabold text-4xl text-white mb-3"
          >
            Create Your <span className="gradient-text">Podcast</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-slate-400"
          >
            Paste a URL or write your text. We handle the rest.
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="generating"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="glass-card p-12 text-center"
            >
              {/* Animated rings */}
              <div className="relative w-24 h-24 mx-auto mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-2 border-purple-500 border-t-transparent"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-2 rounded-full border-2 border-pink-500 border-b-transparent"
                />
                <div className="absolute inset-0 flex items-center justify-center text-3xl">
                  🎵
                </div>
              </div>

              {/* Step dots */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {generatingMessages.map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: i === generatingStep ? 1.3 : 1,
                      opacity: i <= generatingStep ? 1 : 0.3,
                    }}
                    className={`w-2 h-2 rounded-full ${
                      i <= generatingStep ? 'bg-purple-500' : 'bg-forge-border'
                    }`}
                  />
                ))}
              </div>

              <motion.p
                key={generatingMsg}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display font-medium text-white text-lg mb-2"
              >
                {generatingMsg}
              </motion.p>
              <p className="text-sm text-forge-muted">This takes 30–90 seconds. Please wait...</p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Input */}
              <div className="glass-card p-6 space-y-3">
                <label className="text-sm font-display font-medium text-slate-300 flex items-center gap-2">
                  <span>📝</span> Article URL or Text
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste a URL like https://techcrunch.com/... or write your own text here..."
                  className="input-field resize-none h-36 text-sm leading-relaxed"
                />
                <div className="flex items-center justify-between text-xs text-forge-muted">
                  <span>{isUrl ? '🔗 URL detected — will scrape automatically' : `${charCount} chars`}</span>
                  {!isValid && charCount > 0 && (
                    <span className="text-amber-500">Need at least 20 characters</span>
                  )}
                </div>
              </div>

              {/* Voice */}
              <div className="glass-card p-6 space-y-3">
                <label className="text-sm font-display font-medium text-slate-300 flex items-center gap-2">
                  <span>🎙️</span> Voice Style
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {voices.map((v) => (
                    <motion.button
                      key={v.id}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedVoice(v.id)}
                      className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 text-left ${
                        selectedVoice === v.id
                          ? 'border-purple-600/60 bg-purple-900/30'
                          : 'border-forge-border bg-transparent hover:border-forge-purple/30 hover:bg-purple-900/10'
                      }`}
                    >
                      <span className="text-2xl">{v.emoji}</span>
                      <div>
                        <p className="font-display font-medium text-white text-sm">{v.label}</p>
                        <p className="text-xs text-forge-muted mt-0.5">{v.desc}</p>
                      </div>
                      {selectedVoice === v.id && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center"
                        >
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Tone */}
              <div className="glass-card p-6 space-y-3">
                <label className="text-sm font-display font-medium text-slate-300 flex items-center gap-2">
                  <span>🎨</span> Music Tone
                </label>
                <div className="flex flex-wrap gap-2">
                  {tones.map((t) => (
                    <motion.button
                      key={t.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedTone(t.id)}
                      className={`px-4 py-2 rounded-xl border text-sm font-display font-medium transition-all duration-200 flex items-center gap-2 ${
                        selectedTone === t.id
                          ? 'border-purple-600/60 bg-purple-900/40 text-white'
                          : 'border-forge-border text-forge-muted hover:border-forge-purple/30 hover:text-slate-300'
                      }`}
                    >
                      <span>{t.emoji}</span>
                      {t.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-4 border border-red-700/40 bg-red-900/20"
                >
                  <p className="text-red-400 text-sm flex items-center gap-2">
                    <span>⚠️</span> {error}
                  </p>
                </motion.div>
              )}

              {/* Generate Button */}
              <motion.button
                whileHover={{ scale: isValid ? 1.02 : 1 }}
                whileTap={{ scale: isValid ? 0.98 : 1 }}
                onClick={handleGenerate}
                disabled={!isValid}
                className={`w-full btn-primary py-4 text-base shadow-xl shadow-purple-900/40 ${
                  !isValid ? 'opacity-40 cursor-not-allowed' : ''
                }`}
              >
                <span className="flex items-center justify-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  Generate Podcast Episode
                </span>
              </motion.button>

              <p className="text-center text-xs text-forge-muted">
                Generation takes 30–90 seconds · Powered by Wubble AI
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}