import React from 'react';
import { Card, CardContent, Box, Typography, Divider } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Question, Answer, UserAnswer } from '../../types/models';

interface QuestionResultCardProps {
  question: Question;
  index: number;
  answers: Answer[];
  userAnswers: UserAnswer[];
}

const QuestionResultCard: React.FC<QuestionResultCardProps> = ({ question, index, answers, userAnswers }) => {
  const correctAnswers = answers.filter(a => a.isTrue);

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold', mr: 1 }}>{index + 1}.</Typography>
          <Typography variant="body1">{question.body}</Typography>
        </Box>

        <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 2 }}>{question.points} points</Typography>
        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" sx={{ mb: 1 }}>Correct Answer:</Typography>
        <Box sx={{ pl: 2, mb: 2 }}>
          {correctAnswers.map(a => (
            <Box key={a.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CheckCircleIcon color="success" sx={{ mr: 1, fontSize: 20 }} />
              <Typography variant="body2">{a.answerBody}</Typography>
            </Box>
          ))}
        </Box>

        <Typography variant="subtitle2" sx={{ mb: 1 }}>Your Answer:</Typography>
        <Box sx={{ pl: 2, mb: 2 }}>
          {userAnswers.map(ua => (
            <Box key={ua.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              {ua.isTrue ? (
                <CheckCircleIcon color="success" sx={{ mr: 1, fontSize: 20 }} />
              ) : (
                <CancelIcon color="error" sx={{ mr: 1, fontSize: 20 }} />
              )}
              <Typography variant="body2">{ua.answerBody}</Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default QuestionResultCard;
