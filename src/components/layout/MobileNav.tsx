'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { MENU_ITEMS } from '@/utils/constants';
import { useEffect, useRef } from 'react';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);

  // 페이지 변경 시 메뉴 닫기 (초기 마운트 제외)
  useEffect(() => {
    if (prevPathnameRef.current !== pathname && isOpen) {
      onClose();
      prevPathnameRef.current = pathname;
    }
  }, [pathname, isOpen, onClose]);

  // 메뉴가 열릴 때 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 lg:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <nav className="fixed top-0 left-0 bottom-0 w-64 bg-white z-50 lg:hidden shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-bold text-gray-800">내집계산기</h2>
            <p className="text-xs text-gray-500">주택 구매 자금 계획</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="메뉴 닫기"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-73px)]">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.id}
                href={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
