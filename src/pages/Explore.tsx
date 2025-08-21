import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Avatar,
  Chip,
  
  IconButton,
  InputAdornment,
  Tabs,
  Tab,
  Button,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  Search,
  FilterList,
  LocationOn,
  Pets,
  Business,
  TrendingUp,
  Favorite,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

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

const Explore: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingPosts, setTrendingPosts] = useState<any[]>([]);
  const [popularPets, setPopularPets] = useState<any[]>([]);
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadExploreData();
  }, []);

  const loadExploreData = async () => {
    setLoading(true);
    try {
      // Load trending posts
      const { data: posts } = await supabase
        .from('posts')
        .select(`
          *,
          users!inner(username, profile_image_url, user_type),
          pets(name, pet_type)
        `)
        .eq('is_archived', false)
        .order('views_count', { ascending: false })
        .limit(10);

      if (posts) {
        setTrendingPosts(posts);
      }

      // Load popular pets
      const { data: pets } = await supabase
        .from('pets')
        .select('*')
        .eq('is_active', true)
        .order('followers_count', { ascending: false })
        .limit(12);

      if (pets) {
        setPopularPets(pets);
      }

      // Load professionals
      const { data: pros } = await supabase
        .from('users')
        .select('*')
        .eq('user_type', 'professional')
        .eq('is_verified', true)
        .order('followers_count', { ascending: false })
        .limit(8);

      if (pros) {
        setProfessionals(pros);
      }
    } catch (error) {
      console.error('Error loading explore data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      // Search posts, users, and pets
      const { data: searchResults } = await supabase
        .from('posts')
        .select(`
          *,
          users!inner(username, profile_image_url),
          pets(name, pet_type)
        `)
        .textSearch('content', searchQuery)
        .limit(20);
      
      // Update results based on search
      if (searchResults) {
        setTrendingPosts(searchResults);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
          Explore
        </Typography>
        
        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search posts, pets, or professionals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton>
                  <FilterList />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        {/* Quick Filters */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label="Trending" icon={<TrendingUp />} onClick={() => {}} />
          <Chip label="Near Me" icon={<LocationOn />} onClick={() => {}} />
          <Chip label="Dogs" onClick={() => {}} />
          <Chip label="Cats" onClick={() => {}} />
          <Chip label="Vets" onClick={() => {}} />
          <Chip label="Pet Shops" onClick={() => {}} />
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Posts" icon={<TrendingUp />} />
          <Tab label="Pets" icon={<Pets />} />
          <Tab label="Professionals" icon={<Business />} />
        </Tabs>
      </Box>

      <AnimatePresence mode="wait">
        {/* Trending Posts */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={2}>
            {trendingPosts.map((post) => (
              <Grid item xs={12} sm={6} md={4} key={post.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar 
                          src={post.users?.profile_image_url} 
                          sx={{ mr: 1, width: 32, height: 32 }}
                        >
                          {post.users?.username?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {post.users?.username}
                          </Typography>
                          {post.pets && (
                            <Typography variant="caption" color="text.secondary">
                              {post.pets.name}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        {post.content}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Favorite fontSize="small" /> {post.likes_count}
                          </Typography>
                          <Typography variant="caption">
                            {post.views_count} views
                          </Typography>
                        </Box>
                        {post.is_sponsored && (
                          <Chip label="Sponsored" size="small" color="primary" />
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Popular Pets */}
        <TabPanel value={activeTab} index={1}>
          <Grid container spacing={3}>
            {popularPets.map((pet) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={pet.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card sx={{ textAlign: 'center', cursor: 'pointer' }}>
                    <CardContent>
                      <Avatar 
                        src={pet.profile_image_url} 
                        sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
                      >
                        {pet.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {pet.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {pet.pet_type} • {pet.breed}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {pet.followers_count} followers
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ mt: 2, display: 'block', mx: 'auto' }}
                      >
                        Follow
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Professionals */}
        <TabPanel value={activeTab} index={2}>
          <Grid container spacing={3}>
            {professionals.map((pro) => (
              <Grid item xs={12} sm={6} md={4} key={pro.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar 
                          src={pro.profile_image_url} 
                          sx={{ mr: 2, width: 48, height: 48 }}
                        >
                          {pro.username.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {pro.username}
                            {pro.is_verified && (
                              <Chip label="Verified" size="small" color="primary" />
                            )}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {pro.business_category}
                          </Typography>
                        </Box>
                      </Box>
                      
                      {pro.bio && (
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {pro.bio}
                        </Typography>
                      )}
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          {pro.followers_count} followers
                        </Typography>
                        <Button size="small" variant="contained">
                          Follow
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </AnimatePresence>
    </Box>
  );
};

export default Explore;