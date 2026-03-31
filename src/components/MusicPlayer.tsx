import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'SECTOR_01.WAV',
    artist: 'AI_SYNTH_CORE',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/glitch1/300/300'
  },
  {
    id: '2',
    title: 'DATA_CORRUPTION.MP3',
    artist: 'NULL_POINTER',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/glitch2/300/300'
  },
  {
    id: '3',
    title: 'VOID_SIGNAL.FLAC',
    artist: 'SYSTEM_OVERRIDE',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/glitch3/300/300'
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(currentProgress || 0);
    }
  };

  const handleTrackEnd = () => {
    skipForward();
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  return (
    <div className="w-full bg-black flex flex-col gap-4">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />
      
      <div className="flex justify-between items-end border-b-2 border-magenta pb-2">
        <h2 className="text-4xl text-magenta tracking-widest glitch-text" data-text="AUDIO.SYS">AUDIO.SYS</h2>
        <span className="text-cyan text-2xl animate-pulse">
          {isPlaying ? 'STREAMING...' : 'IDLE'}
        </span>
      </div>

      <div className="flex items-start gap-6">
        <div className="relative w-32 h-32 border-2 border-cyan p-1 flex-shrink-0">
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title}
            className={`w-full h-full object-cover filter grayscale contrast-150 ${isPlaying ? 'screen-tear' : ''}`}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-magenta/20 mix-blend-overlay" />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h3 className="text-4xl text-cyan truncate glitch-text" data-text={currentTrack.title}>
            {currentTrack.title}
          </h3>
          <p className="text-magenta text-2xl tracking-widest mt-2">
            {'>'} {currentTrack.artist}
          </p>
        </div>
      </div>

      <div className="space-y-4 mt-2">
        {/* Raw Progress Bar */}
        <div className="h-6 border border-cyan bg-black relative">
          <div 
            className="absolute top-0 left-0 h-full bg-magenta"
            style={{ width: `${progress}%` }}
          />
          {/* Grid overlay for progress bar */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9InRyYW5zcGFyZW50Ii8+PHBhdGggZD0iTTAgNEw0IDBaIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMSIvPjwvc3ZnPg==')] opacity-50 pointer-events-none" />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between border-t border-cyan/30 pt-4">
          <button 
            onClick={skipBackward}
            className="text-cyan hover:text-magenta hover:bg-cyan/10 p-2 transition-colors"
          >
            <SkipBack size={40} />
          </button>

          <button 
            onClick={togglePlay}
            className="text-magenta hover:text-cyan border-2 border-magenta hover:border-cyan p-3 transition-colors"
          >
            {isPlaying ? <Pause size={40} /> : <Play size={40} />}
          </button>

          <button 
            onClick={skipForward}
            className="text-cyan hover:text-magenta hover:bg-cyan/10 p-2 transition-colors"
          >
            <SkipForward size={40} />
          </button>
        </div>
      </div>
    </div>
  );
}
