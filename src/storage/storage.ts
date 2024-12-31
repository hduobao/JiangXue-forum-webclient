// tokenStorage.ts

const TOKEN_KEY = 'AccessToken';
const REFRESH_TOKEN_KEY = 'RefreshToken';
const ID_KEY = 'id';

export const setTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const getAccessToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setUserId = (id: string) => {
    localStorage.setItem(ID_KEY, id);
};

export const getUserId = (): string | null => {
    return localStorage.getItem(ID_KEY);
};

export const removeTokens = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(ID_KEY);
};