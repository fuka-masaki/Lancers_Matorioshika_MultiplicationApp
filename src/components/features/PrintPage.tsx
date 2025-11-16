import React from 'react';
import { PrintData } from '@/types';

interface PrintPageProps {
  printData: PrintData;
  pageNumber: number;
  totalPages: number;
}

export const PrintPage: React.FC<PrintPageProps> = ({
  printData,
  pageNumber,
  totalPages,
}) => {
  const { levelTitle, date, accuracy, timeSpent, targetTime, questions } =
    printData;

  const isFirstPage = pageNumber === 1;
  const isLastPage = pageNumber === totalPages;

  // 答えを生成
  const answers = questions.map((q) => ({
    number: q.number,
    answer: q.answerValue,
  }));

  // 数字の丸囲み
  const getCircledNumber = (num: number): string => {
    if (num <= 20) {
      return String.fromCharCode(9311 + num); // ①②③...
    }
    return `(${num})`;
  };

  return (
    <div className="print-page bg-white shadow-lg mb-6 mx-auto" style={{ width: '182mm', minHeight: '257mm' }}>
      <div className="p-8">
        {/* ヘッダー（1ページ目のみ） */}
        {isFirstPage && (
          <header className="mb-6 pb-4 border-b-2 border-gray-300">
            <h1 className="text-2xl font-bold text-center mb-4">
              九九マスター - {levelTitle} 結果
            </h1>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold">日付:</span> {date}
              </div>
              <div>
                <span className="font-semibold">正答率:</span> {accuracy}%
              </div>
              <div>
                <span className="font-semibold">タイム:</span> {timeSpent}
              </div>
              <div>
                <span className="font-semibold">目標タイム:</span> {targetTime}
              </div>
            </div>
          </header>
        )}

        {/* ページ番号（2ページ目以降） */}
        {!isFirstPage && (
          <div className="text-right text-sm text-gray-600 mb-4">
            {levelTitle} (続き) - {pageNumber}/{totalPages}
          </div>
        )}

        {/* メッセージ */}
        <div className="text-center mb-6">
          <p className="text-xl font-bold text-purple-700">
            この九九をおぼえてね！
          </p>
          <p className="text-sm text-gray-600 mt-1">
            （⭐は2回間違えた問題）
          </p>
        </div>

        {/* 問題一覧 */}
        <div className="mb-8">
          <div className="space-y-4">
            {questions.map((q) => {
              const { number, displayText, missingPart, isDoubleWrong } = q;

              return (
                <div key={number} className="flex items-center gap-3 text-lg">
                  <span className="font-bold text-gray-700 w-8">
                    {getCircledNumber(number)}
                  </span>
                  {isDoubleWrong && <span className="text-xl">⭐</span>}
                  <span className="font-semibold">
                    {missingPart === 'multiplicand' && (
                      <>
                        <span className="inline-block border-b-2 border-gray-800 w-16 mx-1"></span>
                        {displayText}
                      </>
                    )}
                    {missingPart === 'multiplier' && (
                      <>
                        {displayText.split('×')[0]} ×
                        <span className="inline-block border-b-2 border-gray-800 w-16 mx-1"></span>
                        = {displayText.split('=')[1]}
                      </>
                    )}
                    {missingPart === 'answer' && (
                      <>
                        {displayText}
                        <span className="inline-block border-b-2 border-gray-800 w-16 mx-1"></span>
                      </>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ページ分割がある場合の続きメッセージ */}
        {!isLastPage && (
          <div className="text-center text-gray-600 mt-8">
            （続く）
          </div>
        )}

        {/* 答え（最後のページのみ） */}
        {isLastPage && (
          <div className="mt-8 pt-6 border-t-2 border-gray-300">
            <h3 className="text-lg font-bold text-center mb-4">【答え】</h3>
            <div className="grid grid-cols-5 gap-4 text-center">
              {answers.map((a) => (
                <div key={a.number} className="text-base">
                  {getCircledNumber(a.number)} <span className="font-bold">{a.answer}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* フッター */}
        {isLastPage && (
          <footer className="mt-8 text-center">
            <p className="text-lg font-semibold text-purple-700">
              がんばって覚えよう！
            </p>
          </footer>
        )}
      </div>
    </div>
  );
};
