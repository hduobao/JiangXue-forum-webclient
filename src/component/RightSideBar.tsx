import React from 'react';

const RightSidebar: React.FC = () => {
  return (
    <aside className="w-60 bg-white shadow-lg p-6 h-screen overflow-y-auto"> {/* 调整了宽度 */}
      <h2 className="text-lg font-bold mb-4">推荐用户</h2>
      <ul>
        <li className="flex items-center mb-4">
          <img src="/static/images/avatar/2.jpg" alt="User" className="w-10 h-10 rounded-full mr-3" />
          <div>
            <p className="font-semibold">用户A</p>
            <button className="text-sm text-blue-500 hover:underline">关注</button>
          </div>
        </li>
        <li className="flex items-center mb-4">
          <img src="/static/images/avatar/3.jpg" alt="User" className="w-10 h-10 rounded-full mr-3" />
          <div>
            <p className="font-semibold">用户B</p>
            <button className="text-sm text-blue-500 hover:underline">关注</button>
          </div>
        </li>
      </ul>

      <h2 className="text-lg font-bold mt-6 mb-4">热门话题</h2>
      <ul>
        <li className="mb-3">
          <p className="text-gray-800">#话题1</p>
          <p className="text-sm text-gray-500">12K讨论</p>
        </li>
        <li className="mb-3">
          <p className="text-gray-800">#话题2</p>
          <p className="text-sm text-gray-500">8K讨论</p>
        </li>
      </ul>
    </aside>
  );
};

export default RightSidebar;
