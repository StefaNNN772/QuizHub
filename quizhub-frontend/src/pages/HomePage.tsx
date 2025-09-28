import React from 'react';
import { Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Box>
      <HeroSection isAuthenticated={isAuthenticated} />
      <FeaturesSection isAuthenticated={isAuthenticated} />
    </Box>
  );
};

export default HomePage;
