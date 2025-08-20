-- Pet Social Platform Database Schema
-- Create enums for user and pet types
CREATE TYPE user_type AS ENUM ('normal', 'professional');
CREATE TYPE pet_type AS ENUM ('dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster', 'reptile', 'other');
CREATE TYPE gender AS ENUM ('male', 'female', 'unknown');
CREATE TYPE post_type AS ENUM ('post', 'story');
CREATE TYPE business_category AS ENUM ('vet', 'pet_shop', 'groomer', 'trainer', 'daycare', 'photographer', 'event_organizer', 'other');

-- Users table (extends auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(30) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  bio TEXT,
  profile_image_url TEXT,
  user_type user_type NOT NULL DEFAULT 'normal',
  business_category business_category,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  address TEXT,
  phone VARCHAR(20),
  website_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_private BOOLEAN DEFAULT FALSE,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Pet profiles (sub-accounts for normal users)
CREATE TABLE public.pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  pet_type pet_type NOT NULL,
  breed VARCHAR(100),
  gender gender DEFAULT 'unknown',
  birth_date DATE,
  weight DECIMAL(5, 2),
  color VARCHAR(50),
  bio TEXT,
  profile_image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  followers_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Posts table (for both users and pets)
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE,
  content TEXT,
  image_urls TEXT[] DEFAULT '{}',
  video_url TEXT,
  post_type post_type NOT NULL DEFAULT 'post',
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  location_name TEXT,
  is_sponsored BOOLEAN DEFAULT FALSE,
  sponsor_budget DECIMAL(10, 2),
  target_pet_types pet_type[],
  target_breeds TEXT[],
  target_radius_km INTEGER DEFAULT 10,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  is_archived BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMPTZ, -- For stories
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Vaccination records
CREATE TABLE public.vaccinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
  vet_id UUID REFERENCES public.users(id), -- Professional vet user
  vaccine_name VARCHAR(100) NOT NULL,
  vaccine_type VARCHAR(50), -- e.g., 'rabies', 'distemper', etc.
  administered_date DATE NOT NULL,
  next_due_date DATE,
  batch_number VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Follows table (users following users/pets)
CREATE TABLE public.follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  following_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  following_pet_id UUID REFERENCES public.pets(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT follows_target_check CHECK (
    (following_user_id IS NOT NULL AND following_pet_id IS NULL) OR 
    (following_user_id IS NULL AND following_pet_id IS NOT NULL)
  ),
  UNIQUE(follower_id, following_user_id, following_pet_id)
);

-- Likes table
CREATE TABLE public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- Comments table
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view all public profiles" ON public.users
  FOR SELECT USING (
    NOT is_private OR 
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM public.follows 
      WHERE follower_id = auth.uid() AND following_user_id = id
    )
  );

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for pets
CREATE POLICY "Anyone can view active pets" ON public.pets
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Pet owners can manage their pets" ON public.pets
  FOR ALL USING (auth.uid() = owner_id);

-- RLS Policies for posts
CREATE POLICY "Anyone can view non-archived posts" ON public.posts
  FOR SELECT USING (
    NOT is_archived AND 
    (post_type = 'post' OR expires_at > now())
  );

CREATE POLICY "Users can create posts" ON public.posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" ON public.posts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" ON public.posts
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for vaccinations
CREATE POLICY "Pet owners can view their pets' vaccinations" ON public.vaccinations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.pets 
      WHERE pets.id = pet_id AND pets.owner_id = auth.uid()
    )
  );

CREATE POLICY "Pet owners and vets can manage vaccinations" ON public.vaccinations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.pets 
      WHERE pets.id = pet_id AND pets.owner_id = auth.uid()
    ) OR
    auth.uid() = vet_id
  );

-- RLS Policies for follows
CREATE POLICY "Users can view all follows" ON public.follows
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can manage their own follows" ON public.follows
  FOR ALL USING (auth.uid() = follower_id);

-- RLS Policies for likes
CREATE POLICY "Users can view all likes" ON public.likes
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can manage their own likes" ON public.likes
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for comments
CREATE POLICY "Users can view all comments" ON public.comments
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can create comments" ON public.comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON public.comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON public.comments
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_users_user_type ON public.users(user_type);
CREATE INDEX idx_users_location ON public.users(location_lat, location_lng);
CREATE INDEX idx_pets_owner_id ON public.pets(owner_id);
CREATE INDEX idx_pets_pet_type ON public.pets(pet_type);
CREATE INDEX idx_posts_user_id ON public.posts(user_id);
CREATE INDEX idx_posts_pet_id ON public.posts(pet_id);
CREATE INDEX idx_posts_created_at ON public.posts(created_at DESC);
CREATE INDEX idx_posts_sponsored ON public.posts(is_sponsored, created_at DESC) WHERE is_sponsored = TRUE;
CREATE INDEX idx_vaccinations_pet_id ON public.vaccinations(pet_id);
CREATE INDEX idx_vaccinations_next_due ON public.vaccinations(next_due_date) WHERE next_due_date IS NOT NULL;
CREATE INDEX idx_follows_follower ON public.follows(follower_id);
CREATE INDEX idx_follows_following_user ON public.follows(following_user_id);
CREATE INDEX idx_follows_following_pet ON public.follows(following_pet_id);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pets_updated_at
  BEFORE UPDATE ON public.pets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vaccinations_updated_at
  BEFORE UPDATE ON public.vaccinations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();