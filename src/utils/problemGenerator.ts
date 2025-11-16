import {
  ProblemInstance,
  QuestionType,
  LevelConfig,
} from '@/types';
import { getProblemsByRange, getMultiplicationProblems } from '@/data/dataLoader';

/**
 * シャッフル関数
 */
function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * ランダムな問題形式を取得（穴あきチャレンジ用）
 */
function getRandomQuestionType(): QuestionType {
  const types: QuestionType[] = ['normal', 'missing_multiplicand', 'missing_multiplier'];
  return types[Math.floor(Math.random() * types.length)];
}

/**
 * レベル設定に基づいて問題を生成
 */
export function generateProblems(config: LevelConfig): ProblemInstance[] {
  // 範囲内の問題を取得
  const baseProblems = config.range.min === 1 && config.range.max === 9
    ? getMultiplicationProblems()
    : getProblemsByRange(config.range.min, config.range.max);

  // 2周分の問題を生成
  const round1 = config.isRandom ? shuffle(baseProblems) : baseProblems;
  const round2 = config.isRandom ? shuffle(baseProblems) : baseProblems;

  const allProblems: ProblemInstance[] = [];

  // 1周目
  round1.forEach((problem) => {
    allProblems.push({
      problem,
      questionType: config.isHoleQuestion ? getRandomQuestionType() : 'normal',
      index: allProblems.length,
      roundNumber: 1,
    });
  });

  // 2周目
  round2.forEach((problem) => {
    allProblems.push({
      problem,
      questionType: config.isHoleQuestion ? getRandomQuestionType() : 'normal',
      index: allProblems.length,
      roundNumber: 2,
    });
  });

  return allProblems;
}

/**
 * 問題インスタンスから正解を取得
 */
export function getCorrectAnswer(instance: ProblemInstance): number {
  const { problem, questionType } = instance;

  switch (questionType) {
    case 'normal':
      return problem.answer;
    case 'missing_multiplicand':
      return problem.multiplicand;
    case 'missing_multiplier':
      return problem.multiplier;
  }
}

/**
 * 問題の一意のキーを生成
 */
export function generateProblemKey(
  multiplicand: number,
  multiplier: number,
  questionType: QuestionType
): string {
  return `${multiplicand}_${multiplier}_${questionType}`;
}
