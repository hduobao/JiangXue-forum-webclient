import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../component/bar/TopBar";
import Loader from "../component/common/Loader";
import Instance from "../interceptors/auth_interceptor";
import { getAccessToken, getUserId } from "../storage/storage";

interface MessageBubble {
  message_id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar: string;
  receiver_id: string;
  content: string;
  timestamp: string;
  status: string;
  is_own: boolean;
  unread_count: number;
}

const MessageCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<MessageBubble[]>([]);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const instance = Instance();

  // 修改processNewMessage方法
  const processNewMessage = (newMsg: any) => {
    setMessages((prev) => {
      const currentUserID = getUserId(); // 获取当前用户ID

      // 判断消息方向
      const isOwnMessage = newMsg.sender_id === currentUserID;
      const otherUserID = isOwnMessage ? newMsg.receiver_id : newMsg.sender_id;

      // 查找已有会话
      const existingIndex = prev.findIndex(
        (m) => m.sender_id === otherUserID || m.receiver_id === otherUserID
      );

      // 新会话处理
      if (existingIndex === -1) {
        return [
          {
            message_id: newMsg.message_id,
            sender_id: newMsg.sender_id,
            sender_name: newMsg.sender_name,
            sender_avatar: newMsg.sender_avatar, // 使用消息中的头像
            receiver_id: newMsg.receiver_id,
            content: newMsg.content,
            timestamp: newMsg.timestamp,
            status: "unread",
            is_own: isOwnMessage,
            unread_count: isOwnMessage ? 0 : 1, // 自己发的消息未读为0
          },
          ...prev,
        ];
      }

      // 更新已有会话
      const updatedMessages = [...prev];
      const existing = updatedMessages[existingIndex];

      updatedMessages[existingIndex] = {
        ...existing,
        content: newMsg.content,
        timestamp: newMsg.timestamp,
        unread_count: existing.unread_count + (isOwnMessage ? 0 : 1),
        sender_avatar: isOwnMessage
          ? existing.sender_avatar
          : newMsg.sender_avatar, // 保持原有头像
      };

      // 置顶会话
      const [latest] = updatedMessages.splice(existingIndex, 1);
      return [latest, ...updatedMessages];
    });
  };

  // 修改获取消息列表的方法
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await instance.get("/api/msg/history", {
        params: { type: "private" },
      });

      // 处理未读数逻辑
      const processedData = response.data.data.map((msg: MessageBubble) => ({
        ...msg,
        // 确保自己发的消息未读数为0
        unread_count: msg.is_own ? 0 : msg.unread_count,
      }));

      setMessages(processedData);
    } catch (error) {
      console.error("获取消息列表失败:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };
  // 初始化WebSocket
  useEffect(() => {
    const token = getAccessToken();
    const userID = getUserId();
    if (!token) return;

    const socket = new WebSocket(
      `ws://127.0.0.1:8888/ws/conn?userID=${userID}`,
      [token]
    );

    socket.onopen = () => {
      console.log("Conversation WS connected");
      setWs(socket);
    };

    // 修改WebSocket消息处理
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // 确保消息结构包含正确的未读数
      if (data.type === "private") {
        processNewMessage({
          ...data,
          unread_count: data.unread_count, // 使用服务端计算的未读数
        });
      }
    };

    socket.onclose = () => console.log("Conversation WS closed");

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleConversationClick = (msg: MessageBubble) => {
    const targetUserID = msg.is_own ? msg.receiver_id : msg.sender_id;
    navigate(`/message/private/${targetUserID}`);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return date.toLocaleDateString("zh-CN", {
      month: "numeric",
      day: "numeric",
    });
  };

  // 判断是否显示未读标记
  const shouldShowUnreadBadge = (msg: MessageBubble) => {
    // 最后一条消息不是自己发的 且 有未读消息
    return !msg.is_own && msg.unread_count > 0;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <TopBar page="消息" />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto bg-white">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader />
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-100">
                {messages.map((msg) => (
                  <div
                    key={msg.message_id}
                    onClick={() => handleConversationClick(msg)}
                    className="flex items-center p-4 hover:bg-gray-50 cursor-pointer active:bg-gray-100"
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={
                          msg.sender_avatar || "https://via.placeholder.com/48"
                        }
                        alt="avatar"
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/48";
                        }}
                      />
                      {/* 修改未读标记显示逻辑 */}
                      {shouldShowUnreadBadge(msg) && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                          {msg.unread_count > 9 ? "9+" : msg.unread_count}
                        </div>
                      )}
                    </div>

                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {msg.sender_name}
                          {/* 在名称后添加未读标记（可选） */}
                          {shouldShowUnreadBadge(msg) && (
                            <span className="ml-2 inline-block bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                              {msg.unread_count > 9 ? "9+" : msg.unread_count}
                            </span>
                          )}
                        </h3>
                        <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {messages.length === 0 && (
                <div className="p-8 text-center text-gray-500">暂无私信</div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default MessageCenterPage;
