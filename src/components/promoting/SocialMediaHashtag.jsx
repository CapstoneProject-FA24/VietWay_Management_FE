import React, { useState } from 'react';
import { Box, Grid, FormControl, Select, MenuItem, InputLabel, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;
    return (
      <Box sx={{
        backgroundColor: 'white',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px'
      }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
          #{label}
        </Typography>
        {payload.map((entry, index) => (
          <Typography key={index} variant="body2">
            {`${entry.name}: ${entry.value.toFixed(2)}`}
          </Typography>
        ))}
        <Typography variant="body2" sx={{ mt: 1 }}>
          Số bài viết trên Facebook: {data.totalFacebookPost || 0}
        </Typography>
        <Typography variant="body2">
          Số bài viết trên X (Twitter): {data.totalXPost || 0}
        </Typography>
      </Box>
    );
  }
  return null;
};

const SocialMediaHashtag = ({ data, startDate, endDate }) => {
  const [chartType, setChartType] = useState('average');

  const chartData = data?.map(item => ({
    name: item.hashtagName,
    'ĐĐGMĐQT trung bình': item.averageScore,
    'ĐĐGMĐQT trung bình trên Facebook': item.averageFacebookScore,
    'ĐĐGMĐQT trung bình trên X (Twitter)': item.averageXScore,
    ...item
  })) || [];

  const ctrChartData = data?.map(item => ({
    name: item.hashtagName,
    'Facebook CTR': item.facebookCTR * 100,
    'X CTR': item.xctr * 100,
  })) || [];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontSize: '1.2rem' }}>
            {`Biểu đồ so sánh điểm đánh giá mức độ quan tâm ${
              {
                'average': 'trung bình',
                'facebook': 'trên Facebook',
                'twitter': 'trên X (Twitter)'
              }[chartType]
            } theo hashtag 
            ${new Date(startDate).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' }).replace(', ', '/').replace('tháng', '')} đến 
            ${new Date(endDate).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' }).replace(', ', '/').replace('tháng', '')}`}
          </Typography>
          <FormControl sx={{ minWidth: 250, maxWidth: 300 }}>
            <InputLabel>Thống kê điểm mức độ quan tâm</InputLabel>
            <Select
              sx={{ fontSize: '0.9rem' }}
              value={chartType}
              label="Thống kê điểm mức độ quan tâm . ."
              onChange={(e) => setChartType(e.target.value)}
            >
              <MenuItem value="average">Trung bình</MenuItem>
              <MenuItem value="facebook">Trên Facebook</MenuItem>
              <MenuItem value="twitter">Trên X (Twitter)</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{
              top: 35,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              interval={0}
              tickFormatter={(value) => `#${value}`}
            />
            <YAxis
              label={{
                value: "Điểm đánh giá mức độ quan tâm",
                position: "top",
                offset: 20,
                style: { fontSize: 16 },
                dx: 100,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            {chartType === 'average' && <Bar dataKey="ĐĐGMĐQT trung bình" fill="#0a9d15" />}
            {chartType === 'facebook' && <Bar dataKey="ĐĐGMĐQT trung bình trên Facebook" fill="#1877F2" />}
            {chartType === 'twitter' && <Bar dataKey="ĐĐGMĐQT trung bình trên X (Twitter)" fill="#000000" />}
          </BarChart>
        </ResponsiveContainer>
      </Grid>

      <Grid item xs={12} sx={{ mt: 5 }}>
        <Typography variant="h6" sx={{ fontSize: '1.2rem', mb: 2 }}>
          {`Biểu đồ tỷ lệ nhấp chuột (CTR) theo hashtag 
          ${new Date(startDate).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' }).replace(', ', '/').replace('tháng', '')} đến 
          ${new Date(endDate).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' }).replace(', ', '/').replace('tháng', '')}`}
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={ctrChartData}
            margin={{
              top: 35,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              interval={0}
              tickFormatter={(value) => `#${value}`}
            />
            <YAxis
              label={{
                value: "Tỷ lệ nhấp chuột (%)",
                position: "top",
                offset: 20,
                style: { fontSize: 16 },
                dx: 50,
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="Facebook CTR" fill="#1877F2" />
            <Bar dataKey="X CTR" fill="#000000" />
          </BarChart>
        </ResponsiveContainer>
      </Grid>
    </Grid>
  );
};

export default SocialMediaHashtag;
