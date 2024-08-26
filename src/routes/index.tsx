import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import PostDetailPage from '../pages/PostDetailPage';
import App from '../App';
import HomePage from '../pages/HomePage';

// const isAuthenticated = !!localStorage.getItem('AccessToken');

// const ProtectedRoute = ({ element }: { element: React.ReactElement }) => {
//   return isAuthenticated ? element : <Navigate to="/login" />;
// };

// const AppRoutes: React.FC = () => (
//   <Routes>
//     <Route path="/login" element={<LoginPage />} />
//     <Route path="/home" element={<ProtectedRoute element={<HomePage />} />} />
//     <Route path="/posts/:postId" element={<ProtectedRoute element={<PostDetailPage />} />} />
//     <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/login"} />} />
//   </Routes>
// );

// export default AppRoutes;

const MainRoute = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route
        path="/"
        element={<App/>}
      >
        <Route path='/home' element={<HomePage/>} />
        <Route index element={<LoginPage/>}/>
        <Route path="/postDetail" element={<PostDetailPage/>}/>
      </Route>
    )
  )

  return {router}
}

export default MainRoute
