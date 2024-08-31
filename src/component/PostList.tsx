import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Avatar, Typography } from '@mui/material';
import { Visibility, Comment, ThumbUp } from '@mui/icons-material';
import { ListPostVo } from "../types/PostModel";
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import instance from '../interceptors/AuthInterceptor'; // 引入配置了拦截器的 axios 实例

const HoverTypography = styled(Typography)(() => ({
  fontSize: '1.125rem',
  cursor: 'pointer',
  textDecoration: 'none',
  transition: 'text-decoration 0.3s',
  '&:hover': {
    textDecoration: 'underline',
  }
}));

const PostList: React.FC = () => {
  const [posts, setPosts] = useState<ListPostVo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const offset = 1;
        const limit = 10;

        const response = await instance.get(`/api/1/posts/offset/${offset}/limit/${limit}`);

        setPosts(response.data.data);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleTitleClick = (postId: number) => {
    navigate(`/posts/${postId}`);
  };

  return (
    <div>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <List>
          {posts.map(post => (
            <ListItem key={post.id} style={{ display: 'flex', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '16px' }}>
                <Avatar 
                  src={post.author_avatar} 
                  alt={post.author_name} 
                  style={{ width: 80, height: 80, marginBottom: '4px' }} 
                />
                <Typography 
                  variant="body2" 
                  style={{ 
                    fontSize: '0.875rem', 
                    marginTop: 'auto' 
                  }}
                >
                  {post.author_name}
                </Typography>
              </div>
              <div style={{ flex: 1 }}>
                <ListItemText
                  primary={
                    <HoverTypography 
                      variant="h6" 
                      onClick={() => handleTitleClick(post.id)} 
                    >
                      {post.title}
                    </HoverTypography>
                  }
                  secondary={
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      height: 'calc(3rem + 48px)',  
                      overflow: 'hidden'
                    }}>
                      <Typography 
                        variant="body2" 
                        style={{
                          display: '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          WebkitLineClamp: 2,  
                          lineHeight: '1.5rem',  
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {post.content}
                      </Typography>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Typography variant="body2">
                          <Visibility fontSize="small" /> {post.view_count}
                        </Typography>
                        <Typography variant="body2">
                          <Comment fontSize="small" /> {post.comment_count}
                        </Typography>
                        <Typography variant="body2">
                          <ThumbUp fontSize="small" /> {post.like_count}
                        </Typography>
                      </div>
                    </div>
                  }
                />
              </div>
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
};

export default PostList;
