import { useEffect, useRef } from 'react'

export function WaveformBars({ count = 20, playing = false, color = 'purple' }) {
  const bars = Array.from({ length: count }, (_, i) => i)

  const colors = {
    purple: 'from-purple-500 to-pink-500',
    cyan: 'from-cyan-500 to-purple-500',
    green: 'from-emerald-500 to-cyan-500',
  }

  return (
    <div className="flex items-center gap-[3px] h-12">
      {bars.map((i) => (
        <div
          key={i}
          className={`wave-bar bg-gradient-to-t ${colors[color] || colors.purple}`}
          style={{
            height: `${20 + Math.sin(i * 0.8) * 15}px`,
            animationDelay: `${i * 0.07}s`,
            animationPlayState: playing ? 'running' : 'paused',
            opacity: playing ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  )
}

export function WaveformCanvas({ playing = false }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = canvas.width
    const H = canvas.height

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      const bars = 60
      const barW = W / bars - 2

      for (let i = 0; i < bars; i++) {
        const phase = (i / bars) * Math.PI * 4 + timeRef.current
        const h = playing
          ? (Math.abs(Math.sin(phase)) * 0.7 + Math.abs(Math.sin(phase * 2.3)) * 0.3) * (H * 0.8)
          : H * 0.1

        const x = i * (barW + 2) + 1
        const y = (H - h) / 2

        const grad = ctx.createLinearGradient(x, y + h, x, y)
        grad.addColorStop(0, 'rgba(124,58,237,0.8)')
        grad.addColorStop(1, 'rgba(236,72,153,0.8)')

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.roundRect(x, y, barW, h, 2)
        ctx.fill()
      }

      if (playing) timeRef.current += 0.06
      animRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animRef.current)
  }, [playing])

  return (
    <canvas
      ref={canvasRef}
      width={480}
      height={80}
      className="w-full rounded-lg"
      style={{ maxHeight: '80px' }}
    />
  )
}
