import React from 'react';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Topic, DifficultyEnum } from '../../types/models';

interface Props {
  search: string;
  setSearch: (value: string) => void;
  difficulty: string;
  setDifficulty: (value: string) => void;
  topic: string;
  setTopic: (value: string) => void;
  topics: Topic[];
}

const QuizFilters: React.FC<Props> = ({ search, setSearch, difficulty, setDifficulty, topic, setTopic, topics }) => {
  return (
    <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <TextField
        label="Search Quizzes"
        variant="outlined"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ flexGrow: 1, minWidth: '200px' }}
      />

      <FormControl sx={{ minWidth: '150px' }}>
        <InputLabel>Difficulty</InputLabel>
        <Select value={difficulty} label="Difficulty" onChange={(e) => setDifficulty(e.target.value)}>
          <MenuItem value="">All Difficulties</MenuItem>
          <MenuItem value={DifficultyEnum.Easy}>Easy</MenuItem>
          <MenuItem value={DifficultyEnum.Medium}>Medium</MenuItem>
          <MenuItem value={DifficultyEnum.Hard}>Hard</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: '150px' }}>
        <InputLabel>Topic</InputLabel>
        <Select value={topic} label="Topic" onChange={(e) => setTopic(e.target.value)}>
          <MenuItem value="">All Topics</MenuItem>
          {topics.map((t) => (
            <MenuItem key={t.id} value={t.about}>
              {t.about}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default QuizFilters;
