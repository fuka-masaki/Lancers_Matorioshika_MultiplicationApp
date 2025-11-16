import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTimerOptions {
  targetTime: number; // 目標タイム（秒）
  onTimeUp?: () => void;
}

export function useTimer({ targetTime, onTimeUp }: UseTimerOptions) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setElapsedSeconds(0);
    setIsRunning(false);
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const remainingSeconds = targetTime - elapsedSeconds;
  const isOvertime = remainingSeconds < 0;

  useEffect(() => {
    if (isOvertime && onTimeUp && remainingSeconds === 0) {
      onTimeUp();
    }
  }, [isOvertime, remainingSeconds, onTimeUp]);

  return {
    elapsedSeconds,
    remainingSeconds,
    isOvertime,
    isRunning,
    start,
    pause,
    reset,
  };
}
