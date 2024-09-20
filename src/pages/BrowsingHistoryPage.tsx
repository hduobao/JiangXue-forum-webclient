import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Instance from '../interceptors/auth_interceptor';
import ListItem from '../component/ListItem'; // 引入 ListItem 组件
import { ListPostVo } from '../types/PostModel';

const BrowsingHistoryPage: React.FC = () => {
  const [history, setHistory] = useState<ListPostVo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const instance = Instance();
  const navigate = useNavigate();

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

  const handleDelete = async (postId: number) => {
    try {
      await instance.delete(`/api/1/history/${postId}`);
      setHistory(history.filter(item => item.id !== postId));
    } catch (error) {
      console.error('Failed to delete history item:', error);
    }
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <h1 className="text-3xl font-bold mb-4">浏览历史</h1>
      {loading ? (
        <div className="text-lg font-semibold">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="space-y-4">
          {history.map(item => (
            <div key={item.id} className="flex justify-between items-center">
              <ListItem
                id={item.id}
                title={item.title}
                content={item.content}
                cover_image={item.cover_image}
                interactive_info={item.interactive_info}
                author_id={item.author_id}
                author_name={item.author_name}
                onPostClick={handlePostClick}
                onAuthorClick={() => {} /* 不需要作者点击的功能 */}
                onLikeClick={() => {} /* 不需要点赞功能 */}
              />
              <button
                className="text-red-500 hover:text-red-600 ml-4"
                onClick={() => handleDelete(item.id)}
              >
                删除
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowsingHistoryPage;
