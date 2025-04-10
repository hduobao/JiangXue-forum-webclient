import { useEffect, useState, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import Loader from "../component/common/Loader";
import TopBar from "../component/bar/TopBar";
import { ListTweetVo } from "../types/TweetModel";
import Instance from "../interceptors/auth_interceptor";
import BackTopButton from "../component/button/BackTopButton";
import TweetFeed from "../component/tweet/TweetFeed";
import { IconMoodEmpty } from "@tabler/icons-react";
import { UserBaseInfo } from "../types/UserModel";
import UserExploreCard from "../component/profile/UserExploreCard";

// 定义搜索类型常量
const SEARCH_TYPES = [
  { id: "explore", name: "探索" },
  { id: "latest", name: "最新" },
  { id: "user", name: "用户" },
  { id: "media", name: "媒体" },
];

const ExplorePage: React.FC = () => {
  const instance = Instance();
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();
  const { account } = location.state || {};
  const [showBackTopButton, setShowBackTopButton] = useState<boolean>(false);
  const [tweets, setTweets] = useState<ListTweetVo[]>([]);
  const [queryCondition, setQueryCondition] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("explore");
  const [users, setUsers] = useState<UserBaseInfo[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const scrollContainerRef = useRef<HTMLElement>(null);

  // 加载数据的函数
  const fetchData = useCallback(
    async (pageNumber: number, isNewSearch: boolean) => {
      setLoading(true);
      try {
        const pageSize = 10;
        if (selectedType === "user") {
          const response = await instance.get(`/api/users`, {
            params: {
              offset: pageNumber,
              limit: pageSize,
              condition: queryCondition || undefined,
            },
          });
          const data = response.data.data || [];
          if (isNewSearch) {
            setUsers(data);
          } else {
            setUsers((prev) => [...prev, ...data]);
          }
          // 检查是否还有更多数据
          setHasMore(data.length >= pageSize);
        } else {
          const response = await instance.get(`/api/tweets`, {
            params: {
              offset: pageNumber,
              limit: pageSize,
              tab: selectedType,
              condition: queryCondition || undefined,
            },
          });
          const data = response.data.data?.list || [];
          if (isNewSearch) {
            setTweets(data);
          } else {
            setTweets((prev) => [...prev, ...data]);
          }
          // 检查是否还有更多数据
          const total = response.data.data?.total || 0;
          setHasMore(pageNumber * pageSize < total);
        }
        setPage(pageNumber + 1);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    },
    [selectedType, queryCondition, instance]
  );

  // 初始化加载和搜索条件/类型变化
  useEffect(() => {
    setPage(1);
    fetchData(1, true);
  }, [queryCondition, selectedType]);

  // 滚动事件处理
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      // 显示返回顶部按钮
      setShowBackTopButton(scrollContainer.scrollTop > 200);

      // 无限滚动逻辑
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const threshold = 100;

      if (
        scrollHeight > clientHeight &&
        scrollHeight - (scrollTop + clientHeight) < threshold &&
        !loading &&
        hasMore
      ) {
        fetchData(page, false);
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, page, fetchData]);

  const handleTypeChange = (typeId: string) => {
    setSelectedType(typeId);
  };

  const scrollToTop = () => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderContent = () => {
    if (loading && page === 1) return <Loader />;

    const isEmpty =
      selectedType === "user" ? users.length === 0 : tweets.length === 0;

    if (isEmpty) {
      return (
        <div className="flex flex-col items-center justify-center h-full py-12 text-gray-500">
          <IconMoodEmpty className="w-16 h-16 mb-4" />
          <p className="text-lg">
            {queryCondition
              ? `没有找到与"${queryCondition}"相关的结果`
              : "暂时没有内容"}
          </p>
          <p className="text-sm mt-2">尝试其他搜索关键词</p>
        </div>
      );
    }

    return (
      <>
        {selectedType === "user" ? (
          <div className="max-w-2xl w-full">
            {users.map((user) => (
              <UserExploreCard
                key={user.id}
                user={user}
                className="mb-4 shadow-sm hover:shadow-md transition-shadow"
              />
            ))}
          </div>
        ) : (
          <TweetFeed tweets={tweets} />
        )}
        {showBackTopButton && <BackTopButton onClick={scrollToTop} />}
      </>
    );
  };

  return (
    <div className="flex-grow flex flex-col h-screen overflow-y-auto">
      <div className="sticky top-0 z-10 bg-white shadow-md">
        <TopBar page={account} onSearch={setQueryCondition} />

        {queryCondition && (
          <div className="w-full px-4 py-2 border-b">
            <div className="grid grid-cols-4 gap-2 w-full">
              {SEARCH_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleTypeChange(type.id)}
                  className={`
                    w-full py-2 rounded-lg text-sm font-medium transition-all
                    ${
                      selectedType === type.id
                        ? "bg-blue-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }
                  `}
                >
                  {type.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <main
        ref={scrollContainerRef}
        className="flex-grow overflow-y-auto scroll-container"
      >
        <div className="flex justify-center">{renderContent()}</div>
      </main>
    </div>
  );
};
export default ExplorePage;