import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '@/integrations/supabase/client';
import { setSession, setProfile, setLoading } from '@/store/slices/authSlice';
import { Box, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        dispatch(setSession({ 
          user: session?.user ?? null, 
          session 
        }));

        if (session?.user) {
          // Fetch user profile
          setTimeout(async () => {
            try {
              const { data: profile, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single();

              if (error) {
                console.error('Error fetching profile:', error);
              } else if (profile) {
                dispatch(setProfile(profile));
              }
            } catch (error) {
              console.error('Profile fetch error:', error);
            }
          }, 0);
        } else {
          dispatch(setProfile(null));
        }
        
        if (!isInitialized) {
          setIsInitialized(true);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isInitialized) {
        dispatch(setSession({ 
          user: session?.user ?? null, 
          session 
        }));
        setIsInitialized(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch, isInitialized]);

  // Show loading screen while initializing
  if (!isInitialized) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <CircularProgress 
            size={60} 
            thickness={4}
            sx={{ color: 'primary.main' }}
          />
        </motion.div>
      </Box>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;