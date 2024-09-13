// src/pages/FavoritesPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Instance from '../interceptors/auth_interceptor';
import { ListPostVo } from '../types/PostModel';
import { IconHeart } from '@tabler/icons-react';

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

  const handlePostClick = (postId: number) => {
    navigate(`/posts/${postId}`);
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      {loading ? (
        <div className="text-lg font-semibold">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-gray-500">No favorites yet.</div>
          ) : (
            posts.map(post => (
              <div
                key={post.id}
                className="bg-white shadow-md rounded-lg p-4 flex space-x-4 cursor-pointer"
                onClick={() => handlePostClick(post.id)}
              >
                {/* Cover Image */}
                <div className="flex-none w-40 h-24 relative">
                  <img
                    src={post.cover_image || '/default-cover.jpg'}
                    alt={post.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>

                {/* Post Content */}
                <div className="flex-1">
                  <h2 className="text-xl font-medium mb-2 cursor-pointer hover:underline">
                    {post.title}
                  </h2>

                  <p className="text-gray-700 mb-2 line-clamp-2">
                    {post.content}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <div className="flex items-center space-x-1">
                      <IconHeart className="w-5 h-5 text-gray-500" />
                      <span>{post.interactive_info.like_count}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
