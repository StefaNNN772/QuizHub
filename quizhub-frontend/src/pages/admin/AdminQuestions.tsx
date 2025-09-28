import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Alert
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AdminQuestionsList from '../../components/admin/AdminQuestionsList';
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

const AdminQuestions: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answersMap, setAnswersMap] = useState<Map<number, Answer[]>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog states
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [answerDialogOpen, setAnswerDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState<Answer | null>(null);
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

      const quizData = await getQuizById(parseInt(id!));
      setQuiz(quizData);

      const questionsData = await getQuestions(parseInt(id!));
      setQuestions(questionsData);

      const answersMapData = new Map<number, Answer[]>();
      await Promise.all(
        questionsData.map(async (question) => {
          const answers = await getAnswers(question.id);
          answersMapData.set(question.id, answers);
        })
      );
      setAnswersMap(answersMapData);

    } catch (err) {
      setError('Failed to load quiz data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Question Formik
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

        let newQuestion: Question | null = null;

        if (currentQuestion) {
          await updateQuestion(currentQuestion.id, questionData);
        } else {
          newQuestion = await createQuestion(questionData);

          if (values.type === QuestionType.TrueOrFalse && newQuestion) {
            await createAnswer({ questionId: newQuestion.id, answerBody: "True", isTrue: false });
            await createAnswer({ questionId: newQuestion.id, answerBody: "False", isTrue: false });
          }
        }

        await fetchData();
        setQuestionDialogOpen(false);
        setCurrentQuestion(null);
        questionFormik.resetForm();
      } catch {
        setError('Failed to save question. Please try again.');
      } finally {
        setSubmitLoading(false);
      }
    },
  });

  // Answer Formik
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

        if (currentQuestion.type === QuestionType.OneAnswer && values.isTrue) {
          const existingAnswers = answersMap.get(currentQuestion.id) || [];
          const alreadyHasTrue = existingAnswers.some(a => a.isTrue && (!currentAnswer || a.id !== currentAnswer.id));
          if (alreadyHasTrue) {
            setError("One Answer type question can only have one correct answer.");
            setSubmitLoading(false);
            return;
          }
        }
        if (currentQuestion.type === QuestionType.FillInTheBlank) {
          values.isTrue = true;
        }

        const answerData = {
          ...values,
          questionId: currentQuestion.id,
        };

        if (currentAnswer) {
          await updateAnswer(currentAnswer.id, answerData);
        } else {
          await createAnswer(answerData);
        }

        await fetchData();
        setAnswerDialogOpen(false);
        setCurrentAnswer(null);
        answerFormik.resetForm();
      } catch {
        setError('Failed to save answer. Please try again.');
      } finally {
        setSubmitLoading(false);
      }
    },
  });

  // Handler functions for dialogs
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
      }

      setDeleteDialogOpen(false);
      setItemToDelete(null);
      fetchData();
    } catch {
      setError(`Failed to delete ${itemToDelete.type}. Please try again.`);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <>
      <AdminQuestionsList
        quiz={quiz}
        questions={questions}
        answersMap={answersMap}
        loading={loading}
        error={error}
        onEditQuestion={handleOpenQuestionDialog}
        onDeleteQuestion={(id) => handleOpenDeleteDialog('question', id)}
        onAddQuestion={() => handleOpenQuestionDialog()}
        onAddAnswer={(q) => handleOpenAnswerDialog(q)}
        onEditAnswer={handleOpenAnswerDialog}
        onDeleteAnswer={(id) => handleOpenDeleteDialog('answer', id)}
        onBack={() => navigate('/admin/quizzes')}
      />

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
            {currentQuestion?.type === QuestionType.FillInTheBlank ? (
              <TextField
                fullWidth
                id="answerBody"
                name="answerBody"
                label="Correct Answer"
                value={answerFormik.values.answerBody}
                onChange={answerFormik.handleChange}
                error={answerFormik.touched.answerBody && Boolean(answerFormik.errors.answerBody)}
                helperText={answerFormik.touched.answerBody && answerFormik.errors.answerBody}
                sx={{ mb: 3 }}
              />
            ) : (
              <>
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
              </>
            )}
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
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this {itemToDelete?.type}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={submitLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={submitLoading}
          >
            {submitLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AdminQuestions;