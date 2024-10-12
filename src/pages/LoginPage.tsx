import React from 'react';
import Instance from '../interceptors/auth_interceptor';
import { useNavigate } from 'react-router-dom';
import { setTokens } from '../storage/storage';

const LoginPage: React.FC = () => {
  const instance = Instance();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const account = formData.get('account');
    const password = formData.get('password');

    try {
      const response = await instance.post('/api/auth/login', {
        account: account,
        password: password,
      });

      if (response.data.data) {
        const token = response.data.data.AccessToken;
        const refreshToken = response.data.data.RefreshToken;
        setTokens(token, refreshToken);
        navigate('/home');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('用户名或密码错误或服务器出现问题');
    }
    console.log('Form submitted');
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-8 bg-gradient-to-r from-blue-400 to-blue-600">
      <div className="flex flex-col items-center w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold">登录</h1>
        <form className="w-full mt-4" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="account" className="block text-sm font-medium">
              账号
            </label>
            <input
              id="account"
              name="account"
              type="text"
              required
              autoComplete="account"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium">
              密码
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            登录
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
