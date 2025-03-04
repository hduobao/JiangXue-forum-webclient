import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Instance from "../interceptors/auth_interceptor";
import { TweetVo } from "../types/TweetModel";
import TopBar from "../component/bar/TopBar";
import GetDeviceInfo from "../component/common/UseDeviceInfo";
import {
  IconMessageCircle,
  IconRepeat,
  IconHeart,
  IconBookmark,
  IconShare2,
  IconHeartFilled,
  IconBookmarkFilled,
} from "@tabler/icons-react"; // 导入图标
import Loader from "../component/common/Loader";
import CommentModal from "../component/comment/CommentModel"; // 引入 CommentModal 组件

const TweetDetailPage: React.FC = () => {
  const instance = Instance();
  const deviceInfo = GetDeviceInfo();
  const { tweetID } = useParams<{ tweetID: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [favoriteCount, setFavoriteCount] = useState<number>(0); // 收藏数状态
  const [, setBookmarkError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0); // 点赞数状态
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // 管理弹窗的显示状态
  const navigate = useNavigate();
  const location = useLocation();

  const [tweet, setTweet] = useState<TweetVo | null>(null);

  const tweetRef = useRef<TweetVo | null>(null);

  const handleCommentClick = () => {
    setIsModalOpen(true); // 打开评论弹窗
  };

  const commentModalRef = useRef<HTMLDivElement | null>(null); // 为弹窗外层添加ref

  const handleClickOutside = (event: MouseEvent) => {
    if (
      commentModalRef.current &&
      commentModalRef.current.contains(event.target as Node)
    ) {
      // 如果点击的地方在弹窗内部，什么都不做
      return;
    }
    // 如果点击的是弹窗外部，关闭弹窗
    setIsModalOpen(false);
  };

  useEffect(() => {
    // 监听点击事件，点击弹窗外部时关闭弹窗
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchTweet = async () => {
      try {
        const response = await instance.get(`/api/1/tweets/${tweetID}`);
        const fetchedTweet = response.data.data;
        setTweet(fetchedTweet);
        tweetRef.current = fetchedTweet; // 将数据保存到 ref 中

        // 在这里进行空值检查
        if (fetchedTweet) {
          setLikeCount(fetchedTweet.interactive_info.like_count);
          setFavoriteCount(fetchedTweet.interactive_info.favorite_count);
          setIsLiked(fetchedTweet.interactive_info.is_like);
          setIsBookmarked(fetchedTweet.interactive_info.is_favorite);
        }
      } catch (error) {
        console.error("Failed to fetch tweet:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTweet();
  }, [tweetID]);

  useEffect(() => {
    // 记录页面加载时的时间
    const startVisitedAt = new Date();
    const handlePopState = () => {
      if (!tweetRef.current) {
        console.log("Tweet is not loaded yet, skipping history save");
        return; // 如果 tweet 还没有加载，跳过
      }
      const endVisitedAt = new Date();
      console.log("tweet:", tweet);
      const author_id = tweetRef.current?.author_id;
      const visitDuration = Math.floor(
        (endVisitedAt.getTime() - startVisitedAt.getTime()) / 1000
      ); // 计算停留时间（秒）
      instance
        .post(`/api/users/${author_id}/browsing-history`, {
          content_id: Number(tweetID),
          tab: "",
          visited_at: startVisitedAt.toISOString(),
          visit_duration: visitDuration,
          device: deviceInfo.device,
          browser: deviceInfo.browser,
          ip_address: "",
        })
        .catch((err) => {
          console.error("Failed to save browsing history:", err);
        });
    };
    return () => {
      handlePopState();
      console.log("Leaving the page:", location);
    };
  }, [location]);

  const handleLike = async () => {
    console.log("like click");
    if (!tweet) return;

    try {
      await instance.post(`/api/tweets/${tweetID}/like`);
      setIsLiked((prev) => !prev);
      setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
    } catch (error) {
      console.error("Failed to update like status:", error);
    }
  };

  const handleBookmark = async () => {
    if (!tweet) return;

    try {
      await instance.post(`/api/tweets/${tweetID}/favorite`);
      setIsBookmarked((prev) => !prev);

      // 更新收藏数，增加或减少
      setFavoriteCount((prevCount) =>
        isBookmarked ? prevCount - 1 : prevCount + 1
      );
    } catch (error) {
      console.error("Failed to update bookmark status:", error);
      setBookmarkError("Failed to update bookmark status");
    }
  };

  const handleAuthorClick = () => {
    navigate(`/user-profile/${tweet?.author_id}`);
  };

  const handleShareClick = async () => {};

  return (
    <div className="flex-grow flex flex-col h-screen overflow-y-auto">
      <div className="sticky top-0 z-10 bg-white shadow-md">
        <TopBar page="帖子详情" />
      </div>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full max-w-3xl px-4">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-2">{tweet?.title}</h2>
            <div className="flex items-center mb-4">
              <div
                className="flex-shrink-0 cursor-pointer"
                onClick={handleAuthorClick}
              >
                <img
                  src={tweet?.author_avatar || "/static/images/avatar/1.jpg"}
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full object-cover mr-2"
                />
              </div>
              <div>
                <span className="font-semibold text-gray-800">
                  {tweet?.author_name}
                </span>
                <span className="text-gray-500 text-sm ml-2">
                  {tweet?.created_at
                    ? new Date(tweet.created_at).toLocaleString()
                    : "Unknown Date"}
                </span>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{tweet?.content}</p>

            {/* Interactive Info */}
            <div className="flex justify-between text-gray-500 mb-4">
              <button
                className="flex items-center space-x-2 hover:text-blue-500"
                onClick={handleCommentClick}
              >
                <IconMessageCircle />
                <span className="ml-2 text-gray-600">
                  {tweet?.interactive_info.comment_count}
                </span>
              </button>
              <span className="flex items-center space-x-2 hover:text-green-500">
                <IconRepeat />
                {tweet?.interactive_info.view_count}
              </span>
              <button
                className={`flex items-center space-x-2 ${
                  isLiked ? "text-pink-500" : "text-gray-500"
                } hover:text-pink-600`}
                onClick={handleLike}
              >
                {isLiked ? (
                  <IconHeartFilled size={24} className={`text-current`} />
                ) : (
                  <IconHeart
                    size={24}
                    className={`text-current hover:text-pink-500`}
                  />
                )}
                <span className="ml-2 text-gray-600">{likeCount}</span>
              </button>
              <button
                className={`flex items-center space-x-2 ${
                  isBookmarked ? "text-yellow-400" : "text-gray-500"
                }  hover:text-yellow-400`}
                onClick={handleBookmark}
              >
                {isBookmarked ? (
                  <IconBookmarkFilled size={24} className={`text-current`} />
                ) : (
                  <IconBookmark
                    size={24}
                    className={`text-current hover:text-yellow-400`}
                  />
                )}
                <span className="ml-2 text-gray-600">{favoriteCount}</span>
              </button>
              <span
                className="flex items-center space-x-2 hover:text-blue-500"
                onClick={handleShareClick}
              >
                <IconShare2 />
              </span>
            </div>
          </div>
          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div
                className="fixed inset-0 bg-black opacity-50"
                onClick={() => setIsModalOpen(false)}
              ></div>
              <div
                className="bg-white rounded-lg shadow-lg z-10 max-w-screen-sm max-h-screen overflow-auto"
                ref={commentModalRef} // 绑定ref
              >
                <CommentModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  replyingTo={tweet?.account}
                  tweetId={tweet?.id}
                  authorAvatar={tweet?.author_avatar}
                  authorName={tweet?.author_name}
                  tweetTextContent={tweet?.content}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TweetDetailPage;
