import React from 'react';
import {
  Typography,
  Box,
  Button,
  Paper,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Chip,
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Quiz, Question, Answer, QuestionType } from '../../types/models';

interface AdminQuestionsListProps {
  quiz: Quiz | null;
  questions: Question[];
  answersMap: Map<number, Answer[]>;
  loading: boolean;
  error: string | null;
  onEditQuestion: (q: Question) => void;
  onDeleteQuestion: (id: number) => void;
  onAddQuestion: () => void;
  onAddAnswer: (q: Question) => void;
  onEditAnswer: (q: Question, a: Answer) => void;
  onDeleteAnswer: (id: number) => void;
  onBack: () => void;
}

const AdminQuestionsList: React.FC<AdminQuestionsListProps> = ({
  quiz,
  questions,
  answersMap,
  loading,
  error,
  onEditQuestion,
  onDeleteQuestion,
  onAddQuestion,
  onAddAnswer,
  onEditAnswer,
  onDeleteAnswer,
  onBack
}) => {
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
            onClick={onAddQuestion}
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
                            onEditQuestion(question);
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
                            onDeleteQuestion(question.id);
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
                      {question.type !== QuestionType.TrueOrFalse && (
                        <Button
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={() => onAddAnswer(question)}
                        >
                          Add Answer
                        </Button>
                      )}
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
                                  onClick={() => onEditAnswer(question, answer)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                {question.type !== QuestionType.TrueOrFalse && (
                                  <IconButton
                                    edge="end"
                                    size="small"
                                    onClick={() => onDeleteAnswer(answer.id)}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                )}
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
            onClick={onAddQuestion}
          >
            Add First Question
          </Button>
        </Paper>
      )}

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={onBack}
        >
          Back to Quizzes
        </Button>
      </Box>
    </Box>
  );
};

export default AdminQuestionsList;