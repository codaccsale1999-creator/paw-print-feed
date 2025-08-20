import React from 'react';
import { Box, Container } from '@mui/material';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import TopNavigation from './TopNavigation';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <Box 
      className="min-h-screen bg-gradient-hero"
      sx={{ 
        display: 'flex',
        bgcolor: 'background.default'
      }}
    >
      {/* Desktop Sidebar */}
      {!isMobile && (
        <motion.div
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <Sidebar />
        </motion.div>
      )}

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Navigation for Mobile */}
        {isMobile && <TopNavigation />}
        
        {/* Main Content */}
        <Container
          maxWidth="sm"
          sx={{
            flexGrow: 1,
            py: isMobile ? 2 : 4,
            px: isMobile ? 1 : 2,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ height: '100%' }}
          >
            {children}
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default AppLayout;