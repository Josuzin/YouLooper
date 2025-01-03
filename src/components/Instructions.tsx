import React from 'react';
import { HelpCircle } from 'lucide-react';

export default function Instructions() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <h3 className="font-semibold mb-1">How to use:</h3>
          <ol className="list-decimal list-inside space-y-1">
            <li>Paste a YouTube video URL in the input field above</li>
            <li>Click "Start Loop" to load the video</li>
            <li>Use the play/pause button to control playback</li>
            <li>Adjust the volume using the slider</li>
            <li>Set custom start and end times for precise looping (optional)</li>
          </ol>
          <p className="mt-2 text-blue-600">
            Supported URL formats: youtube.com/watch?v=..., youtu.be/..., youtube.com/embed/...
          </p>
        </div>
      </div>
    </div>
  );
}