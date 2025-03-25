import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IconSend, IconArrowLeft } from "@tabler/icons-react";
import Instance from "../../interceptors/auth_interceptor";
import { getAccessToken } from "../../storage/storage";
import { nanoid } from "nanoid";
import TopBar from "../bar/TopBar";

interface Message {
  id?: number;
  message_id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar: string;
  receiver_id: string;
  content: string;
  type: string;
  timestamp: string;
  status: string;
  is_own: boolean;
}

const MessageDetailPanel: React.FC = () => {
  const { userID } = useParams<{ userID: string }>();
  const navigate = useNavigate();
  const instance = Instance();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    avatar: string;
  } | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 加载聊天记录和WebSocket连接
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      console.error("No authorization token found");
      return;
    }

    const loadChatHistory = async () => {
      try {
        const response = await instance.get(`/api/msg/chat`, {
          params: { targetUserID: userID },
        });

        setMessages(response.data.data);

        if (response.data.data.length > 0) {
          const firstMessage = response.data.data[0];
          const currentUserId = firstMessage.is_own
            ? firstMessage.sender_id
            : firstMessage.receiver_id;
          const currentUserName = firstMessage.is_own
            ? firstMessage.sender_name
            : "";
          const currentUserAvatar = firstMessage.is_own
            ? firstMessage.sender_avatar
            : "";

          setCurrentUser({
            id: currentUserId,
            name: currentUserName,
            avatar: currentUserAvatar,
          });
        }
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        setLoading(false);
      }
    };

    loadChatHistory();

    // 建立WebSocket连接
    const socket = new WebSocket(
      `ws://127.0.0.1:8888/ws/conn?userID=${userID}`,
      [token]
    );

    socket.onopen = () => {
      console.log("WebSocket connected");
      setWs(socket);
    };

    socket.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);
      const newMessage: Message = {
        ...receivedMessage,
        is_own: receivedMessage.sender_id === currentUser?.id,
      };
      setMessages((prev) => [...prev, newMessage]);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socket.close();
    };
  }, [userID]);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 发送消息
  const sendMessage = async () => {
    if (!newMessage.trim() || !ws || !currentUser) return;

    try {
      const tempMessage: Message = {
        message_id: nanoid(),
        sender_id: currentUser.id,
        sender_name: currentUser.name,
        sender_avatar: currentUser.avatar, // 使用当前用户头像
        receiver_id: userID || "",
        content: newMessage,
        type: "message",
        timestamp: new Date().toISOString(),
        status: "delivered",
        is_own: true,
      };
      console.log("message:", tempMessage);

      // 通过WebSocket发送消息
      ws.send(JSON.stringify(tempMessage));

      setMessages((prev) => [...prev, tempMessage]);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // 格式化时间显示
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // 检查是否应该显示时间分隔线
  const shouldShowDateSeparator = (index: number) => {
    if (index === 0) return true;

    const currentDate = new Date(messages[index].timestamp).toDateString();
    const prevDate = new Date(messages[index - 1].timestamp).toDateString();

    return currentDate !== prevDate;
  };

  // 格式化日期显示
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "今天";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "昨天";
    } else {
      return date.toLocaleDateString([], { month: "numeric", day: "numeric" });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* 顶部导航栏 */}
      <TopBar page="私信对话" />

      {/* 消息内容区域 */}
      <main className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                暂无消息记录
              </div>
            ) : (
              messages.map((message, index) => (
                <React.Fragment key={message.id || message.message_id}>
                  {/* 日期分隔线 */}
                  {shouldShowDateSeparator(index) && (
                    <div className="flex justify-center my-4">
                      <div className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
                        {formatDate(message.timestamp)}
                      </div>
                    </div>
                  )}

                  {/* 消息气泡 */}
                  <div
                    className={`flex ${
                      message.is_own ? "justify-end" : "justify-start"
                    } gap-2`}
                  >
                    {/* 对方头像 */}
                    {!message.is_own && (
                      <img
                        src={message.sender_avatar}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/40";
                        }}
                      />
                    )}

                    {/* 消息内容 */}
                    <div
                      className={`max-w-[70%] flex flex-col ${
                        message.is_own ? "items-end" : "items-start"
                      }`}
                    >
                      {!message.is_own && (
                        <div className="text-xs text-gray-500 mb-1">
                          {message.sender_name}
                        </div>
                      )}
                      <div
                        className={`p-3 rounded-lg ${
                          message.is_own
                            ? "bg-blue-500 text-white rounded-tr-none"
                            : "bg-white border border-gray-200 rounded-tl-none"
                        }`}
                      >
                        <p>{message.content}</p>
                      </div>
                      <div
                        className={`text-xs mt-1 ${
                          message.is_own ? "text-gray-500" : "text-gray-400"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </div>
                    </div>

                    {/* 自己头像 */}
                    {message.is_own && (
                      <img
                        src={message.sender_avatar}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/40";
                        }}
                      />
                    )}
                  </div>
                </React.Fragment>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* 输入框区域 */}
      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="输入消息..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            <IconSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageDetailPanel;
