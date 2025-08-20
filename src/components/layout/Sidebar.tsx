import React from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Avatar,
  Typography,
  Divider,
  Paper
} from '@mui/material';
import {
  Home,
  Search,
  Explore,
  VideoLibrary,
  Send,
  FavoriteBorder,
  Add,
  Person,
  Menu,
  Pets
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { motion } from 'framer-motion';

const Sidebar: React.FC = () => {
  const { profile } = useSelector((state: RootState) => state.auth);
  
  const menuItems = [
    { icon: <Home />, text: 'Home', path: '/' },
    { icon: <Search />, text: 'Search', path: '/search' },
    { icon: <Explore />, text: 'Explore', path: '/explore' },
    { icon: <VideoLibrary />, text: 'Reels', path: '/reels' },
    { icon: <Send />, text: 'Messages', path: '/messages' },
    { icon: <FavoriteBorder />, text: 'Notifications', path: '/notifications' },
    { icon: <Add />, text: 'Create', path: '/create' },
    { icon: <Pets />, text: 'My Pets', path: '/pets' },
    { icon: <Person />, text: 'Profile', path: '/profile' },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        width: 280,
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        borderRight: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1200,
      }}
    >
      {/* Logo */}
      <Box sx={{ p: 3, pb: 2 }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, hsl(25, 95%, 55%), hsl(320, 60%, 60%))',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Pets sx={{ color: 'primary.main', fontSize: '2rem' }} />
            PawPrint
          </Typography>
        </motion.div>
      </Box>

      {/* Navigation Menu */}
      <List sx={{ flexGrow: 1, px: 1 }}>
        {menuItems.map((item, index) => (
          <motion.div
            key={item.text}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 * index, type: "spring", stiffness: 200 }}
          >
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                sx={{
                  borderRadius: 2,
                  px: 2,
                  py: 1.5,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    transform: 'translateX(8px)',
                    '& .MuiListItemIcon-root': {
                      color: 'inherit',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: 'text.primary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: 500,
                    fontSize: '1rem'
                  }}
                />
              </ListItemButton>
            </ListItem>
          </motion.div>
        ))}
      </List>

      {/* User Profile Section */}
      {profile && (
        <>
          <Divider sx={{ mx: 2 }} />
          <Box sx={{ p: 2 }}>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={profile.profile_image_url}
                  sx={{ 
                    width: 40, 
                    height: 40,
                    border: '2px solid',
                    borderColor: 'primary.main'
                  }}
                >
                  {profile.full_name?.[0] || profile.username[0]}
                </Avatar>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="body1" fontWeight={600} noWrap>
                    {profile.full_name || profile.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    @{profile.username}
                  </Typography>
                </Box>
                <Menu sx={{ color: 'text.secondary', cursor: 'pointer' }} />
              </Box>
            </motion.div>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default Sidebar;