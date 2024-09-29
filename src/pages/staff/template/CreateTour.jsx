import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, Grid, TextField, List, ListItem, ListItemText } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker, StaticDatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { getTourTemplateById } from '@hooks/MockTourTemplate';
import SidebarStaff from '@layouts/SidebarStaff';

const CreateTour = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [tourTemplate, setTourTemplate] = useState(null);
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());

  useEffect(() => {
    const template = getTourTemplateById(parseInt(id));
    setTourTemplate(template);
  }, [id]);

  const handleGoBack = () => {
    navigate('/nhan-vien/tour-mau');
  };

  const handleDateChange = (newDate) => {
    setStartDate(newDate);
    setSelectedMonth(newDate);
  };

  const handleMonthChange = (newMonth) => {
    setSelectedMonth(newMonth);
  };

  if (!tourTemplate) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', height: '80vh' }}>
            <img src="/loading.gif" alt="Loading..." />
        </div>
    );
  }

  return (
    <Box sx={{ display: 'flex', width: '100vw' }}>
      <SidebarStaff isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: isSidebarOpen ? '250px' : 0, transition: 'margin 0.3s' }}>
        <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              {tourTemplate.tourTemplateName}
            </Typography>
            <Button variant="outlined" onClick={handleGoBack}>
              Quay lại
            </Button>
          </Box>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            {tourTemplate.TourName}
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ width: 200 }}>
                    <Typography variant="h6" gutterBottom>Chọn tháng</Typography>
                    <List>
                      {Array.from({ length: 7 }).map((_, index) => {
                        const month = dayjs().add(index, 'month');
                        const monthLabel = month.format('MM/YYYY');
                        return (
                          <ListItem 
                            button 
                            key={index} 
                            onClick={() => handleMonthChange(month)}
                            sx={{
                              backgroundColor: selectedMonth.isSame(month, 'month') ? 'primary.main' : 'transparent',
                              color: selectedMonth.isSame(month, 'month') ? 'white' : 'inherit',
                              borderRadius: '8px',
                              mb: 1,
                              '&:hover': {
                                backgroundColor: selectedMonth.isSame(month, 'month') ? 'primary.main' : 'rgba(0, 0, 0, 0.04)',
                              }
                            }}
                          >
                            <ListItemText primary={monthLabel} />
                          </ListItem>
                        );
                      })}
                    </List>
                  </Box>
                  <Box>
                    <StaticDatePicker
                      displayStaticWrapperAs="desktop"
                      openTo="day"
                      value={startDate}
                      onChange={handleDateChange}
                      renderInput={(params) => <TextField {...params} />}
                      views={['year', 'month', 'day']}
                      minDate={selectedMonth.startOf('month')}
                      maxDate={selectedMonth.endOf('month')}
                    />
                  </Box>
                </Box>
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Các thông tin khác</Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">Thời gian</Typography>
                  <Typography variant="body1">Thời lượng chuyến đi: {tourTemplate.TourTemplateDuration}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">Ngày khởi hành và kết thúc</Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Ngày khởi hành"
                      value={startDate}
                      onChange={handleDateChange}
                      renderInput={(params) => <TextField {...params} fullWidth sx={{ mb: 1 }} />}
                    />
                    <DatePicker
                      label="Ngày kết thúc"
                      value={endDate}
                      onChange={(newValue) => setEndDate(newValue)}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">Giờ khởi hành</Typography>
                  <Typography variant="body1">{tourTemplate.TourTemplateBeginTime}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">Địa điểm khởi hành</Typography>
                  <Typography variant="body1">{tourTemplate.TourTemplateDeparturePoint}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">Giá tour (VND)</Typography>
                  <TextField
                    fullWidth
                    label="Người lớn (trên 12 tuổi)"
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    fullWidth
                    label="Trẻ em (5-12 tuổi)"
                    variant="outlined"
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    fullWidth
                    label="Em bé (dưới 5 tuổi)"
                    variant="outlined"
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">Phụ thu (VND)</Typography>
                  <TextField
                    fullWidth
                    label="Phụ thu phòng đơn"
                    variant="outlined"
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" color="primary" sx={{ mr: 2 }}>
              Xác Nhận
            </Button>
            <Button variant="contained" color="error">
              Hủy
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default CreateTour;