import React from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';
import type { LoopControls } from '../types/youtube';

interface ControlsProps {
  controls: LoopControls;
  onControlsChange: (controls: Partial<LoopControls>) => void;
}

export default function Controls({ controls, onControlsChange }: ControlsProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md">
      <button
        onClick={() => onControlsChange({ isPlaying: !controls.isPlaying })}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        {controls.isPlaying ? (
          <Pause className="w-6 h-6" />
        ) : (
          <Play className="w-6 h-6" />
        )}
      </button>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onControlsChange({ volume: controls.volume === 0 ? 100 : 0 })}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          {controls.volume === 0 ? (
            <VolumeX className="w-6 h-6" />
          ) : (
            <Volume2 className="w-6 h-6" />
          )}
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={controls.volume}
          onChange={(e) => onControlsChange({ volume: Number(e.target.value) })}
          className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
}