import React from 'react';
import { formatTime } from '@/utils/timeUtils';

interface TimerProps {
  remainingSeconds: number;
  totalSeconds: number;
  isOvertime?: boolean;
}

export const Timer: React.FC<TimerProps> = ({
  remainingSeconds,
  totalSeconds,
  isOvertime = false,
}) => {
  const percentage = Math.max(0, (remainingSeconds / totalSeconds) * 100);

  // 残り時間が少なくなったら色を変える
  const getColorClass = () => {
    if (isOvertime) return 'text-red-600 font-bold animate-pulse';
    if (percentage <= 20) return 'text-red-500 animate-shake';
    if (percentage <= 50) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`timer-display text-3xl md:text-4xl font-bold transition-all ${getColorClass()}`}>
        {isOvertime && '+'}{formatTime(Math.abs(remainingSeconds))}
      </div>
      <div className="w-full max-w-md h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`
            h-full transition-all duration-1000
            ${isOvertime ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-r from-green-400 to-blue-500'}
          `}
          style={{ width: `${isOvertime ? 100 : percentage}%` }}
        />
      </div>
      <div className="text-sm text-gray-600">
        目標タイム: {formatTime(totalSeconds)}
      </div>
    </div>
  );
};
