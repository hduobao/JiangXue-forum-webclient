import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import instance from '../interceptors/auth_interceptor'; // 引入配置了拦截器的 axios 实例
import { Typography, CircularProgress, Container, Avatar } from '@mui/material';

interface PostVo {
  id: number;
  title: string;
  content: string;
  author_name: string;
  author_avatar: string;
  view_count: string;
  comment_count: string;
  like_count: string;
  created_at: string;
}

const PostDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<PostVo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const token = localStorage.getItem("AccessToken");
        const response = await instance.get(`/api/1/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setPost(response.data.data);
      } catch (error) {
        console.error('Failed to fetch post details:', error);
        setError('Failed to load post details');
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetail();
  }, [postId]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!post) {
    return <Typography>No post found.</Typography>;
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {post.title}
      </Typography>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <Avatar 
          src={post.author_avatar} 
          alt={post.author_name} 
          style={{ marginRight: '8px' }} 
        />
        <Typography variant="body1">{post.author_name}</Typography>
      </div>
      <Typography variant="body2" color="textSecondary">
        Views: {post.view_count} | Comments: {post.comment_count} | Likes: {post.like_count}
      </Typography>
      <Typography variant="body1" paragraph style={{ marginTop: '16px' }}>
        {post.content}
      </Typography>
      <Typography variant="caption" color="textSecondary">
        Created at: {post.created_at}
      </Typography>
    </Container>
  );
};

export default PostDetail;
