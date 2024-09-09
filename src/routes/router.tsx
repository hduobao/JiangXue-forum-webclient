import { Route, createBrowserRouter, createRoutesFromElements, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import PostDetailPage from '../pages/PostDetailPage';
import App from '../App';
import HomePage from '../pages/HomePage';
import ProtectedRoute from './ProtectedRoute';
import UserProfile from '../pages/UserSpacePage';
import MessageCenter from '../pages/MessageCenter';

const MainRoute = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<App />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="home" element={<ProtectedRoute element={<HomePage />} />} />
        <Route path="posts/:postID" element={<ProtectedRoute element={<PostDetailPage />} />} />
        <Route path="user-profile" element={<ProtectedRoute element={<UserProfile />} />} />
        <Route path="user-profile/:authorID" element={<ProtectedRoute element={<UserProfile />} />} />
        <Route path="message" element={<ProtectedRoute element={<MessageCenter />} />} />
        <Route index element={<Navigate to={!!localStorage.getItem('AccessToken') ? "/home" : "/login"} />} />
      </Route>
    )
  );

  return { router };
};

export default MainRoute;