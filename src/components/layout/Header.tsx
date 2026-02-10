'use client';

import { Menu, Home } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="메뉴 열기"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-lg">
              <Home size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">내집계산기</h1>
              <p className="text-xs text-gray-500 hidden sm:block">주택 구매 자금 계획</p>
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          {/* 추가 헤더 액션 영역 */}
        </div>
      </div>
    </header>
  );
}
