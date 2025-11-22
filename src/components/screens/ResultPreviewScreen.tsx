import React, { useState, useMemo } from 'react';
import { LevelId } from '@/types';
import { getLevelConfig } from '@/data/dataLoader';
import { ResultScreen } from './ResultScreen';
import { PrintPreviewScreen } from './PrintPreviewScreen';
import { Button } from '@/components/common/Button';
import { usePageTransition } from '@/hooks/usePageTransition';
import { generatePrintData } from '@/utils/printDataGenerator';
import {
  generateDummyResult,
  getPatternDisplayName,
  DummyResultPattern,
} from '@/utils/dummyResultGenerator';

interface ResultPreviewScreenProps {
  onBackToLevelSelect: () => void;
}

const LEVELS: LevelId[] = [1, 2, 3, 4, 5, 6, 7];
const PATTERNS: DummyResultPattern[] = ['perfect', 'allCorrect', 'fewWrong', 'manyWrong'];

export const ResultPreviewScreen: React.FC<ResultPreviewScreenProps> = ({
  onBackToLevelSelect,
}) => {
  const isVisible = usePageTransition();
  const [selectedLevel, setSelectedLevel] = useState<LevelId>(1);
  const [selectedPattern, setSelectedPattern] = useState<DummyResultPattern>('perfect');
  const [showResult, setShowResult] = useState(false);
  const [showPrint, setShowPrint] = useState(false);

  // 選択されたレベル設定と結果データを生成
  const levelConfig = useMemo(() => getLevelConfig(selectedLevel), [selectedLevel]);
  const resultData = useMemo(
    () => levelConfig ? generateDummyResult(levelConfig, selectedPattern) : null,
    [levelConfig, selectedPattern]
  );

  if (!levelConfig || !resultData) {
    return <div>レベル設定が見つかりません</div>;
  }

  // 印刷プレビュー画面を表示中の場合
  if (showPrint) {
    return (
      <PrintPreviewScreen
        printData={generatePrintData(levelConfig, resultData)}
        onClose={() => setShowPrint(false)}
      />
    );
  }

  // 結果画面を表示中の場合
  if (showResult) {
    return (
      <ResultScreen
        levelConfig={levelConfig}
        result={resultData}
        onBackToLevelSelect={() => setShowResult(false)}
        onRetry={() => setShowResult(false)}
        onPrint={() => setShowPrint(true)}
      />
    );
  }

  // 設定画面を表示
  return (
    <div
      className={`min-h-[100dvh] bg-gradient-to-br from-white to-blue-50 transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* ヘッダー */}
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-blue-900 mb-4">
            結果画面プレビュー
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-600">
            開発用：さまざまなパターンを確認できます
          </p>
        </header>

        {/* レベル選択 */}
        <div className="max-w-4xl mx-auto mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 text-center">
            レベルを選択
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 sm:gap-3">
            {LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`py-3 px-4 rounded-lg font-bold text-sm sm:text-base transition-all ${
                  selectedLevel === level
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                    : 'bg-white text-slate-700 hover:bg-blue-50 border-2 border-slate-200'
                }`}
              >
                Lv {level}
              </button>
            ))}
          </div>
        </div>

        {/* パターン選択 */}
        <div className="max-w-4xl mx-auto mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-4 text-center">
            表示パターンを選択
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {PATTERNS.map((pattern) => (
              <button
                key={pattern}
                onClick={() => setSelectedPattern(pattern)}
                className={`py-4 px-6 rounded-xl font-bold text-sm sm:text-base transition-all ${
                  selectedPattern === pattern
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30 scale-105'
                    : 'bg-white text-slate-700 hover:bg-blue-50 border-2 border-slate-200'
                }`}
              >
                {getPatternDisplayName(pattern)}
              </button>
            ))}
          </div>
        </div>

        {/* プレビューボタン */}
        <div className="max-w-md mx-auto flex flex-col gap-3 sm:gap-4">
          <Button
            variant="primary"
            size="large"
            fullWidth
            onClick={() => setShowResult(true)}
          >
            結果画面をプレビュー
          </Button>

          <Button
            variant="secondary"
            size="large"
            fullWidth
            onClick={onBackToLevelSelect}
          >
            レベル選択に戻る
          </Button>
        </div>

        {/* 選択中の情報 */}
        <div className="max-w-2xl mx-auto mt-8 p-4 sm:p-6 bg-white rounded-xl shadow-lg">
          <h3 className="text-lg font-bold text-slate-800 mb-3">選択中の設定</h3>
          <div className="space-y-2 text-sm sm:text-base text-slate-700">
            <p>
              <span className="font-semibold">レベル:</span> レベル{selectedLevel} -{' '}
              {levelConfig.title} ({levelConfig.description})
            </p>
            <p>
              <span className="font-semibold">パターン:</span>{' '}
              {getPatternDisplayName(selectedPattern)}
            </p>
            <p>
              <span className="font-semibold">問題数:</span> {levelConfig.totalQuestions}問
            </p>
            <p>
              <span className="font-semibold">目標タイム:</span> {levelConfig.targetTime}秒
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
