// src/main.tsx

import { createRoot } from 'react-dom/client';
import './index.css';
import MainRoute from './routes/router.tsx';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux'; // 导入 Provider
import store from './store/store'; // 导入 Redux store

const { router } = MainRoute();

createRoot(document.getElementById('root')!).render(
  <Provider store={store}> {/* 包装 RouterProvider */}
    <RouterProvider router={router} />
  </Provider>
);
