// src/pages/FavoritesPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Instance from '../interceptors/auth_interceptor';
import { ListTweetVo } from '../types/TweetModel';
import TopBar from '../component/bar/TopBar';
import Loader from '../component/common/Loader';
import Tweet from '../component/tweet/Tweet';

const FavoritesPage: React.FC = () => {
  const [tweets, setTweets] = useState<ListTweetVo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
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
  }, []);

  const handleTweetClick = (tweetId: number) => {
    navigate(`/tweet/${tweetId}`);
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
            <div className="w-full max-w-3xl px-4 overflow-y-auto">
              {tweets.map((tweet, index) => (
                <Tweet key={index} tweet={tweet} onClick={() => handleTweetClick(tweet.id)} /> // 传递点击事件
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FavoritesPage;
