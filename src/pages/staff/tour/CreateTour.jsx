import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, Grid, TextField, List, ListItem, ListItemText } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, StaticDatePicker, DatePicker, TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import SidebarStaff from '@layouts/SidebarStaff';
import { fetchTourTemplateById } from '@services/TourTemplateService';
import { fetchToursByTemplateId } from '@services/TourService';

const CreateTour = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [tourTemplate, setTourTemplate] = useState(null);
  const [startDate, setStartDate] = useState(dayjs());
  const [startTime, setStartTime] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [tours, setTours] = useState([]);
  const [newTourData, setNewTourData] = useState({
    startDate: dayjs(),
    startTime: null,
    maxParticipants: '',
    minParticipants: '',
    adultPrice: '',
    childPrice: '',
    infantPrice: ''
  });

  useEffect(() => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    if (!role || !token || role !== 'nhan-vien') { navigate(`/dang-nhap`); }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedTourTemplate = await fetchTourTemplateById(id);
        console.log(fetchedTourTemplate);
        setTourTemplate(fetchedTourTemplate);
      } catch (error) {
        console.error('Error fetching tour template:', error);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const fetchedTours = await fetchToursByTemplateId(id);
        setTours(fetchedTours);
      } catch (error) {
        console.error('Error fetching tours:', error);
      }
    };
    fetchTours();
  }, [id]);

  const handleGoBack = () => {
    navigate('/nhan-vien/tour-mau');
  };

  const handleMonthChange = (newMonth) => {
    setSelectedMonth(newMonth);
    if (newMonth !== 'all') {
      const today = dayjs();
      let startDate;
      if (newMonth.isSame(today, 'month')) {
        startDate = today.toDate();
      } else {
        startDate = newMonth.startOf('month').toDate();
      }
      setStartDate(dayjs(startDate));
      setEndDate(dayjs(startDate));
    }
  };

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue);
    if (newValue.isAfter(endDate)) {
      setEndDate(newValue);
    }
  };

  const handleNewTourChange = (field, value) => {
    setNewTourData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateEndDate = (startDate, startTime, duration) => {
    if (!startDate || !startTime || !duration || !duration.durationName) return null;

    try {
      const durationStr = duration.durationName;

      // Extract number of nights (đêm) and days (ngày)
      const nights = parseInt(durationStr.match(/\d+(?=\s*đêm)/)[0]);
      const days = parseInt(durationStr.match(/\d+(?=\s*ngày)/)[0]);

      if (isNaN(nights) || isNaN(days)) {
        console.error('Could not parse duration:', durationStr);
        return null;
      }

      // Validate days >= nights
      if (days < nights) {
        console.error('Invalid duration: days must be >= nights');
        return null;
      }

      // If days > nights, validate start time < 18:00
      if (days > nights && startTime.hour() >= 18) {
        console.error('Invalid start time: must be before 18:00 when days > nights');
        return null;
      }

      // Calculate end date
      const startDateTime = dayjs(startDate)
        .hour(startTime.hour())
        .minute(startTime.minute());

      return startDateTime.add(nights, 'day');
    } catch (error) {
      console.error('Error calculating end date:', error);
      return null;
    }
  };

  const ToursList = () => (
    <Box sx={{ ml: 4 }}>
      <Typography variant="h6" gutterBottom>
        {selectedMonth === 'all' ? 'Tất cả các tour' : `Tours trong tháng ${selectedMonth.format('MM/YYYY')}`}
      </Typography>
      <List>
        {tours
          .filter(tour => selectedMonth === 'all' ? true : dayjs(tour.startDate).isSame(selectedMonth, 'month'))
          .map((tour, index) => (
            <ListItem
              key={index}
              sx={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                mb: 1,
                backgroundColor: '#f5f5f5'
              }}
            >
              <ListItemText
                primary={`${dayjs(tour.startDate).format('DD/MM/YYYY')} - ${dayjs(tour.endDate).format('DD/MM/YYYY')}`}
                secondary={`Khởi hành: ${tour.startTime} | Số người: ${tour.currentParticipant}/${tour.maxParticipant}`}
              />
            </ListItem>
          ))}
      </List>
    </Box>
  );

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

      <Box component="main" sx={{ flexGrow: 1, p: 3, marginLeft: isSidebarOpen ? '250px' : 3, transition: 'margin 0.3s', mt: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 3 }}>
              Tạo tour mới
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <ToursList />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 700, mb: 1, color: 'primary.main' }}>
                Thông tin tour mẫu
              </Typography>
              <Box>
                <Typography gutterBottom sx={{ textAlign: 'left', fontWeight: 700, mb: 1, fontSize: '1.2rem' }}>
                  {tourTemplate.tourName}
                </Typography>
                <Typography gutterBottom sx={{ textAlign: 'left', mb: 0.5, fontSize: '0.95rem' }}>
                  <strong>Mã tour mẫu:</strong> {tourTemplate.code}
                </Typography>
                <Typography gutterBottom sx={{ textAlign: 'left', fontSize: '0.95rem' }}>
                  <strong>Thời lượng:</strong> {tourTemplate.duration.durationName}
                </Typography>
              </Box>
            </Paper>
            <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', fontWeight: 700, mb: 2, color: 'primary.main' }}>
                Thông tin tour mới
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography sx={{ mb: 1, fontSize: '1.2rem', fontWeight: 700 }}>Thời gian</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box sx={{ mb: 2 }}>
                    <DatePicker
                      label="Ngày khởi hành"
                      value={newTourData.startDate}
                      onChange={(value) => handleNewTourChange('startDate', value)}
                      format="DD/MM/YYYY"
                      minDate={dayjs()}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <TimePicker
                      label="Giờ khởi hành"
                      value={newTourData.startTime}
                      onChange={(value) => handleNewTourChange('startTime', value)}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  </Box>
                  {newTourData.startDate && newTourData.startTime && tourTemplate.duration && (
                    <Box sx={{ mb: 2 }}>
                      {(() => {
                        const durationStr = tourTemplate.duration.durationName;
                        const nights = parseInt(durationStr.match(/\d+(?=\s*đêm)/)[0]);
                        const days = parseInt(durationStr.match(/\d+(?=\s*ngày)/)[0]);

                        if (days < nights) {
                          return (
                            <Typography variant="body1" color="error">
                              Thời lượng không hợp lệ: Số ngày phải lớn hơn hoặc bằng số đêm
                            </Typography>
                          );
                        }

                        if (days > nights && newTourData.startTime.hour() >= 18) {
                          return (
                            <Typography variant="body1" color="error">
                              Giờ khởi hành không hợp lệ: Tour phải bắt đầu trước 18:00
                            </Typography>
                          );
                        }

                        const endDate = calculateEndDate(newTourData.startDate, newTourData.startTime, tourTemplate.duration);
                        return endDate ? (
                          <>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                              Bắt đầu: {newTourData.startDate.format('DD/MM/YYYY')} {newTourData.startTime.format('HH:mm')}
                            </Typography>
                            <Typography variant="body1">
                              Kết thúc: {endDate.format('DD/MM/YYYY')}
                            </Typography>
                          </>
                        ) : (
                          <Typography variant="body1" color="error">
                            Không thể tính ngày kết thúc
                          </Typography>
                        );
                      })()}
                    </Box>
                  )}
                </LocalizationProvider>
              </Box>

              <Box sx={{ mb: 2 }}>
                <TextField label="Số khách tối đa" fullWidth type="number" variant="outlined" sx={{ mb: 1 }} />
                <TextField label="Số khách tối thiểu" fullWidth type="number" variant="outlined" sx={{ mb: 1 }} />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">Giá tour (VND)</Typography>
                <TextField
                  fullWidth
                  type="number"
                  label="Người lớn (trên 12 tuổi)"
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
                <TextField
                  fullWidth
                  type="number"
                  label="Trẻ em (5-12 tuổi)"
                  variant="outlined"
                  sx={{ mb: 1 }}
                />
                <TextField
                  fullWidth
                  type="number"
                  label="Em bé (dưới 5 tuổi)"
                  variant="outlined"
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2">Phụ thu (VND)</Typography>
                <TextField
                  fullWidth
                  type="number"
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
      </Box>
    </Box>
  );
};

export default CreateTour;