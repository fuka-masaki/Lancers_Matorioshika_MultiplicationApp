import { useState } from 'react';
import { QuestionScreen, ResultScreen, PrintPreviewScreen } from '@/components/screens';
import { getLevelConfig } from '@/data/dataLoader';
import { AttemptRecord, LevelResult } from '@/types';
import { createLevelResult } from '@/utils/resultAnalyzer';
import { generatePrintData } from '@/utils/printDataGenerator';

type ScreenType = 'levelSelect' | 'question' | 'result' | 'printPreview';

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('levelSelect');
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [levelResult, setLevelResult] = useState<LevelResult | null>(null);

  const handleLevelSelect = (levelId: number) => {
    console.log('Selected level:', levelId);
    setSelectedLevel(levelId);
    setCurrentScreen('question');
  };

  const handleComplete = (attempts: AttemptRecord[], totalTimeSpent: number) => {
    console.log('Quiz completed!', attempts);

    if (!selectedLevel) return;

    const levelConfig = getLevelConfig(selectedLevel);
    if (!levelConfig) return;

    const result = createLevelResult(levelConfig, attempts, totalTimeSpent);
    setLevelResult(result);
    setCurrentScreen('result');
  };

  const handleQuit = () => {
    setSelectedLevel(null);
    setLevelResult(null);
    setCurrentScreen('levelSelect');
  };

  const handleBackToLevelSelect = () => {
    setSelectedLevel(null);
    setLevelResult(null);
    setCurrentScreen('levelSelect');
  };

  const handlePrint = () => {
    setCurrentScreen('printPreview');
  };

  const handleClosePrintPreview = () => {
    setCurrentScreen('result');
  };

  // 簡易的なレベル選択画面（TICKET-005で正式に実装予定）
  const SimpleLevelSelect = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          九九マスター
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6, 7].map((levelId) => (
            <button
              key={levelId}
              onClick={() => handleLevelSelect(levelId)}
              className="px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-bold text-lg"
            >
              レベル {levelId}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const levelConfig = selectedLevel ? getLevelConfig(selectedLevel) : null;

  return (
    <div>
      {currentScreen === 'levelSelect' && <SimpleLevelSelect />}

      {currentScreen === 'question' && levelConfig && (
        <QuestionScreen
          levelConfig={levelConfig}
          onComplete={handleComplete}
          onQuit={handleQuit}
        />
      )}

      {currentScreen === 'result' && levelConfig && levelResult && (
        <ResultScreen
          levelConfig={levelConfig}
          result={levelResult}
          onBackToLevelSelect={handleBackToLevelSelect}
          onPrint={handlePrint}
        />
      )}

      {currentScreen === 'printPreview' && levelConfig && levelResult && (
        <PrintPreviewScreen
          printData={generatePrintData(levelConfig, levelResult)}
          onClose={handleClosePrintPreview}
        />
      )}
    </div>
  );
}

export default App;
