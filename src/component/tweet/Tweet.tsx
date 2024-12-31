import React, { useState } from 'react';
import { IconMessageCircle, IconRepeat, IconHeart, IconEye, IconHeartFilled } from '@tabler/icons-react'; // 引入 Tabler Icons 用作操作按钮
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate
import { ListPostVo } from "../../types/PostModel";
import { getUserId } from '../../storage/storage';
import Instance from '../../interceptors/auth_interceptor';

const Tweet: React.FC<{ post: ListPostVo; onClick: () => void; }> = ({ post, onClick }) => {

  const userId = getUserId();

  const instance = Instance();
  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState<boolean>(post.interactive_info.is_like);
  const [likeCount, setLikeCount] = useState<number>(post.interactive_info.like_count);

  const handleLike = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); // 阻止事件冒泡
    if (!post) return;

    try {
      await instance.post(`/api/posts/${post.id}/like`);
      setIsLiked((prev) => !prev);
      setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1)); // 更新点赞数
    } catch (error) {
      console.error('Failed to update like status:', error);
    }
  };

  const handleAuthorClick = async (event : React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (!post) return;
    if (userId == post.author_id.toString()) {
      navigate(`/user-profile`)
    } else {
      navigate(`/user-profile/${post.author_id}`)
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6 cursor-pointer" onClick={onClick}>
      <div className="flex items-start">
        {/* 用户头像 */}
        <div className="flex-shrink-0" onClick={handleAuthorClick}>
          <img
            src={post.author_avatar || "/static/images/avatar/1.jpg"}
            alt="User Avatar"
            className="w-12 h-12 rounded-full object-cover"
            style={{ width: '48px', height: '48px' }} // 固定宽高为 48x48 px，保持圆形
          />
        </div>
        <div className="flex-grow ml-4">
          {/* 用户名和推文内容 */}
          <div className="flex justify-between items-center">
            <div>
              <span className="font-semibold text-gray-800">{post.author_name}</span>
              <span className="text-gray-500 text-sm ml-2">@{post.author_name}</span>
            </div>
            <span className="text-gray-400 text-sm">{new Date(post.created_at).toLocaleTimeString()}</span>
          </div>
          <p className="mt-2 text-gray-700 tracking-widest line-clamp-10">{post.content}</p>

          {/* 操作按钮 */}
          <div className="flex justify-between mt-4 text-gray-500">
            <button className="flex items-center space-x-2 hover:text-blue-500">
              <IconMessageCircle />
              <span className='ml-2 text-current'>{post.interactive_info.comment_count}</span>
            </button>
            <button className="flex items-center space-x-2 hover:text-green-500">
              <IconRepeat />
              <span className='ml-2 text-current'>0</span>
            </button>
            <button
              className={`flex items-center space-x-2 ${isLiked ? 'text-pink-500' : 'text-gray-500'} hover:text-pink-600`}
              onClick={handleLike}
            >
              {isLiked ? (
                <IconHeartFilled size={24} className={`text-current`} />
              ) : (
                <IconHeart size={24} className={`text-current hover:text-pink-500`} />
              )}
              <span className="ml-2 text-current">{likeCount}</span>
            </button>

            <button className="flex items-center space-x-2 hover:text-blue-500">
              <IconEye />
              <span className='ml-2 text-current'>{post.interactive_info.view_count}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tweet;
