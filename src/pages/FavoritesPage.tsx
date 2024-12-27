// src/pages/FavoritesPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Instance from '../interceptors/auth_interceptor';
import { ListPostVo } from '../types/PostModel';
import TopBar from '../component/bar/TopBar';
import Loader from '../component/common/Loader';
import Tweet from '../component/tweet/Tweet';

const FavoritesPage: React.FC = () => {
  const [posts, setPosts] = useState<ListPostVo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const instance = Instance();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await instance.get('/api/me/favorites');
        setPosts(response.data.data);
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
        setError('Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleTweetClick = (postId: number) => {
    navigate(`/tweet/${postId}`);
  };

  return (
    <div className="flex-grow flex flex-col h-screen overflow-y-auto">
      <div className="sticky top-0 z-10 bg-white shadow-md">
        <TopBar page='收藏' />
      </div>
      <main className="flex-grow overflow-y-auto">
        {/* <h1 className="text-2xl font-semibold mb-4">浏览历史</h1> */}
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="flex justify-center">
            <div className="w-full max-w-3xl px-4 overflow-y-auto">
              {posts.map((tweet, index) => (
                <Tweet key={index} post={tweet} onClick={() => handleTweetClick(tweet.id)} /> // 传递点击事件
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FavoritesPage;
