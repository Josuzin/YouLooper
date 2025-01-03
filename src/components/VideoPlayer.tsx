import React, { useEffect, useRef, useCallback, useState } from 'react';
import type { LoopControls, YouTubePlayerRef } from '../types/youtube';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface VideoPlayerProps {
  videoId: string | null;
  controls: LoopControls;
  onError: (error: string) => void;
  onDurationChange: (duration: number) => void;
}

export default function VideoPlayer({ 
  videoId, 
  controls, 
  onError,
  onDurationChange 
}: VideoPlayerProps) {
  const playerRef = useRef<YouTubePlayerRef | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const checkIntervalRef = useRef<number>();
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  const [apiLoadStatus, setApiLoadStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');

  // Safer API loading function
  const loadYouTubeAPI = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      // If API is already loaded, resolve immediately
      if (window.YT?.Player) {
        setApiLoadStatus('loaded');
        resolve();
        return;
      }

      // Prevent multiple script loading attempts
      if (scriptRef.current) {
        reject(new Error('API script already loading'));
        return;
      }

      // Create script element
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.defer = true;
      scriptRef.current = script;

      // Error handling
      script.onerror = (error) => {
        console.error('YouTube API Script Load Error:', error);
        setApiLoadStatus('error');
        scriptRef.current = null;
        reject(new Error('Failed to load YouTube iframe API'));
      };

      // Success callback
      window.onYouTubeIframeAPIReady = () => {
        console.log('YouTube API Loaded Successfully');
        setApiLoadStatus('loaded');
        scriptRef.current = null;
        resolve();
      };

      // Append script to document
      document.head.appendChild(script);

      // Timeout mechanism
      const loadTimeout = setTimeout(() => {
        if (apiLoadStatus !== 'loaded') {
          console.error('YouTube API Loading Timed Out');
          setApiLoadStatus('error');
          scriptRef.current = null;
          reject(new Error('YouTube API loading timed out'));
        }
      }, 10000);

      // Cleanup function
      return () => {
        clearTimeout(loadTimeout);
        if (scriptRef.current) {
          document.head.removeChild(scriptRef.current);
          scriptRef.current = null;
        }
      };
    });
  }, [apiLoadStatus]);

  // Comprehensive player initialization
  const initializePlayer = useCallback(async () => {
    // Validate inputs
    if (!videoId) {
      onError('No video ID provided');
      return;
    }

    if (!containerRef.current) {
      onError('Video container not available');
      return;
    }

    try {
      // Ensure API is loaded
      await loadYouTubeAPI();

      // Validate API availability with additional checks
      if (typeof window.YT === 'undefined' || typeof window.YT.Player !== 'function') {
        throw new Error('YouTube API not fully initialized');
      }

      // Cleanup existing player
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (destroyError) {
          console.warn('Existing player destruction error:', destroyError);
        }
      }

      // Clear container
      containerRef.current.innerHTML = '';

      // Create new player with safe configuration
      const newPlayer = new window.YT.Player(containerRef.current, {
        videoId,
        width: '100%',
        height: '100%',
        host: 'https://www.youtube-nocookie.com',
        playerVars: {
          autoplay: controls.isPlaying ? 1 : 0,
          controls: 1,
          rel: 0,
          modestbranding: 1,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event: any) => {
            try {
              // Safely set player reference
              playerRef.current = event.target;

              // Initialize player state
              const safeSetVolume = () => {
                try {
                  playerRef.current?.setVolume(Math.max(0, Math.min(100, controls.volume)));
                } catch (volumeError) {
                  console.warn('Volume setting error:', volumeError);
                }
              };

              // Safely get and set duration
              const safeDurationSet = () => {
                try {
                  const duration = playerRef.current?.getDuration() || 0;
                  onDurationChange(duration);
                } catch (durationError) {
                  console.warn('Duration retrieval error:', durationError);
                }
              };

              // Apply initializations
              safeSetVolume();
              safeDurationSet();

              // Play if required
              if (controls.isPlaying) {
                playerRef.current?.playVideo();
              }

              // Setup time checking interval with error protection
              if (checkIntervalRef.current) {
                window.clearInterval(checkIntervalRef.current);
              }
              checkIntervalRef.current = window.setInterval(() => {
                try {
                  const player = playerRef.current;
                  if (!player) return;

                  const currentTime = player.getCurrentTime();
                  const endTime = controls.endTime || player.getDuration();

                  if (currentTime >= endTime) {
                    player.seekTo(controls.startTime);
                    if (controls.isPlaying) {
                      player.playVideo();
                    }
                  }
                } catch (intervalError) {
                  console.error('Interval check error:', intervalError);
                }
              }, 1000);

            } catch (setupError) {
              console.error('Player Setup Error:', setupError);
              onError('Failed to initialize player controls');
            }
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              if (controls.isPlaying) {
                playerRef.current?.seekTo(controls.startTime);
                playerRef.current?.playVideo();
              }
            }
          },
          onError: (error: any) => {
            console.error('YouTube Player Specific Error:', error);
            onError('Video playback error. Check video accessibility.');
          },
        },
      });
    } catch (initError) {
      console.error('Player Initialization Error:', initError);
      onError('Failed to load YouTube player. Please check your connection.');
    }
  }, [videoId, controls, onError, onDurationChange, loadYouTubeAPI]);

  // Effect for player initialization and cleanup
  useEffect(() => {
    initializePlayer();

    return () => {
      // Comprehensive cleanup
      if (checkIntervalRef.current) {
        window.clearInterval(checkIntervalRef.current);
      }
      
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (destroyError) {
          console.warn('Component Unmount Destruction Error:', destroyError);
        }
        playerRef.current = null;
      }

      // Ensure script is removed if still present
      if (scriptRef.current) {
        document.head.removeChild(scriptRef.current);
        scriptRef.current = null;
      }
    };
  }, [videoId, initializePlayer]);

  // Render with error state handling
  return (
    <div className="relative aspect-video w-full max-w-3xl mx-auto bg-gray-900 rounded-lg overflow-hidden">
      {videoId ? (
        <div ref={containerRef} className="w-full h-full" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <p>Enter a YouTube URL to start</p>
        </div>
      )}
      
      {apiLoadStatus === 'error' && (
        <div className="absolute inset-0 bg-red-500 bg-opacity-75 flex flex-col items-center justify-center text-white p-4 text-center">
          <p className="mb-2">Failed to Load YouTube Player</p>
          <p className="text-sm">
            Possible issues:
            - Internet Connection
            - Script Blocking
            - Network Restrictions
          </p>
          <button 
            onClick={initializePlayer} 
            className="mt-4 px-4 py-2 bg-white text-red-500 rounded hover:bg-gray-100"
          >
            Retry Loading
          </button>
        </div>
      )}
    </div>
  );
}