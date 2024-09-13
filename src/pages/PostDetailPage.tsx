import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Instance from '../interceptors/auth_interceptor';
import { PostVo } from '../types/PostModel';
import { IconThumbUp, IconThumbUpFilled, IconShare, IconMessage2, IconBookmark, IconBookmarkFilled } from '@tabler/icons-react'; // 引入 IconBookmarkFilled

const PostDetail: React.FC = () => {
  const instance = Instance();
  const { postID } = useParams<{ postID: string }>();
  const [post, setPost] = useState<PostVo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [, setFollowError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [, setBookmarkError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const response = await instance.get(`/api/1/posts/${postID}`);
        setPost(response.data.data);

        const followResponse = await instance.get(`/api/me/follows/${response.data.data.author_id}/status`);
        setIsFollowing(followResponse.data.data);

        const bookmarkResponse = await instance.get(`/api/me/favorites/${postID}/status`);
        setIsBookmarked(bookmarkResponse.data.data);

        const likeResponse = await instance.get(`/api/posts/${postID}/like/status`);
        setIsLiked(likeResponse.data.data);
        // setLikeCount(likeResponse.data.data.like_count);

      } catch (error) {
        console.error('Failed to fetch post details:', error);
        setError('Failed to load post details');
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetail();
  }, [postID]);

  const handleAuthorClick = () => {
    navigate(`/user-profile/${post?.author_id}`);
  };

  const handleFollow = async () => {
    if (!post) return;

    try {
      await instance.post(`/api/me/follows/${post.author_id}`);
      setIsFollowing((prev) => !prev);
    } catch (error) {
      console.error('Failed to update follow status:', error);
      setFollowError('Failed to update follow status');
    }
  };

  const handleLike = async () => {
    if (!post) return;

    try {
      await instance.post(`/api/posts/${postID}/like`);
      setIsLiked((prev) => !prev);
      setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
    } catch (error) {
      console.error('Failed to update like status:', error);
    }
  };

  const handleBookmark = async () => {
    if (!post) return;

    try {
      await instance.post(`/api/posts/${postID}/favorite`);
      setIsBookmarked((prev) => !prev);
    } catch (error) {
      console.error('Failed to update bookmark status:', error);
      setBookmarkError('Failed to update bookmark status');
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

  if (!post) {
    return <div className="text-center mt-10">No post found.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <div className="flex items-center mt-2">
            <img
              src={post.author_avatar}
              alt={post.author_name}
              className="w-16 h-16 rounded-full mr-2 object-cover cursor-pointer"
              onClick={handleAuthorClick}
            />
            <div>
              <p
                className="text-base font-semibold cursor-pointer"
                onClick={handleAuthorClick}
              >
                {post.author_name}
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

      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">
          {/* Views: {post.view_count} | Comments: {post.comment_count} | Likes: {likeCount} */}
        </div>
        <div className="text-sm text-gray-500">Posted on {post.created_at}</div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <p className="text-base leading-relaxed">{post.content}</p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex">
          <button className="flex items-center mr-4" onClick={handleLike}>
            {isLiked ? (
              <IconThumbUpFilled size={24} fill="red" className="text-red-500" />
            ) : (
              <IconThumbUp size={24} fill="none" className="text-gray-500" />
            )}
            <span className="ml-1">{isLiked ? 'Liked' : 'Like'}</span>
          </button>

          <button className="flex items-center mr-4" onClick={handleBookmark}>
            {isBookmarked ? (
              <IconBookmarkFilled size={24} fill="#FFC107" className="text-yellow-600" />
            ) : (
              <IconBookmark size={24} fill="none" className="text-gray-500" />
            )}
            <span className="ml-1">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
          </button>

          <button className="flex items-center mr-4">
            <IconShare size={24} className="text-blue-500" />
            <span className="ml-1">Share</span>
          </button>

        </div>

        <button className="flex items-center text-gray-500">
          <IconMessage2 size={24} />
          <span className="ml-1">Comment</span>
        </button>
      </div>

      <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-lg font-semibold mb-4">Comments</h3>
        <p className="text-gray-600">No comments yet. Be the first to comment!</p>
      </div>
    </div>
  );
};

export default PostDetail;
