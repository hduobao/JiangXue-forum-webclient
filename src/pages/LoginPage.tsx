// LoginPage.tsx
import React from 'react';
import axios from 'axios'; // 引入axios
import { Button, TextField, Container, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { setTokens } from '../storage/storage';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // 从表单中获取数据
        const formData = new FormData(event.currentTarget);
        const account = formData.get('account');
        const password = formData.get('password');
      
        try {
          // 发送POST请求到后端登录接口
          const response = await axios.post('/api/auth/login', {
            account: account,
            password: password
          });
      
          // 检查响应中是否包含Access_Token
          if (response.data.data) {
            const token = response.data.data.AccessToken; // 后端返回的Access_Token
            const refreshToken = response.data.data.RefreshToken;
            setTokens(token, refreshToken)
            // localStorage.setItem('AccessToken', token); // 保存Access_Token
            navigate('/home'); // 登录成功，跳转到首页
          } else {
            throw new Error('Invalid response from server');
          }
        } catch (error) {
          // 处理错误，例如网络问题或后端服务错误
          console.error('Login error:', error);
          alert('用户名或密码错误或服务器出现问题');
        }
        console.log('Form submitted');
      };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center', // Center vertically
          minHeight: '100vh', // Full viewport height
          py: 8, // Padding top and bottom
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            p: 3,
            borderRadius: 1,
            boxShadow: 3,
            backgroundColor: 'background.paper', // Optional: for better visibility
          }}
        >
          <Typography component="h1" variant="h5">
            登录
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="account"
              label="账号"
              name="account"
              autoComplete="account"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              label="密码"
              name="password"
              type="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              登录
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
