import React from 'react';
import { ListPostVo } from "../types/PostModel";

interface TweetDetailProps {
  tweet: ListPostVo;
}

const TweetDetail: React.FC<TweetDetailProps> = ({ tweet }) => {
    if (!tweet) {
      return <div>Loading...</div>; // 如果 tweet 为 null，显示加载提示或其他内容
    }
  
    return (
      <div className="flex justify-center">
        <div className="w-full max-w-3xl px-4">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">{tweet.author_name}</h2>
            <p className="text-gray-700">{tweet.content}</p>
          </div>
        </div>
      </div>
    );
  };
  

export default TweetDetail;
