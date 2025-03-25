// src/utils/scrollManager.ts
interface ScrollPositions {
    [key: string]: number;
  }
  
  const scrollPositions: ScrollPositions = {};
  
  export const saveScrollPosition = (key: string, position: number) => {
    scrollPositions[key] = position;
  };
  
  export const getScrollPosition = (key: string): number => {
    return scrollPositions[key] || 0;
  };
  
  export const deleteScrollPosition = (key: string) => {
    delete scrollPositions[key];
  };