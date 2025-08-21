import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Chip,
  Avatar,
  
  IconButton,
  Fab,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Add,
  Vaccines,
  Event,
  Pets,
  Warning,
  CheckCircle,
  Edit,
  Delete,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { format, isAfter, addDays } from 'date-fns';

interface Vaccination {
  id: string;
  pet_id: string;
  vaccine_name: string;
  vaccine_type: string;
  administered_date: string;
  next_due_date?: string;
  notes?: string;
  batch_number?: string;
  vet_id?: string;
}

const commonVaccines = [
  'DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza)',
  'Rabies',
  'Bordetella',
  'Lyme Disease',
  'Canine Influenza',
  'FVRCP (Feline Distemper)',
  'FeLV (Feline Leukemia)',
  'FIV (Feline Immunodeficiency Virus)',
];

const Vaccinations: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { userPets } = useSelector((state: RootState) => state.pets);
  
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPet, setSelectedPet] = useState('');
  const [formData, setFormData] = useState({
    vaccine_name: '',
    vaccine_type: '',
    administered_date: '',
    next_due_date: '',
    notes: '',
    batch_number: '',
  });

  useEffect(() => {
    if (user) {
      loadVaccinations();
    }
  }, [user]);

  const loadVaccinations = async () => {
    try {
      const { data, error } = await supabase
        .from('vaccinations')
        .select(`
          *,
          pets!inner(name, pet_type, profile_image_url, owner_id)
        `)
        .eq('pets.owner_id', user?.id)
        .order('administered_date', { ascending: false });

      if (error) throw error;
      setVaccinations(data || []);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPet || !formData.vaccine_name || !formData.administered_date) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('vaccinations')
        .insert({
          pet_id: selectedPet,
          vaccine_name: formData.vaccine_name,
          vaccine_type: formData.vaccine_type || formData.vaccine_name,
          administered_date: formData.administered_date,
          next_due_date: formData.next_due_date || null,
          notes: formData.notes || null,
          batch_number: formData.batch_number || null,
        });

      if (error) throw error;

      setOpen(false);
      resetForm();
      loadVaccinations();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedPet('');
    setFormData({
      vaccine_name: '',
      vaccine_type: '',
      administered_date: '',
      next_due_date: '',
      notes: '',
      batch_number: '',
    });
  };

  const getVaccinationStatus = (vaccination: Vaccination) => {
    if (!vaccination.next_due_date) return 'completed';
    
    const dueDate = new Date(vaccination.next_due_date);
    const today = new Date();
    const warningDate = addDays(today, 30); // 30 days warning

    if (isAfter(today, dueDate)) return 'overdue';
    if (isAfter(warningDate, dueDate)) return 'due-soon';
    return 'up-to-date';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'overdue': return 'error';
      case 'due-soon': return 'warning';
      case 'up-to-date': return 'success';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'overdue': return <Warning />;
      case 'due-soon': return <Event />;
      case 'up-to-date': return <CheckCircle />;
      default: return <Vaccines />;
    }
  };

  const groupedVaccinations = userPets.reduce((acc, pet) => {
    acc[pet.id] = {
      pet,
      vaccinations: vaccinations.filter(v => v.pet_id === pet.id),
    };
    return acc;
  }, {} as Record<string, { pet: any; vaccinations: Vaccination[] }>);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Vaccines /> Vaccination Records
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Keep track of your pets' vaccination schedules
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Pets and their vaccinations */}
      <Grid container spacing={3}>
        {Object.values(groupedVaccinations).map(({ pet, vaccinations: petVaccinations }) => (
          <Grid item xs={12} key={pet.id}>
            <Card>
              <CardContent>
                {/* Pet Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar 
                    src={pet.profile_image_url} 
                    sx={{ mr: 2, width: 48, height: 48 }}
                  >
                    {pet.name.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6">{pet.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {pet.pet_type} • {petVaccinations.length} vaccination records
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Add />}
                    onClick={() => {
                      setSelectedPet(pet.id);
                      setOpen(true);
                    }}
                  >
                    Add Vaccination
                  </Button>
                </Box>

                {/* Vaccinations */}
                {petVaccinations.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Vaccines sx={{ fontSize: '3rem', color: 'text.disabled', mb: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      No vaccination records yet
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Add />}
                      sx={{ mt: 2 }}
                      onClick={() => {
                        setSelectedPet(pet.id);
                        setOpen(true);
                      }}
                    >
                      Add First Vaccination
                    </Button>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {petVaccinations.map((vaccination) => {
                      const status = getVaccinationStatus(vaccination);
                      return (
                        <Grid item xs={12} sm={6} md={4} key={vaccination.id}>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Card variant="outlined" sx={{ height: '100%' }}>
                              <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                  <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                      {vaccination.vaccine_name}
                                    </Typography>
                                    <Chip
                                      size="small"
                                      label={status.replace('-', ' ').toUpperCase()}
                                      color={getStatusColor(status) as any}
                                      icon={getStatusIcon(status)}
                                    />
                                  </Box>
                                  <IconButton size="small">
                                    <Edit />
                                  </IconButton>
                                </Box>

                                <Box sx={{ mb: 2 }}>
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                    Administered: {format(new Date(vaccination.administered_date), 'MMM dd, yyyy')}
                                  </Typography>
                                  {vaccination.next_due_date && (
                                    <Typography variant="body2" color="text.secondary">
                                      Next due: {format(new Date(vaccination.next_due_date), 'MMM dd, yyyy')}
                                    </Typography>
                                  )}
                                </Box>

                                {vaccination.notes && (
                                  <Typography variant="body2" sx={{ mb: 1 }}>
                                    {vaccination.notes}
                                  </Typography>
                                )}

                                {vaccination.batch_number && (
                                  <Typography variant="caption" color="text.secondary">
                                    Batch: {vaccination.batch_number}
                                  </Typography>
                                )}
                              </CardContent>
                            </Card>
                          </motion.div>
                        </Grid>
                      );
                    })}
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Empty state for no pets */}
      {userPets.length === 0 && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Pets sx={{ fontSize: '4rem', color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              No pets found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add your pets first to start tracking their vaccinations
            </Typography>
            <Button variant="contained" href="/setup-pets">
              Add Pets
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Floating Action Button */}
      {userPets.length > 0 && (
        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => setOpen(true)}
        >
          <Add />
        </Fab>
      )}

      {/* Add Vaccination Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add Vaccination Record</DialogTitle>
          <DialogContent>
            <TextField
              select
              fullWidth
              label="Pet"
              value={selectedPet}
              onChange={(e) => setSelectedPet(e.target.value)}
              required
              sx={{ mb: 2 }}
            >
              {userPets.map((pet) => (
                <MenuItem key={pet.id} value={pet.id}>
                  {pet.name} ({pet.pet_type})
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              fullWidth
              label="Vaccine"
              value={formData.vaccine_name}
              onChange={(e) => setFormData({ ...formData, vaccine_name: e.target.value })}
              required
              sx={{ mb: 2 }}
            >
              {commonVaccines.map((vaccine) => (
                <MenuItem key={vaccine} value={vaccine}>
                  {vaccine}
                </MenuItem>
              ))}
              <MenuItem value="custom">Custom Vaccine</MenuItem>
            </TextField>

            {formData.vaccine_name === 'custom' && (
              <TextField
                fullWidth
                label="Custom Vaccine Name"
                value={formData.vaccine_type}
                onChange={(e) => setFormData({ ...formData, vaccine_type: e.target.value })}
                required
                sx={{ mb: 2 }}
              />
            )}

            <TextField
              fullWidth
              label="Date Administered"
              type="date"
              value={formData.administered_date}
              onChange={(e) => setFormData({ ...formData, administered_date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              required
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Next Due Date (Optional)"
              type="date"
              value={formData.next_due_date}
              onChange={(e) => setFormData({ ...formData, next_due_date: e.target.value })}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Batch Number (Optional)"
              value={formData.batch_number}
              onChange={(e) => setFormData({ ...formData, batch_number: e.target.value })}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Notes (Optional)"
              multiline
              rows={2}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional notes about this vaccination..."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Adding...' : 'Add Vaccination'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Vaccinations;