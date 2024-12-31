import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Instance from '../interceptors/auth_interceptor';
import { PostVo } from "../types/PostModel";
import TopBar from '../component/bar/TopBar';
import GetDeviceInfo from '../component/common/UseDeviceInfo';
import { IconMessageCircle, IconRepeat, IconHeart, IconBookmark, IconShare2, IconHeartFilled, IconBookmarkFilled } from '@tabler/icons-react'; // 导入图标
import Loader from '../component/common/Loader';

const TweetDetailPage: React.FC = () => {
  const instance = Instance();
  const deviceInfo = GetDeviceInfo();
  const { postID } = useParams<{ postID: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [, setFollowError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [favoriteCount, setFavoriteCount] = useState<number>(0); // 收藏数状态
  const [, setBookmarkError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0); // 点赞数状态
  const navigate = useNavigate();
  const location = useLocation();

  const [visitedAt, setVisitedAt] = useState<Date | null>(null);
  const [tweet, setTweet] = useState<PostVo | null>(null);

  const tweetRef = useRef<PostVo | null>(null);

  useEffect(() => {
    const fetchTweet = async () => {
      try {
        const response = await instance.get(`/api/1/posts/${postID}`);
        const fetchedTweet = response.data.data;
        setTweet(fetchedTweet);
        tweetRef.current = fetchedTweet; // 将数据保存到 ref 中

        // 在这里进行空值检查
        if (fetchedTweet) {
          setLikeCount(fetchedTweet.interactive_info.like_count);
          setFavoriteCount(fetchedTweet.interactive_info.favorite_count);
          setIsLiked(fetchedTweet.interactive_info.is_like);
          setIsBookmarked(fetchedTweet.interactive_info.is_favorite);

          const followResponse = await instance.get(`/api/me/follows/${fetchedTweet.author_id}/status`);
          setIsFollowing(followResponse.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch tweet:', error);
      } finally {
        setLoading(false)
      }
    };

    fetchTweet();
  }, [postID]);

  useEffect(() => {
    // 记录页面加载时的时间
    const startVisitedAt = new Date();
    setVisitedAt(startVisitedAt);
    const handlePopState = () => {
      if (!tweetRef.current) {
        console.log('Tweet is not loaded yet, skipping history save');
        return;  // 如果 tweet 还没有加载，跳过
      }
      const endVisitedAt = new Date();
      console.log("tweet:", tweet)
      const author_id = tweetRef.current?.author_id;
      const visitDuration = Math.floor((endVisitedAt.getTime() - startVisitedAt.getTime()) / 1000); // 计算停留时间（秒）
      instance.post(`/api/users/${author_id}/browsing-history`, {
        content_id: Number(postID),
        tab: '',
        visited_at: startVisitedAt.toISOString(),
        visit_duration: visitDuration,
        device: deviceInfo.device,
        browser: deviceInfo.browser,
        ip_address: '',
      }).catch((err) => {
        console.error('Failed to save browsing history:', err);
      });
    };
    return () => {
      handlePopState();
      console.log('Leaving the page:', location);
    };
  }, [location]);

  const handleLike = async () => {
    console.log("like click")
    if (!tweet) return;

    try {
      await instance.post(`/api/posts/${postID}/like`);
      setIsLiked((prev) => !prev);
      setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
    } catch (error) {
      console.error('Failed to update like status:', error);
    }
  };

  const handleBookmark = async () => {
    if (!tweet) return;

    try {
      await instance.post(`/api/posts/${postID}/favorite`);
      setIsBookmarked((prev) => !prev);

      // 更新收藏数，增加或减少
      setFavoriteCount((prevCount) => (isBookmarked ? prevCount - 1 : prevCount + 1));
    } catch (error) {
      console.error('Failed to update bookmark status:', error);
      setBookmarkError('Failed to update bookmark status');
    }
  };


  const handleAuthorClick = () => {
    navigate(`/user-profile/${tweet?.author_id}`);
  };

  return (
    <div className="flex-grow flex flex-col h-screen overflow-y-auto">
      <div className="sticky top-0 z-10 bg-white shadow-md">
          <TopBar page='帖子详情' />
      </div>
      {loading ? (
        <Loader />
      ): (
        <div className="w-full max-w-3xl px-4">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-2">{tweet?.title}</h2>
            <div className="flex items-center mb-4">
              <div className='flex-shrink-0 cursor-pointer' onClick={handleAuthorClick}>
                <img
                  src={tweet?.author_avatar || "/static/images/avatar/1.jpg"}
                  alt="User Avatar"
                  className="w-12 h-12 rounded-full object-cover mr-2"
                />
              </div>
              <div>
                <span className="font-semibold text-gray-800">{tweet?.author_name}</span>
                <span className="text-gray-500 text-sm ml-2">
                  {tweet?.created_at ? new Date(tweet.created_at).toLocaleString() : 'Unknown Date'}
                </span>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{tweet?.content}</p>

            {/* Interactive Info */}
            <div className="flex justify-between text-gray-500 mb-4">
              <span className="flex items-center">
                <IconMessageCircle className="mr-1" /> {tweet?.interactive_info.comment_count}
              </span>
              <span className="flex items-center">
                <IconRepeat className="mr-1" /> {tweet?.interactive_info.view_count}
              </span>
              <button className="flex items-center" onClick={handleLike}>
                {isLiked ? (
                  <IconHeartFilled size={24} className="text-pink-500" />
                ) : (
                  <IconHeart size={24} fill="none" className="text-gray-500" />
                )}
                <span className="ml-2 text-gray-600">{likeCount}</span>
              </button>
              <button className="flex items-center mr-4" onClick={handleBookmark}>
              {isBookmarked ? (
                <IconBookmarkFilled size={24} fill="#FFC107" className="text-yellow-600" />
              ) : (
                <IconBookmark size={24} fill="none" className="text-gray-500" />
              )}
              <span className="ml-2 text-gray-600">{favoriteCount}</span>
            </button>
              <span className="flex items-center">
                <IconShare2 className="mr-1" />
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TweetDetailPage;
