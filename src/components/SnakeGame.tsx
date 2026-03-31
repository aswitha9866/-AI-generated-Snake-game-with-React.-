import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Direction, Point } from '../types';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const GAME_SPEED = 120;

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 1);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, isPaused, isGameOver]);

  return (
    <div className="flex flex-col items-center gap-4 bg-black w-full">
      <div className="flex justify-between w-full items-end border-b-2 border-cyan pb-2">
        <h2 className="text-4xl text-cyan tracking-widest glitch-text" data-text="EXE:SNAKE">EXE:SNAKE</h2>
        <div className="text-3xl text-magenta">
          DATA: [{score.toString().padStart(4, '0')}]
        </div>
      </div>

      <div 
        className="relative bg-black border-2 border-cyan/50 screen-tear"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Grid lines for raw look */}
        <div className="absolute inset-0 pointer-events-none opacity-20" 
             style={{
               backgroundImage: 'linear-gradient(var(--color-cyan) 1px, transparent 1px), linear-gradient(90deg, var(--color-cyan) 1px, transparent 1px)',
               backgroundSize: '20px 20px'
             }} 
        />

        {snake.map((segment, i) => (
          <div
            key={`${i}-${segment.x}-${segment.y}`}
            style={{ 
              gridColumnStart: segment.x + 1, 
              gridRowStart: segment.y + 1,
              backgroundColor: i === 0 ? 'var(--color-magenta)' : 'var(--color-cyan)',
              border: '1px solid black'
            }}
            className="w-full h-full"
          />
        ))}

        <motion.div
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 0.2, ease: "steps(2)" }}
          style={{ 
            gridColumnStart: food.x + 1, 
            gridRowStart: food.y + 1 
          }}
          className="w-full h-full bg-magenta border border-black"
        />

        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20"
            >
              {isGameOver ? (
                <>
                  <h3 className="text-6xl text-magenta mb-4 glitch-text" data-text="SYS.FAILURE">SYS.FAILURE</h3>
                  <button 
                    onClick={resetGame}
                    className="px-6 py-2 border-2 border-cyan text-cyan text-3xl hover:bg-cyan hover:text-black transition-colors uppercase"
                  >
                    {'>'} REBOOT
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-6xl text-cyan mb-4 glitch-text" data-text="HALTED">HALTED</h3>
                  <button 
                    onClick={() => setIsPaused(false)}
                    className="px-6 py-2 border-2 border-magenta text-magenta text-3xl hover:bg-magenta hover:text-black transition-colors uppercase"
                  >
                    {'>'} EXECUTE
                  </button>
                  <p className="mt-4 text-cyan/50 text-2xl animate-pulse">AWAITING [SPACE]</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
