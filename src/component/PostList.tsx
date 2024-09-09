import React, { useEffect, useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Instance from '../interceptors/auth_interceptor';
import { ListPostVo } from "../types/PostModel";
import { IconThumbUp, IconMessage2, IconEye } from '@tabler/icons-react';

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<ListPostVo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const instance = Instance()
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const offset = 1;
        const limit = 10;

        const response = await instance.get(`/api/1/posts/offset/${offset}/limit/${limit}`);

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

  const handlePostClick = (postID: number) => {
    navigate(`/posts/${postID}`);
  };

  const handleAuthorClick = (authorID: number, event: MouseEvent) => {
    // Prevent click event from propagating to parent div
    event.stopPropagation();
    console.log('Navigating to user profile with authorID:', authorID); // Add this line
    navigate(`/user-profile/${authorID}`);
  };
  

  const handleIconClick = (event: MouseEvent) => {
    // Prevent click event from propagating to parent div
    event.stopPropagation();
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
                <h2
                  className="text-xl font-medium mb-2 cursor-pointer hover:underline"
                  onClick={() => handlePostClick(post.id)}
                >
                  {post.title}
                </h2>

                <p className="text-gray-700 mb-2 line-clamp-2">
                  {post.content}
                </p>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <div
                    className="flex items-center space-x-1"
                    onClick={handleIconClick}
                  >
                    <IconEye className="w-5 h-5 text-gray-500" />
                    <span>{post.view_count}</span>
                  </div>
                  <div
                    className="flex items-center space-x-1"
                    onClick={handleIconClick}
                  >
                    <IconMessage2 className="w-5 h-5 text-gray-500" />
                    <span>{post.comment_count}</span>
                  </div>
                  <div
                    className="flex items-center space-x-1"
                    onClick={handleIconClick}
                  >
                    <IconThumbUp className="w-5 h-5 text-gray-500" />
                    <span>{post.like_count}</span>
                  </div>
                  {/* Add Author Information */}
                  <div className="flex items-center space-x-2 ml-auto">
                    <span
                      className="text-gray-700 cursor-pointer hover:text-blue-500 hover:underline"
                      onClick={(event) => handleAuthorClick(post.author_id, event)}
                    >
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
