import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../component/SideBar';
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
      <Sidebar avatar={userInfo.avatar} username={userInfo.username} />
      <main className="flex-grow p-0 ml-60">
        <Navbar />
        <div className="p-6">
          <PostList fetchPosts={fetchPosts} />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
