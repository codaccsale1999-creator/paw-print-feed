import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CreatePostState {
  content: string;
  selectedImages: File[];
  selectedPetId?: string;
  location?: string;
  isPosting: boolean;
  postType: 'post' | 'story';
}

const initialState: CreatePostState = {
  content: '',
  selectedImages: [],
  selectedPetId: undefined,
  location: undefined,
  isPosting: false,
  postType: 'post',
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setContent: (state, action: PayloadAction<string>) => {
      state.content = action.payload;
    },
    setSelectedImages: (state, action: PayloadAction<File[]>) => {
      state.selectedImages = action.payload;
    },
    addImage: (state, action: PayloadAction<File>) => {
      state.selectedImages.push(action.payload);
    },
    removeImage: (state, action: PayloadAction<number>) => {
      state.selectedImages.splice(action.payload, 1);
    },
    setSelectedPetId: (state, action: PayloadAction<string | undefined>) => {
      state.selectedPetId = action.payload;
    },
    setLocation: (state, action: PayloadAction<string | undefined>) => {
      state.location = action.payload;
    },
    setPostType: (state, action: PayloadAction<'post' | 'story'>) => {
      state.postType = action.payload;
    },
    setIsPosting: (state, action: PayloadAction<boolean>) => {
      state.isPosting = action.payload;
    },
    resetPost: (state) => {
      state.content = '';
      state.selectedImages = [];
      state.selectedPetId = undefined;
      state.location = undefined;
      state.isPosting = false;
      state.postType = 'post';
    },
  },
});

export const {
  setContent,
  setSelectedImages,
  addImage,
  removeImage,
  setSelectedPetId,
  setLocation,
  setPostType,
  setIsPosting,
  resetPost,
} = postSlice.actions;
export default postSlice.reducer;