import { useState } from 'react';
import { LevelSelectScreen, QuestionScreen, ResultScreen, PrintPreviewScreen, ResultPreviewScreen } from '@/components/screens';
import { getLevelConfig } from '@/data/dataLoader';
import { AttemptRecord, LevelResult } from '@/types';
import { createLevelResult } from '@/utils/resultAnalyzer';
import { generatePrintData } from '@/utils/printDataGenerator';

type ScreenType = 'levelSelect' | 'question' | 'result' | 'printPreview' | 'resultPreview';

function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('levelSelect');
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [levelResult, setLevelResult] = useState<LevelResult | null>(null);

  const handleLevelSelect = (levelId: number) => {
    console.log('Selected level:', levelId);
    setSelectedLevel(levelId);
    setCurrentScreen('question');
  };

  const handleComplete = (attempts: AttemptRecord[], totalTimeSpent: number, isTimedOut: boolean = false) => {
    console.log('Quiz completed!', attempts, 'isTimedOut:', isTimedOut);

    if (!selectedLevel) return;

    const levelConfig = getLevelConfig(selectedLevel);
    if (!levelConfig) return;

    const result = createLevelResult(levelConfig, attempts, totalTimeSpent, isTimedOut);
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

  const handleRetry = () => {
    setLevelResult(null);
    setCurrentScreen('question');
  };

  const handlePrint = () => {
    setCurrentScreen('printPreview');
  };

  const handleClosePrintPreview = () => {
    setCurrentScreen('result');
  };

  const handleOpenResultPreview = () => {
    setCurrentScreen('resultPreview');
  };

  const levelConfig = selectedLevel ? getLevelConfig(selectedLevel) : null;

  return (
    <div>
      {currentScreen === 'levelSelect' && (
        <LevelSelectScreen
          onLevelSelect={handleLevelSelect}
          onOpenResultPreview={handleOpenResultPreview}
        />
      )}

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
          onRetry={handleRetry}
          onPrint={handlePrint}
        />
      )}

      {currentScreen === 'printPreview' && levelConfig && levelResult && (
        <PrintPreviewScreen
          printData={generatePrintData(levelConfig, levelResult)}
          onClose={handleClosePrintPreview}
        />
      )}

      {currentScreen === 'resultPreview' && (
        <ResultPreviewScreen
          onBackToLevelSelect={handleBackToLevelSelect}
        />
      )}
    </div>
  );
}

export default App;
