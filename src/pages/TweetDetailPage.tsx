import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Instance from '../interceptors/auth_interceptor';
import { PostVo } from "../types/PostModel"; // Make sure to import the PostVo interface
import TopBar from '../component/TopBar';

const TweetDetailPage: React.FC = () => {
  const instance = Instance()
  const { postID } = useParams<{ postID: string }>(); // 获取推文 ID
  const navigate = useNavigate();
  const [tweet, setTweet] = useState<PostVo | null>(null); // Changed to PostVo

  useEffect(() => {
    const fetchTweet = async () => {
      try {
        const response = await instance.get(`/api/1/posts/${postID}`);
        console.log(response.data.data)
        setTweet(response.data.data); // Assuming response data structure matches PostVo
      } catch (error) {
        console.error('Failed to fetch tweet:', error);
      }
    };

    fetchTweet();
  }, [postID]);

  if (!tweet) {
    return <div>Loading...</div>; // 加载状态
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-3xl px-4">
      <div className="sticky top-0 z-10 bg-white shadow-md">
        <TopBar />
      </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-2">{tweet.title}</h2>
          <div className="flex items-center mb-4">
            <img
              src={tweet.author_avatar || "/static/images/avatar/1.jpg"}
              alt="User Avatar"
              className="w-12 h-12 rounded-full object-cover mr-2"
            />
            <div>
              <span className="font-semibold text-gray-800">{tweet.author_name}</span>
              <span className="text-gray-500 text-sm ml-2">{new Date(tweet.created_at).toLocaleString()}</span>
            </div>
          </div>
          <p className="text-gray-700 mb-4">{tweet.content}</p>

          {/* Interactive Info */}
          <div className="flex justify-between text-gray-500">
            <span>浏览量: {tweet.interactive_info.view_count}</span>
            <span>评论数: {tweet.interactive_info.comment_count}</span>
            <span>点赞数: {tweet.interactive_info.like_count}</span>
            <span>收藏数: {tweet.interactive_info.favorite_count}</span>
          </div>
          <div className="flex justify-between mt-4">
            <span>{tweet.interactive_info.is_like ? "已点赞" : "未点赞"}</span>
            <span>{tweet.interactive_info.is_favorite ? "已收藏" : "未收藏"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetDetailPage;
