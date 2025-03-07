import axios from 'axios';
import { getAccessToken, getRefreshToken, removeTokens, setTokens } from '../storage/storage';
import { Toast } from 'antd-mobile';
// import MainRoute from '../routes/router';
import { useNavigate } from 'react-router-dom';




function Instance() {

  const instance = axios.create({
    timeout: 5000,
  });
  const navigate = useNavigate();

  async function handleResponseError(error: any) {
    if (!error.response) {
      Toast.show('网络异常');
      return Promise.reject(error);
    }

    if (error.response.status !== 401) {
      Toast.show('操作错误');
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();
    const accessToken = getAccessToken();
    console.log("refresh:", refreshToken);
    console.log("access:", accessToken);
    if (!refreshToken) {
      Toast.show('执行登录信息过期');
      removeTokens();
      navigate('/login', { replace: true });
      return Promise.reject(error);
    }

    try {
      const res = await axios({
        url: `/api/auth/refresh`,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      if (res.status !== 200) {
        throw new Error('Refresh token failed');
      }

      const { AccessToken, RefreshToken } = res.data.data;
      setTokens(AccessToken, RefreshToken);
      console.log('成功刷新token');

      // 更新请求中的 Authorization 头并重新发起请求
      error.config.headers.Authorization = `Bearer ${AccessToken}`;
      return instance.request(error.config);
    } catch (err) {
      console.error('Error occurred:', err);
      Toast.show('报错登录信息过期');
      removeTokens();
      navigate('/login', { replace: true });
      return Promise.reject(err);
    }
  }

  instance.interceptors.request.use(
    function (config) {
      // 跳过对登录接口的请求拦截
      if (config.url === '/api/auth/login') {
        return config;
      }
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    function (response) {
      return response;
    },
    async function (error) {
      return handleResponseError(error);
    }
  );

  return instance;
}

export default Instance;

