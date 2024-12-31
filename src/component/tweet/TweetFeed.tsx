import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate
import Instance from '../../interceptors/auth_interceptor';
import { ListPostVo } from "../../types/PostModel";
import Tweet from './Tweet'; 
import Loader from '../common/Loader';
import BackTopButton from '../button/BackTopButton';

const TweetFeed: React.FC = () => {
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
        console.error('Failed to fetch posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

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
  const handleTweetClick = (postID: number) => {
    navigate(`/tweet/${postID.toString()}`); // 将 postID 转换为字符串
  };
  
  return (
    <div className="flex justify-center">
      {loading ? (
        <Loader />
      ) : (
      <div className="w-full max-w-3xl px-4 overflow-y-auto">
        {posts.map((post, index) => (
          <Tweet key={index} post={post} onClick={() => handleTweetClick(post.id)} /> // 传递点击事件
        ))}
        {showBackTopButton && <BackTopButton onClick={scrollToTop} />}
      </div>
      )}
    </div>
  );
};

export default TweetFeed;
