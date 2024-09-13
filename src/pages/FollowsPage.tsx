import React, { useEffect, useState } from 'react';
import Instance from '../interceptors/auth_interceptor';
import { useNavigate } from 'react-router-dom';
import { UserFollows } from '../types/UserModel';

const FollowsPage: React.FC = () => {
    const instance = Instance();
    const [followers, setFollowers] = useState<UserFollows[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFollowList = async () => {
            try {
                const response = await instance.get('/api/me/follows');
                setFollowers(response.data.data); // 假设返回的数据在 response.data.data
            } catch (error) {
                console.error('Failed to fetch follow list:', error);
                setError('Failed to load follow list');
            } finally {
                setLoading(false);
            }
        };

        fetchFollowList();
    }, []);

    const handleUserClick = (userId: string) => {
        navigate(`/user-profile/${userId}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" />
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center mt-10">{error}</div>;
    }

    if (!followers || followers.length === 0) {
        return <div className="text-center mt-10">You are not following anyone yet.</div>;
    }

    return (
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Following</h1>
          <ul className="space-y-4">
            {followers.map((user) => (
              <li key={user.id} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md">
                {/* 头像 */}
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {/* 用户信息 */}
                <div>
                  <p className="font-semibold">{user.username}</p>
                  {/* 展示用户 bio */}
                  <p className="text-gray-500 text-sm">{user.bio}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      );
};

export default FollowsPage;
