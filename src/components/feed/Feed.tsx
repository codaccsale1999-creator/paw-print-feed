import React, { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setPosts, setStories, setLoading } from '@/store/slices/feedSlice';
import { supabase } from '@/integrations/supabase/client';
import FeedPost from './FeedPost';
import StoriesCarousel from './StoriesCarousel';
import { motion } from 'framer-motion';

const Feed: React.FC = () => {
  const dispatch = useDispatch();
  const { posts, stories, isLoading } = useSelector((state: RootState) => state.feed);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      loadFeed();
      loadStories();
    }
  }, [isAuthenticated]);

  const loadFeed = async () => {
    dispatch(setLoading(true));
    try {
      const { data: postsData, error } = await supabase
        .from('posts')
        .select(`
          *,
          users!posts_user_id_fkey (
            username,
            profile_image_url,
            is_verified
          ),
          pets (
            name,
            profile_image_url,
            pet_type
          )
        `)
        .eq('post_type', 'post')
        .eq('is_archived', false)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error loading feed:', error);
      } else {
        const formattedPosts = postsData?.map(post => ({
          ...post,
          user: post.users,
          pet: post.pets?.[0] || null,
        })) || [];
        dispatch(setPosts(formattedPosts));
      }
    } catch (error) {
      console.error('Error loading feed:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const loadStories = async () => {
    try {
      const { data: storiesData, error } = await supabase
        .from('posts')
        .select(`
          *,
          users!posts_user_id_fkey (
            username,
            profile_image_url,
            is_verified
          ),
          pets (
            name,
            profile_image_url,
            pet_type
          )
        `)
        .eq('post_type', 'story')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error loading stories:', error);
      } else {
        const formattedStories = storiesData?.map(story => ({
          ...story,
          user: story.users,
          pet: story.pets?.[0] || null,
        })) || [];
        dispatch(setStories(formattedStories));
      }
    } catch (error) {
      console.error('Error loading stories:', error);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      // Toggle like
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .single();

      if (existingLike) {
        // Unlike
        await supabase
          .from('likes')
          .delete()
          .eq('post_id', postId);
      } else {
        // Like
        await supabase
          .from('likes')
          .insert({ 
            post_id: postId,
            user_id: (await supabase.auth.getUser()).data.user?.id!
          });
      }

      // Refresh feed to get updated counts
      loadFeed();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" gutterBottom>
          Welcome to PawPrint!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please sign in to view your personalized feed
        </Typography>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', width: '100%' }}>
      {/* Stories */}
      {stories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StoriesCarousel
            stories={stories}
            onCreateStory={() => console.log('Create story')}
            onViewStory={(id) => console.log('View story', id)}
          />
        </motion.div>
      )}

      {/* Posts */}
      <Box>
        {posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                color: 'text.secondary',
              }}
            >
              <Typography variant="h6" gutterBottom>
                No posts yet!
              </Typography>
              <Typography variant="body2">
                Start following some pets to see their posts here
              </Typography>
            </Box>
          </motion.div>
        ) : (
          posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <FeedPost
                post={post}
                onLike={handleLike}
                onComment={(id) => console.log('Comment on', id)}
                onShare={(id) => console.log('Share', id)}
              />
            </motion.div>
          ))
        )}
      </Box>
    </Box>
  );
};

export default Feed;