import { useState, useEffect } from 'react';

/**
 * メディアクエリにマッチするかどうかを返すフック
 * @param query メディアクエリ文字列
 * @returns マッチするかどうか
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

/**
 * モバイルデバイスかどうかを返すフック
 * @returns モバイルデバイスの場合true
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)');
}

/**
 * タブレットデバイスかどうかを返すフック
 * @returns タブレットデバイスの場合true
 */
export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
}

/**
 * デスクトップデバイスかどうかを返すフック
 * @returns デスクトップデバイスの場合true
 */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 1024px)');
}
