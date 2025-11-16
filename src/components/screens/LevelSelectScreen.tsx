import { useEffect, useState } from 'react';
import { LevelCard } from '@/components/common';
import { getLevelConfigs } from '@/data/dataLoader';

interface LevelSelectScreenProps {
  onLevelSelect: (levelId: number) => void;
}

export const LevelSelectScreen: React.FC<LevelSelectScreenProps> = ({
  onLevelSelect,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const levelConfigs = getLevelConfigs();

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            九九マスター
          </h1>
          <p className="text-lg md:text-xl text-gray-700">
            レベルをえらんで、ちょうせんしよう！
          </p>
        </header>

        {/* レベル一覧 */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {levelConfigs.map((config) => (
            <LevelCard
              key={config.id}
              config={config}
              onClick={() => onLevelSelect(config.id)}
            />
          ))}
        </div>

        {/* フッター */}
        <footer className="text-center mt-12 text-sm text-gray-600">
          <p>Bright 珠算教場</p>
        </footer>
      </div>
    </div>
  );
};
