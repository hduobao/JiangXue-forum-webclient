import { useEffect, useState } from "react";
import { parseISO, formatDistanceToNow } from "date-fns";
import { CommentVO } from "../../types/CommentModel";
import Instance from "../../interceptors/auth_interceptor";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";

interface CommentListProps {
  tweetId: number;
}

const CommentFeed = ({ tweetId }: CommentListProps) => {
  const [comments, setComments] = useState<CommentVO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedComments, setExpandedComments] = useState<Set<number>>(new Set());
  const instance = Instance();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await instance.get(`/api/comment?tweetID=${tweetId}`);
        const data = response.data.data || [];
        setComments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load comments");
      } finally {
        setLoading(false);
      }
    };

    if (tweetId) fetchComments();
  }, [tweetId]);
  
  const toggleCommentExpand = (commentId: number) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      newSet.has(commentId) ? newSet.delete(commentId) : newSet.add(commentId);
      return newSet;
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4 my-5">
      {/* 加载状态 */}
      {loading && (
        <div className="space-y-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 错误状态 */}
      {error && (
        <div className="p-4 bg-red-50 rounded-xl border border-red-200 flex items-center gap-3">
          <div className="text-red-500 flex-1">⚠️ {error}</div>
          <button 
            onClick={() => setError("")}
            className="text-red-600 hover:bg-red-100 px-3 py-1 rounded-lg"
          >
            Retry
          </button>
        </div>
      )}

      {/* 评论列表 */}
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
        >
          <div className="p-4">
            <div className="flex gap-3">
              {/* 用户头像 */}
              <img
                src={comment.user_avatar}
                alt={`@user_${comment.user_id}`}
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
              />

              {/* 评论主体 */}
              <div className="flex-1">
                {/* 用户信息栏 */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">
                    User #{comment.user_id}
                  </span>
                  <span className="text-gray-500 text-sm">·</span>
                  <span className="text-gray-500 text-sm">
                    {formatDistanceToNow(parseISO(comment.created_at))}
                  </span>
                  
                  <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>

                {/* 评论内容 */}
                <div className="relative">
                  <p 
                    className={`text-gray-800 mb-2 ${
                      !expandedComments.has(comment.id) && "line-clamp-3"
                    }`}
                  >
                    {comment.content}
                    {comment.content.length > 200 && (
                      <button 
                        onClick={() => toggleCommentExpand(comment.id)}
                        className="ml-2 text-blue-500 hover:text-blue-600 font-medium"
                      >
                        {expandedComments.has(comment.id) ? "Show less" : "Show more"}
                      </button>
                    )}
                  </p>
                </div>

                {/* 图片展示 */}
                {comment.images && comment.images.length > 0 && (
                  <div className={`grid gap-2 mt-3 ${
                    comment.images.length === 1 ? "grid-cols-1" : 
                    comment.images.length === 2 ? "grid-cols-2" : "grid-cols-3"
                  }`}>
                    {comment.images.map((image) => (
                      <div key={image} className="relative aspect-square">
                        <img
                          src={image}
                          alt="Comment media"
                          className="rounded-xl object-cover w-full h-full bg-gray-100"
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* 互动按钮 */}
                <div className="flex items-center gap-4 mt-3 text-gray-500">
                  <button className="flex items-center gap-1.5 hover:text-pink-500 transition-colors">
                    <Heart size={18} />
                    <span className="text-sm">42</span>
                  </button>
                  
                  <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                    <MessageCircle size={18} />
                    <span className="text-sm">Reply</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* 空状态 */}
      {!loading && comments.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">🎈</div>
          <p className="text-gray-500">Be the first to comment</p>
        </div>
      )}
    </div>
  );
};

export default CommentFeed;