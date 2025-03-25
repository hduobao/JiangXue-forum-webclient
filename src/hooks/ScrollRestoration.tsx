// src/hooks/useScrollRestoration.ts
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useScrollRestoration = (selector: string) => {
  const location = useLocation();

  useEffect(() => {
    const scrollContainer = document.querySelector(selector);
    if (!scrollContainer) return;
    // 从 sessionStorage 恢复滚动位置
    const savedPosition = sessionStorage.getItem(location.key);
    if (savedPosition) {
      scrollContainer.scrollTo({ top: parseInt(savedPosition), behavior: "smooth" });
    }

    // 保存滚动位置到 sessionStorage
    const saveScroll = () => {
      console.log("偏移量：", location.pathname, scrollContainer.scrollTop)
      sessionStorage.setItem(location.key, scrollContainer.scrollTop.toString());
    };

    // 在卸载时保存
    return () => {
      console.log("执行卸载")
      saveScroll();
    };
  }, [location.key, selector]);
};