import { useState, useEffect } from "react";
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

  useEffect(() => {
    const fetchForum = async () => {
      try {
        const response = await instance.get("/api/forum/list");
        setForums(response.data.data);
      } catch (error) {}
    };
    fetchForum();
  }, []);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        setLoading(true);
        const offset = 1;
        const limit = 10;
        const response = await instance.get(`/api/tweets`, {
          params: { 
            offset, 
            limit,
            forum: selectedForumId
          },
        });
        setTweets(response.data.data);
      } catch (error) {
        console.error("Failed to fetch tweets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();

    const scrollContainer = document.querySelector(".scroll-container");
    if (!scrollContainer) return;

    const handleScroll = () => {
      setShowBackTopButton(scrollContainer.scrollTop > 200);
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [selectedForumId]); // 核心变化：依赖项增加 selectedForumId

  // 滚动到顶部（保持原有）
  const scrollToTop = () => {
    const scrollContainer = document.querySelector(".scroll-container");
    scrollContainer?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex-grow flex flex-col h-screen overflow-y-auto">
      <div className="sticky top-0 z-10 bg-white shadow-md">
        <TopBar page="社区" />
      </div>
      <main className="flex-grow overflow-y-auto scroll-container">
        {loading ? (
          <Loader />
        ) : (
          <div>
            <ForumButtonBar 
              forums={forums} 
              onSelectForum={setSelectedForumId} // 直接传递状态更新函数
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
