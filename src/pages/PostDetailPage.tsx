import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Instance from '../interceptors/auth_interceptor';
import { PostVo } from '../types/PostModel';
import { IconThumbUp, IconShare, IconMessage2 } from '@tabler/icons-react';

const PostDetail: React.FC = () => {
  const instance = Instance();
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<PostVo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false); // 存储关注状态
  const [followError, setFollowError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const token = localStorage.getItem("AccessToken");
        const response = await instance.get(`/api/1/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPost(response.data.data);

        // 获取当前关注状态
        const followResponse = await instance.get(`/api/user/follow/${response.data.data.author_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsFollowing(followResponse.data.data); // 设置关注状态（true/false）
      } catch (error) {
        console.error('Failed to fetch post details or follow status:', error);
        setError('Failed to load post details or follow status');
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetail();
  }, [postId]);

  const handleAuthorClick = () => {
    navigate(`/user-profile/${post?.author_id}`);
  };

  const handleFollow = async () => {
    if (!post) return;

    try {
      const token = localStorage.getItem("AccessToken");
      await instance.post(`/api/user/follow/${post.author_id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsFollowing((prev) => !prev); // 切换关注状态
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

  if (!post) {
    return <div className="text-center mt-10">No post found.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      {/* 帖子标题和作者信息 */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <div className="flex items-center mt-2">
            {/* 作者头像 */}
            <img
              src={post.author_avatar}
              alt={post.author_name}
              className="w-16 h-16 rounded-full mr-2 object-cover cursor-pointer"
              onClick={handleAuthorClick} // 点击头像触发跳转
            />
            {/* 作者信息 */}
            <div>
              <p
                className="text-base font-semibold cursor-pointer"
                onClick={handleAuthorClick} // 点击作者名触发跳转
              >
                {post.author_name}
              </p>
              {/* 关注/取消关注按钮 */}
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


      {/* 帖子统计信息和发布时间 */}
      <div className="flex justify-between items-center mb-4">
        {/* 帖子统计信息 */}
        <div className="text-sm text-gray-600">
          Views: {post.view_count} | Comments: {post.comment_count} | Likes: {post.like_count}
        </div>
        {/* 发布时间 */}
        <div className="text-sm text-gray-500">
          Posted on {post.created_at}
        </div>
      </div>

      {/* 帖子内容 */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <p className="text-base leading-relaxed">{post.content}</p>
      </div>

      {/* 互动按钮 */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex">
          {/* 点赞按钮 */}
          <button className="flex items-center mr-4">
            <IconThumbUp size={20} className="text-red-500" />
            <span className="ml-1">Like</span>
          </button>

          {/* 分享按钮 */}
          <button className="flex items-center mr-4">
            <IconShare size={20} className="text-gray-500" />
            <span className="ml-1">Share</span>
          </button>
        </div>

        {/* 评论按钮 */}
        <button className="flex items-center text-gray-500">
          <IconMessage2 size={20} />
          <span className="ml-1">Comment</span>
        </button>
      </div>

      {/* 评论区域 */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-6">
        <h3 className="text-lg font-semibold mb-4">Comments</h3>
        <p className="text-gray-600">No comments yet. Be the first to comment!</p>
        {/* 评论表单可以在这里添加 */}
      </div>
    </div>
  );
};

export default PostDetail;
