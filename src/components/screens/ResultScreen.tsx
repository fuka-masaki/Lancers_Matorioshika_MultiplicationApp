import React from 'react';
import { LevelResult, LevelConfig } from '@/types';
import { Button } from '@/components/common/Button';
import { formatTimeJapanese } from '@/utils/timeUtils';
import { WrongAnswerList } from '@/components/features/WrongAnswerList';
import { usePageTransition } from '@/hooks/usePageTransition';

interface ResultScreenProps {
  levelConfig: LevelConfig;
  result: LevelResult;
  onBackToLevelSelect: () => void;
  onPrint: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  levelConfig,
  result,
  onBackToLevelSelect,
  onPrint,
}) => {
  const isVisible = usePageTransition();
  const {
    accuracy,
    totalTimeSpent,
    targetTime,
    isPassed,
    wrongAnswerRecords,
  } = result;

  const hasWrongAnswers = wrongAnswerRecords.length > 0;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* ヘッダー */}
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-800 mb-2">
            結果発表
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            レベル{levelConfig.id}: {levelConfig.title}
          </p>
        </header>

        {/* 結果カード */}
        <div className="max-w-2xl mx-auto bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 mb-6 sm:mb-8">
          {/* タイムと正答率 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="text-center">
              <div className="text-xs sm:text-sm text-gray-600 mb-2">タイム</div>
              <div
                className={`text-2xl sm:text-3xl font-bold ${
                  totalTimeSpent <= targetTime
                    ? 'text-green-600'
                    : 'text-orange-600'
                }`}
              >
                {formatTimeJapanese(totalTimeSpent)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                目標: {formatTimeJapanese(targetTime)}
              </div>
            </div>

            <div className="text-center">
              <div className="text-xs sm:text-sm text-gray-600 mb-2">正答率</div>
              <div
                className={`text-2xl sm:text-3xl font-bold ${
                  accuracy === 100 ? 'text-green-600' : 'text-orange-600'
                }`}
              >
                {accuracy}%
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {result.correctAnswers}/{result.totalQuestions}問正解
              </div>
            </div>
          </div>

          {/* 合格/不合格メッセージ */}
          {isPassed ? (
            <div className="text-center py-6 sm:py-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
              <div className="text-5xl sm:text-6xl mb-4">🎉</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
                レベル{levelConfig.id} 合格！
              </h2>
              <p className="text-base sm:text-lg text-gray-700">
                {levelConfig.id < 7
                  ? `次のレベル${levelConfig.id + 1}へすすみましょう！`
                  : 'すべてのレベルをクリアしました！'}
              </p>
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl">
              <div className="text-5xl sm:text-6xl mb-4">💪</div>
              <h2 className="text-xl sm:text-2xl font-bold text-orange-600 mb-2">
                もう少し！
              </h2>
              <p className="text-sm sm:text-base text-gray-700">
                {hasWrongAnswers
                  ? '間違えた問題を復習してもう一度チャレンジしよう！'
                  : 'タイムを縮めてもう一度チャレンジしよう！'}
              </p>
            </div>
          )}
        </div>

        {/* 間違えた問題一覧 */}
        {hasWrongAnswers && (
          <div className="max-w-4xl mx-auto mb-6 sm:mb-8">
            <WrongAnswerList wrongAnswers={wrongAnswerRecords} />
          </div>
        )}

        {/* ボタン */}
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            variant="secondary"
            size="large"
            fullWidth
            onClick={onBackToLevelSelect}
          >
            レベル選択に戻る
          </Button>

          {hasWrongAnswers && (
            <Button
              variant="primary"
              size="large"
              fullWidth
              onClick={onPrint}
            >
              印刷する
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
