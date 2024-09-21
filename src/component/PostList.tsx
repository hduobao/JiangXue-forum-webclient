import React, { useEffect, useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Instance from '../interceptors/auth_interceptor';
import { ListPostVo } from "../types/PostModel";
import { IconThumbUp, IconThumbUpFilled, IconMessage2, IconEye } from '@tabler/icons-react';

interface PostListProps {
  fetchPosts: () => Promise<ListPostVo[]>;
}

const PostList: React.FC<PostListProps> = ({ fetchPosts }) => {
  const [posts, setPosts] = useState<ListPostVo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts();
        setPosts(data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [fetchPosts]);

  const handlePostClick = (postId: number) => {
    navigate(`/posts/${postId}`);
  };

  const handleAuthorClick = (authorId: number, event: MouseEvent) => {
    event.stopPropagation();
    console.log('Navigating to user profile with authorId:', authorId);
    navigate(`/user-profile/${authorId}`);
  };

  const handleIconClick = (event: MouseEvent) => {
    event.stopPropagation();
  };

  const handleLike = async (postId: number, isLiked: boolean, event: MouseEvent) => {
    event.stopPropagation();

    // Assuming the instance is available for API calls
    const instance = Instance();

    try {
      await instance.post(`/api/posts/${postId}/like`);
      setPosts(posts.map(post =>
        post.id === postId
          ? {
              ...post,
              interactive_info: {
                ...post.interactive_info,
                is_like: !isLiked,
                like_count: isLiked ? post.interactive_info.like_count - 1 : post.interactive_info.like_count + 1,
              }
            }
          : post
      ));
    } catch (error) {
      console.error('Failed to update like status:', error);
    }
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      {loading ? (
        <div className="text-lg font-semibold">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="bg-white shadow-md rounded-lg p-4 flex space-x-4 cursor-pointer" onClick={() => handlePostClick(post.id)}>
              <div className="flex-none w-40 h-24 relative">
                <img src={post.cover_image || '/default-cover.jpg'} alt={post.title} className="w-full h-full object-cover rounded-md" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-medium mb-2 cursor-pointer hover:underline" onClick={() => handlePostClick(post.id)}>
                  {post.title}
                </h2>
                <p className="text-gray-700 mb-2 line-clamp-2">{post.content}</p>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <div className="flex items-center space-x-1" onClick={handleIconClick}>
                    <IconEye className="w-5 h-5 text-gray-500" />
                    <span>{post.interactive_info.view_count}</span>
                  </div>
                  <div className="flex items-center space-x-1" onClick={handleIconClick}>
                    <IconMessage2 className="w-5 h-5 text-gray-500" />
                    <span>{post.interactive_info.comment_count}</span>
                  </div>
                  <div className="flex items-center space-x-1" onClick={(event) => handleLike(post.id, post.interactive_info.is_like, event)}>
                    {post.interactive_info.is_like ? (
                      <IconThumbUpFilled size={24} className="text-pink-500" />
                    ) : (
                      <IconThumbUp size={24} className="text-gray-500" />
                    )}
                    <span className="ml-1">{post.interactive_info.like_count}</span>
                  </div>
                  <div className="flex items-center space-x-2 ml-auto">
                    <span className="text-gray-700 cursor-pointer hover:text-blue-500 hover:underline" onClick={(event) => handleAuthorClick(post.author_id, event)}>
                      作者：{post.author_name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;
