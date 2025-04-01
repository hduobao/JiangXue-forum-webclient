// src/pages/FavoritesPage.tsx
import React, { useEffect, useState } from 'react';
import Instance from '../interceptors/auth_interceptor';
import { ListTweetVo } from '../types/TweetModel';
import TopBar from '../component/bar/TopBar';
import Loader from '../component/common/Loader';
import TweetFeed from '../component/tweet/TweetFeed';
import BackTopButton from '../component/button/BackTopButton';

const FavoritesPage: React.FC = () => {
  const [tweets, setTweets] = useState<ListTweetVo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showBackTopButton, setShowBackTopButton] = useState<boolean>(false);
  const instance = Instance();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await instance.get('/api/me/favorites');
        const data = response.data?.data;
        setTweets(Array.isArray(data) ? data : []); // 确保是数组
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
        setError('Failed to load favorites');
        setTweets([]); // 出错时重置为空数组
      } finally {
        setLoading(false);
      }
    };
  
    fetchFavorites();

    const scrollContainer = document.querySelector(".scroll-container");
    console.log("doc:", scrollContainer);
    if (!scrollContainer) return;
    const handleScroll = () => {
      console.log("aa:", scrollContainer.scrollTop);
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
        <TopBar page='收藏' />
      </div>
      <main className="flex-grow overflow-y-auto scroll-container">
        {/* <h1 className="text-2xl font-semibold mb-4">浏览历史</h1> */}
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="text-red-500">{error}</div>
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

export default FavoritesPage;
