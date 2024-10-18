import React, { useEffect, useState } from 'react';
import Instance from '../interceptors/auth_interceptor';
import { ListPostVo } from "../types/PostModel";

const PostList: React.FC = () => {
  const instance = Instance();
  const [posts, setPosts] = useState<ListPostVo[]>([]);

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
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="flex justify-center">
      {/* 设置中间推文流的最大宽度 */}
      <div className="w-full max-w-2xl px-4">
        {posts.map((post, index) => (
          <div key={index} className="w-full p-4 border-b border-gray-300">
            <div className="flex items-start space-x-4">
              {/* 用户头像 */}
              <img
                src={post.cover_image || "/static/images/avatar/1.jpg"}
                alt="User Avatar"
                className="w-12 h-12 rounded-full"
              />
              {/* 帖子内容 */}
              <div>
                <div className="font-bold">{post.author_name}</div>
                <div className="text-gray-600">{post.content}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;
