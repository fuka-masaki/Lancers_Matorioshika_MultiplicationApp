import { MultiplicationProblem } from '@/types';

/**
 * 九九データの整合性をチェック
 *
 * @param problems - 検証する九九問題データ
 * @returns 全てのチェックが通ればtrue、それ以外はfalse
 * @example
 * const problems = getMultiplicationProblems();
 * const isValid = validateMultiplicationData(problems);
 * console.log('Data validation:', isValid ? 'PASS' : 'FAIL');
 */
export function validateMultiplicationData(
  problems: MultiplicationProblem[]
): boolean {
  // 81問あるかチェック
  if (problems.length !== 81) {
    console.error(`Expected 81 problems, but got ${problems.length}`);
    return false;
  }

  // 各問題の整合性をチェック
  for (const problem of problems) {
    const { multiplicand, multiplier, answer } = problem;

    // 計算結果が正しいかチェック
    if (multiplicand * multiplier !== answer) {
      console.error(
        `Invalid calculation: ${multiplicand} × ${multiplier} should be ${multiplicand * multiplier}, but got ${answer}`
      );
      return false;
    }

    // 読み仮名が存在するかチェック
    if (!problem.reading || !problem.reading.multiplicand || !problem.reading.multiplier || !problem.reading.answer) {
      console.error(`Missing reading for ${multiplicand} × ${multiplier}`);
      return false;
    }

    // 等号の読みが「が」であることをチェック
    if (problem.reading.equals !== 'が') {
      console.error(`Invalid equals reading for ${multiplicand} × ${multiplier}: expected "が", but got "${problem.reading.equals}"`);
      return false;
    }

    // 被乗数と乗数が1〜9の範囲内であることをチェック
    if (multiplicand < 1 || multiplicand > 9 || multiplier < 1 || multiplier > 9) {
      console.error(`Invalid range: ${multiplicand} × ${multiplier} (multiplicand and multiplier must be 1-9)`);
      return false;
    }
  }

  // 全ての組み合わせ（1×1〜9×9）が存在するかチェック
  for (let m = 1; m <= 9; m++) {
    for (let n = 1; n <= 9; n++) {
      const found = problems.find(
        (p) => p.multiplicand === m && p.multiplier === n
      );
      if (!found) {
        console.error(`Missing problem: ${m} × ${n}`);
        return false;
      }
    }
  }

  return true;
}
