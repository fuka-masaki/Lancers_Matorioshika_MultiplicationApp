import React, { useEffect } from 'react';
import { PrintData } from '@/types';
import { Button } from '@/components/common';
import { PrintPage } from '@/components/features/PrintPage';

interface PrintPreviewScreenProps {
  printData: PrintData;
  onClose: () => void;
}

export const PrintPreviewScreen: React.FC<PrintPreviewScreenProps> = ({
  printData,
  onClose,
}) => {
  const QUESTIONS_PER_PAGE = 15;
  const { questions, totalPages } = printData;

  const handlePrint = () => {
    window.print();
  };

  // 印刷用のスタイルを追加
  useEffect(() => {
    document.body.classList.add('print-preview');
    return () => {
      document.body.classList.remove('print-preview');
    };
  }, []);

  // ページごとに問題を分割
  const pages = Array.from({ length: totalPages }, (_, pageIndex) => {
    const start = pageIndex * QUESTIONS_PER_PAGE;
    const end = start + QUESTIONS_PER_PAGE;
    return questions.slice(start, end);
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 印刷プレビューヘッダー（印刷時は非表示） */}
      <div className="no-print bg-white shadow-md py-4 px-6 mb-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">印刷プレビュー</h1>
          <div className="flex gap-4">
            <Button variant="secondary" onClick={onClose}>
              戻る
            </Button>
            <Button variant="primary" onClick={handlePrint}>
              印刷する
            </Button>
          </div>
        </div>
      </div>

      {/* 印刷ページ */}
      <div className="container mx-auto px-4 pb-8">
        {pages.map((pageQuestions, pageIndex) => (
          <PrintPage
            key={pageIndex}
            printData={{
              ...printData,
              questions: pageQuestions,
            }}
            pageNumber={pageIndex + 1}
            totalPages={totalPages}
          />
        ))}
      </div>
    </div>
  );
};
