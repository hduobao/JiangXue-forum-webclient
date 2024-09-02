import React, { useEffect, useState } from 'react';
import { Container, Avatar, Typography, Box, Divider, Grid, Paper } from '@mui/material';
import instance from '../interceptors/auth_interceptor';
import { UserBaseInfo } from '../types/UserModel';

const UserProfile: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserBaseInfo | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await instance.get('/api/user/userInfo');
        setUserInfo(response.data.data);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  if (!userInfo) {
    return <Typography variant="h6">加载中...</Typography>;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar
            alt="User Avatar"
            src={userInfo.avatar || '/static/images/avatar/1.jpg'}
            sx={{ width: 100, height: 100, mr: 3 }}
          />
          <Box>
            <Typography variant="h4">{userInfo.username}</Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {userInfo.location || '未设置位置'}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Typography variant="h6">个人简介</Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          {userInfo.bio || '这个用户还没有添加个人简介。'}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="textSecondary">账户</Typography>
            <Typography variant="body1">{userInfo.account}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="textSecondary">邮箱</Typography>
            <Typography variant="body1">{userInfo.email || '未设置邮箱'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="textSecondary">手机号</Typography>
            <Typography variant="body1">{userInfo.phone_number || '未设置手机号'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="textSecondary">生日</Typography>
            <Typography variant="body1">{userInfo.birthday ? new Date(userInfo.birthday).toLocaleDateString() : '未设置生日'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="textSecondary">性别</Typography>
            <Typography variant="body1">{userInfo.gender === 1 ? '男' : userInfo.gender === 2 ? '女' : '未设置性别'}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="textSecondary">声望</Typography>
            <Typography variant="body1">{userInfo.reputation}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="textSecondary">最近登录时间</Typography>
            <Typography variant="body1">{new Date(userInfo.last_login).toLocaleString()}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="textSecondary">注册时间</Typography>
            <Typography variant="body1">{new Date(userInfo.created_at).toLocaleDateString()}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default UserProfile;
