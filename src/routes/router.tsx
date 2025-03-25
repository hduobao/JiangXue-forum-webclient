import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import App from '../App';
import HomePage from '../pages/HomePage';
import ProtectedRoute from './ProtectedRoute';
import UserSpacePage from '../pages/UserSpacePage';
import MessageCenterPage from '../pages/MessageCenterPage';
import FollowsPage from '../pages/FollowsPage';
import FansPage from '../pages/FansPage';
import FavoritesPage from '../pages/FavoritesPage';
import BrowsingHistoryPage from '../pages/BrowsingHistoryPage';
import TweetDetailPage from '../pages/TweetDetailPage';
import CommunityPage from '../pages/CommunityPage';
import NotificationPage from '../pages/NotificationPage';
import ExplorePage from '../pages/ExplorePage';
import MessageDetailPanel from '../component/panels/MessageDetailPanel';

const MainRoute = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="login" element={<LoginPage />} />
        <Route path="/" element={<App />}>
          <Route path="home" element={<ProtectedRoute element={<HomePage />} />} />
          <Route path="tweet/:tweetID" element={<ProtectedRoute element={<TweetDetailPage />} />} />
          <Route path="user-profile" element={<ProtectedRoute element={<UserSpacePage />} />} />
          <Route path="user-profile/:authorID" element={<ProtectedRoute element={<UserSpacePage />} />} />
          <Route path="notifications" element={<ProtectedRoute element={<NotificationPage />} />} />
          <Route path="explore" element={<ProtectedRoute element={<ExplorePage />} />} />
          <Route path="messages" element={<ProtectedRoute element={<MessageCenterPage />} />} />
          <Route path='message/:type/:userID' element={<ProtectedRoute element={<MessageDetailPanel />} />} />
          <Route path="follows" element={<ProtectedRoute element={<FollowsPage />} />} />
          <Route path="fans" element={<ProtectedRoute element={<FansPage />} />} />
          <Route path="favorites" element={<ProtectedRoute element={<FavoritesPage />} />} />
          <Route path="history" element={<ProtectedRoute element={<BrowsingHistoryPage />} />} />
          <Route path="communities" element={<ProtectedRoute element={<CommunityPage />} />} />
        </Route>
      </>
    )
  );

  return { router };
};

export default MainRoute; // 确保这里只有一个默认导出
