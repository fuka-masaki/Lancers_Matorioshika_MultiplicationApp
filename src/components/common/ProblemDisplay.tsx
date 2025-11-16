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
}

export const ProblemDisplay: React.FC<ProblemDisplayProps> = ({
  multiplicand,
  multiplier,
  answer,
  reading,
  showReading = false,
  questionType: _questionType,
  size = 'large',
}) => {
  const sizeClasses = {
    small: 'text-2xl',
    medium: 'text-4xl',
    large: 'text-6xl',
  };

  const readingSize = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-xl',
  };

  const NumberWithReading: React.FC<{
    value: number | '?';
    readingText?: string
  }> = ({ value, readingText }) => (
    <div className="flex flex-col items-center">
      {showReading && readingText && (
        <span className={`${readingSize[size]} text-gray-600 mb-1`}>
          {readingText}
        </span>
      )}
      <span className={`${sizeClasses[size]} font-bold`}>{value}</span>
    </div>
  );

  return (
    <div className="flex items-center justify-center gap-4 md:gap-6">
      <NumberWithReading
        value={multiplicand}
        readingText={reading?.multiplicand}
      />
      <span className={`${sizeClasses[size]} font-bold text-gray-700`}>×</span>
      <NumberWithReading
        value={multiplier}
        readingText={reading?.multiplier}
      />
      <div className="flex flex-col items-center">
        {showReading && reading && (
          <span className={`${readingSize[size]} text-gray-600 mb-1`}>
            {reading.equals}
          </span>
        )}
        <span className={`${sizeClasses[size]} font-bold text-gray-700`}>=</span>
      </div>
      {answer !== undefined && (
        <NumberWithReading
          value={answer}
          readingText={reading?.answer}
        />
      )}
    </div>
  );
};
