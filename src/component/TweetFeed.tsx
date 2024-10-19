import React, { useEffect, useState } from 'react';
import Instance from '../interceptors/auth_interceptor';
import { ListPostVo } from "../types/PostModel";
import Tweet from './Tweet'; // 导入 Tweet 组件

const TweetFeed: React.FC = () => {
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
      <div className="w-full max-w-3xl px-4">
        {posts.map((post, index) => (
          <Tweet key={index} post={post} /> // 使用 Tweet 组件
        ))}
      </div>
    </div>
  );
};

export default TweetFeed;
