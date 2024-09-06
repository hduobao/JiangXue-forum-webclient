import React, { useState } from 'react';
import { IconHeart, IconMessageCircle, IconEye, IconSearch } from '@tabler/icons-react';

const Navbar = () => {
  const [activeTab, setActiveTab] = useState('recommend');

  const handleTabClick = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
  };

  return (
    <header className="bg-white text-gray-800 shadow-md py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-gray-900">
          校园论坛
        </div>

        {/* Search Box */}
        <div className="flex flex-1 mx-4 max-w-xl">
          <input
            type="text"
            placeholder="搜索帖子..."
            className="w-full px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none"
          />
          <button
            className="bg-gray-200 px-4 py-2 rounded-r-md text-gray-600 flex items-center"
          >
            <IconSearch />
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav>
          <ul className="flex space-x-4">
            {['recommend', 'follow', 'hot', 'new'].map(tab => (
              <li key={tab}>
                <button
                  onClick={() => handleTabClick(tab)}
                  className={`py-2 px-4 rounded-md ${
                    activeTab === tab
                      ? 'bg-gray-300 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-100'
                  } flex items-center space-x-2`}
                >
                  {tab === 'recommend' && (
                    <>
                      <span>推荐</span>
                    </>
                  )}
                  {tab === 'follow' && (
                    <>
                      <span>关注</span>
                    </>
                  )}
                  {tab === 'hot' && (
                    <>
                      <span>热门</span>
                    </>
                  )}
                  {tab === 'new' && '最新'}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
