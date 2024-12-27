import { useState, useEffect } from "react";
import Loader from "../component/common/Loader";
import TopBar from "../component/bar/TopBar";
import Instance from "../interceptors/auth_interceptor";
import ForumButtonBar from "../component/bar/ForumButtonBar";
import { useNavigate } from "react-router-dom";
import { ListPostVo } from "../types/PostModel";
import Tweet from "../component/tweet/Tweet";
import BackTopButton from "../component/button/BackTopButton";

const CommunityPage: React.FC = () => {
  const instance = Instance();
  const navigate = useNavigate(); // 使用 useNavigate
  const [posts, setPosts] = useState<ListPostVo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showBackTopButton, setShowBackTopButton] = useState<boolean>(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const offset = 1;
        const limit = 10;
        const response = await instance.get(`/api/1/posts`, {
          params: { offset, limit },
        });
        setPosts(response.data.data);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

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
  const handleTweetClick = (postID: number) => {
    navigate(`/tweet/${postID.toString()}`);
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
            <ForumButtonBar />
            <div className="flex justify-center">
              <div className="w-full max-w-3xl px-4">
                {posts.map((tweet, index) => (
                  <Tweet
                    key={index}
                    post={tweet}
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
