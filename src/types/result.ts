import { LevelId } from './level';
import { AttemptRecord, WrongAnswerRecord } from './attempt';

/**
 * レベルクリア結果
 *
 * @example
 * const result: LevelResult = {
 *   levelId: 1,
 *   totalQuestions: 90,
 *   correctAnswers: 85,
 *   wrongAnswers: 5,
 *   accuracy: 94.4,
 *   totalTimeSpent: 250,
 *   targetTime: 240,
 *   isPassed: false,
 *   wrongAnswerRecords: [...],
 *   allAttempts: [...],
 *   date: "2025-11-16T08:45:00.000Z"
 * };
 */
export interface LevelResult {
  levelId: LevelId;
  totalQuestions: number;        // 総問題数
  correctAnswers: number;        // 正解数
  wrongAnswers: number;          // 不正解数
  accuracy: number;              // 正答率（0-100）
  totalTimeSpent: number;        // 実際にかかった時間（秒）
  targetTime: number;            // 目標タイム（秒）
  isPassed: boolean;             // 合格したか
  isTimedOut: boolean;           // 時間切れで終了したか
  answeredQuestions: number;     // 解答した問題数
  wrongAnswerRecords: WrongAnswerRecord[]; // 間違えた問題
  allAttempts: AttemptRecord[];  // 全ての解答記録
  date: string;                  // 実施日（ISO 8601形式）
}
