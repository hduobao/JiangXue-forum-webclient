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
import CommentModal from "../comment/CommentModel"; // 引入 CommentModal 组件

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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // 管理弹窗的显示状态

  const handleLike = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); // 阻止事件冒泡
    if (!tweet) return;

    try {
      await instance.post(`/api/tweets/${tweet.id}/like`);
      setIsLiked((prev) => !prev);
      setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1)); // 更新点赞数
    } catch (error) {
      console.error("Failed to update like status:", error);
    }
  };

  const handleAuthorClick = async (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (!tweet) return;
    if (userId == tweet.author_id.toString()) {
      navigate(`/user-profile`);
    } else {
      navigate(`/user-profile/${tweet.author_id}`);
    }
  };

  const handleCommentClick = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    setIsModalOpen(true); // 打开评论弹窗
  };

  const handleModalClose = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setIsModalOpen(false); // 关闭评论弹窗
  };

  return (
    <div
      className="bg-white shadow-md rounded-lg p-4 mb-6 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start">
        {/* 用户头像 */}
        <div className="flex-shrink-0" onClick={handleAuthorClick}>
          <img
            src={tweet.author_avatar || "/static/images/avatar/1.jpg"}
            alt="User Avatar"
            className="w-12 h-12 rounded-full object-cover"
            style={{ width: "48px", height: "48px" }} // 固定宽高为 48x48 px，保持圆形
          />
        </div>
        <div className="flex-grow ml-4">
          {/* 用户名和推文内容 */}
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
          <p className="mt-2 text-gray-700 tracking-widest line-clamp-10">
            {tweet.content}
          </p>

          {/* 操作按钮 */}
          <div className="flex justify-between mt-4 text-gray-500">
            <button
              className="flex items-center space-x-2 hover:text-blue-500"
              onClick={handleCommentClick}
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
                <IconHeartFilled size={24} className={`text-current`} />
              ) : (
                <IconHeart
                  size={24}
                  className={`text-current hover:text-pink-500`}
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
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div
            className="bg-white rounded-lg shadow-lg z-10 max-w-screen-sm max-h-screen overflow-auto"
            onClick={handleModalClose}
          >
            <CommentModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              replyingTo={tweet?.account}
              tweetId={tweet?.id}
              authorAvatar={tweet?.author_avatar}
              authorName={tweet?.author_name}
              tweetTextContent={tweet?.content}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Tweet;
