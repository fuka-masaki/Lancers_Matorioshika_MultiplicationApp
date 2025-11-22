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
  onRetry: () => void;
  onPrint: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  levelConfig,
  result,
  onBackToLevelSelect,
  onRetry,
  onPrint,
}) => {
  const isVisible = usePageTransition();
  const {
    accuracy,
    totalTimeSpent,
    targetTime,
    isPassed,
    isTimedOut,
    answeredQuestions,
    totalQuestions,
    wrongAnswerRecords,
  } = result;

  const hasWrongAnswers = wrongAnswerRecords.length > 0;

  return (
    <div className={`min-h-[100dvh] bg-slate-50 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* ヘッダー */}
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-blue-900 mb-2">
            結果発表
          </h1>
          <p className="text-base sm:text-lg text-slate-600">
            レベル{levelConfig.id}: {levelConfig.title}
          </p>
        </header>

        {/* 結果カード */}
        <div className="max-w-2xl mx-auto bg-white rounded-xl sm:rounded-2xl shadow-2xl shadow-blue-500/10 p-6 sm:p-8 mb-6 sm:mb-8">
          {/* 時間切れバッジ */}
          {isTimedOut && (
            <div className="mb-4 sm:mb-6 bg-red-50 border-2 border-red-300 rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl sm:text-3xl">⏰</span>
                <span className="text-base sm:text-lg font-bold text-red-700">時間切れ</span>
              </div>
              <p className="text-xs sm:text-sm text-red-600 text-center mt-2">
                {answeredQuestions}/{totalQuestions}問 解答
              </p>
            </div>
          )}

          {/* タイムと正答率 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="text-center">
              <div className="text-xs sm:text-sm text-slate-600 mb-2">タイム</div>
              <div
                className={`text-2xl sm:text-3xl font-bold ${
                  totalTimeSpent <= targetTime
                    ? 'text-green-600'
                    : 'text-orange-600'
                }`}
              >
                {formatTimeJapanese(totalTimeSpent)}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                目標: {formatTimeJapanese(targetTime)}
              </div>
            </div>

            <div className="text-center">
              <div className="text-xs sm:text-sm text-slate-600 mb-2">正答率</div>
              <div
                className={`text-2xl sm:text-3xl font-bold ${
                  accuracy === 100 ? 'text-green-600' : 'text-orange-600'
                }`}
              >
                {accuracy}%
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {result.correctAnswers}/{result.totalQuestions}問正解
              </div>
            </div>
          </div>

          {/* 合格/不合格メッセージ */}
          {isPassed ? (
            <div className="text-center py-6 sm:py-8 bg-blue-50 border-l-8 border-blue-600 rounded-xl shadow-md">
              <div className="text-5xl sm:text-6xl mb-4">🎉</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">
                レベル{levelConfig.id} 合格！
              </h2>
              <p className="text-base sm:text-lg text-slate-700">
                {levelConfig.id < 7
                  ? `次のレベル${levelConfig.id + 1}へすすみましょう！`
                  : 'すべてのレベルをクリアしました！'}
              </p>
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8 bg-orange-50 border-l-8 border-orange-500 rounded-xl shadow-md">
              <div className="text-5xl sm:text-6xl mb-4">💪</div>
              <h2 className="text-xl sm:text-2xl font-bold text-orange-600 mb-2">
                もう少し！
              </h2>
              <p className="text-sm sm:text-base text-slate-700">
                {isTimedOut
                  ? '時間内にすべての問題を解けるように練習しよう！'
                  : hasWrongAnswers
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
        <div className="max-w-2xl mx-auto flex flex-col gap-3 mb-4 xs:mb-6 safe-area-inset-bottom">
          {/* もう一度チャレンジボタン */}
          <Button
            variant="primary"
            size="large"
            fullWidth
            onClick={onRetry}
          >
            もう一度チャレンジ
          </Button>

          {/* その他のボタン */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
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
                variant="secondary"
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
    </div>
  );
};
