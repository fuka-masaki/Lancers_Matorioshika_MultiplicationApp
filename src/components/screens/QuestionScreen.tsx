import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LevelConfig, ProblemInstance, AttemptRecord, AnimationType } from '@/types';
import {
  Button,
  Timer,
  NumberInput,
  NumberInputRef,
  ProblemDisplay,
  CustomKeyboard,
} from '@/components/common';
import { generateProblems, getCorrectAnswer } from '@/utils/problemGenerator';
import { useTimer } from '@/hooks/useTimer';
import { usePageTransition } from '@/hooks/usePageTransition';
import { useIsMobile, useHasTouch, useIsIPad, useIsIPadLandscape } from '@/hooks/useMediaQuery';

interface QuestionScreenProps {
  levelConfig: LevelConfig;
  onComplete: (attempts: AttemptRecord[], totalTimeSpent: number, isTimedOut?: boolean) => void;
  onQuit: () => void;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = ({
  levelConfig,
  onComplete,
  onQuit,
}) => {
  const [problems] = useState<ProblemInstance[]>(() =>
    generateProblems(levelConfig)
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const attemptsRef = useRef<AttemptRecord[]>([]);
  const inputRef = useRef<NumberInputRef>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationType, setAnimationType] = useState<AnimationType | null>(null);
  const isVisible = usePageTransition();
  const isMobile = useIsMobile();
  const hasTouch = useHasTouch();
  const isIPad = useIsIPad();
  const isIPadLandscape = useIsIPadLandscape();

  // iPad または大画面でのキーボード表示状態
  const isLargeScreen = !isMobile && !isIPad; // iPadは除外
  const shouldShowKeyboardToggle = isIPad || isLargeScreen;
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(hasTouch && (isLargeScreen || isIPad));

  // iPad横向きでキーボードが表示されている場合、極小レイアウトモードにする
  const isCompactMode = isIPadLandscape && isKeyboardVisible;

  // iPad横向きになったら自動でキーボードを表示
  useEffect(() => {
    if (isIPadLandscape) {
      setIsKeyboardVisible(true);
    }
  }, [isIPadLandscape]);

  // カスタムキーボード表示切り替え時の処理
  const toggleKeyboard = () => {
    const newState = !isKeyboardVisible;
    setIsKeyboardVisible(newState);

    // カスタムキーボードを表示する場合、inputのフォーカスを外す（OSキーボード抑制）
    if (newState && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  // 時間切れ時の処理
  const handleTimeUp = useCallback(() => {
    const totalTimeSpent = levelConfig.targetTime;
    setTimeout(() => onComplete(attemptsRef.current, totalTimeSpent, true), 0);
  }, [levelConfig.targetTime, onComplete]);

  const timer = useTimer({
    targetTime: levelConfig.targetTime,
    onTimeUp: handleTimeUp,
  });

  const currentProblem = problems[currentIndex];

  // タイマー開始
  useEffect(() => {
    timer.start();
  }, []);

  // 問題が変わったら開始時刻を記録
  useEffect(() => {
    setQuestionStartTime(Date.now());
  }, [currentIndex]);

  // 大画面またはiPadでカスタムキーボード非表示の場合、問題が変わったらフォーカスを当てる
  useEffect(() => {
    if ((isLargeScreen || isIPad) && !isKeyboardVisible && !showCorrectAnswer && inputRef.current) {
      // 少し遅延させてDOMの更新を待つ
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [currentIndex, showCorrectAnswer, isLargeScreen, isIPad, isKeyboardVisible]);

  const moveToNextQuestion = useCallback(() => {
    setShowCorrectAnswer(false);
    setCorrectAnswer(null);
    setUserInput('');
    setShowAnimation(false);
    setAnimationType(null);

    if (currentIndex < problems.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // 最後の問題の場合、結果画面へ遷移
      timer.pause();
      const totalTimeSpent = levelConfig.targetTime - timer.remainingSeconds;
      setTimeout(() => onComplete(attemptsRef.current, totalTimeSpent), 0);
    }
  }, [currentIndex, problems.length, timer, levelConfig.targetTime, onComplete]);

  // 不正解時のEnterキーリスナー
  useEffect(() => {
    if (!showCorrectAnswer) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // input要素からのイベントは無視（NumberInputからのバブリングを防ぐ）
      if (e.target instanceof HTMLInputElement) return;

      if (e.key === 'Enter') {
        moveToNextQuestion();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showCorrectAnswer, moveToNextQuestion]);

  const handleSubmit = useCallback(() => {
    if (!currentProblem) return;

    const answer = getCorrectAnswer(currentProblem);
    const userAnswer = parseInt(userInput, 10);
    const isCorrect = !isNaN(userAnswer) && userAnswer === answer;
    const timeSpent = (Date.now() - questionStartTime) / 1000;

    // 解答記録を保存
    const attempt: AttemptRecord = {
      problemInstance: currentProblem,
      userAnswer: isNaN(userAnswer) ? -1 : userAnswer,
      isCorrect,
      timestamp: Date.now(),
      timeSpent,
    };

    // 解答記録を保存
    attemptsRef.current = [...attemptsRef.current, attempt];

    // 最後の問題かつ正解の場合は、ここで完了処理
    if (isCorrect && currentIndex === problems.length - 1) {
      timer.pause();
      // 次のレンダリングサイクルで onComplete を呼ぶ
      const totalTimeSpent = levelConfig.targetTime - timer.remainingSeconds;
      setTimeout(() => onComplete(attemptsRef.current, totalTimeSpent), 0);
    }

    if (isCorrect) {
      // 正解：アニメーション表示後、次の問題へ
      setAnimationType('correct');
      setShowAnimation(true);
      setTimeout(() => {
        setShowAnimation(false);
        if (currentIndex < problems.length - 1) {
          moveToNextQuestion();
        }
      }, 1000);
    } else {
      // 不正解：バッジを表示し続ける（次の問題に行くまで）
      setAnimationType('incorrect');
      setShowAnimation(true);

      // 正解を表示
      setCorrectAnswer(answer);
      setShowCorrectAnswer(true);
    }
  }, [currentProblem, userInput, questionStartTime, currentIndex, problems.length, timer, onComplete, moveToNextQuestion]);

  const handleInputChange = (value: string) => {
    if (!showCorrectAnswer) {
      setUserInput(value);
    }
  };

  const handleKeySubmit = () => {
    if (showCorrectAnswer) {
      // 不正解後のEnter：次の問題へ
      moveToNextQuestion();
    } else {
      // 通常のEnter：解答送信
      handleSubmit();
    }
  };

  // CustomKeyboard用のハンドラ
  const handleNumberClick = (num: string) => {
    if (!showCorrectAnswer && userInput.length < 2) {
      setUserInput(userInput + num);
    }
  };

  const handleClear = () => {
    setUserInput('');
  };

  const handleCustomKeyboardSubmit = () => {
    if (showCorrectAnswer) {
      moveToNextQuestion();
    } else {
      handleSubmit();
    }
  };

  if (!currentProblem) {
    return null;
  }

  // 問題表示用の値を決定
  const getDisplayValues = () => {
    const { problem, questionType } = currentProblem;

    // 不正解時の表示
    if (showCorrectAnswer && correctAnswer !== null) {
      switch (questionType) {
        case 'normal':
          // 通常問題：「=」の後に正解を表示
          return {
            multiplicand: problem.multiplicand,
            multiplier: problem.multiplier,
            answer: correctAnswer,
          };
        case 'missing_multiplicand':
          // 穴埋め（被乗数）：「?」を正解に置き換え
          return {
            multiplicand: correctAnswer,
            multiplier: problem.multiplier,
            answer: problem.answer,
          };
        case 'missing_multiplier':
          // 穴埋め（乗数）：「?」を正解に置き換え
          return {
            multiplicand: problem.multiplicand,
            multiplier: correctAnswer,
            answer: problem.answer,
          };
      }
    }

    // 通常時（解答前）の表示
    switch (questionType) {
      case 'normal':
        return {
          multiplicand: problem.multiplicand,
          multiplier: problem.multiplier,
          answer: undefined,
        };
      case 'missing_multiplicand':
        return {
          multiplicand: '?' as const,
          multiplier: problem.multiplier,
          answer: problem.answer,
        };
      case 'missing_multiplier':
        return {
          multiplicand: problem.multiplicand,
          multiplier: '?' as const,
          answer: problem.answer,
        };
    }
  };

  const displayValues = getDisplayValues();

  // 不正解時に赤色で強調表示する部分を決定
  const getHighlightPart = (): 'multiplicand' | 'multiplier' | 'answer' | undefined => {
    if (!showCorrectAnswer) return undefined;

    const { questionType } = currentProblem;
    switch (questionType) {
      case 'normal':
        return 'answer';
      case 'missing_multiplicand':
        return 'multiplicand';
      case 'missing_multiplier':
        return 'multiplier';
    }
  };

  const highlightPart = getHighlightPart();

  return (
    <div className={`question-screen h-[100dvh] bg-slate-50 flex flex-col transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* ヘッダー - モバイル＆タブレット用コンパクト版 */}
      <header className={`bg-blue-600 shadow-lg px-3 sm:px-4 flex-shrink-0 z-10 ${isCompactMode ? 'py-2' : 'py-1.5 xs:py-2 sm:py-3'
        }`}>
        <div className="container mx-auto">
          {/* モバイル＆タブレット：2行レイアウト */}
          {isMobile ? (
            <div>
              {/* 1行目: レベル情報 + やめるボタン */}
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xs xs:text-sm font-bold text-white truncate">
                  レベル{levelConfig.id}: {levelConfig.title}
                </h2>
                <button
                  onClick={onQuit}
                  className="text-xs text-white border border-white/60 hover:bg-white/10 px-2 py-0.5 xs:px-2.5 xs:py-1 rounded transition-all whitespace-nowrap ml-2 flex-shrink-0"
                >
                  やめる
                </button>
              </div>

              {/* 2行目: 問題番号 + タイマー */}
              <div className="flex items-center gap-2 xs:gap-3">
                <div className="text-xs font-semibold text-blue-100 whitespace-nowrap">
                  問題 {currentIndex + 1}/{problems.length}
                </div>
                <div className="text-blue-100 text-xs">•</div>
                <Timer
                  remainingSeconds={timer.remainingSeconds}
                  totalSeconds={levelConfig.targetTime}
                  isOvertime={timer.isOvertime}
                  compact={true}
                />
              </div>
            </div>
          ) : (
            /* デスクトップ：従来のレイアウト */
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h1 className={`font-bold text-white ${isCompactMode ? 'text-lg' : 'text-lg sm:text-xl md:text-2xl'}`}>
                  レベル{levelConfig.id}: {levelConfig.title}
                </h1>
              </div>

              <div className="text-xs sm:text-sm text-blue-100">
                問題 {currentIndex + 1} / {problems.length}
              </div>

              {/* コンパクトモード時はやめるボタンもヘッダーに */}
              {isCompactMode && (
                <button
                  onClick={onQuit}
                  className="text-xs text-white border border-white/60 hover:bg-white/10 px-3 py-1 rounded transition-all whitespace-nowrap ml-2"
                >
                  やめる
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* タイマー - デスクトップ・iPad表示 (コンパクトモード含む) */}
      {!isMobile && (
        <div className={isCompactMode ? 'py-1' : isIPadLandscape ? 'py-2' : 'py-4 sm:py-6'}>
          <Timer
            remainingSeconds={timer.remainingSeconds}
            totalSeconds={levelConfig.targetTime}
            isOvertime={timer.isOvertime}
            isIPadLandscape={isIPadLandscape}
            compact={false} // バーを表示するためにfalse
          />
        </div>
      )}

      {/* 問題表示エリア */}
      <div className="flex-1 flex flex-col lg:justify-center overflow-hidden">
        {/* モバイル＆iPad（キーボード表示時）：問題エリア */}
        {(isMobile || (isIPad && isKeyboardVisible)) && (
          <div className={`flex-1 flex flex-col overflow-y-auto ${isCompactMode ? 'px-4 justify-center' : 'px-3 sm:px-6'
            }`}>
            {/* フィードバック表示 - iPad横向き用に最適化 */}
            <div className={`flex items-center justify-center flex-shrink-0 ${isCompactMode ? 'h-8 mb-2' : isIPadLandscape ? 'h-6 mt-1 mb-1' : 'h-8 xs:h-10 mt-2 mb-2'
              }`}>
              {showAnimation && animationType && (
                <div className={`
                  rounded-full shadow-lg font-bold
                  animate-slide-up
                  ${isCompactMode
                    ? 'px-6 py-1.5 text-lg bg-opacity-95 backdrop-blur-sm shadow-xl'
                    : isIPadLandscape
                      ? 'px-3 py-0.5 text-sm'
                      : 'px-4 py-1 xs:px-5 xs:py-1.5 text-base xs:text-lg'
                  }
                  ${animationType === 'correct'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  }
                `}>
                  {animationType === 'correct' ? '○せいかい' : <><span className={`font-extrabold ${isIPadLandscape ? 'text-base' : 'text-lg xs:text-xl'}`}>×</span> ふせいかい</>}
                </div>
              )}
            </div>

            {/* 問題カード - iPad横向き+キーボード表示時のみパディング最適化 */}
            <div className={`bg-white rounded-2xl shadow-xl shadow-blue-500/10 max-w-2xl mx-auto w-full flex-shrink-0 ${isCompactMode ? 'p-4' : isIPadLandscape && isKeyboardVisible ? 'p-2 sm:p-3' : isIPad ? 'p-4 sm:p-6' : 'p-4 xs:p-5 sm:p-8'
              }`}>
              {levelConfig.id === 1 && (
                <div className={`text-center text-slate-600 ${isCompactMode
                    ? 'mb-1 text-xs'
                    : isIPadLandscape && isKeyboardVisible
                      ? 'mb-1 text-[10px] sm:text-xs'
                      : isIPad
                        ? 'mb-2 text-xs sm:text-sm'
                        : 'mb-2 xs:mb-3 sm:mb-4 text-xs sm:text-sm'
                  }`}>
                  れんしゅうちゅう
                </div>
              )}

              <ProblemDisplay
                multiplicand={displayValues.multiplicand}
                multiplier={displayValues.multiplier}
                answer={displayValues.answer}
                reading={currentProblem.problem.reading}
                showReading={levelConfig.hasReading}
                questionType={currentProblem.questionType}
                highlightPart={highlightPart}
                isIPad={isIPad}
                isIPadLandscape={isIPadLandscape}
                isKeyboardVisible={isKeyboardVisible}
                // コンパクトモードでもサイズを少し大きく保つためにpropsを調整
                size={isCompactMode ? 'large' : undefined}
              />

              {/* 入力表示欄 - iPad横向き+キーボード表示時のみサイズ調整 */}
              <div className={`flex justify-center ${isCompactMode ? 'mt-3' : isIPadLandscape && isKeyboardVisible ? 'mt-1 sm:mt-2' : isIPad ? 'mt-3 sm:mt-4' : 'mt-4 xs:mt-5 sm:mt-6'
                }`}>
                <NumberInput
                  value={userInput}
                  onChange={() => { }}
                  onSubmit={() => { }}
                  disabled={showCorrectAnswer}
                  readOnly={true}
                  autoFocus={false}
                  inputMode="none"
                  className={`${isCompactMode
                      ? 'w-20 h-14 text-3xl'
                      : isIPadLandscape && isKeyboardVisible
                        ? 'w-14 h-10 text-xl'
                        : isIPad
                          ? 'w-20 h-14 text-3xl'
                          : 'w-16 h-12 xs:w-20 xs:h-14 sm:w-24 sm:h-16 text-2xl xs:text-3xl sm:text-4xl'
                    } ${showCorrectAnswer ? 'border-red-500 bg-red-50' : ''}`}
                />
              </div>
            </div>
          </div>
        )}

        {/* 不正解時のメッセージ - キーボードの上に配置 */}
        {(isMobile || (isIPad && isKeyboardVisible)) && showCorrectAnswer && (
          <div className={`bg-slate-100 border-t border-slate-200 flex-shrink-0 ${isCompactMode ? 'py-1 px-2' : 'py-2 px-3'
            }`}>
            <p className={`text-slate-600 text-center ${isCompactMode ? 'text-xs' : 'text-xs xs:text-sm'}`}>
              →ボタンを押して次の問題へ
            </p>
          </div>
        )}

        {/* デスクトップ または iPad（キーボード非表示時）：従来通り */}
        {(!isMobile && !(isIPad && isKeyboardVisible)) && (
          <div className="flex flex-col items-center justify-center px-4">
            {/* フィードバック表示 - iPad横向き用に最適化 */}
            <div className={`flex items-center justify-center ${isIPadLandscape ? 'h-8 mb-2' : 'h-12 mb-4'
              }`}>
              {showAnimation && animationType && (
                <div className={`
                  rounded-full shadow-lg font-bold
                  animate-slide-up
                  ${isIPadLandscape
                    ? 'px-4 py-1 text-base'
                    : 'px-6 py-2 text-xl'
                  }
                  ${animationType === 'correct'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  }
                `}>
                  {animationType === 'correct' ? '○せいかい' : <><span className={`font-extrabold ${isIPadLandscape ? 'text-lg' : 'text-2xl'}`}>×</span> ふせいかい</>}
                </div>
              )}
            </div>

            <div className={`question-container bg-white rounded-2xl shadow-2xl shadow-blue-500/10 max-w-4xl w-full ${isIPadLandscape && isKeyboardVisible
                ? 'p-4 lg:p-6'
                : isIPadLandscape
                  ? 'p-6 lg:p-8'
                  : 'p-8 lg:p-12'
              }`}>
              {levelConfig.id === 1 && (
                <div className={`text-center text-slate-600 text-base ${isIPadLandscape && isKeyboardVisible ? 'mb-3' : isIPadLandscape ? 'mb-4' : 'mb-6'
                  }`}>
                  れんしゅうちゅう
                </div>
              )}

              <ProblemDisplay
                multiplicand={displayValues.multiplicand}
                multiplier={displayValues.multiplier}
                answer={displayValues.answer}
                reading={currentProblem.problem.reading}
                showReading={levelConfig.hasReading}
                questionType={currentProblem.questionType}
                highlightPart={highlightPart}
                isIPad={isIPad}
                isIPadLandscape={isIPadLandscape}
                isKeyboardVisible={isKeyboardVisible}
              />

              {/* 入力欄 - iPad横向き用にサイズ調整 */}
              <div className={`flex flex-col items-center gap-4 ${isIPadLandscape && isKeyboardVisible ? 'mt-4' : isIPadLandscape ? 'mt-6' : 'mt-8'
                }`}>
                <NumberInput
                  ref={inputRef}
                  value={userInput}
                  onChange={isKeyboardVisible ? () => { } : handleInputChange}
                  onSubmit={isKeyboardVisible ? () => { } : handleKeySubmit}
                  disabled={showCorrectAnswer}
                  autoFocus={!isKeyboardVisible}
                  readOnly={isKeyboardVisible}
                  inputMode={isKeyboardVisible ? 'none' : 'text'}
                  className={`${isIPadLandscape && isKeyboardVisible
                      ? 'w-20 h-14 text-3xl'
                      : 'w-24 h-16 text-4xl'
                    } ${showCorrectAnswer ? 'border-red-500 bg-red-50' : ''}`}
                />

                {showCorrectAnswer && (
                  <p className="text-base text-slate-600">
                    Enterを押して次の問題へ
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* モバイル：カスタムキーボード（常時表示） */}
      {isMobile && !isIPad && (
        <div className="bg-slate-100 border-t border-slate-200 pt-2 xs:pt-3 pb-2 xs:pb-3 safe-area-inset-bottom flex-shrink-0">
          <CustomKeyboard
            onNumberClick={handleNumberClick}
            onClear={handleClear}
            onSubmit={handleCustomKeyboardSubmit}
            disabled={false}
            showNext={showCorrectAnswer}
          />
        </div>
      )}

      {/* iPad・大画面用：カスタムキーボード（トグル式） */}
      {shouldShowKeyboardToggle && isKeyboardVisible && (
        <div className={`bg-slate-100 border-t border-slate-200 animate-slide-up flex-shrink-0 ${isCompactMode ? 'pt-1 pb-1' : 'pt-3 pb-3 sm:pt-4 sm:pb-4'
          }`}>
          <CustomKeyboard
            onNumberClick={handleNumberClick}
            onClear={handleClear}
            onSubmit={handleCustomKeyboardSubmit}
            disabled={false}
            showNext={showCorrectAnswer}
            isIPad={isIPad}
            isLandscape={isCompactMode}
          />
        </div>
      )}

      {/* フッター - デスクトップ・iPad表示 */}
      {(!isMobile || isIPad) && (
        <div className={`flex justify-between items-center ${isCompactMode ? 'p-1.5' : 'p-3 sm:p-4 md:p-6'
          }`}>
          {/* キーボードトグルボタン - iPad・大画面 */}
          {shouldShowKeyboardToggle && (
            <button
              onClick={toggleKeyboard}
              className={`bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-2 ${isCompactMode ? 'px-3 py-1.5 text-xs' : isIPad ? 'px-4 py-2 text-sm' : 'px-6 py-3'
                }`}
            >
              <span className={isCompactMode ? 'text-base' : 'text-xl'}>{isKeyboardVisible ? '▼' : '⌨️'}</span>
              <span>{isKeyboardVisible ? 'キーボードを閉じる' : 'キーボードを表示'}</span>
            </button>
          )}
          <div className={shouldShowKeyboardToggle ? '' : 'ml-auto'}>
            {!isCompactMode && (
              <Button variant="danger" onClick={onQuit}>
                やめる
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
