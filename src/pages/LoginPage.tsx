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
    const account = formData.get('account') as string;
    const password = formData.get('password') as string;

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
  };

  return (
    <div className="relative flex justify-center items-center h-screen w-full">
      <img
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/login_bg.svg" // 背景图片
        alt="Background"
      />
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 relative z-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm bg-white rounded-xl shadow-lg p-8">
          <img
            alt="Your Company"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="account" className="block text-sm font-medium leading-6 text-gray-900">
                Account
              </label>
              <div className="mt-2">
                <input
                  id="account"
                  name="account"
                  type="text"
                  required
                  autoComplete="username"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                LOG IN
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <a href="#" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
