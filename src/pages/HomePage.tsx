import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftSidebar from '../component/LeftSideBar';
import RightSidebar from '../component/RightSideBar';
import Instance from '../interceptors/auth_interceptor';
import PostList from '../component/PostList';

const HomePage: React.FC = () => {
  const instance = Instance();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({ avatar: '', username: '' });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await instance.get("/api/me/home");
        setUserInfo({
          avatar: response.data.data.avatar,
          username: response.data.data.username,
        });
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        navigate('/home');
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div className="flex justify-center bg-gray-100">
      {/* 设置页面最大宽度 */}
      <div className="w-full max-w-[1200px] flex relative">
        {/* 左侧导航栏 */}
        <div className="w-[15vw] relative"> {/* 将宽度从 20vw 改为 15vw */}
          <LeftSidebar avatar={userInfo.avatar} username={userInfo.username} />
        </div>

        {/* 中间内容 */}
        <div className="flex-grow ml-4"> {/* 自动扩展中间内容区域 */}
          <main className="flex justify-center mt-4">
            <PostList />
          </main>
        </div>

        {/* 右侧导航栏 */}
        <div className="w-[15vw] relative"> {/* 同样将右侧栏宽度从 20vw 改为 15vw */}
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
