import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Loader from "../component/common/Loader";
import TopBar from "../component/bar/TopBar";
import { ListTweetVo } from "../types/TweetModel";
import Instance from "../interceptors/auth_interceptor";
import BackTopButton from "../component/button/BackTopButton";
import TweetFeed from "../component/tweet/TweetFeed";

const ExplorePage: React.FC = () => {
  const instance = Instance();
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();
  const { account } = location.state || {};
  const [showBackTopButton, setShowBackTopButton] = useState<boolean>(false);
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

  return (
    <div className="flex-grow flex flex-col h-screen overflow-y-auto">
      <div className="sticky top-0 z-10 bg-white shadow-md">
        <TopBar page={account} />
      </div>
      <main className="flex-grow overflow-y-auto scroll-container">
        {loading ? (
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

export default ExplorePage;
