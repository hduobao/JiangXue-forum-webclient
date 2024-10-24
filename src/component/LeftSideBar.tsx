import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IconHome, IconMap, IconBell, IconMessageCircle, IconBookmark, IconUsers, IconUser, IconSwitchHorizontal } from '@tabler/icons-react';
import { SidebarProps } from '../types/UserModel';
import Instance from '../interceptors/auth_interceptor';
import { getAccessToken, getRefreshToken, removeTokens } from '../storage/storage';

const LeftSidebar: React.FC<SidebarProps> = ({ avatar, username }) => {
  const instance = Instance();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = async () => {
    try {
      await instance.post('/api/auth/logout', {
        accessToken : getAccessToken(),
        refreshToken : getRefreshToken,
      });
      removeTokens();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const menuItems = [
    { icon: <IconHome />, label: "首页", route: "/home" },
    { icon: <IconMap />, label: "发现", route: "/explore" },
    { icon: <IconBell />, label: "通知", route: "/notifications" },
    { icon: <IconMessageCircle />, label: "消息", route: "/messages" },
    { icon: <IconBookmark />, label: "收藏", route: "/bookmarks" },
    { icon: <IconUsers />, label: "联系人", route: "/lists" },
    { icon: <IconUser />, label: "空间", route: "/profile" },
  ];

  return (
    <div className="h-screen bg-white text-gray-800 flex flex-col relative">
      <div className="flex items-center justify-between p-4">
        <img src={`/favorite.svg`} alt="Company Logo" className="h-10" />
        {/* <div className="text-2xl ml-0 leading-none">𝒮𝓃𝑜𝓌ℱ𝓁𝑜𝓌</div> */}
        <img src={`/snowflow.svg`} alt="s" className='h-10' />
      </div>

      <ul className="flex-grow mt-0">
        {menuItems.map((item, index) => (
          <li key={index} className={`rounded-lg transition-colors duration-200 ${location.pathname === item.route ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}>
            <button
              className="flex items-center p-4 w-full text-left transition-all duration-200 ease-in-out"
              onClick={() => navigate(item.route)}
            >
              <span className="mr-4">{item.icon}</span>
              <span className="text-base font-medium">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* 名片区域 */}
      <div className="flex items-center justify-between p-4 cursor-pointer">
        {/* 左侧区域：头像和用户名 */}
        <div className={`flex items-center transition-transform duration-500 ${showLogout ? 'transform rotate-y-180' : ''}`}>
          <div className={`relative flex items-center ${showLogout ? 'hidden' : ''}`}>
            <img
              src={avatar || "/static/images/avatar/1.jpg"}
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover shadow-lg"
            />
            <div className="flex flex-col items-start ml-4">
              <p className="text-sm font-bold">{username || "用户昵称"}</p>
              <p className="text-xs text-gray-600">123456</p>
            </div>
          </div>

          {/* 退出按钮区域 */}
          <div className={`relative flex items-center ${showLogout ? '' : 'hidden'} rotate-y-180`}>
            <button
              className="bg-white text-center w-40 rounded-2xl h-14 relative text-black text-xl font-semibold group"
              type="button"
              onClick={handleLogout}
            >
              <div className="bg-red-500 rounded-xl h-12 w-1/4 flex items-center justify-center absolute left-1 top-[4px] group-hover:w-[184px] z-10 duration-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" height="25px" width="25px">
                  <path d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z" fill="#000000"></path>
                  <path d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z" fill="#000000"></path>
                </svg>
              </div>
              <p className="translate-x-2">退出</p>
            </button>
          </div>
        </div>

        {/* 右侧区域：切换按钮 */}
        <div
          className="flex items-center p-2 hover:bg-blue-500 rounded-lg transition duration-200"
          onClick={() => setShowLogout(!showLogout)}
        >
          <button
            className="flex items-center justify-center w-10 h-10 rounded-full"
          >
            <IconSwitchHorizontal size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
