import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../component/TopNavigationBar';
import Instance from '../interceptors/auth_interceptor';
import { ListPostVo } from "../types/PostModel";

const BrowsingHistoryPage: React.FC = () => {
  const instance = Instance();
  const navigate = useNavigate();
  const [history, setHistory] = useState<ListPostVo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await instance.get('/api/me/browsing-history');
        setHistory(response.data.data);
      } catch (error) {
        console.error('Failed to fetch browsing history:', error);
        setError('Failed to load browsing history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handlePostClick = (postId: number) => {
    navigate(`/posts/${postId}`);
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <main className="flex-grow p-6">
        <h1 className="text-2xl font-semibold mb-4">浏览历史</h1>
        {loading ? (
          <div className="text-lg font-semibold">加载中...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="space-y-4">
            {history.map(item => (
              <div
                key={item.id}
                className="bg-white shadow-md rounded-lg p-4 flex space-x-4 cursor-pointer"
                onClick={() => handlePostClick(item.id)}
              >
                <div className="flex-none w-40 h-24 relative">
                  <img
                    src={item.cover_image || '/default-cover.jpg'}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-medium mb-2">{item.title}</h2>
                  <p className="text-gray-700 mb-2 line-clamp-2">{item.content}</p>
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <span>作者：{item.author_name}</span>
                    {/* <span>浏览时间：{new Date(item.vi).toLocaleString()}</span> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BrowsingHistoryPage;
