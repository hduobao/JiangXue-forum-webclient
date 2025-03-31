import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Instance from '../interceptors/auth_interceptor';
import { TweetVo } from '../types/TweetModel';
import { IconThumbUp, IconThumbUpFilled, IconShare, IconMessage2, IconBookmark, IconBookmarkFilled } from '@tabler/icons-react'; // 引入 IconBookmarkFilled
import GetDeviceInfo from '../component/common/UseDeviceInfo';

const TweetDetail: React.FC = () => {
  const instance = Instance();
  const deviceInfo = GetDeviceInfo();
  const { tweetID } = useParams<{ tweetID: string }>();
  const [tweet, setTweet] = useState<TweetVo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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

  useEffect(() => {
    const forumID = 1;

    const fetchTweetDetail = async () => {
      try {
        const response = await instance.get(`/api/tweets/${tweetID}`, {
          params: {
            forumID,
          },
        });
        const tweetData = response.data.data;
        setTweet(tweetData);

        setLikeCount(tweetData.interactive_info.like_count);
        setFavoriteCount(tweetData.interactive_info.favorite_count);
        setIsLiked(tweetData.interactive_info.is_like);
        setIsBookmarked(tweetData.interactive_info.is_favorite);

        const followResponse = await instance.get(`/api/me/follows/${tweetData.author_id}/status`);
        setIsFollowing(followResponse.data.data);
      } catch (error) {
        console.error('Failed to fetch tweet details:', error);
        setError('Failed to load tweet details');
      } finally {
        setLoading(false);
      }
    };

    fetchTweetDetail();

  }, [tweetID]);

  useEffect(() => {
    // 记录页面加载时的时间
    const startVisitedAt = new Date();
    setVisitedAt(startVisitedAt);
    const handlePopState = () => {
      const endVisitedAt = new Date();
      const visitDuration = Math.floor((endVisitedAt.getTime() - startVisitedAt.getTime()) / 1000); // 计算停留时间（秒）
      instance.post(`/api/users/${tweet?.author_id}/browsing-history`, {
        content_id: Number(tweetID),
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
    if (!tweet) return;

    try {
      await instance.post(`/api/tweets/${tweetID}/like`);
      setIsLiked((prev) => !prev);
      setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1)); // 更新点赞数
    } catch (error) {
      console.error('Failed to update like status:', error);
    }
  };

  const handleBookmark = async () => {
    if (!tweet) return;

    try {
      await instance.post(`/api/tweets/${tweetID}/favorite`);
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

  const handleFollow = async () => {
    if (!tweet) return;

    try {
      await instance.post(`/api/me/follows/${tweet.author_id}`);
      setIsFollowing((prev) => !prev);
    } catch (error) {
      console.error('Failed to update follow status:', error);
      setFollowError('Failed to update follow status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  if (!tweet) {
    return <div className="text-center mt-10">No tweet found.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      {/* Tweet Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold">{tweet.title}</h1>
          <div className="flex items-center mt-2">
            <img
              src={tweet.author_avatar}
              alt={tweet.author_name}
              className="w-16 h-16 rounded-full mr-2 object-cover cursor-pointer"
              onClick={handleAuthorClick}
            />
            <div>
              <p
                className="text-base font-semibold cursor-pointer"
                onClick={handleAuthorClick}
              >
                {tweet.author_name}
              </p>
              <button
                onClick={handleFollow}
                className={`mt-2 py-1 px-3 rounded ${isFollowing ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
              >
                {isFollowing ? '取消关注' : '关注'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tweet Metadata */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">
          {/* 显示点赞和收藏数 */}
          {/* {`Likes: ${likeCount} | Favorites: ${favoriteCount}`} */}
        </div>
        <div className="text-sm text-gray-500">Tweeted on {tweet.created_at}</div>
      </div>

      {/* Tweet Content */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <p className="text-base leading-relaxed">{tweet.content}</p>
      </div>

      {/* Interaction Buttons */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex">
          {/* 点赞按钮 */}
          <button className="flex items-center mr-4" onClick={handleLike}>
            {isLiked ? (
              <IconThumbUpFilled size={24} className="text-pink-500" />
            ) : (
              <IconThumbUp size={24} fill="none" className="text-gray-500" />
            )}
            {/* <span className="ml-1">{isLiked ? 'Liked' : 'Like'}</span> */}
            <span className="ml-2 text-gray-600">{likeCount}</span> {/* 显示点赞数 */}
          </button>

          {/* 收藏按钮 */}
          <button className="flex items-center mr-4" onClick={handleBookmark}>
            {isBookmarked ? (
              <IconBookmarkFilled size={24} fill="#FFC107" className="text-yellow-600" />
            ) : (
              <IconBookmark size={24} fill="none" className="text-gray-500" />
            )}
            {/* <span className="ml-1">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span> */}
            <span className="ml-2 text-gray-600">{favoriteCount}</span> {/* 显示收藏数 */}
          </button>

          {/* 分享按钮 */}
          <button className="flex items-center mr-4">
            <IconShare size={24} className="text-blue-500" />
            <span className="ml-1">Share</span>
          </button>
        </div>

        {/* 评论按钮 */}
        <button className="flex items-center text-gray-500">
          <IconMessage2 size={24} />
          <span className="ml-1">Comment</span>
        </button>
      </div>

      {/* Comments Section */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-lg font-semibold mb-4">Comments</h3>
        <p className="text-gray-600">No comments yet. Be the first to comment!</p>
      </div>
    </div>
  );

};

export default TweetDetail;
