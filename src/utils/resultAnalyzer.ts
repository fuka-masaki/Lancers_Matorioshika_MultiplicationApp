import {
  AttemptRecord,
  WrongAnswerRecord,
  LevelResult,
  LevelConfig,
} from '@/types';
import { generateProblemKey } from './problemGenerator';

/**
 * 間違えた問題を集計
 * 重複の定義: 被乗数、乗数、問題形式の3つが全て一致
 */
export function analyzeWrongAnswers(
  attempts: AttemptRecord[]
): WrongAnswerRecord[] {
  const wrongMap = new Map<string, WrongAnswerRecord>();

  attempts.forEach((attempt) => {
    if (!attempt.isCorrect) {
      const { problemInstance } = attempt;
      const key = generateProblemKey(
        problemInstance.problem.multiplicand,
        problemInstance.problem.multiplier,
        problemInstance.questionType
      );

      if (wrongMap.has(key)) {
        const existing = wrongMap.get(key)!;
        existing.wrongCount = Math.min(existing.wrongCount + 1, 2) as 1 | 2;
        existing.attempts.push(attempt);
      } else {
        wrongMap.set(key, {
          problem: problemInstance.problem,
          questionType: problemInstance.questionType,
          wrongCount: 1,
          attempts: [attempt],
        });
      }
    }
  });

  return Array.from(wrongMap.values());
}

/**
 * レベル結果を生成
 */
export function createLevelResult(
  levelConfig: LevelConfig,
  attempts: AttemptRecord[],
  totalTimeSpent: number,
  isTimedOut: boolean = false
): LevelResult {
  const answeredQuestions = attempts.length;
  const totalQuestions = levelConfig.totalQuestions;
  const correctAnswers = attempts.filter((a) => a.isCorrect).length;

  // 時間切れの場合、未解答問題は不正解扱い
  const wrongAnswers = totalQuestions - correctAnswers;
  const accuracy = totalQuestions > 0
    ? Math.round((correctAnswers / totalQuestions) * 100)
    : 0;
  const wrongAnswerRecords = analyzeWrongAnswers(attempts);

  // 時間切れの場合は必ず不合格
  const isPassed = !isTimedOut &&
    wrongAnswers === 0 &&
    totalTimeSpent <= levelConfig.targetTime;

  return {
    levelId: levelConfig.id,
    totalQuestions,
    correctAnswers,
    wrongAnswers,
    accuracy,
    totalTimeSpent,
    targetTime: levelConfig.targetTime,
    isPassed,
    isTimedOut,
    answeredQuestions,
    wrongAnswerRecords,
    allAttempts: attempts,
    date: new Date().toISOString(),
  };
}
