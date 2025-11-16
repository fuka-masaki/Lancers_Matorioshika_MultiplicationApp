import {
  WrongAnswerRecord,
  PrintableQuestion,
  PrintData,
  LevelResult,
  LevelConfig,
} from '@/types';
import { formatTimeJapanese } from './timeUtils';

const QUESTIONS_PER_PAGE = 15;

/**
 * 印刷用の問題データを生成
 */
export function generatePrintableQuestions(
  wrongAnswers: WrongAnswerRecord[]
): PrintableQuestion[] {
  return wrongAnswers.map((record, index) => {
    const { problem, questionType, wrongCount } = record;

    let displayText = '';
    let answerValue = 0;
    let missingPart: 'answer' | 'multiplicand' | 'multiplier' = 'answer';

    switch (questionType) {
      case 'normal':
        displayText = `${problem.multiplicand} × ${problem.multiplier} = `;
        answerValue = problem.answer;
        missingPart = 'answer';
        break;
      case 'missing_multiplicand':
        displayText = `× ${problem.multiplier} = ${problem.answer}`;
        answerValue = problem.multiplicand;
        missingPart = 'multiplicand';
        break;
      case 'missing_multiplier':
        displayText = `${problem.multiplicand} × = ${problem.answer}`;
        answerValue = problem.multiplier;
        missingPart = 'multiplier';
        break;
    }

    return {
      number: index + 1,
      problem,
      questionType,
      isDoubleWrong: wrongCount === 2,
      displayText,
      answerValue,
      missingPart,
    };
  });
}

/**
 * 印刷データを生成
 */
export function generatePrintData(
  levelConfig: LevelConfig,
  result: LevelResult
): PrintData {
  const questions = generatePrintableQuestions(result.wrongAnswerRecords);
  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);

  return {
    levelId: levelConfig.id,
    levelTitle: `レベル${levelConfig.id}: ${levelConfig.title}`,
    date: new Date(result.date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    accuracy: result.accuracy,
    timeSpent: formatTimeJapanese(result.totalTimeSpent),
    targetTime: formatTimeJapanese(result.targetTime),
    questions,
    totalPages,
  };
}
