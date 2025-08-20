import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Post {
  id: string;
  user_id: string;
  pet_id?: string;
  content?: string;
  image_urls: string[];
  video_url?: string;
  post_type: 'post' | 'story';
  location_name?: string;
  is_sponsored: boolean;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  views_count: number;
  created_at: string;
  // Joined data
  user?: {
    username: string;
    profile_image_url?: string;
    is_verified: boolean;
  };
  pet?: {
    name: string;
    profile_image_url?: string;
    pet_type: string;
  };
}

interface FeedState {
  posts: Post[];
  stories: Post[];
  isLoading: boolean;
  hasMorePosts: boolean;
  lastPostId?: string;
}

const initialState: FeedState = {
  posts: [],
  stories: [],
  isLoading: false,
  hasMorePosts: true,
  lastPostId: undefined,
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
    },
    addPosts: (state, action: PayloadAction<Post[]>) => {
      state.posts = [...state.posts, ...action.payload];
      state.hasMorePosts = action.payload.length > 0;
      if (action.payload.length > 0) {
        state.lastPostId = action.payload[action.payload.length - 1].id;
      }
    },
    setStories: (state, action: PayloadAction<Post[]>) => {
      state.stories = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updatePostLikes: (state, action: PayloadAction<{ postId: string; likes_count: number }>) => {
      const post = state.posts.find(p => p.id === action.payload.postId);
      if (post) {
        post.likes_count = action.payload.likes_count;
      }
    },
    addNewPost: (state, action: PayloadAction<Post>) => {
      state.posts.unshift(action.payload);
    },
  },
});

export const { 
  setPosts, 
  addPosts, 
  setStories, 
  setLoading, 
  updatePostLikes, 
  addNewPost 
} = feedSlice.actions;
export default feedSlice.reducer;