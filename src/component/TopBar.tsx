import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconArrowLeft} from '@tabler/icons-react'; // 引入 Tabler Icons 用作操作按钮

const TopBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('recommendations'); // 默认激活标签

  // 处理标签点击
  const handleTabClick = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
  };

  // 判断是否在详情页
  const isDetailPage = location.pathname.includes('/tweet'); // 根据你的路由调整条件

  return (
    <div className="relative flex flex-col">
      <div className="flex border-b">
        {isDetailPage ? (
          // 详情页的返回按钮
          <button
            className="flex items-center cursor-pointer p-4 transition-colors duration-200 text-gray-700"
            onClick={() => navigate(-1)} // 返回上一个页面
          >
            <IconArrowLeft />
            返回
          </button>
        ) : (
          <>
            {/* 推荐标签按钮 */}
            <button
              className={`flex-grow text-center cursor-pointer p-4 transition-colors duration-200 ${activeTab === 'recommendations' ? 'font-bold' : 'text-gray-700 hover:bg-gray-200'}`}
              onClick={() => handleTabClick('recommendations')}
              style={{ fontSize: '1.1rem' }} // 字体调整
            >
              推荐
            </button>
            {/* 关注标签按钮 */}
            <button
              className={`flex-grow text-center cursor-pointer p-4 transition-colors duration-200 ${activeTab === 'following' ? 'font-bold' : 'text-gray-700 hover:bg-gray-200'}`}
              onClick={() => handleTabClick('following')}
              style={{ fontSize: '1.1rem' }} // 字体调整
            >
              关注
            </button>
          </>
        )}
      </div>

      {/* 蓝色横线指示激活的标签 */}
      {!isDetailPage && (
        <div className="h-1 bg-blue-500 transition-all duration-300" style={{ 
          width: '50%', 
          marginLeft: activeTab === 'recommendations' ? '0%' : '50%' 
        }} />
      )}
    </div>
  );
};

export default TopBar;
