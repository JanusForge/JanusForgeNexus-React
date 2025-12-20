'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  videoSrc?: string;
}

export default function AnimatedLogo({ 
  size = 'xl',
  videoSrc = '/logos/nexus-video-logo.mp4'
}: AnimatedLogoProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const sizes = {
    sm: { container: 'w-24 h-24', text: 'text-2xl', sphere: 'inset-0' },
    md: { container: 'w-40 h-40', text: 'text-4xl', sphere: '-inset-4' },
    lg: { container: 'w-64 h-64', text: 'text-5xl', sphere: '-inset-8' },
    xl: { container: 'w-80 h-80', text: 'text-6xl', sphere: '-inset-12' }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      let progressInterval: NodeJS.Timeout;
      
      const handleProgress = () => {
        if (video.buffered.length > 0 && video.duration > 0) {
          const bufferedEnd = video.buffered.end(video.buffered.length - 1);
          const progressPercent = (bufferedEnd / video.duration) * 100;
          setProgress(progressPercent);
        }
      };
      
      const handleLoaded = () => {
        console.log('✅ Video loaded successfully');
        setIsLoaded(true);
        setHasError(false);
        clearInterval(progressInterval);
      };
      
      const handleError = (e: Event) => {
        console.error('❌ Video failed to load:', e);
        setHasError(true);
        setIsLoaded(false);
        clearInterval(progressInterval);
      };
      
      video.addEventListener('progress', handleProgress);
      video.addEventListener('loadeddata', handleLoaded);
      video.addEventListener('canplay', handleLoaded);
      video.addEventListener('error', handleError);
      
      // Track loading progress
      progressInterval = setInterval(handleProgress, 100);
      
      // Set timeout to show error if video doesn't load
      const timeoutId = setTimeout(() => {
        if (!isLoaded && !hasError) {
          console.warn('⚠ Video loading timeout');
          setHasError(true);
        }
      }, 15000); // 15 seconds timeout
      
      return () => {
        video.removeEventListener('progress', handleProgress);
        video.removeEventListener('loadeddata', handleLoaded);
        video.removeEventListener('canplay', handleLoaded);
        video.removeEventListener('error', handleError);
        clearInterval(progressInterval);
        clearTimeout(timeoutId);
      };
    }
  }, [videoSrc]);

  return (
    <div className="flex flex-col items-center">
      {/* Enhanced Video Logo Container */}
      <div className={`relative ${sizes[size].container} group`}>
        {/* Pulsating Lavender Sphere - Outer Glow */}
        <div className="absolute inset-0">
          <div className={`absolute ${sizes[size].sphere} bg-gradient-to-r from-purple-500/30 via-violet-500/40 to-blue-500/30 rounded-full blur-2xl animate-pulse`} />
          <div className={`absolute ${sizes[size].sphere} bg-gradient-to-r from-purple-600/20 via-violet-600/30 to-blue-600/20 rounded-full blur-xl animate-pulse delay-1000`} />
        </div>
        
        {/* Video Container */}
        <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
          {/* Video Logo with poster for faster initial display */}
          <video
            ref={videoRef}
            src={videoSrc}
            poster="/logos/janus-logo-poster.svg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata" // Changed from "auto" to "metadata" for faster initial load
            className="w-full h-full object-cover scale-110"
          />
          
          {/* Loading overlay with progress */}
          {!isLoaded && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <div className="text-center p-4">
                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <div className="text-white text-sm mb-2">Loading video logo...</div>
                
                {/* Progress bar */}
                <div className="w-48 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-gray-400 text-xs mt-2">{Math.round(progress)}% loaded</div>
              </div>
            </div>
          )}
          
          {/* Error overlay */}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/50 to-blue-900/50 backdrop-blur-sm">
              <div className="text-center p-4">
                <div className="text-white text-4xl font-bold mb-2">JFN</div>
                <div className="text-white/80 text-sm">Janus Forge Nexus</div>
              </div>
            </div>
          )}
          
          {/* Play/Pause overlay - Only show when loaded */}
          {isLoaded && !hasError && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"
              aria-label={isPlaying ? "Pause logo animation" : "Play logo animation"}
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600/80 to-blue-600/80 rounded-full flex items-center justify-center backdrop-blur-md transform scale-0 group-hover:scale-100 transition-transform duration-300 shadow-2xl">
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-8 h-8 text-white ml-1" />
                )}
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
