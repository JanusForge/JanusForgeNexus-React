'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, RefreshCw } from 'lucide-react';

export default function LogoVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Use consistent values for SSR/CSR hydration
  const particlePositions = [
    { left: '17%', top: '10%', delay: '0s' },
    { left: '35%', top: '25%', delay: '0.5s' },
    { left: '75%', top: '15%', delay: '1s' },
    { left: '25%', top: '70%', delay: '1.5s' },
    { left: '85%', top: '75%', delay: '2s' },
  ];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsLoaded(true);
      setHasError(false);
      if (isPlaying) {
        video.play().catch(() => {
          setHasError(true);
          setIsPlaying(false);
        });
      }
    };

    const handleError = () => {
      setHasError(true);
      setIsLoaded(false);
      setIsPlaying(false);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    
    // Auto-play with muted audio (browser policy compliant)
    video.muted = isMuted;
    
    // Try to load
    video.load();
    
    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [isPlaying, isMuted]);

  const togglePlay = () => {
    if (!videoRef.current || hasError) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {
        setHasError(true);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current || hasError) return;
    
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const retryLoad = () => {
    setHasError(false);
    setIsLoaded(false);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  // Fallback animation if video fails
  const renderFallback = () => (
    <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-2xl md:rounded-3xl overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient-x"></div>
      
      {/* Animated circuit board effect */}
      <div className="absolute inset-0 opacity-20">
        {particlePositions.map((pos, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 animate-pulse"
            style={{
              left: pos.left,
              top: pos.top,
              animationDelay: pos.delay,
            }}
          />
        ))}
      </div>

      {/* Central logo symbol */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Outer ring */}
          <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 border-4 border-blue-400/50 rounded-full animate-spin-slow"></div>
          
          {/* Inner rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 border-2 border-purple-400/50 rounded-full animate-spin-slow-reverse"></div>
          </div>
          
          {/* Central icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl md:text-5xl lg:text-6xl">⚡</div>
          </div>
        </div>
      </div>

      {/* Floating AI particles */}
      {['🤖', '🧠', '🔮', '🔍', '⚡'].map((icon, i) => (
        <div
          key={i}
          className="absolute text-xl animate-float"
          style={{
            left: particlePositions[i].left,
            top: particlePositions[i].top,
            animationDelay: particlePositions[i].delay,
          }}
        >
          {icon}
        </div>
      ))}
    </div>
  );

  return (
    <div className="relative group">
      {/* Video Container */}
      <div className="relative w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-2xl md:rounded-3xl overflow-hidden bg-gray-900 shadow-2xl border border-gray-700/50">
        {/* Video Element - Only show if no error */}
        {!hasError ? (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            preload="metadata"
            poster="/janus-logo-placeholder.svg"
          >
            {/* Only reference MP4 file */}
            <source src="/janus-logo-video.mp4" type="video/mp4" />
            {/* Fallback image if video format not supported */}
            <img 
              src="/janus-logo-placeholder.svg" 
              alt="Janus Forge Nexus Logo"
              className="w-full h-full object-cover"
            />
          </video>
        ) : (
          renderFallback()
        )}

        {/* Loading State */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <span className="text-gray-400 text-sm">Loading video...</span>
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 p-4">
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-lg font-semibold mb-2">Janus Forge Nexus</h3>
              <p className="text-gray-400 text-sm mb-4">Where 5 AIs Debate Reality</p>
              <button
                onClick={retryLoad}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Retry Video
              </button>
            </div>
          </div>
        )}

        {/* Video Controls Overlay */}
        {isLoaded && !hasError && (
          <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={togglePlay}
              className="p-2 bg-gray-900/80 hover:bg-gray-800/90 rounded-full backdrop-blur-sm"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>
            
            <button
              onClick={toggleMute}
              className="p-2 bg-gray-900/80 hover:bg-gray-800/90 rounded-full backdrop-blur-sm"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
          </div>
        )}

        {/* Glow Effect */}
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-2xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-blue-400/50 rounded-tr-lg"></div>
      <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-purple-400/50 rounded-bl-lg"></div>
    </div>
  );
}
