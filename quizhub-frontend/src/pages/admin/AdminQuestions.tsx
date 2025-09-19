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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getQuizById, 
  getQuestions, 
  getAnswers, 
  createQuestion, 
  updateQuestion, 
  deleteQuestion,
  createAnswer,
  updateAnswer,
  deleteAnswer
} from '../../api/quizService';
import { Quiz, Question, Answer, QuestionType } from '../../types/models';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const AdminQuestions: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answersMap, setAnswersMap] = useState<Map<number, Answer[]>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [answerDialogOpen, setAnswerDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState<Answer | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'question' | 'answer', id: number } | null>(null);

  useEffect(() => {
    if (!id) {
      navigate('/admin/quizzes');
      return;
    }
    
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch quiz details
      const quizData = await getQuizById(parseInt(id!));
      setQuiz(quizData);
      
      // Fetch questions
      const questionsData = await getQuestions(parseInt(id!));
      setQuestions(questionsData);
      
      // Fetch answers for each question
      const answersMapData = new Map<number, Answer[]>();
      await Promise.all(
        questionsData.map(async (question) => {
          const answers = await getAnswers(question.id);
          answersMapData.set(question.id, answers);
        })
      );
      setAnswersMap(answersMapData);
      
    } catch (err) {
      console.error('Error fetching quiz data:', err);
      setError('Failed to load quiz data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Question Form
  const questionFormik = useFormik({
    initialValues: {
      body: '',
      type: QuestionType.OneAnswer,
      points: 1,
    },
    validationSchema: Yup.object({
      body: Yup.string().required('Question body is required'),
      type: Yup.string().required('Question type is required'),
      points: Yup.number()
        .required('Points are required')
        .min(0.5, 'Points must be at least 0.5')
        .max(10, 'Points cannot exceed 10'),
    }),
    onSubmit: async (values) => {
      if (!id) return;
      
      try {
        setSubmitLoading(true);
        setError(null);
        
        const questionData = {
          ...values,
          quizId: parseInt(id),
          type: values.type as QuestionType,
        };
        
        if (currentQuestion) {
          // Update existing question
          await updateQuestion(currentQuestion.id, questionData);
        } else {
          // Create new question
          console.log(questionData)
          const newQuestion = await createQuestion(questionData);
          setQuestions([...questions, newQuestion]);
        }
        
        await fetchData();
        setQuestionDialogOpen(false);
        setCurrentQuestion(null);
        questionFormik.resetForm();
      } catch (err) {
        console.error('Error saving question:', err);
        setError('Failed to save question. Please try again.');
      } finally {
        setSubmitLoading(false);
      }
    },
  });

  // Answer Form
  const answerFormik = useFormik({
    initialValues: {
      answerBody: '',
      isTrue: false,
    },
    validationSchema: Yup.object({
      answerBody: Yup.string().required('Answer text is required'),
      isTrue: Yup.boolean(),
    }),
    onSubmit: async (values) => {
      if (!currentQuestion) return;
      
      try {
        setSubmitLoading(true);
        setError(null);
        
        const answerData = {
          ...values,
          questionId: currentQuestion.id,
        };
        
        if (currentAnswer) {
          // Update existing answer
          await updateAnswer(currentAnswer.id, answerData);
        } else {
          // Create new answer
          await createAnswer(answerData);
        }
        
        await fetchData();
        setAnswerDialogOpen(false);
        setCurrentAnswer(null);
        answerFormik.resetForm();
      } catch (err) {
        console.error('Error saving answer:', err);
        setError('Failed to save answer. Please try again.');
      } finally {
        setSubmitLoading(false);
      }
    },
  });

  const handleOpenQuestionDialog = (question?: Question) => {
    if (question) {
      setCurrentQuestion(question);
      questionFormik.setValues({
        body: question.body,
        type: question.type,
        points: question.points,
      });
    } else {
      setCurrentQuestion(null);
      questionFormik.resetForm();
    }
    setQuestionDialogOpen(true);
  };

  const handleOpenAnswerDialog = (question: Question, answer?: Answer) => {
    setCurrentQuestion(question);
    
    if (answer) {
      setCurrentAnswer(answer);
      answerFormik.setValues({
        answerBody: answer.answerBody,
        isTrue: answer.isTrue,
      });
    } else {
      setCurrentAnswer(null);
      answerFormik.resetForm();
    }
    
    setAnswerDialogOpen(true);
  };

  const handleOpenDeleteDialog = (type: 'question' | 'answer', id: number) => {
    setItemToDelete({ type, id });
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      setSubmitLoading(true);
      
      if (itemToDelete.type === 'question') {
        await deleteQuestion(itemToDelete.id);
        setQuestions(questions.filter(q => q.id !== itemToDelete.id));
      } else {
        await deleteAnswer(itemToDelete.id);
        // We'll refresh the data to update the answers
      }
      
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      fetchData();
    } catch (err) {
      console.error(`Error deleting ${itemToDelete.type}:`, err);
      setError(`Failed to delete ${itemToDelete.type}. Please try again.`);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!quiz) {
    return <Alert severity="error">Quiz not found</Alert>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Manage Questions
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {quiz.title}
          </Typography>
        </Box>
        <Box>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenQuestionDialog()}
          >
            Add Question
          </Button>
        </Box>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {questions.length > 0 ? (
        <Box>
          {questions.map((question) => {
            const answers = answersMap.get(question.id) || [];
            return (
              <Accordion key={question.id} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ mr: 2 }}>{question.body}</Typography>
                      <Chip 
                        label={`${question.points} pts`} 
                        size="small" 
                        sx={{ mr: 1 }} 
                      />
                      <Chip 
                        label={question.type.replace(/([A-Z])/g, ' $1').trim()} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                    </Box>
                    <Box>
                      <Tooltip title="Edit Question">
                        <IconButton 
                          size="small" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenQuestionDialog(question);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Question">
                        <IconButton 
                          size="small" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDeleteDialog('question', question.id);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1">Answers</Typography>
                      <Button 
                        size="small" 
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenAnswerDialog(question)}
                      >
                        Add Answer
                      </Button>
                    </Box>
                    
                    {answers.length > 0 ? (
                      <List sx={{ width: '100%' }}>
                        {answers.map((answer) => (
                          <ListItem
                            key={answer.id}
                            secondaryAction={
                              <Box>
                                <IconButton 
                                  edge="end" 
                                  size="small"
                                  onClick={() => handleOpenAnswerDialog(question, answer)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton 
                                  edge="end" 
                                  size="small"
                                  onClick={() => handleOpenDeleteDialog('answer', answer.id)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            }
                            sx={{
                              bgcolor: answer.isTrue ? 'rgba(76, 175, 80, 0.1)' : 'inherit',
                              borderRadius: 1,
                              mb: 1
                            }}
                          >
                            <ListItemText
                              primary={answer.answerBody}
                              secondary={answer.isTrue ? 'Correct answer' : 'Incorrect answer'}
                            />
                          </ListItem>
                        ))}
                      </List>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No answers added yet.
                      </Typography>
                    )}
                  </Box>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" paragraph>
            No questions added to this quiz yet.
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenQuestionDialog()}
          >
            Add First Question
          </Button>
        </Paper>
      )}

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/admin/quizzes')}
        >
          Back to Quizzes
        </Button>
      </Box>

      {/* Question Dialog */}
      <Dialog open={questionDialogOpen} onClose={() => setQuestionDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentQuestion ? 'Edit Question' : 'Add New Question'}
        </DialogTitle>
        <form onSubmit={questionFormik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="body"
                  name="body"
                  label="Question Text"
                  multiline
                  rows={3}
                  value={questionFormik.values.body}
                  onChange={questionFormik.handleChange}
                  error={questionFormik.touched.body && Boolean(questionFormik.errors.body)}
                  helperText={questionFormik.touched.body && questionFormik.errors.body}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={questionFormik.touched.type && Boolean(questionFormik.errors.type)}>
                  <InputLabel id="type-label">Question Type</InputLabel>
                  <Select
                    labelId="type-label"
                    id="type"
                    name="type"
                    value={questionFormik.values.type}
                    label="Question Type"
                    onChange={questionFormik.handleChange}
                  >
                    <MenuItem value={QuestionType.OneAnswer}>One Answer (Multiple Choice)</MenuItem>
                    <MenuItem value={QuestionType.MultipleAnswer}>Multiple Answers</MenuItem>
                    <MenuItem value={QuestionType.TrueOrFalse}>True/False</MenuItem>
                    <MenuItem value={QuestionType.FillInTheBlank}>Fill in the Blank</MenuItem>
                  </Select>
                  {questionFormik.touched.type && questionFormik.errors.type && (
                    <Typography variant="caption" color="error">
                      {questionFormik.errors.type as string}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  id="points"
                  name="points"
                  label="Points"
                  type="number"
                  value={questionFormik.values.points}
                  onChange={questionFormik.handleChange}
                  error={questionFormik.touched.points && Boolean(questionFormik.errors.points)}
                  helperText={questionFormik.touched.points && questionFormik.errors.points}
                  InputProps={{ inputProps: { min: 0.5, max: 10, step: 0.5 } }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setQuestionDialogOpen(false)} 
              disabled={submitLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              disabled={submitLoading}
            >
              {submitLoading ? 'Saving...' : 'Save Question'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Answer Dialog */}
      <Dialog open={answerDialogOpen} onClose={() => setAnswerDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {currentAnswer ? 'Edit Answer' : 'Add New Answer'}
        </DialogTitle>
        <form onSubmit={answerFormik.handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              id="answerBody"
              name="answerBody"
              label="Answer Text"
              multiline
              rows={2}
              value={answerFormik.values.answerBody}
              onChange={answerFormik.handleChange}
              error={answerFormik.touched.answerBody && Boolean(answerFormik.errors.answerBody)}
              helperText={answerFormik.touched.answerBody && answerFormik.errors.answerBody}
              sx={{ mb: 3 }}
            />
            
            <FormControl fullWidth>
              <InputLabel id="isTrue-label">Answer Status</InputLabel>
              <Select
                labelId="isTrue-label"
                id="isTrue"
                name="isTrue"
                value={answerFormik.values.isTrue ? "true" : "false"}
                label="Answer Status"
                onChange={e => {
                  answerFormik.setFieldValue("isTrue", e.target.value === "true");
                }}
              >
                <MenuItem value="true">Correct Answer</MenuItem>
                <MenuItem value="false">Incorrect Answer</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setAnswerDialogOpen(false)} 
              disabled={submitLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              disabled={submitLoading}
            >
              {submitLoading ? 'Saving...' : 'Save Answer'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this {itemToDelete?.type}? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={submitLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            disabled={submitLoading}
          >
            {submitLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminQuestions;