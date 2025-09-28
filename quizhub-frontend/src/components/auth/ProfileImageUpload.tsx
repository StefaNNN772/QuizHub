import React from 'react';
import { Avatar, IconButton, Grid, Typography } from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { FormikProps } from 'formik';

// Tip forme
export interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  profileImage: File | null;
}

interface ProfileImageUploadProps {
  formik: FormikProps<RegisterFormValues>;
  selectedImage: string | null;
  setSelectedImage: (img: string | null) => void;
  setError: (err: string | null) => void;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  formik,
  selectedImage,
  setSelectedImage,
  setError
}) => {

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Limit 4MB
      if (file.size > 1024 * 1024 * 4) {
        setError('Image size should not exceed 4MB');
        return;
      }
      if (!file.type.match('image.*')) {
        setError('Please select an image file');
        return;
      }

      formik.setFieldValue('profileImage', file);

      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target?.result as string);
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item>
        <div style={{ position: 'relative' }}>
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
        </div>
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
  );
};

export default ProfileImageUpload;
