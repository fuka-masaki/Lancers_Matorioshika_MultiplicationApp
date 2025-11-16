import React from 'react';
import { WrongAnswerRecord } from '@/types';

interface WrongAnswerListProps {
  wrongAnswers: WrongAnswerRecord[];
}

export const WrongAnswerList: React.FC<WrongAnswerListProps> = ({
  wrongAnswers,
}) => {
  const formatProblem = (record: WrongAnswerRecord): string => {
    const { problem, questionType } = record;

    switch (questionType) {
      case 'normal':
        return `${problem.multiplicand} × ${problem.multiplier} = ${problem.answer}`;
      case 'missing_multiplicand':
        return `? × ${problem.multiplier} = ${problem.answer}`;
      case 'missing_multiplier':
        return `${problem.multiplicand} × ? = ${problem.answer}`;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="text-4xl">💡</div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            この九九をおぼえてね！
          </h2>
          <p className="text-sm text-gray-600">
            {new Date().toLocaleDateString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {wrongAnswers.map((record, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-2 ${
              record.wrongCount === 2
                ? 'border-red-400 bg-red-50'
                : 'border-orange-300 bg-orange-50'
            }`}
          >
            <div className="flex items-center gap-2">
              {record.wrongCount === 2 && (
                <span className="text-xl">⭐</span>
              )}
              <span className="text-xl font-bold text-gray-800">
                {formatProblem(record)}
              </span>
            </div>
            {record.wrongCount === 2 && (
              <div className="text-xs text-red-600 mt-1">
                2回間違えました
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 text-sm text-gray-600 text-center">
        ⭐は2回間違えた問題です
      </div>
    </div>
  );
};
