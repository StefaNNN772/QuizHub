import React from 'react';
import { Card, CardContent, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Checkbox, TextField, Box, Divider, Typography } from '@mui/material';
import { Question, Answer, QuestionType } from '../../types/models';

interface QuestionCardProps {
  question: Question;
  answers: Answer[];
  userAnswer: string[];
  handleAnswerChange: (questionId: number, value: string, isMultiple?: boolean) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, answers, userAnswer, handleAnswerChange }) => {
  return (
    <Card elevation={3} sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="textSecondary">
            {question.points} points • {question.type.replace(/([A-Z])/g, ' $1').trim()}
          </Typography>
          <Typography variant="h6" component="h2" sx={{ mt: 1 }}>
            {question.body}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {question.type === QuestionType.OneAnswer && (
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend">Select one answer:</FormLabel>
            <RadioGroup value={userAnswer[0] || ''} onChange={e => handleAnswerChange(question.id, e.target.value)}>
              {answers.map(a => <FormControlLabel key={a.id} value={a.answerBody} control={<Radio />} label={a.answerBody} />)}
            </RadioGroup>
          </FormControl>
        )}

        {question.type === QuestionType.MultipleAnswer && (
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend">Select all correct answers:</FormLabel>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
              {answers.map(a => (
                <FormControlLabel
                  key={a.id}
                  control={<Checkbox checked={userAnswer.includes(a.answerBody)} onChange={() => handleAnswerChange(question.id, a.answerBody, true)} />}
                  label={a.answerBody}
                />
              ))}
            </Box>
          </FormControl>
        )}

        {question.type === QuestionType.TrueOrFalse && (
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend">Is this statement true or false?</FormLabel>
            <RadioGroup value={userAnswer[0] || ''} onChange={e => handleAnswerChange(question.id, e.target.value)}>
              <FormControlLabel value="True" control={<Radio />} label="True" />
              <FormControlLabel value="False" control={<Radio />} label="False" />
            </RadioGroup>
          </FormControl>
        )}

        {question.type === QuestionType.FillInTheBlank && (
          <FormControl fullWidth>
            <FormLabel component="legend">Fill in the blank:</FormLabel>
            <TextField
              fullWidth
              value={userAnswer[0] || ''}
              onChange={e => handleAnswerChange(question.id, e.target.value)}
              margin="normal"
              placeholder="Your answer..."
              variant="outlined"
            />
          </FormControl>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
