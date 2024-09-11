import { Route, createBrowserRouter, createRoutesFromElements, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import PostDetailPage from '../pages/PostDetailPage';
import App from '../App';
import HomePage from '../pages/HomePage';
import ProtectedRoute from './ProtectedRoute';
import UserProfile from '../pages/UserSpacePage';
import MessageCenterPage from '../pages/MessageCenterPage';
import FollowsPage from '../pages/FollowsPage';
import FansPage from '../pages/FansPage';

const MainRoute = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<App />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="home" element={<ProtectedRoute element={<HomePage />} />} />
        <Route path="posts/:postID" element={<ProtectedRoute element={<PostDetailPage />} />} />
        <Route path="user-profile" element={<ProtectedRoute element={<UserProfile />} />} />
        <Route path="user-profile/:authorID" element={<ProtectedRoute element={<UserProfile />} />} />
        <Route path="message" element={<ProtectedRoute element={<MessageCenterPage />} />} />
        <Route path="follows" element={<ProtectedRoute element={<FollowsPage />} />} />
        <Route path="fans" element={<ProtectedRoute element={<FansPage />} />} />
        <Route index element={<Navigate to={!!localStorage.getItem('AccessToken') ? "/home" : "/login"} />} />
      </Route>
    )
  );

  return { router };
};

export default MainRoute;