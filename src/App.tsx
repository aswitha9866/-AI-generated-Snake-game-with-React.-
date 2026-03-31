import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Terminal, Activity } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-cyan font-pixel scanlines crt-flicker relative overflow-hidden selection:bg-magenta selection:text-black">
      <div className="static-noise"></div>
      
      {/* Header */}
      <header className="relative z-10 p-6 border-b-4 border-magenta flex flex-col md:flex-row justify-between items-start md:items-center bg-black/90 screen-tear gap-4">
        <div className="flex items-center gap-4">
          <Terminal size={40} className="text-magenta" />
          <h1 className="text-5xl font-bold tracking-widest glitch-text text-cyan" data-text="SYS.OP.TERMINAL">
            SYS.OP.TERMINAL
          </h1>
        </div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 text-2xl text-cyan/80">
          <span className="animate-pulse text-magenta">{'>'} STATUS: ONLINE</span>
          <span>MEM: 0x4F2A</span>
          <span>UPLINK: ESTABLISHED</span>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8 flex flex-col xl:flex-row items-start justify-center gap-8 min-h-[calc(100vh-120px)]">
        
        {/* Center - Snake Game */}
        <div className="flex-shrink-0 border-4 border-cyan p-2 bg-black shadow-[0_0_30px_#00ffff_inset]">
          <div className="border border-cyan/30 p-4">
            <SnakeGame />
          </div>
        </div>

        {/* Right Side - Music Player & Logs */}
        <div className="flex flex-col gap-8 w-full max-w-xl">
          <div className="border-4 border-magenta p-2 bg-black shadow-[0_0_30px_#ff00ff_inset]">
            <div className="border border-magenta/30 p-4">
              <MusicPlayer />
            </div>
          </div>
          
          {/* Cryptic Logs */}
          <div className="border-2 border-cyan/50 p-6 bg-black/90 h-64 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black pointer-events-none z-10" />
            <h3 className="text-magenta text-3xl mb-4 flex items-center gap-3 border-b border-magenta/30 pb-2">
              <Activity size={28} />
              SYS.LOGS
            </h3>
            <div className="text-cyan/90 text-2xl space-y-2">
              <p>{'>'} INITIALIZING PROTOCOL...</p>
              <p>{'>'} LOADING AUDIO.SYS... <span className="text-magenta">OK</span></p>
              <p>{'>'} LOADING SNAKE.EXE... <span className="text-magenta">OK</span></p>
              <p className="text-magenta screen-tear">{'>'} WARNING: ANOMALY DETECTED</p>
              <p>{'>'} ATTEMPTING CONTAINMENT...</p>
              <p className="animate-pulse mt-4">{'>'} AWAITING USER INPUT_</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
