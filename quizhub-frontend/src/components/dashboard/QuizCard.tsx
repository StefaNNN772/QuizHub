import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Chip, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Quiz, DifficultyEnum } from '../../types/models';

interface Props {
  quiz: Quiz;
  getDifficultyColor: (difficulty: DifficultyEnum) => string;
}

const QuizCard: React.FC<Props> = ({ quiz, getDifficultyColor }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {quiz.title}
        </Typography>
        <Chip 
          label={quiz.difficulty} 
          color={getDifficultyColor(quiz.difficulty) as any}
          size="small"
          sx={{ mb: 2 }}
        />
        <Typography variant="body2" color="text.secondary" paragraph>
          {quiz.description}
        </Typography>
        <Typography variant="body2">
          Time limit: {quiz.time} minutes
        </Typography>
        {quiz.topics && (
          <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {quiz.topics.map((topicName, index) => (
              <Chip key={`topic-${index}-${topicName}`} label={topicName} size="small" variant="outlined" />
            ))}
          </Box>
        )}
      </CardContent>
      <CardActions>
        <Button size="small" component={RouterLink} to={`/quiz/${quiz.id}`} variant="contained" fullWidth>
          Start Quiz
        </Button>
      </CardActions>
    </Card>
  );
};

export default QuizCard;
