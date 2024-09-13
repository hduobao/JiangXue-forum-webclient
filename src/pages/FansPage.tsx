import React, { useEffect, useState } from 'react';
import Instance from '../interceptors/auth_interceptor';
import { UserFans } from '../types/UserModel';
import { IconUsers, IconHeart } from '@tabler/icons-react';

const FansPage: React.FC = () => {
    const instance = Instance();
    const [fans, setFans] = useState<UserFans[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFans = async () => {
            try {
                const response = await instance.get('/api/me/fans');
                setFans(response.data.data);
            } catch (error) {
                console.error('Failed to fetch fans:', error);
                setError('Failed to load fans');
            } finally {
                setLoading(false);
            }
        };

        fetchFans();
    }, []);

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

    // 检查 fans 是否为空或 null
    if (!fans || fans.length === 0) {
        return <p className="text-center text-gray-500">No fans yet. Start interacting with users!</p>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Your Fans</h1>
            {fans.length === 0 ? (
                <p className="text-center text-gray-500">No fans yet. Start interacting with users!</p>
            ) : (
                <div className="grid gap-6">
                    {fans.map((fan) => (
                        <div key={fan.id} className="flex items-center bg-white p-4 rounded-lg shadow-md">
                            {/* 用户头像 */}
                            <img
                                src={fan.avatar}
                                alt={fan.username}
                                className="w-16 h-16 rounded-full object-cover mr-4"
                            />
                            {/* 用户信息 */}
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    {/* 用户名 */}
                                    <h2 className="text-xl font-semibold">{fan.username}</h2>
                                    {/* 互动数 */}
                                    <div className="flex items-center text-sm text-gray-600">
                                        <IconHeart size={16} className="text-red-500 mr-1" />
                                        {fan.interaction_count}
                                    </div>
                                </div>
                                {/* 用户简介 */}
                                <p className="text-gray-500">{fan.bio}</p>
                            </div>
                            {/* 互相关注状态 */}
                            {fan.mutual_follow && (
                                <div className="text-green-500 font-bold ml-4">
                                    <IconUsers size={20} className="inline-block mr-1" />
                                    Mutual Follow
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FansPage;
