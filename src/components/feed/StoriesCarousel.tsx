import React from 'react';
import { Box, Avatar, Typography, Paper } from '@mui/material';
import { Add } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Post } from '@/store/slices/feedSlice';

interface StoriesCarouselProps {
  stories: Post[];
  onCreateStory?: () => void;
  onViewStory?: (storyId: string) => void;
}

const StoriesCarousel: React.FC<StoriesCarouselProps> = ({ 
  stories, 
  onCreateStory, 
  onViewStory 
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,
        bgcolor: 'background.paper',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          pb: 1,
          '&::-webkit-scrollbar': {
            height: '4px',
          },
          '&::-webkit-scrollbar-track': {
            bgcolor: 'grey.100',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            bgcolor: 'primary.main',
            borderRadius: '4px',
          },
        }}
      >
        {/* Create Story Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCreateStory}
          style={{ cursor: 'pointer', flexShrink: 0 }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: 80,
            }}
          >
            <Box
              sx={{
                position: 'relative',
                mb: 1,
              }}
            >
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: 'grey.100',
                  border: '2px dashed',
                  borderColor: 'primary.main',
                }}
              >
                <Add sx={{ color: 'primary.main', fontSize: 24 }} />
              </Avatar>
            </Box>
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.75rem',
                fontWeight: 500,
                textAlign: 'center',
                color: 'text.secondary',
                lineHeight: 1.2,
              }}
            >
              Your Story
            </Typography>
          </Box>
        </motion.div>

        {/* Stories */}
        {stories.map((story, index) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onViewStory?.(story.id)}
            style={{ cursor: 'pointer', flexShrink: 0 }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: 80,
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  mb: 1,
                }}
              >
                <Avatar
                  src={story.pet?.profile_image_url || story.user?.profile_image_url}
                  sx={{
                    width: 60,
                    height: 60,
                    border: '3px solid',
                    borderColor: 'primary.main',
                    background: 'linear-gradient(45deg, hsl(25, 95%, 55%), hsl(320, 60%, 60%))',
                    p: '2px',
                  }}
                >
                  {story.pet?.name?.[0] || story.user?.username?.[0]}
                </Avatar>
                
                {/* Story preview image */}
                {story.image_urls.length > 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: '50%',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `url(${story.image_urls[0]}) center/cover`,
                        borderRadius: '50%',
                        zIndex: -1,
                      },
                    }}
                  />
                )}
              </Box>
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  textAlign: 'center',
                  color: 'text.primary',
                  lineHeight: 1.2,
                  maxWidth: 80,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {story.pet?.name || story.user?.username}
              </Typography>
            </Box>
          </motion.div>
        ))}
      </Box>
    </Paper>
  );
};

export default StoriesCarousel;