import { motion } from 'framer-motion'

const steps = [
  { label: 'Extracting content', icon: '📄' },
  { label: 'Analyzing tone', icon: '🎨' },
  { label: 'Generating audio', icon: '🎙️' },
  { label: 'Mixing tracks', icon: '🎵' },
  { label: 'Exporting podcast', icon: '📦' },
]

export default function GeneratingLoader({ step = 0, message = 'Crafting your podcast...' }) {
  const activeStep = Math.min(step, steps.length - 1)

  return (
    <div className="glass-card p-8 space-y-8">
      {/* Animated rings */}
      <div className="flex items-center justify-center">
        <div className="relative w-32 h-32">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border-2 border-purple-500/30"
              animate={{ scale: [1, 1.3 + i * 0.15, 1], opacity: [0.8, 0.1, 0.8] }}
              transition={{ duration: 2.5, delay: i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-900/50"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="text-center">
        <motion.p
          key={message}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display font-semibold text-white text-lg"
        >
          {message}
        </motion.p>
        <p className="text-forge-muted text-sm mt-1">Powered by Wubble AI</p>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-500 ${
              i < activeStep
                ? 'bg-emerald-900/20 border border-emerald-700/30'
                : i === activeStep
                ? 'bg-purple-900/30 border border-purple-700/40'
                : 'opacity-40'
            }`}
          >
            <span className="text-lg">{s.icon}</span>
            <span className={`text-sm font-medium ${i <= activeStep ? 'text-white' : 'text-forge-muted'}`}>
              {s.label}
            </span>
            {i < activeStep && (
              <motion.svg
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-4 h-4 text-emerald-400 ml-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </motion.svg>
            )}
            {i === activeStep && (
              <motion.div
                className="ml-auto w-4 h-4 rounded-full border-2 border-purple-500 border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
