import React, { MouseEvent } from 'react';
import { IconThumbUp, IconThumbUpFilled, IconMessage2, IconEye } from '@tabler/icons-react';

interface ListItemProps {
  id: number;
  title: string;
  content: string;
  cover_image: string;
  interactive_info: {
    view_count: number;
    comment_count: number;
    like_count: number;
    is_like: boolean;
  };
  author_id: number;
  author_name: string;
  onPostClick: (postId: number) => void;
  onAuthorClick: (authorId: number, event: MouseEvent) => void;
  onLikeClick: (postId: number, isLiked: boolean, event: MouseEvent) => void;
}

const ListItem: React.FC<ListItemProps> = ({
  id,
  title,
  content,
  cover_image,
  interactive_info,
  author_id,
  author_name,
  onPostClick,
  onAuthorClick,
  onLikeClick,
}) => {

  const handleIconClick = (event: MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <div
      className="bg-white shadow-md rounded-lg p-4 flex space-x-4 cursor-pointer"
      onClick={() => onPostClick(id)}
    >
      <div className="flex-none w-40 h-24 relative">
        <img
          src={cover_image || '/default-cover.jpg'}
          alt={title}
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      <div className="flex-1">
        <h2 className="text-xl font-medium mb-2 cursor-pointer hover:underline">
          {title}
        </h2>

        <p className="text-gray-700 mb-2 line-clamp-2">
          {content}
        </p>
        
        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <div className="flex items-center space-x-1" onClick={handleIconClick}>
            <IconEye className="w-5 h-5 text-gray-500" />
            <span>{interactive_info.view_count}</span>
          </div>
          <div className="flex items-center space-x-1" onClick={handleIconClick}>
            <IconMessage2 className="w-5 h-5 text-gray-500" />
            <span>{interactive_info.comment_count}</span>
          </div>
          <div className="flex items-center space-x-1" onClick={(event) => onLikeClick(id, interactive_info.is_like, event)}>
            {interactive_info.is_like ? (
              <IconThumbUpFilled size={24} className="text-pink-500" />
            ) : (
              <IconThumbUp size={24} className="text-gray-500" />
            )}
            <span>{interactive_info.like_count}</span>
          </div>
          
          <div className="flex items-center space-x-2 ml-auto">
            <span
              className="text-gray-700 cursor-pointer hover:text-blue-500 hover:underline"
              onClick={(event) => onAuthorClick(author_id, event)}
            >
              作者：{author_name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListItem;
