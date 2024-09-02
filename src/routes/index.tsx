import { Route, createBrowserRouter, createRoutesFromElements, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import PostDetailPage from '../pages/PostDetailPage';
import App from '../App';
import HomePage from '../pages/HomePage';
import ProtectedRoute from './ProtectedRoute'; // Import the ProtectedRoute component
import UserProfile from '../pages/UserSpacePage';

const MainRoute = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<App />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="home" element={<ProtectedRoute element={<HomePage />} />} />
        <Route path="posts/:postId" element={<ProtectedRoute element={<PostDetailPage />} />} />
        <Route index element={<Navigate to={!!localStorage.getItem('AccessToken') ? "/home" : "/login"} />} />
        <Route path='user-profile' element={<UserProfile />} />
      </Route>
    )
  );

  return { router };
};

export default MainRoute;
