import axios from 'axios';
import { getAccessToken, getRefreshToken, setTokens } from '../storage/storage';
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
    if (!refreshToken) {
      Toast.show('登录信息过期');
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
      Toast.show('登录信息过期');
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



// import axios, { AxiosRequestConfig } from 'axios';
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import useTokenStore from '../../store/TokenStore';


// const Instance = () => {
//   const navigate = useNavigate()
//   // const {token} = useToken()
//   const token = useTokenStore.use.token()
//   const service = axios.create({
//     // baseURL: 'https://mock.apifox.com/m1/4399114-4043653-default/',  // 你的API地址
//     baseURL: "http://10.23.45.94:8000",
//     // baseURL: "http://xiaoli.chat:8000",
//     timeout: 10000,  // 请求超时时间
//   });

//   // 请求拦截器
//   service.interceptors.request.use(
//     config => {
//       // 在发送请求之前做些什么：例如添加token
//       // config.headers.Authorization = `${token}`
//       return config;
//     },
//     error => {
//       // 对请求错误做些什么
//       return Promise.reject(error);
//     }
//   );

//   // 响应拦截器
//   service.interceptors.response.use(
//     response => {
//       // 对响应数据做点什么
//       const res = response.data;

//       // 根据你的业务处理回调
//       if (res.code !== 1) {
//         toast.error(`${res.msg}`)
//         return Promise.reject(new Error(res.message || 'Error'));
//       } else {
//         return res;
//       }
//     },
//     error => {
//       // 对响应错误做点什么
//       console.log('err' + error);  // for debug
//       return Promise.reject(error);
//     }
//   );

//   // const httpService = {
//   //   post<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T>{
//   //     return service.post(url,data,config)
//   //   },
//   //   get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>{
//   //     return service.get(url,config)
//   //   },
//   //   delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>{
//   //     return service.delete(url,config)
//   //   },
//   //   put<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T>{
//   //     return service.put(url,data,config)
//   //   }
//   // }

//   return { service }
// }

// export default Instance;