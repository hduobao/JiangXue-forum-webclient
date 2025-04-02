import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { Toast } from "antd-mobile";
import Instance from "../../interceptors/auth_interceptor";
import { useFileUploader } from "../form/FIleUploader";
import { IconPhoto, IconMoodSmile } from "@tabler/icons-react"; // 引入所需的图标
import { UploadZone } from "../form/UploadZone";
import { getAccessToken, getUserId } from "../../storage/storage";
import { nanoid } from "nanoid";

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommentSuccess?: () => void; 
  tweetId?: number;
  replyingTo?: string;
  authorID?: number;
  authorAvatar?: string;
  authorName?: string;
  tweetTextContent?: string;
}

export function CommentModal({
  isOpen,
  onClose,
  onCommentSuccess,
  tweetId,
  replyingTo,
  authorID,
  authorAvatar,
  authorName,
  tweetTextContent,
}: CommentModalProps) {
  const [comment, setComment] = useState("");
  const instance = Instance();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [ws, setWs] = useState<WebSocket | null>(null); // WebSocket状态

  useEffect(() => {
    // 获取当前用户信息（根据你的认证系统实现）
    const token = getAccessToken() || "";
    // 建立WebSocket连接
    const socket = new WebSocket(
      `ws://127.0.0.1:8888/ws/conn?userID=${authorID}`,
      [token]
    );

    setWs(socket);

    return () => socket.close();
  }, []);

  // 使用上传组件逻辑
  const { uploadTasks, handleFileChange, removeUploadTask } = useFileUploader({
    folder: "comment",
    maxFiles: 4,
    allowedTypes: ["image/*", "video/*"],
    getUploadToken: async ({ md5, fileName, fileType, folder }) => {
      const response = await instance.get("/api/file/token", {
        params: { md5, fileName, fileType, folder },
      });
      return response.data.data;
    },
  });

  if (!isOpen) return null;

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleRemoveFile = (id: string) => {
    removeUploadTask(id);
  };

  const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      handleFileChange(files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const fileKeys = uploadTasks
        .filter((task) => task.status === "success")
        .map((task) => task.key) as string[];
      const response = await instance.post("/api/comment", {
        content: comment,
        type: "text",
        tweet_id: tweetId,
        parent_id: null,
        file_keys: fileKeys,
      });
      if (ws && response.status === 200 && authorID) {
        const currentUserId = getUserId();
        if (authorID.toString() != currentUserId) {
          const notification = {
            message_id: nanoid(),
            type: "reply",
            sender_id: currentUserId,
            receiver_id: authorID.toString(),
            content: `评论了你的贴子：${comment}`,
            content_type : "text",
            tweet_id: tweetId,
            timestamp: new Date().toISOString(),
          };
          ws.send(JSON.stringify(notification));
        }
        if (onCommentSuccess) {
          onCommentSuccess();
        }
      }
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
    Toast.show("评论成功");
    setComment("");
    onClose();
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-[600px] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Display author info */}
        <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <img
            src={authorAvatar}
            alt={authorName}
            className="w-12 h-12 rounded-full mr-3 object-cover"
          />
          <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {authorName}
          </span>
        </div>
        <p className="mt-2 text-gray-700 tracking-widest line-clamp-10 px-4">
          {tweetTextContent}
        </p>

        <div className="p-4">
          {replyingTo && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              回复 <span className="text-blue-500">@{replyingTo}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Post your reply"
              className="w-full min-h-[150px] bg-transparent border-none outline-none resize-none text-lg"
              autoFocus
            />
            <div className="mb-4">
              <UploadZone
                tasks={uploadTasks}
                onFileChange={handleFileChange}
                onRemove={handleRemoveFile}
                maxFiles={4}
              />
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={onFileInputChange}
              accept="image/*,video/*"
              multiple
            />
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2 text-blue-500">
                <button
                  type="button"
                  onClick={handleFileSelect}
                  className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-full"
                >
                  <IconPhoto className="w-6 h-6" />
                </button>

                <button
                  type="button"
                  className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-full"
                >
                  <IconMoodSmile className="w-6 h-6" />
                </button>
              </div>

              <button
                type="submit"
                disabled={!comment.trim()}
                className={`px-4 py-2 rounded-full font-semibold ${
                  comment.trim()
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-blue-300 text-white cursor-not-allowed"
                }`}
              >
                Reply
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CommentModal;
