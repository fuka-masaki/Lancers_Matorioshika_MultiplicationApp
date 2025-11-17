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

  const levelConfig = selectedLevel ? getLevelConfig(selectedLevel) : null;

  return (
    <div>
      {currentScreen === 'levelSelect' && (
        <LevelSelectScreen
          onLevelSelect={handleLevelSelect}
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
