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
  <div className="w-full max-w-[1200px] flex relative">
    {/* 左侧边栏固定 */}
    <div className="w-[18vw] h-screen fixed top-0 left-24">
      <LeftSidebar avatar={userInfo.avatar} username={userInfo.username} />
    </div>

    {/* 中间内容，添加 padding-right 避免覆盖 */}
    <div className="flex-grow overflow-y-auto h-screen pl-[15vw] pr-[24vw]">
      <main className="flex justify-center mt-4">
        <PostList />
      </main>
    </div>

    {/* 右侧导航栏固定 */}
    <div className="w-[24vw] h-screen fixed top-0 right-24">
      <RightSidebar />
    </div>
  </div>
</div>

  );
};

export default HomePage;