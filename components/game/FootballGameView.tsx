//game/FootballGameView.tsx
import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from '@football/engine';
import { ThreeRenderer } from './renderers/ThreeRenderer';

export default function FootballGameView() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const rendererRef = useRef<ThreeRenderer | null>(null);

  const [uiState, setUiState] = useState({ score: 0, shotsLeft: 5, isGameOver: false });
  const [feedback, setFeedback] = useState<string | null>(null);
  const startPos = useRef({ x: 0, y: 0, time: 0 });

  useEffect(() => {
    if (!mountRef.current) return;

    const engine = new GameEngine();
    const renderer = new ThreeRenderer(mountRef.current);

    engineRef.current = engine;
    rendererRef.current = renderer;

    // Engine Event Listeners for Dynamic Feedback
    engine.events?.on('ON_GOAL', () => {
      showFeedback('GOAL! ⚽🔥');
      setTimeout(() => engine.resetShot(), 1800);
    });

    engine.events?.on('ON_MISS', () => {
      showFeedback('SAVED / MISS! ❌');
      setTimeout(() => engine.resetShot(), 1800);
    });

    engine.subscribe((state) => {
      setUiState({
        score: state.score,
        shotsLeft: state.shotsLeft,
        isGameOver: state.isGameOver,
      });
    });

    renderer.start(engine);

    return () => {
      renderer.destroy();
    };
  }, []);

  const showFeedback = (text: string) => {
    setFeedback(text);
    setTimeout(() => setFeedback(null), 1500);
  };

  // Touch / Swipe Controls
  const handlePointerDown = (e: React.PointerEvent) => {
    startPos.current = { x: e.clientX, y: e.clientY, time: performance.now() };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!engineRef.current || uiState.isGameOver) return;

    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;
    const duration = (performance.now() - startPos.current.time) / 1000;

    if (deltaY < -20) {
      engineRef.current.kickWithSwipe?.({
        startX: startPos.current.x,
        startY: startPos.current.y,
        endX: e.clientX,
        endY: e.clientY,
        duration,
      }) ?? engineRef.current.kick(deltaX, deltaY, duration);
    }
  };

  const handleRestart = () => {
    if (!engineRef.current) return;
    engineRef.current.match.reset();
    engineRef.current.resetShot();
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0a0e17] select-none font-sans">
      {/* 1. 3D Canvas Viewport */}
      <div
        ref={mountRef}
        className="w-full h-full touch-none cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      />

      {/* 2. Glassmorphism HUD Scoreboard */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center pointer-events-none">
        <div className="bg-black/40 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
          <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">Score</span>
          <span className="text-3xl font-extrabold text-white">{uiState.score}</span>
        </div>

        <div className="bg-black/40 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3">
          <span className="text-xs font-bold text-amber-400 tracking-wider uppercase">Shots Left</span>
          <span className="text-3xl font-extrabold text-white">{uiState.shotsLeft}</span>
        </div>
      </div>

      {/* 3. Dynamic Shot Feedback Toast */}
      {feedback && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-bounce">
          <h1 className="text-4xl md:text-6xl font-black text-amber-300 drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] tracking-wide">
            {feedback}
          </h1>
        </div>
      )}

      {/* 4. Game Over Overlay Screen */}
      {uiState.isGameOver && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-lg flex flex-col items-center justify-center gap-6 z-50 animate-fade-in">
          <h2 className="text-5xl font-black text-amber-400 tracking-widest uppercase">
            Game Over
          </h2>
          <p className="text-xl text-gray-300">
            Final Score: <strong className="text-white text-2xl">{uiState.score}</strong>
          </p>
          <button
            onClick={handleRestart}
            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-black font-extrabold rounded-full transition-all duration-200 shadow-lg cursor-pointer"
          >
            PLAY AGAIN
          </button>
        </div>
      )}
    </div>
  );
}