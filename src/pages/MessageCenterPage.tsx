import React, { useState, useEffect } from 'react';
import { IconRepeat, IconAt, IconMail, IconBell } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { getUserId } from '../storage/storage';
import TopBar from '../component/bar/TopBar';
import Loader from "../component/common/Loader";
import Instance from '../interceptors/auth_interceptor';

type MessageType = 'reply' | 'mention' | 'notification' | 'message';

interface Conversation {
  id: string;
  sender_id: string; 
  type: MessageType;
  participant: string;
  avatar: string;
  last_message: string;
  timestamp: number;
  unread: number;
}

interface MessageBubble {
  message_id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar: string;
  receiver_id: string;
  content: string;
  type: string;
  timestamp: string;
  status: string;
}

const MessageCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<MessageType>('reply');
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const user_id = getUserId();
  const instance = Instance();

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await instance.get('/api/msg/history', {
          params: { type: activeTab }
        });
        const message_bubbles: MessageBubble[] = response.data.data;
        
        const convertedConversations = message_bubbles.map(msg => {
          const is_system = msg.type === 'notification';
          return {
            id: msg.message_id,
            sender_id: msg.sender_id,
            type: msg.type as MessageType,
            participant: is_system ? '系统通知' : msg.sender_name,
            avatar: is_system 
              ? 'https://example.com/system-icon.jpg' 
              : msg.sender_avatar || 'https://via.placeholder.com/48',
            last_message: msg.content,
            timestamp: new Date(msg.timestamp).getTime(),
            unread: msg.status === 'read' ? 0 : 1,
          };
        });

        setConversations(convertedConversations);
      } catch (error) {
        console.error('获取消息列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [activeTab]);

  const handleConversationClick = (conversation: Conversation) => {
    console.log("sender_id", conversation.sender_id);
    navigate(`/message/${activeTab}/${conversation.sender_id}`);
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <TopBar page="消息中心" />
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto bg-white">
          <div className="flex sticky top-0 z-10 bg-white border-b">
            {[
              { id: 'reply', icon: IconRepeat, label: '回复' },
              { id: 'mention', icon: IconAt, label: '提到' },
              { id: 'message', icon: IconMail, label: '私信' },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as MessageType)}
                className={`flex-1 p-4 flex flex-col items-center gap-1 ${
                  activeTab === id 
                    ? 'text-blue-500 border-b-2 border-blue-500' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                <span className="text-xs sm:text-sm">{label}</span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader />
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-100">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => handleConversationClick(conversation)}
                    className="flex items-center p-4 hover:bg-gray-50 cursor-pointer active:bg-gray-100"
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={conversation.avatar}
                        alt="avatar"
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48';
                        }}
                      />
                      {conversation.unread > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                          {conversation.unread}
                        </div>
                      )}
                    </div>

                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {conversation.participant}
                        </h3>
                        <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                          {formatTime(conversation.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {conversation.last_message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {conversations.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  {`暂无${getTabLabel(activeTab)}`}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

function getTabLabel(type: MessageType): string {
  switch (type) {
    case 'reply': return '回复消息';
    case 'mention': return '提到消息';
    case 'message': return '私信消息';
    default: return '消息';
  }
}

export default MessageCenterPage;