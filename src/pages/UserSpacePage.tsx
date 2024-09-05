import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import instance from '../interceptors/auth_interceptor';
import { UserBaseInfo } from '../types/UserModel';

const UserProfile: React.FC = () => {
  const { authorId } = useParams<{ authorId?: string }>();
  console.log('Author ID:', authorId); // Add this line
  const [userInfo, setUserInfo] = useState<UserBaseInfo | null>(null);

  useEffect(() => {
    console.log('Author ID has changed:', authorId);
    const fetchUserInfo = async () => {
      try {
        const endpoint = authorId ? `/api/user/userInfo/${authorId}` : '/api/user/userInfo';
        const response = await instance.get(endpoint);
        setUserInfo(response.data.data);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };
  
    fetchUserInfo();
  }, [authorId]);
  

  if (!userInfo) {
    return <div className="text-lg font-semibold">加载中...</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex mb-6">
          {/* Left side: Avatar and Username */}
          <div className="flex-none w-48">
            <img
              alt="User Avatar"
              src={userInfo.avatar || '/static/images/avatar/1.jpg'}
              className="w-24 h-24 rounded-full mb-4"
            />
            <div>
              <h1 className="text-2xl font-semibold">{userInfo.username}</h1>
              <p className="text-gray-500">{userInfo.location || '未设置位置'}</p>
            </div>
          </div>
          
          {/* Right side: User Information */}
          <div className="flex-grow ml-6">
            <h2 className="text-lg font-semibold mb-4">个人信息</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-gray-500">账户</p>
                <p>{userInfo.account}</p>
              </div>
              <div>
                <p className="text-gray-500">邮箱</p>
                <p>{userInfo.email || '未设置邮箱'}</p>
              </div>
              <div>
                <p className="text-gray-500">手机号</p>
                <p>{userInfo.phone_number || '未设置手机号'}</p>
              </div>
              <div>
                <p className="text-gray-500">生日</p>
                <p>{userInfo.birthday ? new Date(userInfo.birthday).toLocaleDateString() : '未设置生日'}</p>
              </div>
              <div>
                <p className="text-gray-500">性别</p>
                <p>{userInfo.gender === 1 ? '男' : userInfo.gender === 2 ? '女' : '未设置性别'}</p>
              </div>
              <div>
                <p className="text-gray-500">声望</p>
                <p>{userInfo.reputation}</p>
              </div>
              <div>
                <p className="text-gray-500">最近登录时间</p>
                <p>{new Date(userInfo.last_login).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-500">注册时间</p>
                <p>{new Date(userInfo.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
