'use client';

import { useEffect, useRef, useState } from 'react';
import { trackScrollDepth, trackSectionView } from '@/lib/gtag';

// 스크롤 깊이 추적
export const useScrollDepthTracker = () => {
  const [trackedDepths, setTrackedDepths] = useState<Set<number>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercent = Math.round(
        ((scrollTop + windowHeight) / documentHeight) * 100
      );

      // 25%, 50%, 75%, 100% 깊이 추적
      const depths = [25, 50, 75, 100];
      depths.forEach((depth) => {
        if (scrollPercent >= depth && !trackedDepths.has(depth)) {
          trackScrollDepth(depth);
          setTrackedDepths((prev) => new Set(prev).add(depth));
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [trackedDepths]);
};

// 섹션 도달 추적
export const useSectionTracker = (
  sectionName: string,
  options?: IntersectionObserverInit
) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hasTracked, setHasTracked] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || hasTracked) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTracked) {
          trackSectionView(sectionName);
          setHasTracked(true);
        }
      },
      {
        threshold: 0.5, // 섹션의 50%가 보일 때 추적
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [sectionName, hasTracked, options]);

  return ref;
};
