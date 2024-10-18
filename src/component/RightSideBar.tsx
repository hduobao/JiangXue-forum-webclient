import React from 'react';
import { IconSearch } from '@tabler/icons-react'; // 引入 Tabler 的搜索图标
import { RightSidebarProps } from '../types/UserModel';

const RightSidebar: React.FC<RightSidebarProps> = () => {
  const trendingTopics = [
    { topic: "#ReactJS", tweets: "23.5K" },
    { topic: "#TypeScript", tweets: "12.1K" },
    { topic: "#JavaScript", tweets: "45.8K" },
    { topic: "#CSS", tweets: "18.3K" },
  ];

  const recommendedUsers = [
    { username: "FrontendDev", handle: "@frontenddev" },
    { username: "JS Guru", handle: "@jsguru" },
    { username: "React Master", handle: "@reactmaster" },
  ];

  return (
    <div className="w-[15vw] h-screen bg-gray-50 text-gray-800 p-6 relative">
      {/* 搜索框 */}
      <div className="mb-6">
        <div className="relative text-gray-600">
          <input
            type="search"
            name="search"
            placeholder="搜索 Twitter"
            className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none w-full shadow-sm"
          />
          <button type="submit" className="absolute right-0 top-0 mt-3 mr-4">
            <IconSearch />
          </button>
        </div>
      </div>

      {/* 趋势话题 */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-bold mb-3">趋势话题</h2>
        <ul>
          {trendingTopics.map((topic, index) => (
            <li key={index} className="mb-4">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{topic.topic}</p>
                  <p className="text-sm text-gray-500">{topic.tweets} Tweets</p>
                </div>
                <button className="text-blue-500 text-sm">关注</button>
              </div>
            </li>
          ))}
        </ul>
        <button className="text-blue-500 text-sm">查看更多</button>
      </div>

      {/* 你可能感兴趣的人 */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-bold mb-3">你可能感兴趣的人</h2>
        <ul>
          {recommendedUsers.map((user, index) => (
            <li key={index} className="flex items-center justify-between mb-4">
              <div>
                <p className="font-medium">{user.username}</p>
                <p className="text-sm text-gray-500">{user.handle}</p>
              </div>
              <button className="bg-blue-500 text-white text-sm py-1 px-4 rounded-full">
                关注
              </button>
            </li>
          ))}
        </ul>
        <button className="text-blue-500 text-sm">查看更多</button>
      </div>

      {/* 版权信息 */}
      <div className="text-gray-400 text-xs">
        <p>© 2024 Twitter, Inc.</p>
      </div>
    </div>
  );
};

export default RightSidebar;