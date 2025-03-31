import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "../component/common/Loader";
import TopBar from "../component/bar/TopBar";
import { ListTweetVo } from "../types/TweetModel";
import Instance from "../interceptors/auth_interceptor";
import Tweet from "../component/tweet/Tweet";
import BackTopButton from "../component/button/BackTopButton";

const ExplorePage: React.FC = () => {
  const instance = Instance();
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();
  const { account } = location.state || {};
  const [showBackTopButton, setShowBackTopButton] = useState<boolean>(false);
  const navigate = useNavigate(); // 使用 useNavigate
  const [tweets, setTweets] = useState<ListTweetVo[]>([]);

  useEffect(() => {
    setLoading(true);
    const fetchTweets = async () => {
      try {
        const offset = 1;
        const limit = 10;
        const response = await instance.get(`/api/tweets`, {
          params: { offset, limit, tab: "explore" },
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
      if (scrollContainer.scrollTop > 200) {
        setShowBackTopButton(true);
      } else {
        setShowBackTopButton(false);
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    const scrollContainer = document.querySelector(".scroll-container");
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // 点击推文时的处理函数
  const handleTweetClick = (tweetID: number) => {
    navigate(`/tweet/${tweetID.toString()}`); // 将 tweetID 转换为字符串
  };

  return (
    <div className="flex-grow flex flex-col h-screen overflow-y-auto">
      <div className="sticky top-0 z-10 bg-white shadow-md">
        <TopBar page={account} />
      </div>
      <main className="flex-grow overflow-y-auto scroll-container">
        {loading ? (
          <Loader />
        ) : (
          <div className="w-full max-w-3xl px-4 overflow-y-auto">
            {tweets?.map((tweet, index) => (
              <Tweet
                key={index}
                tweet={tweet}
                onClick={() => handleTweetClick(tweet.id)}
              />
            ))}
            {showBackTopButton && <BackTopButton onClick={scrollToTop} />}
          </div>
        )}
      </main>
    </div>
  );
};

export default ExplorePage;
