import store from '@/store';
import axios from 'axios';
import { getToken, hasToken, setToken } from '@/storage';
import { logout, saveToken } from '@/store/actions/login';
import { Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom'; // 引入 useNavigate

const baseURL = 'http://geek.itheima.net/v1_0/';

const instance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
});

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    const token = getToken();
    if (hasToken()) {
      config.headers.Authorization = 'Bearer ' + token.token;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const navigate = useNavigate(); // 在函数内部调用 useNavigate
    if (!error.response) {
      Toast.show('网络异常');
      return Promise.reject(error);
    }
    if (error.response.status !== 401) {
      Toast.show('操作错误');
      return Promise.reject(error);
    }
    const { refresh_token } = getToken();
    if (!refresh_token) {
      navigate('/login', { replace: true });
      Toast.show('登录信息过期');
      return Promise.reject(error);
    }
    try {
      const res = await axios({
        url: baseURL + 'authorizations',
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${refresh_token}`,
        },
      });
      const token = res.data.data.token;
      setToken({ token, refresh_token });
      store.dispatch(saveToken(token));
      return instance(error.config);
    } catch (err) {
      store.dispatch(logout());
      navigate('/login', { replace: true });
      return Promise.reject(err);
    }
  }
);

export default instance;
