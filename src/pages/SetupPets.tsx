import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Avatar,
  MenuItem,
  
  Stepper,
  Step,
  StepLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  Chip,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { Pets, PhotoCamera, Save } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface PetForm {
  name: string;
  pet_type: string;
  breed: string;
  gender: 'male' | 'female' | 'unknown';
  birth_date: string;
  weight: string;
  color: string;
  bio: string;
  profile_image_url: string;
}

const petTypes = [
  { value: 'dog', label: 'Dog', emoji: '🐕' },
  { value: 'cat', label: 'Cat', emoji: '🐱' },
  { value: 'bird', label: 'Bird', emoji: '🐦' },
  { value: 'fish', label: 'Fish', emoji: '🐠' },
  { value: 'rabbit', label: 'Rabbit', emoji: '🐰' },
  { value: 'hamster', label: 'Hamster', emoji: '🐹' },
  { value: 'reptile', label: 'Reptile', emoji: '🦎' },
  { value: 'other', label: 'Other', emoji: '🐾' },
];

const SetupPets: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeStep, setActiveStep] = useState(0);
  const [pets, setPets] = useState<PetForm[]>([]);
  const [currentPet, setCurrentPet] = useState<PetForm>({
    name: '',
    pet_type: '',
    breed: '',
    gender: 'unknown',
    birth_date: '',
    weight: '',
    color: '',
    bio: '',
    profile_image_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps = ['Pet Type', 'Basic Info', 'Details', 'Review'];

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const addPet = () => {
    setPets([...pets, currentPet]);
    setCurrentPet({
      name: '',
      pet_type: '',
      breed: '',
      gender: 'unknown',
      birth_date: '',
      weight: '',
      color: '',
      bio: '',
      profile_image_url: '',
    });
    setActiveStep(0);
  };

  const removePet = (index: number) => {
    setPets(pets.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (pets.length === 0) {
      setError('Please add at least one pet to continue');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      for (const pet of pets) {
        const { error } = await supabase
          .from('pets')
          .insert({
            owner_id: user?.id,
            name: pet.name,
            pet_type: pet.pet_type as any,
            breed: pet.breed || null,
            gender: pet.gender,
            birth_date: pet.birth_date || null,
            weight: pet.weight ? parseFloat(pet.weight) : null,
            color: pet.color || null,
            bio: pet.bio || null,
            profile_image_url: pet.profile_image_url || null,
          });

        if (error) {
          throw error;
        }
      }

      navigate('/');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            {petTypes.map((type) => (
              <Grid item xs={6} sm={4} md={3} key={type.value}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    border: currentPet.pet_type === type.value ? 2 : 1,
                    borderColor: currentPet.pet_type === type.value ? 'primary.main' : 'divider',
                    '&:hover': { borderColor: 'primary.main' },
                  }}
                  onClick={() => setCurrentPet({ ...currentPet, pet_type: type.value })}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="h3" sx={{ mb: 1 }}>
                      {type.emoji}
                    </Typography>
                    <Typography variant="body2">{type.label}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        );

      case 1:
        return (
          <Box sx={{ maxWidth: 400, mx: 'auto' }}>
            <TextField
              fullWidth
              label="Pet Name"
              value={currentPet.name}
              onChange={(e) => setCurrentPet({ ...currentPet, name: e.target.value })}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Breed (Optional)"
              value={currentPet.breed}
              onChange={(e) => setCurrentPet({ ...currentPet, breed: e.target.value })}
              sx={{ mb: 2 }}
            />
            <FormControl sx={{ mb: 2 }}>
              <FormLabel>Gender</FormLabel>
              <RadioGroup
                value={currentPet.gender}
                onChange={(e) => setCurrentPet({ ...currentPet, gender: e.target.value as any })}
                row
              >
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="female" control={<Radio />} label="Female" />
                <FormControlLabel value="unknown" control={<Radio />} label="Unknown" />
              </RadioGroup>
            </FormControl>
          </Box>
        );

      case 2:
        return (
          <Box sx={{ maxWidth: 400, mx: 'auto' }}>
            <TextField
              fullWidth
              label="Birth Date"
              type="date"
              value={currentPet.birth_date}
              onChange={(e) => setCurrentPet({ ...currentPet, birth_date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Weight (kg)"
              type="number"
              value={currentPet.weight}
              onChange={(e) => setCurrentPet({ ...currentPet, weight: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Color"
              value={currentPet.color}
              onChange={(e) => setCurrentPet({ ...currentPet, color: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Bio"
              multiline
              rows={3}
              value={currentPet.bio}
              onChange={(e) => setCurrentPet({ ...currentPet, bio: e.target.value })}
              placeholder="Tell us about your pet..."
            />
          </Box>
        );

      case 3:
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Card sx={{ maxWidth: 300, mx: 'auto', mb: 3 }}>
              <CardContent>
                <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: 'primary.main' }}>
                  {currentPet.name.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h6">{currentPet.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {petTypes.find(t => t.value === currentPet.pet_type)?.label} • {currentPet.breed}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {currentPet.bio}
                </Typography>
              </CardContent>
            </Card>
            <Button
              variant="contained"
              onClick={addPet}
              disabled={!currentPet.name || !currentPet.pet_type}
              sx={{ mr: 2 }}
            >
              Add Pet
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: 4,
        px: 2,
      }}
    >
      <Box sx={{ maxWidth: 800, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Pets sx={{ fontSize: '3rem', color: 'primary.main', mb: 1 }} />
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
            Setup Your Pets
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Add your beloved pets to start sharing their amazing moments
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Added Pets */}
        {pets.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Your Pets ({pets.length})
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {pets.map((pet, index) => (
                <Chip
                  key={index}
                  label={pet.name}
                  onDelete={() => removePet(index)}
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Stepper */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent(activeStep)}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
                variant="outlined"
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={
                  (activeStep === 0 && !currentPet.pet_type) ||
                  (activeStep === 1 && !currentPet.name) ||
                  (activeStep === 3)
                }
                variant="contained"
              >
                {activeStep === steps.length - 1 ? 'Add Pet' : 'Next'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Final Actions */}
        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={pets.length === 0 || loading}
            startIcon={<Save />}
            sx={{ minWidth: 200 }}
          >
            {loading ? 'Setting up...' : 'Complete Setup'}
          </Button>
          {pets.length > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              You can always add more pets later
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default SetupPets;