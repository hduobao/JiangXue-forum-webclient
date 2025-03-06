import React, { useState } from "react";
import {
  IconMessageCircle,
  IconRepeat,
  IconHeart,
  IconEye,
  IconHeartFilled,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { ListTweetVo } from "../../types/TweetModel";
import { getUserId } from "../../storage/storage";
import Instance from "../../interceptors/auth_interceptor";
import CommentModal from "../comment/CommentModel";
import MediaDisplay from "./MediaDisplay"; // 根据实际路径调整

const Tweet: React.FC<{ tweet: ListTweetVo; onClick: () => void }> = ({
  tweet,
  onClick,
}) => {
  const userId = getUserId();
  const instance = Instance();
  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState<boolean>(
    tweet.interactive_info.is_like
  );
  const [likeCount, setLikeCount] = useState<number>(
    tweet.interactive_info.like_count
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleLike = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    try {
      await instance.post(`/api/tweets/${tweet.id}/like`);
      setIsLiked((prev) => !prev);
      setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
    } catch (error) {
      console.error("Failed to update like status:", error);
    }
  };

  const handleAuthorClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (userId === tweet.author_id.toString()) {
      navigate(`/user-profile`);
    } else {
      navigate(`/user-profile/${tweet.author_id}`);
    }
  };

  // 如果存在媒体（图片或视频），文字最多显示5行，否则显示10行
  const hasMedia = tweet.images && tweet.images.length > 0;
  const textClampClass = hasMedia ? "line-clamp-5" : "line-clamp-10";

  return (
    <div
      className="bg-white shadow-md rounded-lg p-4 mb-6 cursor-pointer max-h-[133vh] overflow-hidden"
      onClick={onClick}
    >
      <div className="flex items-start">
        {/* 用户头像 */}
        <div className="flex-shrink-0" onClick={handleAuthorClick}>
          <img
            src={tweet.author_avatar || "/static/images/avatar/1.jpg"}
            alt="User Avatar"
            className="w-12 h-12 rounded-full object-cover"
          />
        </div>

        <div className="flex-grow ml-4">
          {/* 用户名和推文头部信息 */}
          <div className="flex justify-between items-center">
            <div>
              <span className="font-semibold text-gray-800">
                {tweet.author_name}
              </span>
              <span className="text-gray-500 text-sm ml-2">
                @{tweet.account}
              </span>
            </div>
            <span className="text-gray-400 text-sm">
              {new Date(tweet.created_at).toLocaleTimeString()}
            </span>
          </div>

          {/* 推文内容 */}
          <p className={`mt-2 text-gray-700 tracking-widest ${textClampClass}`}>
            {tweet.content}
          </p>

          {/* 使用媒体展示组件 */}
          <MediaDisplay media={tweet.images || []} />

          {/* 互动按钮 */}
          <div className="flex justify-between mt-4 text-gray-500">
            <button
              className="flex items-center space-x-2 hover:text-blue-500"
              onClick={(event) => {
                event.stopPropagation();
                setIsModalOpen(true);
              }}
            >
              <IconMessageCircle />
              <span className="ml-2 text-current">
                {tweet.interactive_info.comment_count}
              </span>
            </button>
            <button className="flex items-center space-x-2 hover:text-green-500">
              <IconRepeat />
              <span className="ml-2 text-current">0</span>
            </button>
            <button
              className={`flex items-center space-x-2 ${
                isLiked ? "text-pink-500" : "text-gray-500"
              } hover:text-pink-600`}
              onClick={handleLike}
            >
              {isLiked ? (
                <IconHeartFilled size={24} className="text-current" />
              ) : (
                <IconHeart
                  size={24}
                  className="text-current hover:text-pink-500"
                />
              )}
              <span className="ml-2 text-current">{likeCount}</span>
            </button>
            <button className="flex items-center space-x-2 hover:text-blue-500">
              <IconEye />
              <span className="ml-2 text-current">
                {tweet.interactive_info.view_count}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 评论模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="bg-white rounded-lg shadow-lg z-10 max-w-screen-sm max-h-screen overflow-auto">
            <CommentModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              replyingTo={tweet.account}
              tweetId={tweet.id}
              authorAvatar={tweet.author_avatar}
              authorName={tweet.author_name}
              tweetTextContent={tweet.content}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Tweet;
