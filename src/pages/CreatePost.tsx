import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  FormControlLabel,
  Switch,
  Slider,
  Divider,
  Alert,
} from '@mui/material';
import {
  PhotoCamera,
  Videocam,
  LocationOn,
  MoreVert,
  Send,
  AttachMoney,
  TrendingUp,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useSelector((state: RootState) => state.auth);
  const { userPets } = useSelector((state: RootState) => state.pets);
  
  const [content, setContent] = useState('');
  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  const [isSponsored, setIsSponsored] = useState(false);
  const [sponsorBudget, setSponsorBudget] = useState(50);
  const [targetRadius, setTargetRadius] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Please add some content to your post');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const postData = {
        user_id: user?.id,
        pet_id: selectedPet,
        content: content.trim(),
        post_type: 'post' as const,
        is_sponsored: isSponsored,
        sponsor_budget: isSponsored ? sponsorBudget : null,
        target_radius_km: isSponsored ? targetRadius : 10,
      };

      const { error } = await supabase
        .from('posts')
        .insert(postData);

      if (error) {
        throw error;
      }

      navigate('/');
    } catch (error: any) {
      setError(error.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardContent sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar 
                src={profile?.profile_image_url} 
                sx={{ mr: 2 }}
              >
                {profile?.username?.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6">Create Post</Typography>
                <Typography variant="body2" color="text.secondary">
                  Share something amazing with the community
                </Typography>
              </Box>
              <IconButton
                onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                <MoreVert />
              </IconButton>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Pet Selection */}
            {profile?.user_type === 'normal' && userPets.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                  Posting for:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label="My Account"
                    onClick={() => setSelectedPet(null)}
                    color={selectedPet === null ? 'primary' : 'default'}
                    variant={selectedPet === null ? 'filled' : 'outlined'}
                  />
                  {userPets.map((pet) => (
                    <Chip
                      key={pet.id}
                      label={pet.name}
                      onClick={() => setSelectedPet(pet.id)}
                      color={selectedPet === pet.id ? 'primary' : 'default'}
                      variant={selectedPet === pet.id ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Content */}
            <TextField
              multiline
              rows={4}
              fullWidth
              placeholder="What's happening with your pets today?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              sx={{ mb: 3 }}
              variant="outlined"
            />

            {/* Media Buttons */}
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              <Button
                startIcon={<PhotoCamera />}
                variant="outlined"
                size="small"
              >
                Photo
              </Button>
              <Button
                startIcon={<Videocam />}
                variant="outlined"
                size="small"
              >
                Video
              </Button>
              <Button
                startIcon={<LocationOn />}
                variant="outlined"
                size="small"
              >
                Location
              </Button>
            </Box>

            {/* Sponsored Content Settings */}
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={isSponsored}
                    onChange={(e) => setIsSponsored(e.target.checked)}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUp fontSize="small" />
                    <Typography variant="body2">Promote this post</Typography>
                  </Box>
                }
              />

              {isSponsored && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="body2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AttachMoney fontSize="small" />
                    Budget: ${sponsorBudget}
                  </Typography>
                  <Slider
                    value={sponsorBudget}
                    onChange={(_, value) => setSponsorBudget(value as number)}
                    min={10}
                    max={1000}
                    step={10}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `$${value}`}
                    sx={{ mb: 3 }}
                  />

                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Target Radius: {targetRadius} km
                  </Typography>
                  <Slider
                    value={targetRadius}
                    onChange={(_, value) => setTargetRadius(value as number)}
                    min={1}
                    max={100}
                    step={1}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value} km`}
                  />
                </motion.div>
              )}
            </Box>

            {/* Submit Button */}
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={loading || !content.trim()}
              startIcon={<Send />}
              sx={{ py: 1.5 }}
            >
              {loading ? 'Posting...' : 'Share Post'}
            </Button>
          </CardContent>
        </Card>

        {/* Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => setAnchorEl(null)}>
            Save as Draft
          </MenuItem>
          <MenuItem onClick={() => setAnchorEl(null)}>
            Schedule Post
          </MenuItem>
        </Menu>
      </motion.div>
    </Box>
  );
};

export default CreatePost;