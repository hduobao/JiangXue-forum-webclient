// HomePage.js
import React, { useEffect, useState, useCallback, useRef } from "react";

import TweetFeed from "../component/tweet/TweetFeed";
import TopBar from "../component/bar/TopBar";
import Instance from "../interceptors/auth_interceptor";
import { ListTweetVo } from "../types/TweetModel";
import BackTopButton from "../component/button/BackTopButton";
import Loader from "../component/common/Loader";

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("recommendations");
  const instance = Instance();
  const [tweets, setTweets] = useState<ListTweetVo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showBackTopButton, setShowBackTopButton] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const scrollContainerRef = useRef<HTMLElement>(null);

  // 加载更多数据的函数
  const loadTweets = useCallback(
    async (pageNumber: number, isNewTab: boolean) => {
      try {
        setLoading(true);
        const pageSize = 10;
        const response = await instance.get(`/api/tweets`, {
          params: {
            offset: pageNumber,
            limit: pageSize,
            tab: activeTab,
          },
        });
        const data = response.data.data;
        if (isNewTab) {
          setTweets(data.list);
        } else {
          setTweets((prev) => [...prev, ...data.list]);
        }

        // 检查是否还有更多数据
        const more = data.page * data.pageSize < data.total;
        setHasMore(more);
        setPage(pageNumber + 1);
      } catch (error) {
        console.error("Failed to fetch tweets:", error);
      } finally {
        setLoading(false);
      }
    },
    [activeTab, instance]
  );

  // 初始化加载和标签切换
  useEffect(() => {
    setPage(1);
    loadTweets(1, true);
  }, [activeTab]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      setShowBackTopButton(scrollContainer.scrollTop > 200);

      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const threshold = 100;

      // 新增关键判断：scrollHeight > clientHeight
      if (
        scrollHeight > clientHeight &&
        scrollHeight - (scrollTop + clientHeight) < threshold &&
        !loading &&
        hasMore
      ) {
        console.log("触发了")
        loadTweets(page, false);
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, page, loadTweets]);

  const scrollToTop = () => {
    const scrollContainer = document.querySelector(".scroll-container");
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="sticky top-0 z-10 bg-white shadow-md">
        <TopBar page="" activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <main
        ref={scrollContainerRef}
        className="flex-grow overflow-y-scroll scroll-container"
      >
        {loading && page === 1 ? ( // 只有第一页加载时显示全屏加载
          <Loader />
        ) : (
          <div className="flex justify-center">
            <TweetFeed tweets={tweets} />
            {showBackTopButton && <BackTopButton onClick={scrollToTop} />}
          </div>
        )}
      </main>
    </div>
  );
};
export default HomePage;
