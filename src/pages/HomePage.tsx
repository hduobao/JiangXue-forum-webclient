// HomePage.js
import React, { useState } from 'react';

import TweetFeed from '../component/tweet/TweetFeed';
import TopBar from '../component/bar/TopBar';

const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("recommendations"); // 初始化标签状态

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="sticky top-0 z-10 bg-white shadow-md">
        <TopBar page='' activeTab={activeTab} setActiveTab={setActiveTab} /> {/* 传递 activeTab */}
      </div>
      <main className="flex-grow overflow-y-scroll scroll-container">
        <TweetFeed activeTab={activeTab} /> {/* 根据 activeTab 渲染不同内容 */}
      </main>
    </div>
  );
};
export default HomePage;
