import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  CircularProgress,
  Alert,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ListIcon from '@mui/icons-material/List';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { getQuizzes, deleteQuiz } from '../../api/quizService';
import { Quiz, DifficultyEnum } from '../../types/models';

const AdminQuizzes: React.FC = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getQuizzes();
      setQuizzes(data);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
      setError('Failed to load quizzes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDeleteDialog = (quiz: Quiz) => {
    setQuizToDelete(quiz);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setQuizToDelete(null);
    setIsDeleting(false);
  };

  const handleDeleteQuiz = async () => {
    if (!quizToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteQuiz(quizToDelete.id);
      setQuizzes(quizzes.filter(quiz => quiz.id !== quizToDelete.id));
      handleCloseDeleteDialog();
    } catch (err) {
      console.error('Error deleting quiz:', err);
      setError('Failed to delete quiz. Please try again.');
      setIsDeleting(false);
    }
  };

  const handleEditQuiz = (quizId: number) => {
    navigate(`/admin/quizzes/${quizId}/edit`);
  };

  const handleManageQuestions = (quizId: number) => {
    navigate(`/admin/quizzes/${quizId}/questions`);
  };

  const filteredQuizzes = quizzes.filter(quiz => 
    quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyColor = (difficulty: DifficultyEnum) => {
    switch (difficulty) {
      case DifficultyEnum.Easy: return 'success';
      case DifficultyEnum.Medium: return 'warning';
      case DifficultyEnum.Hard: return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Manage Quizzes
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          component={RouterLink}
          to="/admin/quizzes/new"
        >
          New Quiz
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Search Quizzes"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredQuizzes.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Difficulty</TableCell>
                <TableCell>Time (min)</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredQuizzes.map((quiz) => (
                <TableRow key={quiz.id}>
                  <TableCell>{quiz.title}</TableCell>
                  <TableCell>{quiz.description.length > 50 ? `${quiz.description.substring(0, 50)}...` : quiz.description}</TableCell>
                  <TableCell>
                    <Chip 
                      label={quiz.difficulty} 
                      color={getDifficultyColor(quiz.difficulty) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {quiz.topics && quiz.topics.length > 0 ? (
                      quiz.topics.map((topic, index) => (
                        <Chip 
                          key={index} 
                          label={topic} 
                          size="small" 
                          sx={{ mr: 0.5, mb: 0.5 }} 
                          variant="outlined"
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No topics
                      </Typography>
                    )}
                  </Box>
                  </TableCell>
                  <TableCell>{quiz.time}</TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Tooltip title="Edit Quiz">
                        <IconButton onClick={() => handleEditQuiz(quiz.id)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Manage Questions">
                        <IconButton onClick={() => handleManageQuestions(quiz.id)}>
                          <ListIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Quiz">
                        <IconButton onClick={() => handleOpenDeleteDialog(quiz)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">
            No quizzes found. {searchTerm ? 'Try a different search term.' : 'Create your first quiz!'}
          </Typography>
        </Paper>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the quiz "{quizToDelete?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={isDeleting}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteQuiz} 
            color="error" 
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminQuizzes;