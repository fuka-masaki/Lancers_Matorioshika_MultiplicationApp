import React from 'react';

interface CustomKeyboardProps {
  onNumberClick: (num: string) => void;
  onClear: () => void;
  onSubmit: () => void;
  disabled?: boolean;
  showNext?: boolean; // 不正解時に「→」を表示
  isIPad?: boolean; // iPad用の最適化フラグ
  isLandscape?: boolean; // 横向き用の最適化フラグ
}

export const CustomKeyboard: React.FC<CustomKeyboardProps> = ({
  onNumberClick,
  onClear,
  onSubmit,
  disabled = false,
  showNext = false,
  isIPad = false,
  isLandscape = false,
}) => {
  const numbers = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
  ];

  // iPad用のサイズクラス（よりコンパクト）
  // 横向きの場合はさらに高さを抑える
  const buttonHeightClass = isLandscape
    ? 'h-9 sm:h-10'
    : isIPad
      ? 'h-11 sm:h-12'
      : 'h-12 xs:h-14 sm:h-16';

  const buttonTextClass = isLandscape
    ? 'text-lg sm:text-xl'
    : isIPad
      ? 'text-xl sm:text-2xl'
      : 'text-2xl xs:text-3xl';

  const clearTextClass = isLandscape
    ? 'text-sm sm:text-base'
    : isIPad
      ? 'text-base sm:text-lg'
      : 'text-lg xs:text-xl';

  const submitTextClass = isLandscape
    ? 'text-base sm:text-lg'
    : isIPad
      ? 'text-lg sm:text-xl'
      : 'text-xl xs:text-2xl';

  const gapClass = isLandscape ? 'gap-1.5' : isIPad ? 'gap-2' : 'gap-2 xs:gap-3';
  const marginClass = isLandscape ? 'mb-1.5' : isIPad ? 'mb-2' : 'mb-2 xs:mb-3';
  const bottomMarginClass = isLandscape ? 'mb-1.5 sm:mb-2' : isIPad ? 'mb-2 sm:mb-3' : 'mb-4 xs:mb-6';

  return (
    <div className={`custom-keyboard w-full mx-auto ${isIPad ? 'max-w-lg px-4 sm:px-6' : 'max-w-md px-3 xs:px-4'}`}>
      {/* 数字ボタン (7-9, 4-6, 1-3) */}
      {numbers.map((row, rowIndex) => (
        <div key={rowIndex} className={`flex ${gapClass} ${marginClass}`}>
          {row.map((num) => (
            <button
              key={num}
              onClick={() => onNumberClick(num)}
              disabled={disabled}
              className={`flex-1 ${buttonHeightClass} ${buttonTextClass} font-bold bg-white border-2 border-blue-200 text-slate-800 rounded-xl hover:border-blue-400 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0`}
            >
              {num}
            </button>
          ))}
        </div>
      ))}

      {/* 最下段: クリア、0、決定 */}
      <div className={`flex ${gapClass} ${bottomMarginClass}`}>
        <button
          onClick={onClear}
          disabled={disabled}
          className={`flex-1 ${buttonHeightClass} ${clearTextClass} font-bold bg-slate-100 border-2 border-slate-300 text-slate-600 rounded-xl hover:bg-slate-200 hover:border-slate-400 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0`}
        >
          C
        </button>
        <button
          onClick={() => onNumberClick('0')}
          disabled={disabled}
          className={`flex-1 ${buttonHeightClass} ${buttonTextClass} font-bold bg-white border-2 border-blue-200 text-slate-800 rounded-xl hover:border-blue-400 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0`}
        >
          0
        </button>
        <button
          onClick={onSubmit}
          disabled={disabled}
          className={`flex-1 ${buttonHeightClass} ${submitTextClass} font-bold text-white rounded-xl hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-lg transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${showNext
              ? 'bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
            }`}
        >
          {showNext ? '→' : '✓'}
        </button>
      </div>
    </div>
  );
};
