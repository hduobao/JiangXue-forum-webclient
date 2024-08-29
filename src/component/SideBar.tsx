import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Avatar, Typography, Box, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import MessageIcon from '@mui/icons-material/Message';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import HistoryIcon from '@mui/icons-material/History';
import PeopleIcon from '@mui/icons-material/People';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // 导入退出图标
import { SidebarProps } from '../types/UserModel'
import axios from 'axios';



const Sidebar: React.FC<SidebarProps> = ({ avatar, username }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      localStorage.removeItem('AccessToken');
      localStorage.removeItem('RefreshToken')
  
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);

    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
          width: 240, 
          boxSizing: 'border-box', 
          backgroundColor: '#f0f0f0', // 灰色背景
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', // 添加阴影效果
          borderRadius: '8px', // 使边角圆润
          position: 'fixed', // 固定位置
          top: 0, // 顶部对齐
          left: 0, // 左侧对齐
          height: '100vh', // 高度为视口高度
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 2,
          pb: 2,
        }}
      >
        <Avatar
          alt="User Avatar"
          src={avatar || "/static/images/avatar/1.jpg"}
          sx={{ width: 64, height: 64 }}
        />
        <Typography variant="h6" sx={{ mt: 1 }}>
          {username || "用户昵称"}
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem button>
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="首页" />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemIcon><MessageIcon /></ListItemIcon>
          <ListItemText primary="消息" />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemIcon><BookmarkIcon /></ListItemIcon>
          <ListItemText primary="收藏" />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemIcon><HistoryIcon /></ListItemIcon>
          <ListItemText primary="历史" />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemIcon><FavoriteIcon /></ListItemIcon>
          <ListItemText primary="关注" />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemIcon><PeopleIcon /></ListItemIcon>
          <ListItemText primary="粉丝" />
        </ListItem>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon><ExitToAppIcon /></ListItemIcon>
          <ListItemText primary="退出" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
