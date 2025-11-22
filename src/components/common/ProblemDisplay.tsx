import React from 'react';
import { QuestionType, Reading } from '@/types';

interface ProblemDisplayProps {
  multiplicand: number | '?';
  multiplier: number | '?';
  answer?: number;
  reading?: Reading;
  showReading?: boolean;
  questionType: QuestionType;
  size?: 'small' | 'medium' | 'large';
  highlightPart?: 'multiplicand' | 'multiplier' | 'answer'; // 赤色で強調表示する部分
  isIPad?: boolean; // iPad用の最適化フラグ
  isIPadLandscape?: boolean; // iPad横向き用の最適化フラグ
  isKeyboardVisible?: boolean; // キーボード表示時のみ最適化を適用
}

export const ProblemDisplay: React.FC<ProblemDisplayProps> = ({
  multiplicand,
  multiplier,
  answer,
  reading,
  showReading = false,
  questionType: _questionType,
  size = 'large',
  highlightPart,
  isIPad = false,
  isIPadLandscape = false,
  isKeyboardVisible = false,
}) => {
  // iPad横向きでキーボード表示時のみコンパクト化
  const shouldCompact = isIPadLandscape && isKeyboardVisible;

  const sizeClasses = {
    small: 'text-2xl',
    medium: 'text-4xl',
    large: shouldCompact
      ? 'text-2xl sm:text-3xl' // iPad横向き+キーボード表示時：コンパクト
      : isIPad
      ? 'text-3xl sm:text-4xl' // iPad縦向き：コンパクト
      : 'text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl', // モバイル・デスクトップ最適化
  };

  const readingSize = {
    small: 'text-sm',
    medium: 'text-base',
    large: shouldCompact
      ? 'text-[10px] sm:text-xs' // iPad横向き+キーボード表示時：小さい読み仮名
      : isIPad
      ? 'text-xs sm:text-sm' // iPad縦向き：コンパクトな読み仮名
      : 'text-[10px] xs:text-xs sm:text-sm md:text-base lg:text-xl', // モバイル・デスクトップ最適化
  };

  const NumberWithReading: React.FC<{
    value: number | '?';
    readingText?: string;
    isHighlighted?: boolean;
  }> = ({ value, readingText, isHighlighted = false }) => (
    <div className="flex flex-col items-center">
      {showReading && readingText && (
        <span className={`${readingSize[size]} mb-0.5 sm:mb-1 ${isHighlighted ? 'text-red-500' : 'text-slate-600'}`}>
          {readingText}
        </span>
      )}
      <span className={`${sizeClasses[size]} font-bold ${isHighlighted ? 'text-red-500' : ''}`}>{value}</span>
    </div>
  );

  // iPad横向き+キーボード表示時のみギャップを調整
  const gapClass = shouldCompact
    ? 'gap-2 sm:gap-3' // iPad横向き+キーボード表示時：小さいギャップ
    : 'gap-1 xs:gap-2 sm:gap-4 md:gap-6'; // 通常のギャップ

  return (
    <div className={`flex items-center justify-center ${gapClass}`}>
      <NumberWithReading
        value={multiplicand}
        readingText={reading?.multiplicand}
        isHighlighted={highlightPart === 'multiplicand'}
      />
      <span className={`${sizeClasses[size]} font-bold text-slate-700`}>×</span>
      <NumberWithReading
        value={multiplier}
        readingText={reading?.multiplier}
        isHighlighted={highlightPart === 'multiplier'}
      />
      <div className="flex flex-col items-center">
        {showReading && reading && (
          <span className={`${readingSize[size]} mb-0.5 sm:mb-1 text-slate-600`}>
            {reading.equals}
          </span>
        )}
        <span className={`${sizeClasses[size]} font-bold text-slate-700`}>=</span>
      </div>
      {answer !== undefined && (
        <NumberWithReading
          value={answer}
          readingText={reading?.answer}
          isHighlighted={highlightPart === 'answer'}
        />
      )}
    </div>
  );
};
