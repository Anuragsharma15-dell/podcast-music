import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar.jsx'
import LandingPage from './pages/LandingPage.jsx'
import CreatePage from './pages/CreatePage.jsx'
import StudioPage from './pages/StudioPage.jsx'
import LibraryPage from './pages/LibraryPage.jsx'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/studio/:id" element={<StudioPage />} />
        <Route path="/library" element={<LibraryPage />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen relative">
        {/* Background orbs */}
        <div className="orb w-[600px] h-[600px] bg-purple-900/20 top-[-200px] left-[-200px]" />
        <div className="orb w-[500px] h-[500px] bg-pink-900/15 top-[40%] right-[-150px]" />
        <div className="orb w-[400px] h-[400px] bg-cyan-900/10 bottom-[10%] left-[20%]" />
        {/* Noise texture */}
        <div className="noise-overlay" />
        <Navbar />
        <AnimatedRoutes />
      </div>
    </BrowserRouter>
  )
}
