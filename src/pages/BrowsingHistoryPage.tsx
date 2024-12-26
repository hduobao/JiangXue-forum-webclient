import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../component/bar/TopBar';
import Instance from '../interceptors/auth_interceptor';
import { ListPostVo } from "../types/PostModel";
import Tweet from '../component/tweet/Tweet'; 
import Loader from '../component/common/Loader';

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

  const handleTweetClick = (postID: number) => {
    navigate(`/tweet/${postID.toString()}`); // 将 postID 转换为字符串
  };

  return (
    <div className="flex-grow flex flex-col h-screen overflow-y-auto">
      <div className="sticky top-0 z-10 bg-white shadow-md">
        <TopBar page='浏览历史' />
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
              {history.map((tweet, index) => (
                <Tweet key={index} post={tweet} onClick={() => handleTweetClick(tweet.id)} /> // 传递点击事件
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default BrowsingHistoryPage;
