'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import {
  Calendar,
  MapPin,
  Clock,
  Music,
  Check,
  Star,
  Volume2,
  VolumeX,
  SkipForward,
  Pause,
  Play,
  ChevronUp,
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { useMobile } from '@/hooks/use-mobile'

// Sample track list - in a real app, these would be actual audio files
const TRACKS = [{ id: 1, name: '夕阳无限好', artist: 'Eason Chan' }]

export default function ConcertInvitation() {
  const [accepted, setAccepted] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [showTrackList, setShowTrackList] = useState(false)
  const [expandedPlayer, setExpandedPlayer] = useState(false)

  const isMobile = useMobile()
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)

  // Close track list when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (playerRef.current && !playerRef.current.contains(event.target)) {
        setShowTrackList(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    setMounted(true)

    // Add subtle floating animation to stars
    const interval = setInterval(() => {
      const stars = document.querySelectorAll<HTMLElement>('.floating-star')
      stars.forEach(star => {
        const randomX = (Math.random() - 0.5) * 10
        const randomY = (Math.random() - 0.5) * 10
        star.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${Math.random() * 360}deg)`
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Handle audio playback
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch(e => console.log('Audio play failed:', e))
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const changeTrack = (index: number) => {
    setCurrentTrack(index)
    // In a real app, you would change the audio source here
    if (isPlaying && audioRef.current) {
      // Simulate track change by restarting playback
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(e => console.log('Audio play failed:', e))
    }
    setShowTrackList(false)
  }

  const nextTrack = () => {
    const next = (currentTrack + 1) % TRACKS.length
    changeTrack(next)
  }

  const toggleExpandPlayer = () => {
    setExpandedPlayer(!expandedPlayer)
  }

  const triggerConfetti = () => {
    const canvas = confettiCanvasRef.current
    const myConfetti = confetti.create(canvas!, {
      resize: true,
      useWorker: true,
    })

    // Adjust origin for mobile
    const originY = isMobile ? 0.7 : 0.6

    // First burst
    myConfetti({
      particleCount: isMobile ? 70 : 100,
      spread: 160,
      origin: { y: originY },
    })

    // Side bursts
    setTimeout(() => {
      myConfetti({
        particleCount: isMobile ? 30 : 50,
        angle: 60,
        spread: 80,
        origin: { x: 0 },
      })
    }, 250)

    setTimeout(() => {
      myConfetti({
        particleCount: isMobile ? 30 : 50,
        angle: 120,
        spread: 80,
        origin: { x: 1 },
      })
    }, 400)

    // Final burst
    setTimeout(() => {
      myConfetti({
        particleCount: isMobile ? 70 : 100,
        spread: 160,
        origin: { y: originY },
      })
    }, 600)
  }

  const handleAccept = () => {
    setAccepted(true)
    triggerConfetti()

    // Start playing music when accepting invitation
    if (audioRef.current && !isPlaying) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e))
      setIsPlaying(true)

      // Auto-expand player on mobile when music starts
      if (isMobile && !expandedPlayer) {
        setTimeout(() => {
          setExpandedPlayer(true)
        }, 1000)
      }
    }
  }

  // Framer Motion variants
  const playerVariants = {
    collapsed: {
      width: isMobile ? 48 : 'auto',
      height: 48,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 30,
        mass: 1,
      },
    },
    expanded: {
      width: 'auto',
      height: 'auto',
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 30,
        mass: 1,
        staggerChildren: 0.07,
        delayChildren: 0.1,
      },
    },
  }

  const controlsVariants = {
    hidden: {
      opacity: 0,
      x: -20,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 30,
      },
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 30,
      },
    },
  }

  const iconVariants = {
    collapsed: {
      rotate: 0,
      scale: 1,
    },
    expanded: {
      rotate: 180,
      scale: 1,
    },
  }

  const trackListVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 30,
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 30,
      },
    },
  }

  const buttonVariants = {
    rest: { scale: 1 },
    pressed: { scale: 0.92 },
    hover: { scale: 1.05 },
  }

  const rippleVariants = {
    initial: {
      opacity: 0.7,
      scale: 0,
    },
    animate: {
      opacity: 0,
      scale: 1.5,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div className="flex justify-center items-center min-h-[100dvh] p-4 relative overflow-hidden">
      <style>{`
        @keyframes fadeSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }

        @keyframes equalizer {
          0%,
          100% {
            height: 3px;
          }
          50% {
            height: 12px;
          }
        }

        .shimmer {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }

        .floating-star {
          transition: transform 3s ease-in-out;
        }

        .equalizer-bar {
          width: 3px;
          background-color: currentColor;
          border-radius: 1px;
        }

        .equalizer-bar:nth-child(1) {
          animation: equalizer 0.8s ease-in-out infinite;
        }
        .equalizer-bar:nth-child(2) {
          animation: equalizer 0.8s ease-in-out infinite 0.2s;
        }
        .equalizer-bar:nth-child(3) {
          animation: equalizer 0.8s ease-in-out infinite 0.4s;
        }
        .equalizer-bar:nth-child(4) {
          animation: equalizer 0.8s ease-in-out infinite 0.6s;
        }

        /* Optimize for mobile */
        @media (max-width: 640px) {
          body {
            overscroll-behavior: none;
          }
        }
      `}</style>

      {/* Canvas for confetti */}
      <canvas
        ref={confettiCanvasRef}
        className="fixed inset-0 pointer-events-none z-50"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Audio element (hidden) */}
      <audio
        ref={audioRef}
        loop
        preload="none"
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      >
        {/* In a real app, you would include actual audio sources */}
        <source src="/public/songs/sun.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Enhanced Mobile-optimized Music Player with Framer Motion */}
      <motion.div
        ref={playerRef}
        className="fixed z-40 top-4 right-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: mounted ? 1 : 0,
          y: mounted ? 0 : -20,
          transition: {
            type: 'spring',
            stiffness: 500,
            damping: 30,
          },
        }}
      >
        <motion.div
          variants={playerVariants}
          initial="collapsed"
          animate={isMobile ? (expandedPlayer ? 'expanded' : 'collapsed') : 'expanded'}
          className={`bg-zinc-900/90 backdrop-blur-sm rounded-full shadow-lg border border-amber-500/20 overflow-hidden`}
          style={{
            originX: 1,
            originY: 0,
            boxShadow: expandedPlayer ? '0 10px 25px -5px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div className={`flex items-center gap-2 p-2 ${isMobile && expandedPlayer ? 'justify-between' : ''}`}>
            {/* Mobile toggle button */}
            {isMobile && (
              <motion.button
                whileTap="pressed"
                whileHover="hover"
                variants={buttonVariants}
                onClick={toggleExpandPlayer}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-500 text-black hover:bg-amber-600 transition-colors relative overflow-hidden"
              >
                <motion.div
                  variants={iconVariants}
                  initial="collapsed"
                  animate={expandedPlayer ? 'expanded' : 'collapsed'}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  {expandedPlayer ? (
                    <ChevronUp size={16} />
                  ) : (
                    <Music size={16} className={isPlaying ? 'animate-pulse' : ''} />
                  )}
                </motion.div>

                {/* Ripple effect */}
                <motion.div
                  className="absolute inset-0 bg-white rounded-full"
                  initial="initial"
                  animate="animate"
                  variants={rippleVariants}
                  key={expandedPlayer ? 'expanded' : 'collapsed'}
                  style={{ originX: 0.5, originY: 0.5 }}
                />
              </motion.button>
            )}

            {/* Controls - animated with Framer Motion */}
            <AnimatePresence>
              {(!isMobile || expandedPlayer) && (
                <>
                  <motion.button
                    variants={controlsVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    whileTap="pressed"
                    whileHover="hover"
                    custom={0}
                    onClick={togglePlay}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-500 text-black hover:bg-amber-600 transition-colors relative overflow-hidden cursor-pointer"
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} />}

                    {/* Ripple effect */}
                    <motion.div
                      className="absolute inset-0 bg-white rounded-full"
                      initial="initial"
                      animate="animate"
                      variants={rippleVariants}
                      key={isPlaying ? 'playing' : 'paused'}
                      style={{ originX: 0.5, originY: 0.5 }}
                    />
                  </motion.button>

                  <motion.div
                    variants={controlsVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    custom={1}
                    className="relative cursor-pointer group"
                    onClick={() => setShowTrackList(!showTrackList)}
                  >
                    <div className="px-3 py-1 flex items-center gap-2 rounded-full hover:bg-white/10 transition-colors">
                      {isPlaying && (
                        <div className="flex items-end h-3 gap-[2px]">
                          <div className="equalizer-bar h-1 !bg-amber-400"></div>
                          <div className="equalizer-bar h-3 !bg-amber-400"></div>
                          <div className="equalizer-bar h-2 !bg-amber-400"></div>
                        </div>
                      )}
                      <span className="text-xs text-white/80 max-w-[100px] truncate">{TRACKS[currentTrack].name}</span>
                    </div>
                  </motion.div>

                  <motion.button
                    variants={controlsVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    custom={2}
                    whileTap="pressed"
                    whileHover="hover"
                    onClick={nextTrack}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors relative overflow-hidden cursor-pointer"
                  >
                    <SkipForward size={16} color="white" />

                    {/* Ripple effect */}
                    <motion.div
                      className="absolute inset-0 bg-white/20 rounded-full"
                      initial="initial"
                      animate="animate"
                      variants={rippleVariants}
                      key={`next-${currentTrack}`}
                      style={{ originX: 0.5, originY: 0.5 }}
                    />
                  </motion.button>

                  <motion.button
                    variants={controlsVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    custom={3}
                    whileTap="pressed"
                    whileHover="hover"
                    onClick={toggleMute}
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors relative overflow-hidden cursor-pointer"
                  >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 color="white" size={16} />}

                    {/* Ripple effect */}
                    <motion.div
                      className="absolute inset-0 bg-white/20 rounded-full"
                      initial="initial"
                      animate="animate"
                      variants={rippleVariants}
                      key={isMuted ? 'muted' : 'unmuted'}
                      style={{ originX: 0.5, originY: 0.5 }}
                    />
                  </motion.button>
                </>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Track list dropdown with Framer Motion */}
        <AnimatePresence>
          {showTrackList && (
            <motion.div
              variants={trackListVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className={`absolute mt-2 bg-zinc-900/90 backdrop-blur-sm rounded-lg shadow-lg border border-amber-500/20 overflow-hidden ${
                isMobile ? 'left-0 right-0' : 'top-full right-0 w-48'
              }`}
              style={{
                transformOrigin: isMobile ? 'top center' : 'top right',
              }}
            >
              <div className="p-2 text-xs text-white/60 border-b border-white/10 flex justify-between items-center">
                <span>选择曲目</span>
                {isMobile && (
                  <motion.button
                    whileTap="pressed"
                    whileHover="hover"
                    variants={buttonVariants}
                    onClick={() => setShowTrackList(false)}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10"
                  >
                    <ChevronUp size={14} />
                  </motion.button>
                )}
              </div>
              <div className="max-h-48 overflow-y-auto">
                {TRACKS.map((track, index) => (
                  <motion.div
                    key={track.id}
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                    className={`px-3 py-3 flex items-center gap-2 cursor-pointer transition-colors ${
                      currentTrack === index ? 'bg-amber-500/20 text-amber-400' : ''
                    }`}
                    onClick={() => changeTrack(index)}
                  >
                    {currentTrack === index && isPlaying ? (
                      <div className="flex items-end h-3 gap-[2px]">
                        <div className="equalizer-bar h-1 bg-amber-400"></div>
                        <div className="equalizer-bar h-3 bg-amber-400"></div>
                        <div className="equalizer-bar h-2 bg-amber-400"></div>
                        <div className="equalizer-bar h-1 bg-amber-400"></div>
                      </div>
                    ) : (
                      <Music size={14} color="white" className={currentTrack === index ? 'text-amber-400' : ''} />
                    )}
                    <div>
                      <div className="text-sm font-medium text-white/60">{track.name}</div>
                      <div className="text-xs text-white/60">{track.artist}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Decorative stars - fewer on mobile for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(isMobile ? 5 : 8)].map((_, i) => (
          <div
            key={i}
            className="absolute floating-star"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.3 + Math.random() * 0.4,
              transition: 'transform 3s ease-in-out',
            }}
          >
            <Star className="text-amber-400" size={8 + Math.random() * 12} fill="currentColor" />
          </div>
        ))}
      </div>

      <div className={`w-full max-w-md transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        <Card className="w-full bg-gradient-to-br from-zinc-900 to-zinc-800 text-white border-none shadow-xl overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>

          <CardHeader className="text-center pt-6 pb-2 relative">
            <div className="space-y-2">
              <h3
                className="text-lg sm:text-xl font-semibold tracking-wide text-amber-400 opacity-0"
                style={{ animation: 'fadeSlideUp 0.6s forwards 0.3s' }}
              >
                EASON CHAN
              </h3>
              <h1
                className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight opacity-0 relative overflow-hidden"
                style={{ animation: 'fadeSlideUp 0.8s forwards 0.5s' }}
              >
                <span className="relative z-10">FEAR AND DREAMS</span>
                <div className="absolute inset-0 shimmer z-0"></div>
              </h1>
              <p
                className="text-xs sm:text-sm uppercase tracking-widest text-zinc-400 opacity-0"
                style={{ animation: 'fadeSlideUp 0.6s forwards 0.7s' }}
              >
                CONCERT TOUR 2025
              </p>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col items-center space-y-5 pt-4">
            <div
              className="w-full max-w-[200px] sm:max-w-[250px] h-[200px] sm:h-[250px] rounded-full bg-gradient-to-r from-amber-500 to-amber-700 flex items-center justify-center overflow-hidden opacity-0 relative"
              style={{ animation: 'scaleIn 1s forwards 0.9s' }}
            >
              <div className="absolute inset-0 bg-black/10 shimmer"></div>
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"
                style={{ animation: 'pulse 8s infinite' }}
              ></div>
              <div className="text-center p-6 relative">
                <h2 className="text-4xl sm:text-5xl font-bold relative z-10">北京站</h2>
                <p className="mt-2 text-base sm:text-lg relative z-10">BEIJING</p>
              </div>
            </div>

            <div className="w-full space-y-2 pt-2">
              <div
                className="flex items-center gap-3 opacity-0 transform translate-x-[-10px] hover:bg-white/5 p-2 rounded-md transition-colors duration-300 cursor-default"
                style={{ animation: 'fadeSlideUp 0.6s forwards 1.2s' }}
              >
                <Calendar className="h-5 w-5 text-amber-400 flex-shrink-0" />
                <p className="text-base sm:text-lg">2025年7月25日</p>
              </div>
              <div
                className="flex items-center gap-3 opacity-0 transform translate-x-[-10px] hover:bg-white/5 p-2 rounded-md transition-colors duration-300 cursor-default"
                style={{ animation: 'fadeSlideUp 0.6s forwards 1.4s' }}
              >
                <MapPin className="h-5 w-5 text-amber-400 flex-shrink-0" />
                <p className="text-base sm:text-lg">待定</p>
              </div>
              <div
                className="flex items-center gap-3 opacity-0 transform translate-x-[-10px] hover:bg-white/5 p-2 rounded-md transition-colors duration-300 cursor-default"
                style={{ animation: 'fadeSlideUp 0.6s forwards 1.6s' }}
              >
                <Clock className="h-5 w-5 text-amber-400 flex-shrink-0" />
                <p className="text-base sm:text-lg">19:00 开始</p>
              </div>
            </div>

            <div className="w-full space-y-2 opacity-0 pt-1" style={{ animation: 'fadeSlideUp 0.6s forwards 1.8s' }}>
              <div className="space-y-1 hover:bg-white/5 p-2 rounded-md transition-colors duration-300 cursor-default">
                <p className="font-semibold text-amber-400 flex items-center gap-2">
                  <Music className="h-4 w-4 flex-shrink-0" /> 特别嘉宾
                </p>
                <p className="text-sm text-zinc-300">将会有神秘嘉宾出场</p>
              </div>

              <div className="pt-1 hover:bg-white/5 p-2 rounded-md transition-colors duration-300 cursor-default">
                <p className="text-xs sm:text-sm text-zinc-400">
                  本次演唱会将严格按照实名制购票，入场时需出示身份证与票券。
                </p>
              </div>
            </div>
          </CardContent>

          <CardFooter
            className="flex flex-col gap-3 justify-center pb-6 opacity-0"
            style={{ animation: 'fadeSlideUp 0.8s forwards 2s' }}
          >
            {!accepted ? (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}>
                <Button
                  ref={buttonRef}
                  onClick={handleAccept}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold px-8 py-6 w-full relative overflow-hidden group transition-colors duration-300 text-lg"
                >
                  <span className="relative z-10">接收邀请</span>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 shimmer transition-opacity duration-300"></div>
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="text-center w-full py-4 bg-amber-500/10 rounded-md border border-amber-500/20"
              >
                <div className="flex items-center justify-center gap-2 text-amber-400 font-semibold">
                  <Check className="h-5 w-5" />
                  <span>已接受邀请</span>
                </div>
              </motion.div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
