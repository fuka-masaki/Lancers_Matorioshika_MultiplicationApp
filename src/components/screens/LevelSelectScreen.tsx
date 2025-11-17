import { LevelCard } from '@/components/common';
import { getLevelConfigs } from '@/data/dataLoader';
import { usePageTransition } from '@/hooks/usePageTransition';

interface LevelSelectScreenProps {
  onLevelSelect: (levelId: number) => void;
  onOpenResultPreview: () => void;
}

export const LevelSelectScreen: React.FC<LevelSelectScreenProps> = ({
  onLevelSelect,
  onOpenResultPreview,
}) => {
  const isVisible = usePageTransition();
  const levelConfigs = getLevelConfigs();

  return (
    <div
      className={`min-h-[100dvh] bg-gradient-to-br from-white to-blue-50 transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* ヘッダー */}
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-blue-900 mb-4">
            九九マスター
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-600">
            レベルをえらんで、ちょうせんしよう！
          </p>
        </header>

        {/* レベル一覧 */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {levelConfigs.map((config) => (
            <LevelCard
              key={config.id}
              config={config}
              onClick={() => onLevelSelect(config.id)}
            />
          ))}
        </div>

        {/* フッター */}
        <footer className="text-center mt-12 text-sm text-slate-500">
          <p>Bright 珠算教場</p>
        </footer>
      </div>
    </div>
  );
};
