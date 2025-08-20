import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  Badge,
} from '@mui/material';
import {
  Send,
  FavoriteBorder,
  Pets,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { motion } from 'framer-motion';

const TopNavigation: React.FC = () => {
  const { profile } = useSelector((state: RootState) => state.auth);

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
        {/* Logo */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Pets sx={{ color: 'primary.main', fontSize: '1.8rem' }} />
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, hsl(25, 95%, 55%), hsl(320, 60%, 60%))',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              PawPrint
            </Typography>
          </Box>
        </motion.div>

        {/* Right Actions */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton 
              size="large"
              sx={{ 
                color: 'text.primary',
                '&:hover': { bgcolor: 'primary.main', color: 'white' }
              }}
            >
              <Badge badgeContent={3} color="error">
                <FavoriteBorder />
              </Badge>
            </IconButton>
            
            <IconButton 
              size="large"
              sx={{ 
                color: 'text.primary',
                '&:hover': { bgcolor: 'primary.main', color: 'white' }
              }}
            >
              <Badge badgeContent={2} color="error">
                <Send />
              </Badge>
            </IconButton>

            {profile && (
              <Avatar
                src={profile.profile_image_url}
                sx={{ 
                  width: 32, 
                  height: 32,
                  border: '2px solid',
                  borderColor: 'primary.main',
                  ml: 1
                }}
              >
                {profile.full_name?.[0] || profile.username[0]}
              </Avatar>
            )}
          </Box>
        </motion.div>
      </Toolbar>
    </AppBar>
  );
};

export default TopNavigation;