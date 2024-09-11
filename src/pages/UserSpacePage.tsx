import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Instance from '../interceptors/auth_interceptor';
import { UserBaseInfo } from '../types/UserModel';

const UserProfile: React.FC = () => {
  const instance = Instance();
  const { authorID } = useParams<{ authorID?: string }>();
  const [userInfo, setUserInfo] = useState<UserBaseInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const endpoint = authorID ? `/api/user/userInfo/${authorID}` : '/api/user/userInfo';
        const response = await instance.get(endpoint);
        setUserInfo(response.data.data);
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };

    fetchUserInfo();
  }, [authorID]);

  if (!userInfo) {
    return <div className="text-lg font-semibold">加载中...</div>;
  }

  const handleAvatarClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto mt-8">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex mb-6">
          {/* Left side: Avatar and Username */}
          <div className="flex-none w-48">
            <img
              alt="User Avatar"
              src={userInfo.avatar || '/static/images/avatar/1.jpg'}
              className="w-24 h-24 rounded-full mb-4 object-cover cursor-pointer"
              onClick={handleAvatarClick}
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

        {/* Bio Section */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">个人简介</h2>
          <p className="text-gray-600">{userInfo.bio || '该用户没有填写个人简介'}</p>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50" onClick={handleCloseModal}></div>
          <div className="bg-white p-4 rounded-lg shadow-lg z-10 max-w-screen-sm max-h-screen overflow-auto">
            <img
              alt="Enlarged Avatar"
              src={userInfo.avatar || '/static/images/avatar/1.jpg'}
              className="w-auto h-auto max-w-full max-h-screen object-contain"
            />
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
              onClick={handleCloseModal}
            >
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
