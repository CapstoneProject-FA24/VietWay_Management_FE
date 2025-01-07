import React, { useState } from 'react';
import { Box, Typography, Grid, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
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
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import PostCategoryReport from '@components/manager/category/PostCategoryReport';

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

const SocialMediaPostCategory = ({ data, startDate, endDate }) => {
  const [chartType, setChartType] = useState('average');
  const [selectedCategory, setSelectedCategory] = useState(null);

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

  const handleCategoryClick = (categoryId, categoryName) => {
    setSelectedCategory({ id: categoryId, name: categoryName });
  };

  const handleCloseDialog = () => {
    setSelectedCategory(null);
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontSize: '1.2rem' }}>
          {`Biểu đồ so sánh điểm đánh giá mức độ quan tâm ${{
            'average': 'trung bình',
            'facebook': 'trên Facebook',
            'twitter': 'trên X (Twitter)',
            'post': 'trên trang Vietway'
          }[chartType]
            } giữa các loại bài viết 
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
            <MenuItem value="post">Trên trang Vietway</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              data={getChartData(chartType)}
              margin={{
                top: 50,
                right: 10,
                left: -10,
                bottom: 10,
              }}
              barCategoryGap={25}
              barGap={0}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                interval={0}
                tick={(props) => {
                  const { x, y, payload } = props;
                  const category = data.find(c => c.categoryName === payload.value);
                  return (
                    <g transform={`translate(${x},${y})`}>
                      <text
                        x={0}
                        y={0}
                        dy={16}
                        textAnchor="end"
                        fill="#666"
                        transform="rotate(-45)"
                        style={{
                          fontSize: 14,
                          cursor: 'pointer'
                        }}
                        onClick={() => handleCategoryClick(category.categoryId, category.categoryName)}
                      >
                        {payload.value}
                      </text>
                    </g>
                  );
                }}
                height={120}
              />
              <YAxis label={{
                value: "Điểm đánh giá mức độ quan tâm",
                position: "top",
                offset: 20,
                style: { fontSize: 16 },
                dx: 100,
              }} />
              <Tooltip content={<CustomTooltip />} />
              {/* <Legend /> */}
              {chartType === 'average' && <Bar dataKey="Trung bình" fill="#0a9d15" />}
              {chartType === 'facebook' && <Bar dataKey="Facebook" fill="#1877F2" />}
              {chartType === 'twitter' && <Bar dataKey="X (Twitter)" fill="#000000" />}
              {chartType === 'post' && <Bar dataKey="Bài viết" fill="#ff7300" />}
            </BarChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>

      {/* Category Details Dialog */}
      <Dialog
        open={Boolean(selectedCategory)}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
      >
        <Box sx={{ position: 'relative' }}>
          <Button
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
              zIndex: 1
            }}
          >
            Đóng
          </Button>
          {selectedCategory && (
            <PostCategoryReport
              categoryId={selectedCategory.id}
            />
          )}
        </Box>
      </Dialog>
    </Box>
  );
};

export default SocialMediaPostCategory;