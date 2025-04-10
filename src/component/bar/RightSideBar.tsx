import React from "react";
import { RightSidebarProps } from "../../types/UserModel";
import SearchForm from "../form/SearchForm";

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

  const isExplorePage = location.pathname.includes("/explore");

  return (
    <div className="h-screen overflow-y-auto scroll-container bg-gray-50 text-gray-800 p-6 relative">
      {isExplorePage ? (
        <></>
      ) : (
        <div className="mb-6">
          <SearchForm />
        </div>
      )}

      {/* 趋势话题 */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-lg font-bold mb-3">热点话题</h2>
        <ul>
          {trendingTopics.map((topic, index) => (
            <li key={index} className="mb-4">
              <div className="flex justify-between">
                <div>
                  <p className="font-medium">{topic.topic}</p>
                  <p className="text-sm text-gray-500">{topic.tweets}</p>
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
        <p>© 2024 SnowFlow, Inc.</p>
      </div>
    </div>
  );
};

export default RightSidebar;
