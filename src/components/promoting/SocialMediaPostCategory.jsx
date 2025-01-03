import React, { useState } from 'react';
import { Box, Typography, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;
    return (
      <Box
        sx={{
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
          {label}
        </Typography>
        <Typography variant="body2">
          {`${payload[0].name}: ${payload[0].value.toFixed(2)}`}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Số bài viết tại Vietway: {data.totalSitePost}
        </Typography>
        <Typography variant="body2">
          Số bài viết trên Facebook: {data.totalFacebookPost}
        </Typography>
        <Typography variant="body2">
          Số bài viết trên X (Twitter): {data.totalXPost}
        </Typography>
      </Box>
    );
  }
  return null;
};

const SocialMediaPostCategory = ({ data }) => {
  const [chartType, setChartType] = useState('average');

  if (!data || data.length === 0) {
    return <Typography>No data available</Typography>;
  }

  const getChartData = (type) => {
    const metricMap = {
      'average': { key: 'Trung bình', value: 'averageScore' },
      'facebook': { key: 'Facebook', value: 'averageFacebookScore' },
      'twitter': { key: 'X (Twitter)', value: 'averageXScore' },
      'post': { key: 'Bài viết', value: 'averageSitePostScore' }
    };

    return data.map(category => ({
      name: category.categoryName,
      [metricMap[type].key]: parseFloat(category[metricMap[type].value].toFixed(2)),
      totalSitePost: category.totalSitePost,
      totalFacebookPost: category.totalFacebookPost,
      totalXPost: category.totalXPost
    }));
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontSize: '1.2rem' }}>
          {`Điểm đánh giá mức độ quan tâm ${
            {
              'average': 'trung bình',
              'facebook': 'trên Facebook',
              'twitter': 'trên X (Twitter)',
              'post': 'của các bài viết'
            }[chartType]
          }`}
        </Typography>
        <FormControl sx={{ minWidth: 200, maxWidth: 300 }}>
          <InputLabel>Biểu đồ</InputLabel>
          <Select
            sx={{ fontSize: '0.9rem' }}
            value={chartType}
            label="Biểu đồ"
            onChange={(e) => setChartType(e.target.value)}
          >
            <MenuItem value="average">ĐĐGMĐQT trung bình</MenuItem>
            <MenuItem value="facebook">ĐĐGMĐQT trên Facebook</MenuItem>
            <MenuItem value="twitter">ĐĐGMĐQT trên X (Twitter)</MenuItem>
            <MenuItem value="post">ĐĐGMĐQT của các bài viết</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart 
              data={getChartData(chartType)} 
              margin={{
                top: 50,
                right: 80,
                left: 50,
                bottom: 10,
              }}
              barCategoryGap={20} 
              barGap={0}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                textAnchor="middle"
                height={80}
                interval={0}
                tick={{
                  fontSize: 14,
                  width: 100,
                  wordWrap: 'break-word'
                }}
              />
              <YAxis label={{
                value: "Điểm đánh giá mức độ quan tâm",
                position: "top",
                offset: 20,
                style: { fontSize: 16 },
                dx: 100,
              }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {chartType === 'average' && <Bar dataKey="Trung bình" fill="#0a9d15" />}
              {chartType === 'facebook' && <Bar dataKey="Facebook" fill="#1877F2" />}
              {chartType === 'twitter' && <Bar dataKey="X (Twitter)" fill="#000000" />}
              {chartType === 'post' && <Bar dataKey="Bài viết" fill="#ff7300" />}
            </BarChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SocialMediaPostCategory;