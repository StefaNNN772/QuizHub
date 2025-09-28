import React from 'react';
import { Typography } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Result } from '../../types/models';

interface ResultsChartProps {
  results: Result[];
}

const ResultsChart: React.FC<ResultsChartProps> = ({ results }) => {
  const calculatePercentage = (points: number, maxPoints: number) => {
    return maxPoints > 0 ? Math.round((points / maxPoints) * 100) : 0;
  };

  const chartData = results.map((r, index) => ({
    name: `Q${index + 1}`,
    percentage: calculatePercentage(r.points, r.maxPoints),
  }));

  return (
    <>
      <Typography variant="h6" gutterBottom>Progress Over Time</Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
          <Tooltip formatter={(value: number) => `${value}%`} />
          <Line type="monotone" dataKey="percentage" stroke="#1976d2" strokeWidth={2} dot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default ResultsChart;
