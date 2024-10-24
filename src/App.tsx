// App.js
import { useNavigate } from 'react-router-dom';
import Instance from './interceptors/auth_interceptor';
import { Outlet } from 'react-router-dom';
import LeftSidebar from './component/LeftSideBar';
import RightSidebar from './component/RightSideBar';
import { useEffect, useState } from 'react';

const App = () => {
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
    <div className="flex justify-center bg-gray-100 h-screen overflow-hidden">
      <div className="w-full max-w-[1500px] flex relative h-full">
        {/* 左侧边栏 */}
        <div className="w-[25%] md:w-[20%] lg:w-[18%] h-screen shadow-lg overflow-y-auto border-r border-gray-200">
          <LeftSidebar avatar={`${userInfo.avatar}`} username={`${userInfo.username}`} />
        </div>

        {/* 中间内容 */}
        <div className="flex-grow flex flex-col h-screen overflow-y-auto">
          <main className="flex-grow overflow-y-auto">
            <Outlet /> {/* 渲染匹配的子路由 */}
          </main>
        </div>

        {/* 右侧导航栏 */}
        <div className="w-[24vw] h-screen shadow-lg overflow-y-auto">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default App;
