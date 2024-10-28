import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, Grid, TextField, List, ListItem, ListItemText } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, StaticDatePicker, DatePicker, TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import SidebarStaff from '@layouts/SidebarStaff';
import { fetchTourTemplateById } from '@services/TourTemplateService';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const CreateTour = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [tourTemplate, setTourTemplate] = useState(null);
  const [startDate, setStartDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs().add(1, 'day'));
  const [startTime, setStartTime] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [dateRange, setDateRange] = useState([
    {
      startDate: dayjs().toDate(),
      endDate: dayjs().add(1, 'day').toDate(),
      key: 'selection'
    }
  ]);
  const [shownDate, setShownDate] = useState(new Date());

  useEffect(() => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    if (!role || !token || role !== 'nhan-vien') { navigate(`/dang-nhap`); }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedTourTemplate = await fetchTourTemplateById(id);
        setTourTemplate(fetchedTourTemplate);
      } catch (error) {
        console.error('Error fetching tour template:', error);
      }
    };
    fetchData();
  }, [id]);

  const handleGoBack = () => {
    navigate('/nhan-vien/tour-mau');
  };

  const handleMonthChange = (newMonth) => {
    setSelectedMonth(newMonth);
    const today = dayjs();
    let startDate;
    if (newMonth.isSame(today, 'month')) {
      startDate = today.toDate();
    } else {
      startDate = newMonth.startOf('month').toDate();
    }
    setStartDate(dayjs(startDate));
    setEndDate(dayjs(startDate));
    setDateRange([{ startDate: startDate, endDate: startDate, key: 'selection' }]);
  };

  const handleDateRangeChange = (item) => {
    setDateRange([item.selection]);
    setStartDate(dayjs(item.selection.startDate));
    setEndDate(dayjs(item.selection.endDate));
    setSelectedMonth(dayjs(item.selection.startDate));
  };

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue);
    setDateRange([{ startDate: newValue.toDate(), endDate: endDate.toDate(), key: 'selection' }]);
    if (newValue.isAfter(endDate)) {
      setEndDate(newValue);
      setDateRange([{ startDate: newValue.toDate(), endDate: newValue.toDate(), key: 'selection' }]);
    }
  };

  const handleEndDateChange = (newValue) => {
    setEndDate(newValue);
    setDateRange([{ startDate: startDate.toDate(), endDate: newValue.toDate(), key: 'selection' }]);
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
              {tourTemplate.code}
            </Typography>
            <Button variant="outlined" onClick={handleGoBack}>
              Quay lại
            </Button>
          </Box>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            {tourTemplate.tourName}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
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
                  <DateRange
                    showSelectionPreview={false}
                    showMonthAndYearPickers={false}
                    showMonthArrow={false}
                    showDateDisplay={false}
                    editableDateInputs={true}
                    onChange={handleDateRangeChange}
                    moveRangeOnFirstSelection={false}
                    ranges={dateRange}
                    months={1}
                    direction="vertical"
                    minDate={new Date()}
                    shownDate={shownDate}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', fontWeight: 700, mb: 3 }}>Các thông tin khác</Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography sx={{ mb: 1, fontSize: '1.2rem', fontWeight: 700 }}>Thời gian</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>Thời lượng: {tourTemplate.duration.durationName}</Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box sx={{ mb: 2 }}>
                      <DatePicker
                        minDate={dayjs()}
                        label="Ngày khởi hành"
                        value={startDate}
                        onChange={handleStartDateChange}
                        format="DD/MM/YYYY"
                        views={['year', 'month', 'day']}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <DatePicker
                        minDate={startDate}
                        label="Ngày kết thúc"
                        value={endDate}
                        onChange={handleEndDateChange}
                        format="DD/MM/YYYY"
                        views={['year', 'month', 'day']}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                      />
                    </Box>
                    <Box sx={{ mb: 2 }}>
                      <TimePicker views={['hours', 'minutes']} format="hh:mm" label="Giờ khởi hành" value={startTime} onChange={(newValue) => setStartTime(newValue)}
                        renderInput={(params) => <TextField {...params} fullWidth />} />
                    </Box>
                  </LocalizationProvider>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">Địa điểm khởi hành</Typography>
                  <Typography variant="body1">{tourTemplate.TourTemplateDeparturePoint}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">Giá tour (VND)</Typography>
                  <TextField fullWidth label="Người lớn (trên 12 tuổi)" variant="outlined" sx={{ mb: 1 }} />
                  <TextField fullWidth label="Trẻ em (5-12 tuổi)" variant="outlined" sx={{ mb: 1 }} />
                  <TextField fullWidth label="Em bé (dưới 5 tuổi)" variant="outlined" />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">Phụ thu (VND)</Typography>
                  <TextField fullWidth label="Phụ thu phòng đơn" variant="outlined" />
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