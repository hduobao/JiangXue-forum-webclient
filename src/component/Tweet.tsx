import React, { useState, useEffect } from 'react';
import { IconMessageCircle, IconRepeat, IconHeart, IconShare } from '@tabler/icons-react'; // 引入 Tabler Icons 用作操作按钮
import { ListPostVo } from "../types/PostModel";
import Instance from '../interceptors/auth_interceptor';

const Tweet: React.FC<{ post: ListPostVo }> = ({ post }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <div className="flex items-start">
        {/* 用户头像 */}
        <img
          src={post.cover_image || "/static/images/avatar/1.jpg"}
          alt="User Avatar"
          className="w-12 h-12 rounded-full object-cover mr-4"
        />
        <div className="flex-grow">
          {/* 用户名和推文内容 */}
          <div className="flex justify-between items-center">
            <div>
              <span className="font-semibold text-gray-800">{post.author_name}</span>
              <span className="text-gray-500 text-sm ml-2">@{post.author_name}</span>
            </div>
            <span className="text-gray-400 text-sm">{new Date(post.created_at).toLocaleTimeString()}</span>
          </div>
          <p className="mt-2 text-gray-700">{post.content}</p>

          {/* 操作按钮 */}
          <div className="flex justify-between mt-4 text-gray-500">
            <button className="flex items-center space-x-2 hover:text-blue-500">
              <IconMessageCircle />
              <span>回复</span>
            </button>
            <button className="flex items-center space-x-2 hover:text-green-500">
              <IconRepeat />
              <span>转发</span>
            </button>
            <button className="flex items-center space-x-2 hover:text-red-500">
              <IconHeart />
              <span>喜欢</span>
            </button>
            <button className="flex items-center space-x-2 hover:text-blue-500">
              <IconShare />
              <span>分享</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tweet;