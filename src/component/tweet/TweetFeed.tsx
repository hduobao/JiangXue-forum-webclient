import React from "react";
import { useNavigate } from "react-router-dom"; // 导入 useNavigate
import { ListTweetVo } from "../../types/TweetModel";
import Tweet from "./Tweet";

const TweetFeed: React.FC<{ tweets: ListTweetVo[] }> = ({ tweets }) => {
  const navigate = useNavigate(); // 使用 useNavigate

  // 点击推文时的处理函数
  const handleTweetClick = (tweetID: number) => {
    navigate(`/tweet/${tweetID.toString()}`); // 将 tweetID 转换为字符串
  };

  return (
    <div className="w-full max-w-3xl px-4 overflow-y-auto">
      {tweets?.map((tweet, index) => (
        <Tweet
          key={index}
          tweet={tweet}
          onClick={() => handleTweetClick(tweet.id)}
        />
      ))}
    </div>
  );
};

export default TweetFeed;
