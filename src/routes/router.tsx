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
import FavoritesPage from '../pages/FavoritesPage';
import BrowsingHistoryPage from '../pages/BrowsingHistoryPage';
import TestPage from '../pages/TestPage';

const MainRoute = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<App />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="home" element={<ProtectedRoute element={<HomePage />} />} />
        <Route path="tweet/:postID" element={<ProtectedRoute element={<PostDetailPage />} />} />
        <Route path="user-profile" element={<ProtectedRoute element={<UserProfile />} />} />
        <Route path="user-profile/:authorID" element={<ProtectedRoute element={<UserProfile />} />} />
        <Route path="message" element={<ProtectedRoute element={<MessageCenterPage />} />} />
        <Route path="follows" element={<ProtectedRoute element={<FollowsPage />} />} />
        <Route path="fans" element={<ProtectedRoute element={<FansPage />} />} />
        <Route path="favorites" element={<ProtectedRoute element={<FavoritesPage />} />} />
        <Route path="history" element={<ProtectedRoute element={<BrowsingHistoryPage />} />} />
        <Route index element={<Navigate to={!!localStorage.getItem('AccessToken') ? "/home" : "/login"} />} />
        <Route path="test" element={<TestPage/>} />
      </Route>
    )
  );

  return { router };
};

export default MainRoute;