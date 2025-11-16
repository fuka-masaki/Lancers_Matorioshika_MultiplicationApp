import { useState, useEffect } from 'react';

/**
 * ページ遷移時のフェードインアニメーション用フック
 *
 * @param delay - フェードイン開始までの遅延時間（ミリ秒）
 * @returns isVisible - フェードインの表示状態
 *
 * @example
 * const isVisible = usePageTransition(100);
 *
 * return (
 *   <div className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
 *     {children}
 *   </div>
 * );
 */
export function usePageTransition(delay = 100): boolean {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return isVisible;
}
