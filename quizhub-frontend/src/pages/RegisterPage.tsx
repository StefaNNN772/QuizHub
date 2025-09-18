import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  Box, 
  Alert, 
  Avatar,
  IconButton,
  Grid
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { register } from '../api/authService';
import { useAuth } from '../context/AuthContext';

const RegisterPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      profileImage: null as File | null,
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must be 20 characters or less')
        .required('Username is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm Password is required'),
      profileImage: Yup.mixed()
        .required('Profile image is required')
    }),
    onSubmit: async (values) => {
      try {
        setError(null);
        
        if (!values.profileImage || !selectedImage) {
          setError('Please select a profile image');
          return;
        }
        
        // Extract base64 data from the preview URL (remove the data:image/xxx;base64, part)
        const base64Image = selectedImage.split(',')[1];
        
        const response = await register(
          values.username, 
          values.email, 
          values.password,
          base64Image // Send base64 image data to backend
        );
        
        authLogin(response.token, response.user);
        navigate('/dashboard');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (limit to 1MB)
      if (file.size > 1024 * 1024 * 4) {
        setError('Image size should not exceed 1MB');
        return;
      }
      
      // Check file type
      if (!file.type.match('image.*')) {
        setError('Please select an image file');
        return;
      }
      
      // Set the file in formik state
      formik.setFieldValue('profileImage', file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear any previous errors
      setError(null);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        mt: 8,
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 500, width: '100%' }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Create a QuizHub Account
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <TextField
            margin="normal"
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
          />
          
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Profile Image
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Box sx={{ position: 'relative' }}>
                  <Avatar 
                    src={selectedImage || ''}
                    alt="Profile Preview"
                    sx={{ width: 80, height: 80 }}
                  />
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="profile-image-upload"
                    type="file"
                    onChange={handleImageChange}
                  />
                  <label htmlFor="profile-image-upload">
                    <IconButton 
                      color="primary" 
                      aria-label="upload picture" 
                      component="span"
                      sx={{ 
                        position: 'absolute', 
                        bottom: -8, 
                        right: -8, 
                        backgroundColor: 'white',
                        '&:hover': { backgroundColor: '#f5f5f5' }
                      }}
                    >
                      <PhotoCamera />
                    </IconButton>
                  </label>
                </Box>
              </Grid>
              <Grid item xs>
                <Typography variant="body2" color="text.secondary">
                  Click the camera icon to upload your profile image. Maximum size: 4MB.
                  {formik.touched.profileImage && formik.errors.profileImage && (
                    <Typography color="error" variant="caption" display="block">
                      {formik.errors.profileImage as string}
                    </Typography>
                  )}
                </Typography>
              </Grid>
            </Grid>
          </Box>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Registering...' : 'Register'}
          </Button>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <RouterLink to="/login">Login here</RouterLink>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterPage;