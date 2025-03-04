import React, { useState } from "react";
import { X } from "lucide-react";
import { Toast } from 'antd-mobile';
import Instance from "../../interceptors/auth_interceptor";

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  tweetId?: number;
  replyingTo?: string;
  authorAvatar?: string;
  authorName?: string;
  tweetTextContent?: string;
}

export function CommentModal({
  isOpen,
  onClose,
  tweetId,
  replyingTo,
  authorAvatar,
  authorName,
  tweetTextContent,
}: CommentModalProps) {
  const [comment, setComment] = useState("");
  const instance = Instance();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Comment submitted:", comment);
    try {
      await instance.post("/api/comment", {
        content: comment,
        type: "text",
        tweet_id: tweetId,
        parent_id: null,
      });
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
    Toast.show("评论成功")
    setComment("");
    onClose();
  };

  // 添加 stopPropagation 阻止冒泡
  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止事件冒泡
    onClose(); // 关闭弹窗
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
            className="w-12 h-12 rounded-full mr-3"
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

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2 text-blue-500">
                {/* Icons for media upload, emoji, etc */}
                <button
                  type="button"
                  className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-full"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.75 2H4.25C3.01 2 2 3.01 2 4.25v15.5C2 20.99 3.01 22 4.25 22h15.5c1.24 0 2.25-1.01 2.25-2.25V4.25C22 3.01 20.99 2 19.75 2zM4.25 3.5h15.5c.413 0 .75.337.75.75v9.676l-3.858-3.858c-.14-.14-.33-.22-.53-.22h-.003c-.2 0-.393.08-.532.224l-4.317 4.384-1.813-1.806c-.14-.14-.33-.22-.53-.22-.193-.03-.395.08-.535.227L3.5 17.642V4.25c0-.413.337-.75.75-.75zm-.744 16.28l5.418-5.534 6.282 6.254H4.25c-.402 0-.727-.322-.744-.72zm16.244.72h-2.42l-5.007-4.987 3.792-3.85 4.385 4.384v3.703c0 .413-.337.75-.75.75z" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-full"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 22.75C6.072 22.75 1.25 17.928 1.25 12S6.072 1.25 12 1.25 22.75 6.072 22.75 12 17.928 22.75 12 22.75zm0-20C6.9 2.75 2.75 6.9 2.75 12S6.9 21.25 12 21.25s9.25-4.15 9.25-9.25S17.1 2.75 12 2.75z" />
                    <path d="M12 17.115c-1.892 0-3.633-.95-4.656-2.544-.224-.348-.123-.81.226-1.035.348-.226.812-.124 1.036.226.747 1.162 2.016 1.855 3.395 1.855s2.648-.693 3.396-1.854c.224-.35.688-.45 1.036-.225.35.224.45.688.226 1.036-1.025 1.594-2.766 2.545-4.658 2.545z" />
                    <circle cx="14.738" cy="9.458" r="1.478" />
                    <circle cx="9.262" cy="9.458" r="1.478" />
                  </svg>
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
