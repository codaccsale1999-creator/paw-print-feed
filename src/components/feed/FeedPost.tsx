import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
  Box,
  Chip,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  FavoriteBorder,
  Favorite,
  ChatBubbleOutline,
  Share,
  MoreVert,
  Verified,
  LocationOn,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Post } from '@/store/slices/feedSlice';
import { formatDistanceToNow } from 'date-fns';

interface FeedPostProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
}

const FeedPost: React.FC<FeedPostProps> = ({ post, onLike, onComment, onShare }) => {
  const [liked, setLiked] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const handleLike = () => {
    setLiked(!liked);
    onLike?.(post.id);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card
        sx={{
          mb: 2,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: 'var(--shadow-soft)',
          '&:hover': {
            boxShadow: 'var(--shadow-medium)',
            transform: 'translateY(-2px)',
            transition: 'all 0.3s ease',
          },
        }}
      >
        {/* Post Header */}
        <CardHeader
          avatar={
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Avatar
                src={post.pet?.profile_image_url || post.user?.profile_image_url}
                sx={{
                  width: 48,
                  height: 48,
                  border: '2px solid',
                  borderColor: 'primary.main',
                }}
              >
                {post.pet?.name?.[0] || post.user?.username?.[0]}
              </Avatar>
            </motion.div>
          }
          action={
            <IconButton onClick={handleMenuOpen}>
              <MoreVert />
            </IconButton>
          }
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle1" fontWeight={600}>
                {post.pet?.name || post.user?.username}
              </Typography>
              {post.user?.is_verified && (
                <Verified sx={{ fontSize: 16, color: 'primary.main' }} />
              )}
              {post.is_sponsored && (
                <Chip 
                  label="Sponsored" 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                  sx={{ fontSize: '0.75rem', height: 20 }}
                />
              )}
            </Box>
          }
          subheader={
            <Box>
              <Typography variant="body2" color="text.secondary">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </Typography>
              {post.location_name && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <LocationOn sx={{ fontSize: 14, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {post.location_name}
                  </Typography>
                </Box>
              )}
            </Box>
          }
        />

        {/* Post Content */}
        {post.content && (
          <CardContent sx={{ pt: 0, pb: 1 }}>
            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
              {post.content}
            </Typography>
          </CardContent>
        )}

        {/* Post Images */}
        {post.image_urls.length > 0 && (
          <Box sx={{ px: 0 }}>
            {post.image_urls.length === 1 ? (
              <motion.img
                src={post.image_urls[0]}
                alt="Post content"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '600px',
                  objectFit: 'cover',
                  display: 'block',
                }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: post.image_urls.length === 2 ? '1fr 1fr' : '1fr 1fr 1fr',
                  gap: 1,
                  p: 1,
                }}
              >
                {post.image_urls.slice(0, 6).map((url, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    style={{ position: 'relative' }}
                  >
                    <img
                      src={url}
                      alt={`Post content ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                      }}
                    />
                    {index === 5 && post.image_urls.length > 6 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          bgcolor: 'rgba(0,0,0,0.6)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '8px',
                        }}
                      >
                        <Typography variant="h6" color="white" fontWeight={600}>
                          +{post.image_urls.length - 6}
                        </Typography>
                      </Box>
                    )}
                  </motion.div>
                ))}
              </Box>
            )}
          </Box>
        )}

        {/* Post Actions */}
        <CardActions sx={{ px: 2, py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            <motion.div whileTap={{ scale: 0.9 }}>
              <IconButton
                onClick={handleLike}
                sx={{ 
                  color: liked ? 'error.main' : 'text.secondary',
                  '&:hover': { bgcolor: liked ? 'error.light' : 'grey.100' }
                }}
              >
                {liked ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
            </motion.div>
            <Typography variant="body2" color="text.secondary">
              {post.likes_count + (liked ? 1 : 0)}
            </Typography>

            <motion.div whileTap={{ scale: 0.9 }}>
              <IconButton
                onClick={() => onComment?.(post.id)}
                sx={{ color: 'text.secondary' }}
              >
                <ChatBubbleOutline />
              </IconButton>
            </motion.div>
            <Typography variant="body2" color="text.secondary">
              {post.comments_count}
            </Typography>

            <motion.div whileTap={{ scale: 0.9 }}>
              <IconButton
                onClick={() => onShare?.(post.id)}
                sx={{ color: 'text.secondary' }}
              >
                <Share />
              </IconButton>
            </motion.div>
            <Typography variant="body2" color="text.secondary">
              {post.shares_count}
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary">
            {post.views_count} views
          </Typography>
        </CardActions>

        {/* Menu */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>Save Post</MenuItem>
          <MenuItem onClick={handleMenuClose}>Copy Link</MenuItem>
          <MenuItem onClick={handleMenuClose}>Report</MenuItem>
        </Menu>
      </Card>
    </motion.div>
  );
};

export default FeedPost;