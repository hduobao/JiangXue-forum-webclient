import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    navigate(-1); // 点击返回按钮时回到上一页
  };

  return (
    <div className="relative flex flex-col">
      {location.pathname.startsWith('/tweet/') ? (
        // 详情页顶部栏
        <div className="flex items-center p-4 border-b">
          <button onClick={handleBack} className="mr-4">
            返回
          </button>
          <h1 className="text-xl font-bold">详情</h1>
        </div>
      ) : (
        // 正常的推荐/关注顶部栏
        <div className="flex border-b">
          <button className="flex-grow text-center p-4">推荐</button>
          <button className="flex-grow text-center p-4">关注</button>
        </div>
      )}
    </div>
  );
};

export default TopBar;
