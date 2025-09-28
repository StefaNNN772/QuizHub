import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

interface ScoreCircleProps {
  percentage: number;
}

const ScoreCircle: React.FC<ScoreCircleProps> = ({ percentage }) => (
  <Box sx={{ textAlign: 'center' }}>
    <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
      <CircularProgress 
        variant="determinate" 
        value={percentage} 
        size={120}
        thickness={5}
        color={percentage >= 70 ? 'success' : percentage >= 50 ? 'warning' : 'error'}
      />
      <Box sx={{ position: 'absolute', top:0, left:0, bottom:0, right:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <Typography variant="h5" component="div" color="text.secondary">
          {Math.round(percentage)}%
        </Typography>
      </Box>
    </Box>
    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Your Score</Typography>
  </Box>
);

export default ScoreCircle;
