import React, { useEffect, useState } from 'react';
import { AnimationType } from '@/types';

interface FeedbackAnimationProps {
  type: AnimationType;
  onComplete?: () => void;
  duration?: number;
}

/**
 * フィードバックアニメーションコンポーネント
 *
 * 正解時、不正解時、レベルクリア時、タイムアップ時のアニメーションを表示
 *
 * @example
 * <FeedbackAnimation type="correct" onComplete={() => console.log('done')} />
 */
export const FeedbackAnimation: React.FC<FeedbackAnimationProps> = ({
  type,
  onComplete,
  duration = 1000,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  if (!isVisible) return null;

  const animations = {
    correct: {
      emoji: '⭐',
      text: 'せいかい！',
      bgColor: 'from-green-400 to-blue-500',
      textColor: 'text-white',
    },
    incorrect: {
      emoji: '💪',
      text: 'もう一度！',
      bgColor: 'from-orange-400 to-red-500',
      textColor: 'text-white',
    },
    levelClear: {
      emoji: '🎉',
      text: 'レベルクリア！',
      bgColor: 'from-purple-400 to-pink-500',
      textColor: 'text-white',
    },
    timeUp: {
      emoji: '⏰',
      text: 'タイムアップ！',
      bgColor: 'from-yellow-400 to-orange-500',
      textColor: 'text-white',
    },
  };

  const animation = animations[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div
        className={`
          animate-bounce-in
          bg-gradient-to-br ${animation.bgColor}
          rounded-3xl shadow-2xl p-12
          transform transition-all duration-500
        `}
      >
        <div className="text-center">
          <div className="text-8xl mb-4 animate-scale-in">{animation.emoji}</div>
          <div className={`text-4xl font-black ${animation.textColor}`}>
            {animation.text}
          </div>
        </div>
      </div>
    </div>
  );
};
