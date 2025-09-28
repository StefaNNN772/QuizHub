import React from 'react';
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Quiz } from '../../types/models';

interface Props {
  quizzes: Quiz[];
  selectedQuiz: string;
  onQuizChange: (value: string) => void;
  period: string;
  onPeriodChange: (value: string) => void;
}

const LeaderboardFilters: React.FC<Props> = ({
  quizzes,
  selectedQuiz,
  onQuizChange,
  period,
  onPeriodChange,
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Quiz</InputLabel>
        <Select
          value={selectedQuiz}
          label="Quiz"
          onChange={(e) => onQuizChange(e.target.value)}
        >
          <MenuItem value="">All Quizzes</MenuItem>
          {quizzes.map((quiz) => (
            <MenuItem key={quiz.id} value={quiz.id.toString()}>
              {quiz.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 150 }}>
        <InputLabel>Time Period</InputLabel>
        <Select
          value={period}
          label="Time Period"
          onChange={(e) => onPeriodChange(e.target.value)}
        >
          <MenuItem value="">All Time</MenuItem>
          <MenuItem value="week">This Week</MenuItem>
          <MenuItem value="month">This Month</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default LeaderboardFilters;
