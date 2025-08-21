import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Email, Verified } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const email = searchParams.get('email') || '';

  useEffect(() => {
    if (!email) {
      navigate('/auth');
    }
  }, [email, navigate]);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'signup',
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        setSuccess(true);
        
        // Check if user has pets
        setTimeout(async () => {
          try {
            const { data: pets } = await supabase
              .from('pets')
              .select('id')
              .eq('owner_id', data.user.id);

            if (!pets || pets.length === 0) {
              // Check user type to determine where to redirect
              const { data: profile } = await supabase
                .from('users')
                .select('user_type')
                .eq('id', data.user.id)
                .single();

              if (profile?.user_type === 'normal') {
                navigate('/setup-pets');
              } else {
                navigate('/');
              }
            } else {
              navigate('/');
            }
          } catch (error) {
            console.error('Error checking user pets:', error);
            navigate('/');
          }
        }, 1500);
      }
    } catch (error: any) {
      setError(error.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        throw error;
      }

      setError(null);
      // You could show a success message here
    } catch (error: any) {
      setError(error.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  if (success) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          p: 2,
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card sx={{ maxWidth: 400, textAlign: 'center' }}>
            <CardContent sx={{ p: 4 }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <Verified sx={{ fontSize: '4rem', color: 'success.main', mb: 2 }} />
              </motion.div>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                Email Verified!
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Welcome to PawPrint! Setting up your account...
              </Typography>
              <CircularProgress size={24} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card sx={{ maxWidth: 450, width: '100%' }}>
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Email sx={{ fontSize: '3rem', color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
                Verify Your Email
              </Typography>
              <Typography variant="body1" color="text.secondary">
                We've sent a 6-digit code to
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {email}
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* OTP Form */}
            <form onSubmit={handleVerifyOtp}>
              <TextField
                fullWidth
                label="Enter 6-digit code"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                  setOtp(value);
                }}
                inputProps={{
                  style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' },
                  maxLength: 6,
                }}
                placeholder="000000"
                sx={{ mb: 3 }}
                required
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading || otp.length !== 6}
                sx={{ py: 1.5, mb: 2 }}
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </Button>
            </form>

            {/* Resend */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Didn't receive the code?
              </Typography>
              <Button
                variant="text"
                onClick={handleResendOtp}
                disabled={resendLoading}
                size="small"
              >
                {resendLoading ? 'Sending...' : 'Resend Code'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default VerifyEmail;