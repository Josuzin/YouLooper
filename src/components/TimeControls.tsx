import React from 'react';
import { Clock } from 'lucide-react';
import type { LoopControls } from '../types/youtube';
import { formatTime } from '../utils/time';

interface TimeControlsProps {
  controls: LoopControls;
  duration: number;
  onControlsChange: (controls: Partial<LoopControls>) => void;
}

export default function TimeControls({ controls, duration, onControlsChange }: TimeControlsProps) {
  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    const endTime = controls.endTime || duration;
    onControlsChange({ 
      startTime: Math.min(value, endTime - 1) 
    });
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    onControlsChange({ 
      endTime: Math.max(value, controls.startTime + 1)
    });
  };

  return (
    <div className="flex items-center gap-4">
      <Clock className="w-5 h-5 text-gray-500" />
      <div className="flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 w-20">Start time:</span>
          <input
            type="range"
            min="0"
            max={duration}
            value={controls.startTime}
            onChange={handleStartTimeChange}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm text-gray-600 w-16 text-right">
            {formatTime(controls.startTime)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 w-20">End time:</span>
          <input
            type="range"
            min="0"
            max={duration}
            value={controls.endTime || duration}
            onChange={handleEndTimeChange}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm text-gray-600 w-16 text-right">
            {formatTime(controls.endTime || duration)}
          </span>
        </div>
      </div>
    </div>
  );
}