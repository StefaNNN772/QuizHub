import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  Chip,
  Stack,
  Autocomplete,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createQuiz, getQuizById, updateQuiz } from '../../api/quizService';
import { DifficultyEnum } from '../../types/models';

// Common topics for suggestions
const commonTopics = [
  'Programming', 'IT', 'Mathematics', 'Science', 'History', 
  'Geography', 'Art', 'Music', 'Sports', 'Movies', 'Literature',
  'Technology', 'Web Development', 'Data Science', 'AI', 'Mobile Development',
  'C#', 'Java', 'Python', 'JavaScript', 'React', 'Angular'
];

const AdminQuizForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topics, setTopics] = useState<string[]>([]);
  const [newTopic, setNewTopic] = useState('');

  const isEditMode = !!id;

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      time: 10,
      difficulty: DifficultyEnum.Medium,
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required').max(100, 'Title must be 100 characters or less'),
      description: Yup.string().required('Description is required'),
      time: Yup.number()
        .required('Time limit is required')
        .min(1, 'Time must be at least 1 minute')
        .max(120, 'Time cannot exceed 120 minutes'),
      difficulty: Yup.string().required('Difficulty is required'),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);
        
        // Include topics in the quiz data
        const quizData = {
          ...values,
          topics: topics.length > 0 ? topics : undefined, // Only include if we have topics
        };
        
        if (isEditMode) {
          await updateQuiz(parseInt(id!), quizData);
        } else {
          await createQuiz(quizData);
        }
        
        navigate('/admin/quizzes');
      } catch (err: any) {
        console.error('Error saving quiz:', err);
        setError(err.response?.data?.message || 'Failed to save quiz. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchQuiz = async () => {
      if (isEditMode) {
        try {
          setLoading(true);
          const quiz = await getQuizById(parseInt(id!));
          formik.setValues({
            title: quiz.title,
            description: quiz.description,
            time: quiz.time,
            difficulty: quiz.difficulty,
          });
          // Set topics from fetched quiz
          setTopics(quiz.topics || []);
        } catch (err: any) {
          console.error('Error fetching quiz:', err);
          setError(err.response?.data?.message || 'Failed to load quiz. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchQuiz();
  }, [id]);

  const handleAddTopic = () => {
    if (newTopic.trim() && !topics.includes(newTopic.trim())) {
      const updatedTopics = [...topics, newTopic.trim()];
      setTopics(updatedTopics);
      setNewTopic('');
    }
  };

  const handleRemoveTopic = (topicToRemove: string) => {
    const updatedTopics = topics.filter(topic => topic !== topicToRemove);
    setTopics(updatedTopics);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTopic.trim()) {
      e.preventDefault();
      handleAddTopic();
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {isEditMode ? 'Edit Quiz' : 'Create New Quiz'}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper sx={{ p: 3 }}>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="title"
                name="title"
                label="Quiz Title"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                id="description"
                name="description"
                label="Description"
                multiline
                rows={4}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="time"
                name="time"
                label="Time Limit (minutes)"
                type="number"
                value={formik.values.time}
                onChange={formik.handleChange}
                error={formik.touched.time && Boolean(formik.errors.time)}
                helperText={formik.touched.time && formik.errors.time}
                InputProps={{ inputProps: { min: 1, max: 120 } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="difficulty-label">Difficulty</InputLabel>
                <Select
                  labelId="difficulty-label"
                  id="difficulty"
                  name="difficulty"
                  value={formik.values.difficulty}
                  label="Difficulty"
                  onChange={formik.handleChange}
                >
                  {Object.values(DifficultyEnum).map((difficulty) => (
                    <MenuItem key={difficulty} value={difficulty}>
                      {difficulty}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Topics
              </Typography>
              <Autocomplete
                freeSolo
                options={commonTopics.filter(topic => !topics.includes(topic))}
                value={newTopic}
                onChange={(_, value) => setNewTopic(value || '')}
                onInputChange={(_, value) => setNewTopic(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Add Topics"
                    variant="outlined"
                    helperText="Press Enter or click Add to add a topic"
                    onKeyDown={handleKeyDown}
                  />
                )}
              />
              <Box sx={{ mt: 1, mb: 2 }}>
                <Button 
                  variant="outlined" 
                  onClick={handleAddTopic} 
                  disabled={!newTopic.trim()}
                  size="small"
                >
                  Add
                </Button>
              </Box>

              <Box sx={{ mt: 2 }}>
                {topics.length > 0 ? (
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {topics.map((topic) => (
                      <Chip
                        key={topic}
                        label={topic}
                        onDelete={() => handleRemoveTopic(topic)}
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No topics added yet
                  </Typography>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/admin/quizzes')}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : isEditMode ? 'Update Quiz' : 'Create Quiz'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AdminQuizForm;