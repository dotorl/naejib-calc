export const GA_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// Google Analytics 활성화 여부 확인
export const isGAEnabled = () => {
  return typeof window !== 'undefined' && GA_ID && window.gtag;
};

// 페이지뷰 추적
export const pageview = (url: string) => {
  if (!isGAEnabled()) return;

  window.gtag('config', GA_ID, {
    page_path: url,
  });
};

// 이벤트 추적
export const event = (
  action: string,
  params?: Record<string, any>
) => {
  if (!isGAEnabled()) return;

  window.gtag('event', action, params);
};

// 스크롤 깊이 추적
export const trackScrollDepth = (depth: number) => {
  event('scroll_depth', {
    event_category: 'engagement',
    event_label: `${depth}%`,
    value: depth,
  });
};

// 섹션 도달 추적
export const trackSectionView = (sectionName: string) => {
  event('section_view', {
    event_category: 'engagement',
    section_name: sectionName,
  });
};

// 클릭 이벤트 추적
export const trackClick = (
  elementName: string,
  elementType: string = 'button',
  additionalParams?: Record<string, any>
) => {
  event('click', {
    event_category: 'interaction',
    element_name: elementName,
    element_type: elementType,
    ...additionalParams,
  });
};

// 계산기 사용 추적
export const trackCalculation = (
  calculatorType: string,
  action: string,
  params?: Record<string, any>
) => {
  event('calculator_action', {
    event_category: 'calculator',
    calculator_type: calculatorType,
    action,
    ...params,
  });
};
