/**
 * 秒数を「分:秒」形式にフォーマット
 * @param seconds 秒数
 * @returns フォーマットされた文字列（例: "3:45"）
 */
export function formatTime(seconds: number): string {
  const absSeconds = Math.abs(seconds);
  const mins = Math.floor(absSeconds / 60);
  const secs = absSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * 秒数を「○分○秒」形式にフォーマット（日本語）
 * @param seconds 秒数
 * @returns フォーマットされた文字列（例: "3分45秒"）
 */
export function formatTimeJapanese(seconds: number): string {
  const absSeconds = Math.abs(seconds);
  const mins = Math.floor(absSeconds / 60);
  const secs = absSeconds % 60;

  if (mins === 0) {
    return `${secs}秒`;
  }
  if (secs === 0) {
    return `${mins}分`;
  }
  return `${mins}分${secs}秒`;
}
