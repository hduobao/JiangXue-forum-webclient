import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconHome, IconMessageCircle, IconBookmark, IconHistory, IconUsers, IconHeart, IconLogout } from '@tabler/icons-react'; // 引入tabler icons
import { SidebarProps } from '../types/UserModel'
import Instance from '../interceptors/auth_interceptor';
import { removeTokens } from '../storage/storage';

const Sidebar: React.FC<SidebarProps> = ({ avatar, username }) => {
  const instance = Instance();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await instance.post('/api/auth/logout');
      removeTokens();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleProfileClick = async () => {
    try {
      navigate('/user-profile');
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    }
  };

  const handleMessageClick = async () => {
    try {
      navigate('/message');
    } catch (error) {
      console.error('Failed to route message center:', error);
    }
  }

  return (
    <div className="w-60 h-screen bg-gray-100 shadow-lg flex flex-col fixed top-0 left-0">
      {/* 用户信息 */}
      <div
        className="flex flex-col items-center mt-4 cursor-pointer"
        onClick={handleProfileClick} // 添加点击事件
      >
        <img
          src={avatar || "/static/images/avatar/1.jpg"}
          alt="User Avatar"
          className="w-16 h-16 rounded-full object-cover" // 这里增加了 object-cover
        />

        <p className="mt-2 text-lg font-semibold">{username || "用户昵称"}</p>
      </div>

      {/* 分割线 */}
      <div className="mt-4 w-full border-t border-gray-300"></div>

      {/* 导航菜单 */}
      <ul className="flex-grow mt-6">
        <li className="hover:bg-gray-200">
          <button className="flex items-center p-4 w-full text-left" onClick={() => navigate('/')}>
            <IconHome className="mr-3 text-gray-600" />
            <span className="text-gray-800">首页</span>
          </button>
        </li>
        <li className="hover:bg-gray-200">
          <button className="flex items-center p-4 w-full text-left" onClick={handleMessageClick}>
            <IconMessageCircle className="mr-3 text-gray-600" />
            <span className="text-gray-800">消息</span>
          </button>
        </li>
        <li className="hover:bg-gray-200">
          <button className="flex items-center p-4 w-full text-left">
            <IconBookmark className="mr-3 text-gray-600" />
            <span className="text-gray-800">收藏</span>
          </button>
        </li>
        <li className="hover:bg-gray-200">
          <button className="flex items-center p-4 w-full text-left">
            <IconHistory className="mr-3 text-gray-600" />
            <span className="text-gray-800">历史</span>
          </button>
        </li>
        <li className="hover:bg-gray-200">
          <button className="flex items-center p-4 w-full text-left">
            <IconHeart className="mr-3 text-gray-600" />
            <span className="text-gray-800">关注</span>
          </button>
        </li>
        <li className="hover:bg-gray-200">
          <button className="flex items-center p-4 w-full text-left">
            <IconUsers className="mr-3 text-gray-600" />
            <span className="text-gray-800">粉丝</span>
          </button>
        </li>
      </ul>

      {/* 退出按钮 */}
      <div className="border-t border-gray-300">
        <button
          className="flex items-center p-4 w-full text-left hover:bg-gray-200"
          onClick={handleLogout}
        >
          <IconLogout className="mr-3 text-gray-600" />
          <span className="text-gray-800">退出</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
