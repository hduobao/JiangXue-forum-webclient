import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../component/bar/TopBar";
import Loader from "../component/common/Loader";
import Instance from "../interceptors/auth_interceptor";
import { getAccessToken, getUserId } from "../storage/storage";
import MessagePlusButton from "../component/button/MessagePlusButton";

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


  // 处理新消息
  const processNewMessage = (newMsg: any) => {
    setMessages((prev) => {
      const currentUserID = getUserId();
      const isOwnMessage = newMsg.sender_id === currentUserID;
      const otherUserID = isOwnMessage ? newMsg.receiver_id : newMsg.sender_id;

      // 查找已有会话
      const existingIndex = prev.findIndex(
        (m) =>
          (m.sender_id === currentUserID && m.receiver_id === otherUserID) ||
          (m.receiver_id === currentUserID && m.sender_id === otherUserID)
      );

      // 新会话处理
      if (existingIndex === -1) {
        return [
          {
            ...newMsg,
            is_own: isOwnMessage,
            unread_count: isOwnMessage ? 0 : 1, // 新消息前端控制未读数
            sender_name: isOwnMessage ? "我" : newMsg.sender_name,
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
        // 仅在前端增加未读数（如果是对方消息）
        unread_count: isOwnMessage
          ? existing.unread_count
          : existing.unread_count + 1,
        sender_avatar: isOwnMessage
          ? existing.sender_avatar
          : newMsg.sender_avatar,
      };

      // 置顶会话
      const [updated] = updatedMessages.splice(existingIndex, 1);
      return [updated, ...updatedMessages];
    });
  };

  // 获取消息列表
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await instance.get("/api/msg/history", {
        params: { type: "private" },
      });

      const currentUserID = getUserId();

      // 初始未读数使用后端返回的值
      const processedData = response.data.data.map((msg: MessageBubble) => ({
        ...msg,
        is_own: msg.sender_id === currentUserID,
        // 保持后端返回的未读数
        unread_count: msg.unread_count || 0,
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

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "private") {
        processNewMessage(data); // 直接使用原始数据，不覆盖unread_count
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

  const shouldShowUnreadBadge = (msg: MessageBubble) => {
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
        <MessagePlusButton />
      </main>
    </div>
  );
};

export default MessageCenterPage;
