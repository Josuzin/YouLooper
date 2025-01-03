export interface LoopControls {
  isPlaying: boolean;
  startTime: number;
  endTime: number | null;
  volume: number;
}

export interface YouTubePlayerRef {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  setVolume: (volume: number) => void;
}

export interface YouTubePlayer extends YouTubePlayerRef {
  destroy: () => void;
}

export interface YouTubeEvent {
  target: YouTubePlayerRef;
  data?: number;
}

export interface YouTubePlayerState {
  ENDED: number;
  PLAYING: number;
  PAUSED: number;
  BUFFERING: number;
  CUED: number;
}

export interface YouTubeAPI {
  Player: new (
    element: HTMLElement,
    options: YouTubePlayerOptions
  ) => YouTubePlayer;
  PlayerState: YouTubePlayerState;
}

export interface YouTubePlayerOptions {
  videoId: string;
  host?: string;
  playerVars?: {
    autoplay?: 0 | 1;
    controls?: 0 | 1;
    rel?: 0 | 1;
    modestbranding?: 0 | 1;
    enablejsapi?: 0 | 1;
  };
  events?: {
    onReady?: (event: YouTubeEvent) => void;
    onStateChange?: (event: YouTubeEvent) => void;
    onError?: (event: YouTubeEvent) => void;
  };
}