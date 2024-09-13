import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../component/SideBar'; // 引入 Sidebar 组件
import PostList from '../component/PostList';
import Navbar from '../component/TopNavigationBar';
import Instance from '../interceptors/auth_interceptor';

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
    <div className="flex h-screen">
      {/* 左侧导航栏 */}
      <Sidebar avatar={userInfo.avatar} username={userInfo.username} />
  
      {/* 主内容区域 */}
      <main className="flex-grow p-0 ml-60">  {/* 添加了 ml-60 确保主内容区域避开侧边栏 */}
        {/* 顶部导航栏 */}
        <Navbar />
        
        {/* PostList 组件，用于展示帖子 */}
        <div className="p-6">
          <PostList />
        </div>
      </main>
    </div>
  );
  
  
};

export default HomePage;
