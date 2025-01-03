import React, { useState } from "react";
import { Youtube } from "lucide-react";
import VideoPlayer from "./components/VideoPlayer";
import Controls from "./components/Controls";
import TimeControls from "./components/TimeControls";
import Instructions from "./components/Instructions";
import { validateYouTubeUrl, extractVideoId } from "./utils/youtube";
import type { LoopControls } from "./types/youtube";
import Socials from "./components/Socials";

function App() {
  const [url, setUrl] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [controls, setControls] = useState<LoopControls>({
    isPlaying: false,
    startTime: 0,
    endTime: null,
    volume: 100,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateYouTubeUrl(url)) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    const id = extractVideoId(url);
    if (id) {
      setVideoId(id);
      setControls((prev) => ({ ...prev, isPlaying: true }));
    }
  };

  const handleControlsChange = (newControls: Partial<LoopControls>) => {
    setControls((prev) => ({ ...prev, ...newControls }));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Youtube className="w-8 h-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900">You Looper</h1>
          </div>
          <p className="text-gray-600">
            Loop any section of your favorite YouTube videos with precise
            control
          </p>
        </div>
        <Socials />

        <Instructions />

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Loop
            </button>
          </div>
          {/* {error && (
            <p className="mt-1 text-red-600 text-sm">{error}</p>
          )} */}
        </form>

        <div className="space-y-4">
          <VideoPlayer
            videoId={videoId}
            controls={controls}
            onError={setError}
            onDurationChange={setDuration}
          />
          {videoId && (
            <div className="space-y-4 max-w-3xl mx-auto">
              {/* <Controls
                controls={controls}
                onControlsChange={handleControlsChange}
              /> */}
              <TimeControls
                controls={controls}
                duration={duration}
                onControlsChange={handleControlsChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
