import React, { useRef } from 'react';
import Instance from '../interceptors/auth_interceptor';
import { useNavigate } from 'react-router-dom';
import { setTokens } from '../storage/storage';

const LoginPage: React.FC = () => {
  const instance = Instance();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null); // 创建一个 ref 来访问 video 元素

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play(); // 鼠标进入时播放视频
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause(); // 鼠标离开时暂停视频
      videoRef.current.currentTime = 0; // 可选：将视频重置为起始位置
    }
  };

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
    <div
      className="relative flex justify-center items-center h-screen w-full"
      onMouseEnter={handleMouseEnter} // 添加鼠标进入事件
      onMouseLeave={handleMouseLeave} // 添加鼠标离开事件
    >
      <video
        ref={videoRef} // 将 ref 赋给 video 元素
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="login_bg.mp4" // 替换为你的视频文件路径
        autoPlay
        muted
        loop
      />
      <div className="grid gap-8 relative z-10">
        <section
          id="back-div"
          className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl"
        >
          <div className="border-8 border-transparent rounded-xl bg-white dark:bg-gray-900 shadow-xl p-8 m-2">
            <h1 className="text-5xl font-bold text-center cursor-default dark:text-gray-300 text-gray-900">
              Log in
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="account" className="block mb-2 text-lg dark:text-gray-300">
                  Account
                </label>
                <input
                  id="account"
                  name="account" // 添加name属性
                  className="border p-3 shadow-md dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 transition transform hover:scale-105 duration-300"
                  type="text"
                  placeholder="Account"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-lg dark:text-gray-300">
                  Password
                </label>
                <input
                  id="password"
                  name="password" // 添加name属性
                  className="border p-3 shadow-md dark:bg-indigo-700 dark:text-gray-300 dark:border-gray-700 border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 transition transform hover:scale-105 duration-300"
                  type="password"
                  placeholder="Password"
                  required
                />
              </div>
              <a href="#" className="text-blue-400 text-sm transition hover:underline">
                Forget your password?
              </a>
              <button
                className="w-full p-3 mt-4 text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg hover:scale-105 transition transform duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="submit"
              >
                LOG IN
              </button>
            </form>
            <div className="flex flex-col mt-4 text-sm text-center dark:text-gray-300">
              <p>
                Don't have an account?
                <a href="#" className="text-blue-400 transition hover:underline">
                  Sign Up
                </a>
              </p>
            </div>
            <div id="third-party-auth" className="flex justify-center gap-4 mt-5">
              <button className="p-2 rounded-lg hover:scale-105 transition transform duration-300 shadow-lg">
                <img
                  className="w-6 h-6"
                  loading="lazy"
                  src="https://ucarecdn.com/8f25a2ba-bdcf-4ff1-b596-088f330416ef/"
                  alt="Google"
                />
              </button>
              <button className="p-2 rounded-lg hover:scale-105 transition transform duration-300 shadow-lg">
                <img
                  className="w-6 h-6"
                  loading="lazy"
                  src="https://ucarecdn.com/95eebb9c-85cf-4d12-942f-3c40d7044dc6/"
                  alt="LinkedIn"
                />
              </button>
              <button className="p-2 rounded-lg hover:scale-105 transition transform duration-300 shadow-lg">
                <img
                  className="w-6 h-6 dark:invert"
                  loading="lazy"
                  src="https://ucarecdn.com/be5b0ffd-85e8-4639-83a6-5162dfa15a16/"
                  alt="GitHub"
                />
              </button>
              <button className="p-2 rounded-lg hover:scale-105 transition transform duration-300 shadow-lg">
                <img
                  className="w-6 h-6"
                  loading="lazy"
                  src="https://ucarecdn.com/6f56c0f1-c9c0-4d72-b44d-51a79ff38ea9/"
                  alt="Facebook"
                />
              </button>
              <button className="p-2 rounded-lg hover:scale-105 transition transform duration-300 shadow-lg">
                <img
                  className="w-6 h-6"
                  loading="lazy"
                  src="https://ucarecdn.com/82d7ca0a-c380-44c4-ba24-658723e2ab07/"
                  alt="Twitter"
                />
              </button>
              <button className="p-2 rounded-lg hover:scale-105 transition transform duration-300 shadow-lg">
                <img
                  className="w-6 h-6"
                  loading="lazy"
                  src="https://ucarecdn.com/3277d952-8e21-4aad-a2b7-d484dad531fb/"
                  alt="Apple"
                />
              </button>
            </div>

            <div className="mt-4 text-center text-sm text-gray-500">
              <p>
                By signing in, you agree to our
                <a href="#" className="text-blue-400 transition hover:underline">
                  Terms
                </a>
                and
                <a href="#" className="text-blue-400 transition hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
