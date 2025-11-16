import { MultiplicationProblem, LevelConfig } from '@/types';
import multiplicationProblemsData from './multiplicationProblems.json';
import levelConfigsData from './levelConfigs.json';

/**
 * 九九の問題データを取得
 *
 * @returns 全81問の九九問題データ
 * @example
 * const problems = getMultiplicationProblems();
 * console.log(problems.length); // 81
 */
export function getMultiplicationProblems(): MultiplicationProblem[] {
  return multiplicationProblemsData as MultiplicationProblem[];
}

/**
 * 特定の範囲の問題を取得
 *
 * @param min - 最小の段（例: 1）
 * @param max - 最大の段（例: 5）
 * @returns 指定範囲の問題データ
 * @example
 * const problems = getProblemsByRange(1, 5); // 1～5のだん（45問）
 */
export function getProblemsByRange(min: number, max: number): MultiplicationProblem[] {
  const allProblems = getMultiplicationProblems();
  return allProblems.filter(
    (p) => p.multiplicand >= min && p.multiplicand <= max
  );
}

/**
 * レベル設定を取得
 *
 * @returns 全7つのレベル設定
 * @example
 * const configs = getLevelConfigs();
 * console.log(configs.length); // 7
 */
export function getLevelConfigs(): LevelConfig[] {
  return levelConfigsData as LevelConfig[];
}

/**
 * 特定のレベル設定を取得
 *
 * @param levelId - レベルID（1〜7）
 * @returns 指定されたレベルの設定。存在しない場合はundefined
 * @example
 * const level1 = getLevelConfig(1);
 * console.log(level1?.title); // "1～5のだん"
 */
export function getLevelConfig(levelId: number): LevelConfig | undefined {
  const configs = getLevelConfigs();
  return configs.find((config) => config.id === levelId);
}
