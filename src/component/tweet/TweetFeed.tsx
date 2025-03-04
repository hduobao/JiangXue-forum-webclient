import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate
import Instance from '../../interceptors/auth_interceptor';
import { ListTweetVo } from "../../types/TweetModel";
import Tweet from './Tweet'; 
import Loader from '../common/Loader';
import BackTopButton from '../button/BackTopButton';

const TweetFeed: React.FC<{ activeTab: string }> = ({ activeTab }) => {
  const instance = Instance();
  const navigate = useNavigate(); // 使用 useNavigate
  const [tweets, setTweets] = useState<ListTweetVo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showBackTopButton, setShowBackTopButton] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true)
    const fetchTweets = async () => {
      try {
        const offset = 1;
        const limit = 10;
        const response = await instance.get(`/api/1/tweets`, {
          params: { offset, limit, tab : activeTab },
        });
        setTweets(response.data.data);
      } catch (error) {
        console.error('Failed to fetch tweets:', error);
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
  }, [activeTab]);

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
    <div className="flex justify-center">
      {loading ? (
        <Loader />
      ) : (
      <div className="w-full max-w-3xl px-4 overflow-y-auto">
        {tweets.map((tweet, index) => (
          <Tweet key={index} tweet={tweet} onClick={() => handleTweetClick(tweet.id)} /> // 传递点击事件
        ))}
        {showBackTopButton && <BackTopButton onClick={scrollToTop} />}
      </div>
      )}
    </div>
  );
};

export default TweetFeed;
