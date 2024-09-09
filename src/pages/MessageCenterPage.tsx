import React, { useState } from 'react';
import { IconRepeat, IconAt, IconMail, IconBell } from '@tabler/icons-react';

const MessageCenterPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('replies'); // 设置默认 Tab 为 "回复我的"

  const messages = {
    replies: [
      { id: 1, content: '用户A 回复了你的帖子', time: '5分钟前' },
      { id: 2, content: '用户B 回复了你的评论', time: '10分钟前' },
    ],
    mentions: [
      { id: 1, content: '用户C 在帖子中提到了你', time: '2小时前' },
    ],
    privateMessages: [
      { id: 1, content: '用户D 发送了私信', time: '1天前' },
    ],
    systemNotifications: [
      { id: 1, content: '系统更新了论坛规则', time: '3天前' },
    ],
  };

  const renderMessages = (category: keyof typeof messages) => {
    return (
      <ul>
        {messages[category].length > 0 ? (
          messages[category].map((message) => (
            <li key={message.id} className="p-2 border-b last:border-none">
              <span className="block text-gray-900">{message.content}</span>
              <span className="block text-gray-500 text-sm">{message.time}</span>
            </li>
          ))
        ) : (
          <p className="text-gray-500">暂无消息</p>
        )}
      </ul>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">消息中心</h1>

      {/* Tab Buttons */}
      <div className="flex space-x-4 border-b-2 mb-4">
        <button
          className={`flex items-center pb-2 px-4 text-sm font-medium 
          ${activeTab === 'replies' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
          onClick={() => setActiveTab('replies')}
        >
          <IconRepeat className="mr-2" />
          回复我的
        </button>
        <button
          className={`flex items-center pb-2 px-4 text-sm font-medium 
          ${activeTab === 'mentions' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
          onClick={() => setActiveTab('mentions')}
        >
          <IconAt className="mr-2" />
          @我的
        </button>
        <button
          className={`flex items-center pb-2 px-4 text-sm font-medium 
          ${activeTab === 'privateMessages' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
          onClick={() => setActiveTab('privateMessages')}
        >
          <IconMail className="mr-2" />
          私信
        </button>
        <button
          className={`flex items-center pb-2 px-4 text-sm font-medium 
          ${activeTab === 'systemNotifications' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
          onClick={() => setActiveTab('systemNotifications')}
        >
          <IconBell className="mr-2" />
          系统通知
        </button>
      </div>

      {/* Tab Panels */}
      <div className="bg-white p-3 rounded-lg shadow-md">
        {activeTab === 'replies' && renderMessages('replies')}
        {activeTab === 'mentions' && renderMessages('mentions')}
        {activeTab === 'privateMessages' && renderMessages('privateMessages')}
        {activeTab === 'systemNotifications' && renderMessages('systemNotifications')}
      </div>
    </div>
  );
};

export default MessageCenterPage;
