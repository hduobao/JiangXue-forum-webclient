import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate
import Instance from '../interceptors/auth_interceptor';
import { ListPostVo } from "../types/PostModel";
import Tweet from './Tweet'; 

const TweetFeed: React.FC = () => {
  const instance = Instance();
  const navigate = useNavigate(); // 使用 useNavigate
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

  // 点击推文时的处理函数
  const handleTweetClick = (postID: number) => {
    navigate(`/tweet/${postID.toString()}`); // 将 postID 转换为字符串
  };
  
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-3xl px-4 overflow-y-auto">
        {posts.map((post, index) => (
          <Tweet key={index} post={post} onClick={() => handleTweetClick(post.id)} /> // 传递点击事件
        ))}
      </div>
    </div>
  );
};

export default TweetFeed;
