import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LevelConfig, ProblemInstance, AttemptRecord, AnimationType } from '@/types';
import {
  Button,
  Timer,
  NumberInput,
  ProblemDisplay,
} from '@/components/common';
import { FeedbackAnimation } from '@/components/features/FeedbackAnimation';
import { generateProblems, getCorrectAnswer } from '@/utils/problemGenerator';
import { useTimer } from '@/hooks/useTimer';
import { usePageTransition } from '@/hooks/usePageTransition';

interface QuestionScreenProps {
  levelConfig: LevelConfig;
  onComplete: (attempts: AttemptRecord[], totalTimeSpent: number) => void;
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
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<number | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationType, setAnimationType] = useState<AnimationType | null>(null);
  const isVisible = usePageTransition();

  const timer = useTimer({
    targetTime: levelConfig.targetTime,
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
      }, 800);
    } else {
      // 不正解：アニメーション表示後、正解を表示
      setAnimationType('incorrect');
      setShowAnimation(true);
      setTimeout(() => {
        setShowAnimation(false);
      }, 800);

      // 正解を表示
      setCorrectAnswer(answer);
      setShowCorrectAnswer(true);
    }
  }, [currentProblem, userInput, questionStartTime, currentIndex, problems.length, timer, onComplete]);

  const moveToNextQuestion = useCallback(() => {
    setShowCorrectAnswer(false);
    setCorrectAnswer(null);
    setUserInput('');

    if (currentIndex < problems.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, problems.length]);

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

  if (!currentProblem) {
    return null;
  }

  // 問題表示用の値を決定
  const getDisplayValues = () => {
    const { problem, questionType } = currentProblem;

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

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* ヘッダー */}
      <header className="bg-white shadow-md py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            レベル{levelConfig.id}: {levelConfig.title}
          </h1>
          <div className="text-sm text-gray-600">
            問題 {currentIndex + 1} / {problems.length}
          </div>
        </div>
      </header>

      {/* タイマー */}
      <div className="py-6">
        <Timer
          remainingSeconds={timer.remainingSeconds}
          totalSeconds={levelConfig.targetTime}
          isOvertime={timer.isOvertime}
        />
      </div>

      {/* 問題表示 */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-4xl w-full">
          {levelConfig.id === 1 && (
            <div className="text-center text-gray-600 mb-6">
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
          />

          {/* 入力欄 */}
          <div className="mt-8 flex flex-col items-center gap-4">
            {showCorrectAnswer ? (
              <div className="text-center">
                <div className="text-5xl font-bold text-red-500 mb-4">
                  {correctAnswer}
                </div>
                <p className="text-gray-600">
                  Enterを押して次の問題へ
                </p>
              </div>
            ) : (
              <NumberInput
                value={userInput}
                onChange={handleInputChange}
                onSubmit={handleKeySubmit}
                autoFocus
              />
            )}
          </div>
        </div>
      </div>

      {/* フッター */}
      <div className="p-6 flex justify-end">
        <Button variant="danger" onClick={onQuit}>
          やめる
        </Button>
      </div>

      {/* アニメーション */}
      {showAnimation && animationType && (
        <FeedbackAnimation type={animationType} />
      )}
    </div>
  );
};
