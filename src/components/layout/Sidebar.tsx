'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MENU_ITEMS } from '@/utils/constants';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-gray-50 border-r border-gray-200 p-4 hidden lg:block fixed left-0 top-16 bottom-0 overflow-y-auto">
      <nav className="space-y-1">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.id}
              href={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                ${
                  isActive
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
      </nav>
    </aside>
  );
}
