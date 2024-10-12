import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IconHome, IconMessageCircle, IconBookmark, IconHistory, IconUsers, IconHeart, IconLogout } from '@tabler/icons-react'; // 引入tabler icons
import { SidebarProps } from '../types/UserModel'
import Instance from '../interceptors/auth_interceptor';
import { removeTokens } from '../storage/storage';

const LeftSidebar: React.FC<SidebarProps> = ({ avatar, username }) => {
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

  const menuItems = [
    { icon: <IconHome />, label: "首页", route: "/" },
    { icon: <IconMessageCircle />, label: "消息", route: "/message" },
    { icon: <IconBookmark />, label: "收藏", route: "/favorites" },
    { icon: <IconHistory />, label: "历史", route: "/history" },
    { icon: <IconHeart />, label: "关注", route: "/follows" },
    { icon: <IconUsers />, label: "粉丝", route: "/fans" }
  ];

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-blue-400 to-blue-500 text-gray-100 shadow-lg flex flex-col fixed top-0 left-0">
      {/* 用户信息 */}
      <div
        className="flex flex-col items-center mt-8 mb-4 cursor-pointer p-4 hover:bg-blue-500 rounded-lg transition-all"
        onClick={() => navigate('/user-profile')}
      >
        <img
          src={avatar || "/static/images/avatar/1.jpg"}
          alt="User Avatar"
          className="w-16 h-16 rounded-full object-cover shadow-lg"
        />
        <p className="mt-3 text-lg font-medium">{username || "用户昵称"}</p>
      </div>

      {/* 分割线 */}
      <div className="mt-4 w-full border-t border-blue-300"></div>

      {/* 导航菜单 */}
      <ul className="flex-grow mt-6">
        {menuItems.map((item, index) => (
          <li key={index} className="hover:bg-blue-600 rounded-lg">
            <button
              className="flex items-center p-4 w-full text-left transition-all duration-200 ease-in-out"
              onClick={() => navigate(item.route)}
            >
              <span className="mr-4">{item.icon}</span>
              <span className="text-base">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* 退出按钮 */}
      <div className="border-t border-blue-300 mt-6">
        <button
          className="flex items-center p-4 w-full text-left hover:bg-red-600 rounded-lg transition-all duration-200 ease-in-out"
          onClick={handleLogout}
        >
          <IconLogout className="mr-4" />
          <span className="text-base">退出</span>
        </button>
      </div>
    </div>
  );
};

export default LeftSidebar;
