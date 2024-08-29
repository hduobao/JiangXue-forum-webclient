// storage.js

const ACCESS_TOKEN_KEY = 'AccessToken';
const REFRESH_TOKEN_KEY = 'RefreshToken';

/**
 * 获取存储在本地的 token
 * @returns {{token: string, refresh_token: string} | null}
 */
export const getToken = () => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  const refresh_token = localStorage.getItem(REFRESH_TOKEN_KEY);

  if (token && refresh_token) {
    return { token, refresh_token };
  }
  return null;
};

/**
 * 检查是否存在 token
 * @returns {boolean}
 */
export const hasToken = () => {
  return !!localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * 存储 token 到本地
 * @param {{token: string, refresh_token: string}} tokens
 */
export const setToken = ({ token, refresh_token }) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
};

/**
 * 清除本地存储的 token
 */
export const clearToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};
