import { useState, useEffect } from "react";
import Loader from "../component/common/Loader";
import TopBar from "../component/bar/TopBar";
import Instance from "../interceptors/auth_interceptor";
import ForumButtonBar from "../component/bar/ForumButtonBar";
import { useNavigate } from "react-router-dom";
import { ListTweetVo } from "../types/TweetModel";
import Tweet from "../component/tweet/Tweet";
import BackTopButton from "../component/button/BackTopButton";
import { ForumVo } from "../types/ForumModel";

const CommunityPage: React.FC = () => {
  const instance = Instance();
  const navigate = useNavigate(); // 使用 useNavigate
  const [tweets, setTweets] = useState<ListTweetVo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showBackTopButton, setShowBackTopButton] = useState<boolean>(false);
  const [forums, setForums] = useState<ForumVo[]>([]);

  useEffect(() => {
    const fetchForum = async () => {
      try {
        const response = await instance.get("/api/forum/list");
        setForums(response.data.data);
      } catch (error) {
      }
    };
  
    fetchForum();
    
    const fetchTweets = async () => {
      try {
        const offset = 1;
        const limit = 10;
        const response = await instance.get(`/api/tweets`, {
          params: { offset, limit },
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
      console.log("Scroll event fired:", scrollContainer.scrollTop);
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
    navigate(`/tweet/${tweetID.toString()}`);
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
            <ForumButtonBar forums={forums} />
            <div className="flex justify-center">
              <div className="w-full max-w-3xl px-4">
                {tweets.map((tweet, index) => (
                  <Tweet
                    key={index}
                    tweet={tweet}
                    onClick={() => handleTweetClick(tweet.id)}
                  /> // 传递点击事件
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      {showBackTopButton && <BackTopButton onClick={scrollToTop} />}
    </div>
  );
};

export default CommunityPage;
