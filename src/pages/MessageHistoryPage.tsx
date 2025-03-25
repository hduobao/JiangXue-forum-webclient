import { CheckIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { CheckIcon as CheckSolidIcon, CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale' // 中文 locale，根据需要调整

interface MessageBubble {
  id: string
  senderName: string
  senderAvatar: string
  content: string
  timestamp: Date
  status: 'sent' | 'delivered' | 'read'
}

const MessageHistoryPage = () => {
  // 模拟数据
  const messages: MessageBubble[] = [
    {
      id: '1',
      senderName: '张三',
      senderAvatar: 'https://example.com/avatar1.jpg',
      content: '今晚一起吃饭吗？',
      timestamp: new Date(Date.now() - 3600 * 1000),
      status: 'read'
    },
    {
      id: '2',
      senderName: '李四',
      senderAvatar: 'https://example.com/avatar2.jpg',
      content: '项目文档已经更新了，请查收',
      timestamp: new Date(Date.now() - 1800 * 1000),
      status: 'delivered'
    },
    // 更多消息...
  ]

  const renderStatusIcon = (status: MessageBubble['status']) => {
    const iconClass = 'h-4 w-4'
    switch (status) {
      case 'sent':
        return <CheckIcon className={iconClass} />
      case 'delivered':
        return (
          <div className="flex">
            <CheckIcon className={iconClass} />
            <CheckIcon className={iconClass} style={{ marginLeft: -6 }} />
          </div>
        )
      case 'read':
        return <CheckCircleSolidIcon className={`${iconClass} text-blue-500`} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="max-w-2xl mx-auto px-4 py-6 flex-grow overflow-y-scroll scroll-container">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          {messages.map((message) => (
            <div
              key={message.id}
              className="flex items-center p-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
            >
              {/* 用户头像 */}
              <div className="flex-shrink-0 mr-3">
                <img
                  src={message.senderAvatar}
                  alt={message.senderName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150'
                  }}
                />
              </div>

              {/* 消息内容 */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h2 className="text-base font-semibold text-gray-800 truncate">
                    {message.senderName}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(message.timestamp, {
                        addSuffix: true,
                        locale: zhCN // 根据需求调整语言
                      })}
                    </span>
                    {renderStatusIcon(message.status)}
                  </div>
                </div>
                <p className="text-sm text-gray-600 truncate-2-lines leading-tight">
                  {message.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default MessageHistoryPage