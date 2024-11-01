import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, Grid, TextField, List, ListItem, ListItemText, Badge } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, StaticDatePicker, DatePicker, TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import SidebarStaff from '@layouts/SidebarStaff';
import { fetchTourTemplateById } from '@services/TourTemplateService';
import { fetchToursByTemplateId, calculateEndDate } from '@services/TourService';
import '@styles/Calendar.css';
import 'react-calendar/dist/Calendar.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TourCalendar from '@components/staff/tour/TourCalendar';
import TourTemplateInfo from '@components/staff/tour/TourTemplateInfo';

const CreateTour = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [tourTemplate, setTourTemplate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [tours, setTours] = useState([]);
  const [newTourData, setNewTourData] = useState({
    startDate: dayjs(), startTime: null, maxParticipants: 20,
    minParticipants: 10, adultPrice: '', childPrice: '', infantPrice: '',
    registerOpenDate: null, registerCloseDate: null
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const fetchedTourTemplate = await fetchTourTemplateById(id);
        setTourTemplate(fetchedTourTemplate);
      } catch (error) {
        console.error('Error fetching tour template:', error);
      } finally {
        setIsLoading(false);
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

  const handleNewTourChange = (field, value) => {
    setNewTourData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculatePrices = (adultPrice) => {
    const childPrice = Math.round(adultPrice * 0.6);
    const infantPrice = Math.round(adultPrice * 0.3);
    return { childPrice, infantPrice };
  };

  const validatePrice = (price, minPrice, maxPrice) => {
    const numPrice = Number(price);
    if (isNaN(numPrice)) return false;
    if (!price) return true;
    return numPrice >= minPrice && numPrice <= maxPrice;
  };

  return (
    <Box sx={{ display: 'flex', width: '98vw' }}>
      <SidebarStaff isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Box component="main" sx={{ flexGrow: 1, p: 2, marginLeft: isSidebarOpen ? '245px' : 2, transition: 'margin 0.3s', mt: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} sx={{ ml: 3 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/nhan-vien/tour-du-lich/tour-mau-duoc-duyet')} sx={{ color: 'grey' }}
            >
              Quay lại
            </Button>
            <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 2 }}> Tạo tour mới </Typography>
          </Grid>
          <Grid item xs={12} md={8.5}>
            <TourTemplateInfo
              tourTemplate={tourTemplate}
              isLoading={isLoading}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TourCalendar tourId={null} tours={tours} selectedMonth={selectedMonth} handleMonthChange={handleMonthChange} />
            </Box>
          </Grid>
          <Grid item xs={12} md={3.5}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', fontWeight: 700, mb: 0.5, color: 'primary.main' }}>
                Thông tin tour mới
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>Thông tin khởi hành</Typography>
                <TextField
                  label="Khởi hành từ" fullWidth variant="outlined" sx={{ mb: 1, mt: 1.5 }}
                  value={newTourData.startAddress} inputProps={{ style: { height: '15px' } }}
                  onChange={(e) => handleNewTourChange('startAddress', e.target.value)}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box sx={{ mb: 2, mt: 1.5 }}>
                    <DatePicker
                      onChange={(value) => handleNewTourChange('startDate', value)}
                      format="DD/MM/YYYY" minDate={dayjs()} label="Ngày khởi hành" value={newTourData.startDate}
                      slotProps={{ textField: { fullWidth: true, inputProps: { style: { height: '15px' } } } }}
                    />
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <TimePicker
                      label="Giờ khởi hành" value={newTourData.startTime} onChange={(value) => handleNewTourChange('startTime', value)}
                      slotProps={{ textField: { fullWidth: true, inputProps: { style: { height: '15px' } } } }}
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body1">
                      Ngày kết thúc: {(() => {
                        if (!newTourData.startDate || !newTourData.startTime || !tourTemplate.duration) {
                          return '';
                        }
                        const result = calculateEndDate(newTourData.startDate, newTourData.startTime, tourTemplate.duration);
                        return result ? result.endDate.format('DD/MM/YYYY') : '';
                      })()}
                    </Typography>
                    {(() => {
                      if (!newTourData.startDate || !newTourData.startTime || !tourTemplate.duration) return null;
                      const result = calculateEndDate(newTourData.startDate, newTourData.startTime, tourTemplate.duration);
                      return result?.recommendationMessage ? (
                        <Typography variant="body2" color="warning.main" sx={{ mt: 1 }}> {result.recommendationMessage}</Typography>
                      ) : null;
                    })()}
                  </Box>
                </LocalizationProvider>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>Số lượng khách</Typography>
                <TextField
                  label="Số khách tối đa" fullWidth type="number" variant="outlined" sx={{ mb: 2, mt: 1.5 }} value={newTourData.maxParticipants}
                  onChange={(e) => {
                    const newMaxParticipants = Number(e.target.value);
                    if (newMaxParticipants > 0) {
                      handleNewTourChange('maxParticipants', e.target.value);
                    }
                  }}
                  error={Number(newTourData.maxParticipants) <= Number(newTourData.minParticipants) || Number(newTourData.maxParticipants) <= 0}
                  helperText={Number(newTourData.maxParticipants) <= Number(newTourData.minParticipants)
                    ? "Số khách tối đa phải lớn hơn số khách tối thiểu" : ""}
                  inputProps={{ min: 1, style: { height: '15px' } }}
                />
                <TextField
                  label="Số khách tối thiểu" fullWidth type="number" variant="outlined" sx={{ mb: 1 }} value={newTourData.minParticipants}
                  onChange={(e) => {
                    const newMinParticipants = Number(e.target.value);
                    if (newMinParticipants > 0 && (!newTourData.maxParticipants || newMinParticipants < Number(newTourData.maxParticipants))) {
                      handleNewTourChange('minParticipants', e.target.value);
                    }
                  }}
                  error={Number(newTourData.minParticipants) >= Number(newTourData.maxParticipants) || Number(newTourData.minParticipants) <= 0}
                  helperText={Number(newTourData.minParticipants) >= Number(newTourData.maxParticipants)
                    ? "Số khách tối thiểu phải nhỏ hơn số khách tối đa" : ""}
                  inputProps={{ min: 1, style: { height: '15px' } }}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>Giá tour</Typography>
                <TextField fullWidth type="number" label="Người lớn (trên 12 tuổi)" variant="outlined" value={newTourData.adultPrice}
                  onChange={(e) => {
                    const newAdultPrice = e.target.value;
                    if (Number(newAdultPrice) >= 0) {
                      handleNewTourChange('adultPrice', newAdultPrice);
                      if (validatePrice(newAdultPrice, tourTemplate?.minPrice, tourTemplate?.maxPrice)) {
                        const { childPrice, infantPrice } = calculatePrices(Number(newAdultPrice));
                        handleNewTourChange('childPrice', childPrice.toString());
                        handleNewTourChange('infantPrice', infantPrice.toString());
                      }
                    }
                  }}
                  error={newTourData.adultPrice && (!validatePrice(newTourData.adultPrice, tourTemplate?.minPrice, tourTemplate?.maxPrice) || Number(newTourData.adultPrice) < 0)}
                  helperText={`Giá phải từ ${tourTemplate?.minPrice?.toLocaleString() || 0} đến ${tourTemplate?.maxPrice?.toLocaleString() || 0} VND`}
                  sx={{ mb: 2, mt: 1.5 }}
                  inputProps={{ min: 0, style: { height: '15px' } }}
                />
                <TextField fullWidth type="number" label="Trẻ em (5-12 tuổi)" variant="outlined" value={newTourData.childPrice}
                  onChange={(e) => {
                    const newChildPrice = Number(e.target.value);
                    const adultPrice = Number(newTourData.adultPrice);
                    if (newChildPrice >= 0 && (!adultPrice || newChildPrice <= adultPrice)) {
                      handleNewTourChange('childPrice', e.target.value);
                    }
                  }}
                  sx={{ mb: 2 }}
                  inputProps={{ min: 0, style: { height: '15px' } }}
                  error={Number(newTourData.childPrice) > Number(newTourData.adultPrice) || Number(newTourData.childPrice) < 0}
                  helperText={Number(newTourData.childPrice) > Number(newTourData.adultPrice) ? "Giá trẻ em phải thấp hơn giá người lớn" : ""}
                />
                <TextField
                  fullWidth type="number" label="Em bé (dưới 5 tuổi)" variant="outlined" value={newTourData.infantPrice}
                  onChange={(e) => {
                    const newInfantPrice = Number(e.target.value);
                    const childPrice = Number(newTourData.childPrice);
                    if (newInfantPrice >= 0 && (!childPrice || newInfantPrice <= childPrice)) {
                      handleNewTourChange('infantPrice', e.target.value);
                    }
                  }}
                  sx={{ mb: 1.5 }}
                  inputProps={{ min: 0, style: { height: '15px' } }}
                  error={Number(newTourData.infantPrice) > Number(newTourData.childPrice) || Number(newTourData.infantPrice) < 0}
                  helperText={Number(newTourData.infantPrice) > Number(newTourData.childPrice) ? "Giá em bé phải thấp hơn giá em bé" : ""}
                />
              </Box>

              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>Thời gian đăng ký</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box sx={{ mb: 2, mt: 1.5 }}>
                    <DatePicker
                      label="Ngày mở đăng ký"
                      value={newTourData.registerOpenDate}
                      onChange={(value) => handleNewTourChange('registerOpenDate', value)}
                      format="DD/MM/YYYY"
                      minDate={dayjs()}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          inputProps: { style: { height: '15px' } },
                          error: newTourData.registerOpenDate && newTourData.registerCloseDate &&
                            dayjs(newTourData.registerOpenDate).isAfter(newTourData.registerCloseDate),
                          helperText: newTourData.registerOpenDate && newTourData.registerCloseDate &&
                            dayjs(newTourData.registerOpenDate).isAfter(newTourData.registerCloseDate) ?
                            "Ngày mở đăng ký phải trước ngày đóng đăng ký" : ""
                        }
                      }}
                    />
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <DatePicker
                      label="Ngày đóng đăng ký"
                      value={newTourData.registerCloseDate}
                      onChange={(value) => handleNewTourChange('registerCloseDate', value)}
                      format="DD/MM/YYYY"
                      minDate={newTourData.registerOpenDate || dayjs()}
                      maxDate={newTourData.startDate}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          inputProps: { style: { height: '15px' } },
                          error: newTourData.registerCloseDate &&
                            dayjs(newTourData.registerCloseDate).isAfter(newTourData.startDate),
                          helperText: newTourData.registerCloseDate &&
                            dayjs(newTourData.registerCloseDate).isAfter(newTourData.startDate) ?
                            "Ngày đóng đăng ký phải trước ngày khởi hành" : ""
                        }
                      }}
                    />
                  </Box>
                </LocalizationProvider>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" sx={{ mr: 2, backgroundColor: 'grey' }}> Lưu nháp </Button>
          <Button variant="contained" color="primary"> Gửi </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateTour;