import React from 'react';
import { IconThumbUp, IconThumbUpFilled, IconMessage2, IconEye } from '@tabler/icons-react';
import { ListPostVo } from '../types/PostModel';

interface PostCardProps {
  post: ListPostVo;
  handlePostClick: (postId: number) => void;
  handleAuthorClick: (authorId: number, event: React.MouseEvent) => void;
  handleLike: (postId: number, isLiked: boolean, event: React.MouseEvent) => void;
  handleIconClick: (event: React.MouseEvent) => void;
}

const PostCard: React.FC<PostCardProps> = ({
    post,
    handlePostClick,
    handleAuthorClick,
    handleLike,
    handleIconClick,
  }) => {
    return (
      <div className="relative flex w-64 flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md cursor-pointer" onClick={() => handlePostClick(post.id)}>
        <div className="relative mx-4 -mt-6 h-40 overflow-hidden rounded-xl bg-blue-gray-500 bg-clip-border text-white shadow-lg shadow-blue-gray-500/40 bg-gradient-to-r from-blue-500 to-blue-600">
          <img src={post.cover_image || '/default-cover.jpg'} alt={post.title} className="w-full h-full object-cover rounded-md" />
        </div>
        <div className="p-6">
          <h5 className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
            {post.title}
          </h5>
          <p className="block font-sans text-base font-light leading-relaxed text-inherit antialiased line-clamp-3">
            {post.content}
          </p>
        </div>
        
        <div className="p-6 pt-0">
          <div className="flex items-center text-sm text-gray-500 space-x-4">
            <div className="flex items-center space-x-1" onClick={handleIconClick}>
              <IconEye className="w-5 h-5 text-gray-500" />
              <span>{post.interactive_info.view_count}</span>
            </div>
            <div className="flex items-center space-x-1" onClick={handleIconClick}>
              <IconMessage2 className="w-5 h-5 text-gray-500" />
              <span>{post.interactive_info.comment_count}</span>
            </div>
            <div className="flex items-center space-x-1" onClick={(event) => handleLike(post.id, post.interactive_info.is_like, event)}>
              {post.interactive_info.is_like ? (
                <IconThumbUpFilled size={24} className="text-pink-500" />
              ) : (
                <IconThumbUp size={24} className="text-gray-500" />
              )}
              <span className="ml-1">{post.interactive_info.like_count}</span>
            </div>
            <div className="flex items-center space-x-2 ml-auto">
              <span className="text-gray-700 cursor-pointer line-clamp-1 hover:text-blue-500 hover:underline" onClick={(event) => handleAuthorClick(post.author_id, event)}>
                作者：{post.author_name}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default PostCard;
