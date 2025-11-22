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
 * モバイルデバイス（タブレット含む）かどうかを返すフック
 * 幅が1024px未満の場合にtrueを返す
 * @returns モバイル・タブレットデバイスの場合true
 */
export function useIsMobile(): boolean {
  const isNarrow = useMediaQuery('(max-width: 1023px)');
  return isNarrow;
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

/**
 * タッチ操作が可能なデバイスかどうかを返すフック
 * iPad、タブレット、タッチモニター付きPCなどを検出
 * @returns タッチ可能なデバイスの場合true
 */
export function useHasTouch(): boolean {
  return useMediaQuery('(any-pointer: coarse)');
}

/**
 * iPadサイズのデバイスかどうかを返すフック
 * 768px-1366pxの範囲でタッチ可能なデバイスを検出
 * iPad (9.7インチ): 768x1024、iPad Air: 820x1180、iPad Pro: 834x1194 / 1024x1366 に対応
 * @returns iPadサイズのデバイスの場合true
 */
export function useIsIPad(): boolean {
  const isTabletSize = useMediaQuery('(min-width: 768px) and (max-width: 1366px)');
  const hasTouch = useHasTouch();
  const isNotLargeDesktop = useMediaQuery('(max-width: 1439px)'); // 大型デスクトップを除外
  return isTabletSize && hasTouch && isNotLargeDesktop;
}

/**
 * iPad横向き（ランドスケープモード）かどうかを返すフック
 * @returns iPad横向きの場合true
 */
export function useIsIPadLandscape(): boolean {
  const isIPad = useIsIPad();
  const isLandscape = useMediaQuery('(orientation: landscape)');
  return isIPad && isLandscape;
}
