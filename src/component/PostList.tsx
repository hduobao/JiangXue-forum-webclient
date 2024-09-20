import React, { useEffect, useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Instance from '../interceptors/auth_interceptor';
import ListItem from './ListItem';  // 引入ListItem组件
import { ListPostVo } from "../types/PostModel";

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<ListPostVo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const instance = Instance();
  const navigate = useNavigate();

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
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handlePostClick = (postId: number) => {
    navigate(`/posts/${postId}`);
  };

  const handleAuthorClick = (authorId: number, event: MouseEvent) => {
    event.stopPropagation();
    navigate(`/user-profile/${authorId}`);
  };

  const handleLikeClick = async (postId: number, isLiked: boolean, event: MouseEvent) => {
    event.stopPropagation();
    try {
      await instance.post(`/api/posts/${postId}/like`);
      setPosts(posts.map(post =>
        post.id === postId
          ? {
            ...post,
            interactive_info: {
              ...post.interactive_info,
              is_like: !isLiked,
              like_count: isLiked
                ? post.interactive_info.like_count - 1
                : post.interactive_info.like_count + 1
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
            <ListItem
              key={post.id}
              id={post.id}
              title={post.title}
              content={post.content}
              cover_image={post.cover_image}
              interactive_info={post.interactive_info}
              author_id={post.author_id}
              author_name={post.author_name}
              onPostClick={handlePostClick}
              onAuthorClick={handleAuthorClick}
              onLikeClick={handleLikeClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;
