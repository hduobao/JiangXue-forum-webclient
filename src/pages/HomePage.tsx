// HomePage.tsx
import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../component/SideBar'; // 引入 Sidebar 组件
import PostList from '../component/PostList';
import instance from '../interceptors/auth_interceptor'; // 引入配置了拦截器的 axios 实例

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({avatar: '', username: ''})

  useEffect(() => {
    const fetchUserInfo = async () => {
        try {
          const response = await instance.get("/api/user/userHomeInfo");
          setUserInfo({
            avatar: response.data.data.avatar,
            username: response.data.data.username,
          });
        } catch (error) {
            console.error('Failed to fetch user info:', error);
            navigate('/home')
        }
    };

    fetchUserInfo();
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar avatar={userInfo.avatar} username={userInfo.username} /> {/* 左侧导航栏 */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3 }}
      >
        <Typography variant="h4">首页内容</Typography>
        {/* 你可以在这里添加首页的其他内容 */}
        <PostList /> {/* 引入 PostList 组件 */}
      </Box>
    </Box>
  );
};

export default HomePage;
