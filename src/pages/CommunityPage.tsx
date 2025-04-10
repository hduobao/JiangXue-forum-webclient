import { useState, useEffect, useCallback, useRef } from "react";
import Loader from "../component/common/Loader";
import TopBar from "../component/bar/TopBar";
import Instance from "../interceptors/auth_interceptor";
import ForumButtonBar from "../component/bar/ForumButtonBar";
import { ListTweetVo } from "../types/TweetModel";
import BackTopButton from "../component/button/BackTopButton";
import { ForumVo } from "../types/ForumModel";
import TweetFeed from "../component/tweet/TweetFeed";

const CommunityPage: React.FC = () => {
  const instance = Instance();
  const [tweets, setTweets] = useState<ListTweetVo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showBackTopButton, setShowBackTopButton] = useState<boolean>(false);
  const [forums, setForums] = useState<ForumVo[]>([]);
  const [selectedForumId, setSelectedForumId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const scrollContainerRef = useRef<HTMLElement>(null);

  // 加载论坛列表（保持原有）
  useEffect(() => {
    const fetchForum = async () => {
      try {
        const response = await instance.get("/api/forum/list");
        setForums(response.data.data);
      } catch (error) {
        console.error("Failed to fetch forums:", error);
      }
    };
    fetchForum();
  }, []);

  // 分页加载推文
  const loadTweets = useCallback(
    async (pageNumber: number, isNewLoad: boolean) => {
      try {
        setLoading(true);
        const pageSize = 10;
        const response = await instance.get(`/api/tweets`, {
          params: { 
            offset: pageNumber,
            limit: pageSize,
            forum: selectedForumId
          },
        });

        const data = response.data.data;
        const newTweets = Array.isArray(data.list) ? data.list : [];

        if (isNewLoad) {
          setTweets(newTweets);
        } else {
          setTweets(prev => [...prev, ...newTweets]);
        }

        // 判断是否还有更多数据
        const more = data.page * data.pageSize < data.total;
        setHasMore(more);
        setPage(pageNumber + 1);
      } catch (error) {
        console.error("Failed to fetch tweets:", error);
      } finally {
        setLoading(false);
      }
    },
    [selectedForumId, instance]
  );

  // 初始化加载和论坛切换
  useEffect(() => {
    setPage(1);
    loadTweets(1, true);
  }, [selectedForumId]);

  // 滚动处理
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      setShowBackTopButton(scrollContainer.scrollTop > 200);

      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const threshold = 100;

      if (
        scrollHeight > clientHeight &&
        scrollHeight - (scrollTop + clientHeight) < threshold &&
        !loading &&
        hasMore
      ) {
        loadTweets(page, false);
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, page]);

  const scrollToTop = () => {
    const scrollContainer = scrollContainerRef.current;
    scrollContainer?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="sticky top-0 z-10 bg-white shadow-md">
        <TopBar page="话题" />
      </div>
      <main
        ref={scrollContainerRef}
        className="flex-grow overflow-y-scroll scroll-container"
      >
        {loading && page === 1 ? (
          <Loader />
        ) : (
          <div>
            <ForumButtonBar 
              forums={forums} 
              onSelectForum={setSelectedForumId}
            />
            <div className="flex justify-center">
              <TweetFeed tweets={tweets} />
              {showBackTopButton && <BackTopButton onClick={scrollToTop} />}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CommunityPage;