import React, { useState } from 'react';
import { LevelConfig } from '@/types';
import { formatTime } from '@/utils/timeUtils';

interface LevelCardProps {
  config: LevelConfig;
  onClick: () => void;
}

export const LevelCard: React.FC<LevelCardProps> = ({ config, onClick }) => {
  const { id, title, description, totalQuestions, targetTime } = config;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        w-full p-4 sm:p-6 min-h-[100px] sm:min-h-[120px] bg-white rounded-xl shadow-md
        transition-all duration-300
        hover:shadow-xl hover:scale-105 active:scale-95
        border-2 border-transparent hover:border-purple-400
        ${isHovered ? 'animate-float' : ''}
      `}
    >
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold">
            {id}
          </div>
          <div className="text-left">
            <h3 className="text-base sm:text-lg font-bold text-gray-800">{title}</h3>
            <p className="text-xs sm:text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-between text-xs sm:text-sm text-gray-600 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
        <span>問題数: {totalQuestions}問</span>
        <span>目標: {formatTime(targetTime)}</span>
      </div>
    </button>
  );
};
