'use client';

import { useState, useCallback } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleOpenMenu = useCallback(() => {
    setIsMobileMenuOpen(true);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={handleOpenMenu} />

      <div className="flex">
        <Sidebar />
        <MobileNav isOpen={isMobileMenuOpen} onClose={handleCloseMenu} />

        <main className="flex-1 p-4 lg:p-6 max-w-7xl mx-auto w-full lg:ml-60">
          {children}
        </main>
      </div>
    </div>
  );
}
