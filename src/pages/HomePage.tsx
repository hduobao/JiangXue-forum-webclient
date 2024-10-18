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
    // <div>
    //   Hello World!
    // </div>
    <div className="flex justify-center bg-gray-100">
      <div className="w-full max-w-[1200px] flex relative">
      
        <div className="w-[15vw] absolute inset-y-0 left-0">
          <LeftSidebar avatar={userInfo.avatar} username={userInfo.username} />
        </div>

      
        <div className="flex-grow ml-4 overflow-y-scoll"> 
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
