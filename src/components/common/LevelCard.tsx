import React from 'react';
import { LevelConfig } from '@/types';
import { formatTime } from '@/utils/timeUtils';

interface LevelCardProps {
  config: LevelConfig;
  onClick: () => void;
}

export const LevelCard: React.FC<LevelCardProps> = ({ config, onClick }) => {
  const { id, title, description, totalQuestions, targetTime } = config;

  return (
    <button
      onClick={onClick}
      className="w-full p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-transparent hover:border-purple-400"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
            {id}
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-between text-sm text-gray-600 mt-4 pt-4 border-t border-gray-200">
        <span>問題数: {totalQuestions}問</span>
        <span>目標: {formatTime(targetTime)}</span>
      </div>
    </button>
  );
};
