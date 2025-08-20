import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Pet {
  id: string;
  owner_id: string;
  name: string;
  pet_type: 'dog' | 'cat' | 'bird' | 'fish' | 'rabbit' | 'hamster' | 'reptile' | 'other';
  breed?: string;
  gender: 'male' | 'female' | 'unknown';
  birth_date?: string;
  weight?: number;
  color?: string;
  bio?: string;
  profile_image_url?: string;
  is_active: boolean;
  followers_count: number;
  posts_count: number;
  created_at: string;
}

export interface Vaccination {
  id: string;
  pet_id: string;
  vaccine_name: string;
  vaccine_type: string;
  administered_date: string;
  next_due_date?: string;
  notes?: string;
}

interface PetState {
  userPets: Pet[];
  currentPet: Pet | null;
  vaccinations: Vaccination[];
  isLoading: boolean;
}

const initialState: PetState = {
  userPets: [],
  currentPet: null,
  vaccinations: [],
  isLoading: false,
};

const petSlice = createSlice({
  name: 'pets',
  initialState,
  reducers: {
    setUserPets: (state, action: PayloadAction<Pet[]>) => {
      state.userPets = action.payload;
    },
    setCurrentPet: (state, action: PayloadAction<Pet | null>) => {
      state.currentPet = action.payload;
    },
    addPet: (state, action: PayloadAction<Pet>) => {
      state.userPets.push(action.payload);
    },
    updatePet: (state, action: PayloadAction<Pet>) => {
      const index = state.userPets.findIndex(pet => pet.id === action.payload.id);
      if (index !== -1) {
        state.userPets[index] = action.payload;
      }
      if (state.currentPet?.id === action.payload.id) {
        state.currentPet = action.payload;
      }
    },
    setVaccinations: (state, action: PayloadAction<Vaccination[]>) => {
      state.vaccinations = action.payload;
    },
    addVaccination: (state, action: PayloadAction<Vaccination>) => {
      state.vaccinations.push(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { 
  setUserPets, 
  setCurrentPet, 
  addPet, 
  updatePet, 
  setVaccinations, 
  addVaccination, 
  setLoading 
} = petSlice.actions;
export default petSlice.reducer;