import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Tab,
  Tabs,
  Paper,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Pets } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Auth: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Sign up form
  const [signUpForm, setSignUpForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    fullName: '',
    userType: 'normal' as 'normal' | 'professional',
    businessCategory: '',
  });

  // Sign in form
  const [signInForm, setSignInForm] = useState({
    email: '',
    password: '',
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signUpForm.password !== signUpForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: signUpForm.email,
        password: signUpForm.password,
        options: {
          emailRedirectTo: `${window.location.origin}/verify-email?email=${signUpForm.email}`,
          data: {
            username: signUpForm.username,
            full_name: signUpForm.fullName,
            user_type: signUpForm.userType,
            business_category: signUpForm.userType === 'professional' ? signUpForm.businessCategory : null,
          }
        }
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (authData.user && !authData.session) {
        // User needs to verify email
        navigate(`/verify-email?email=${signUpForm.email}`);
      } else if (authData.user && authData.session) {
        // User is already signed in (email confirmation disabled)
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email: signUpForm.email,
            username: signUpForm.username,
            full_name: signUpForm.fullName,
            user_type: signUpForm.userType,
            business_category: signUpForm.userType === 'professional' ? signUpForm.businessCategory as any : null,
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          setError('Account created but profile setup failed. Please try logging in.');
        } else {
          // Navigate based on user type
          if (signUpForm.userType === 'normal') {
            navigate('/setup-pets');
          } else {
            navigate('/');
          }
        }
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: signInForm.email,
        password: signInForm.password,
      });

      if (error) {
        setError(error.message);
      } else {
        navigate('/');
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, hsl(25, 95%, 95%) 0%, hsl(320, 60%, 95%) 100%)',
        p: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
      >
        <Card
          sx={{
            maxWidth: 450,
            width: '100%',
            borderRadius: 4,
            boxShadow: '0 20px 40px -12px rgba(251, 146, 60, 0.25)',
            border: '1px solid hsl(25, 20%, 90%)',
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Pets sx={{ fontSize: '3rem', color: 'primary.main', mb: 1 }} />
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, hsl(25, 95%, 55%), hsl(320, 60%, 60%))',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1
                  }}
                >
                  PawPrint
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Connect with pet lovers worldwide
                </Typography>
              </Box>
            </motion.div>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs 
                value={activeTab} 
                onChange={(_, newValue) => setActiveTab(newValue)}
                centered
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab label="Sign In" />
                <Tab label="Sign Up" />
              </Tabs>
            </Box>

            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {/* Sign In Tab */}
              <TabPanel value={activeTab} index={0}>
                <motion.form
                  onSubmit={handleSignIn}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={signInForm.email}
                    onChange={(e) => setSignInForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={signInForm.password}
                    onChange={(e) => setSignInForm(prev => ({ ...prev, password: e.target.value }))}
                    required
                    sx={{ mb: 3 }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{ py: 1.5 }}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </motion.form>
              </TabPanel>

              {/* Sign Up Tab */}
              <TabPanel value={activeTab} index={1}>
                <motion.form
                  onSubmit={handleSignUp}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={signUpForm.email}
                    onChange={(e) => setSignUpForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Username"
                    value={signUpForm.username}
                    onChange={(e) => setSignUpForm(prev => ({ ...prev, username: e.target.value }))}
                    required
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={signUpForm.fullName}
                    onChange={(e) => setSignUpForm(prev => ({ ...prev, fullName: e.target.value }))}
                    sx={{ mb: 2 }}
                  />
                  
                  {/* User Type Selection */}
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                      Account Type
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Paper
                          sx={{
                            p: 2,
                            cursor: 'pointer',
                            border: signUpForm.userType === 'normal' ? 2 : 1,
                            borderColor: signUpForm.userType === 'normal' ? 'primary.main' : 'divider',
                            '&:hover': { borderColor: 'primary.main' },
                            textAlign: 'center',
                          }}
                          onClick={() => setSignUpForm(prev => ({ ...prev, userType: 'normal' }))}
                        >
                          <Typography variant="h4" sx={{ mb: 1 }}>🐾</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            Pet Owner
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Share your pets' moments
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6}>
                        <Paper
                          sx={{
                            p: 2,
                            cursor: 'pointer',
                            border: signUpForm.userType === 'professional' ? 2 : 1,
                            borderColor: signUpForm.userType === 'professional' ? 'primary.main' : 'divider',
                            '&:hover': { borderColor: 'primary.main' },
                            textAlign: 'center',
                          }}
                          onClick={() => setSignUpForm(prev => ({ ...prev, userType: 'professional' }))}
                        >
                          <Typography variant="h4" sx={{ mb: 1 }}>💼</Typography>
                          <Typography variant="body2" fontWeight={600}>
                            Professional
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Vet, shop, services
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Business Category for Professional Users */}
                  {signUpForm.userType === 'professional' && (
                    <TextField
                      fullWidth
                      label="Business Category"
                      select
                      SelectProps={{ native: true }}
                      value={signUpForm.businessCategory}
                      onChange={(e) => setSignUpForm(prev => ({ ...prev, businessCategory: e.target.value }))}
                      required
                      sx={{ mb: 2 }}
                    >
                      <option value="">Select Category</option>
                      <option value="vet">Veterinarian</option>
                      <option value="pet_shop">Pet Shop</option>
                      <option value="groomer">Groomer</option>
                      <option value="trainer">Trainer</option>
                      <option value="daycare">Daycare</option>
                      <option value="photographer">Photographer</option>
                      <option value="event_organizer">Event Organizer</option>
                      <option value="other">Other</option>
                    </TextField>
                  )}

                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={signUpForm.password}
                    onChange={(e) => setSignUpForm(prev => ({ ...prev, password: e.target.value }))}
                    required
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type="password"
                    value={signUpForm.confirmPassword}
                    onChange={(e) => setSignUpForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                    sx={{ mb: 3 }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{ py: 1.5 }}
                  >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                  </Button>
                </motion.form>
              </TabPanel>
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default Auth;