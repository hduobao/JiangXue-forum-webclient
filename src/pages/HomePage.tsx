import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftSidebar from '../component/LeftSideBar';
import RightSidebar from '../component/RightSideBar';
import PostList from '../component/PostList';
import Navbar from '../component/TopNavigationBar';
import Instance from '../interceptors/auth_interceptor';
import { ListPostVo } from "../types/PostModel";

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

  const fetchPosts = async (): Promise<ListPostVo[]> => {
    const offset = 1;
    const limit = 10;
    const response = await instance.get(`/api/1/posts`, {
      params: { offset, limit },
    });
    return response.data.data;
  };

  return (
    <div className="flex h-screen">
      {/* 左侧导航栏 */}
      <LeftSidebar avatar={userInfo.avatar} username={userInfo.username} />

      {/* 中间主要内容和右侧栏包裹在一个 div 中 */}
      <div className="flex flex-grow">
        {/* 中间主要内容 */}
        <main className="flex-grow bg-gray-100 p-6 ml-60 mr-20">
          <Navbar />
          <div className="p-6">
            <PostList fetchPosts={fetchPosts} />
          </div>
        </main>
      </div>
      {/* 右侧推荐栏 */}
      <RightSidebar /> {/* 右侧栏组件 */}
    </div>
  );
};

export default HomePage;
