import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, Grid, TextField, InputAdornment, Snackbar, Alert } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import SidebarStaff from '@layouts/SidebarStaff';
import { fetchTourTemplateById } from '@services/TourTemplateService';
import { fetchToursByTemplateId, calculateEndDate, createTour } from '@services/TourService';
import '@styles/Calendar.css';
import 'react-calendar/dist/Calendar.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import TourCalendar from '@components/staff/tour/TourCalendar';
import TourTemplateInfo from '@components/staff/tour/TourTemplateInfo';

const DATE_FORMAT = "DD/MM/YYYY";

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
  const [refundPolicies, setRefundPolicies] = useState([
    { cancelBefore: null, refundRate: '' }
  ]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

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
    setNewTourData(prev => ({ ...prev, [field]: value }));
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

  const handleAddPolicy = () => {
    setRefundPolicies([...refundPolicies, { cancelBefore: null, refundRate: '' }]);
  };

  const handleRemovePolicy = (index) => {
    setRefundPolicies(refundPolicies.filter((_, i) => i !== index));
  };

  const handlePolicyChange = (index, field, value) => {
    const newPolicies = [...refundPolicies];
    newPolicies[index][field] = value;
    setRefundPolicies(newPolicies);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const validateRefundPolicies = () => {
    if (refundPolicies.length === 0) {
      setSnackbar({ open: true, message: 'Vui lòng thêm ít nhất một chính sách hoàn tiền', severity: 'error' });
      return false;
    }
    const sortedPolicies = [...refundPolicies].sort((a, b) => 
      dayjs(b.cancelBefore).valueOf() - dayjs(a.cancelBefore).valueOf()
    );
    const isValidData = sortedPolicies.every(policy => 
      policy.cancelBefore && 
      policy.refundRate !== '' && 
      Number(policy.refundRate) >= 0 && 
      Number(policy.refundRate) <= 100
    );
    if (!isValidData) {
      setSnackbar({ open: true, message: 'Vui lòng điền đầy đủ thông tin cho tất cả các chính sách hoàn tiền', severity: 'error' });
      return false;
    }
    const isValidDates = sortedPolicies.every(policy => 
      dayjs(policy.cancelBefore).isBefore(dayjs(newTourData.startDate))
    );
    if (!isValidDates) {
      setSnackbar({ open: true, message: 'Ngày hủy tour phải trước ngày khởi hành', severity: 'error' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateRefundPolicies()) { return; }
    const formattedPolicies = refundPolicies.map(policy => ({
      cancelBefore: dayjs(policy.cancelBefore).format('YYYY-MM-DD'),
      refundRate: Number(policy.refundRate)
    }));
    const tourData = {
      tourTemplateId: id,
      ...newTourData,
      refundPolicies: formattedPolicies
    };
    try {
      await createTour(tourData);
      setSnackbar({ open: true, message: 'Tạo tour thành công', severity: 'success' });
      navigate('/nhan-vien/tour-du-lich');
    } catch (error) {
      setSnackbar({ open: true, message: 'Có lỗi xảy ra khi tạo tour', severity: 'error' });
      console.error('Error creating tour:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', width: '98vw' }}>
      <SidebarStaff isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Box component="main" sx={{ flexGrow: 1, p: 2, marginLeft: isSidebarOpen ? '245px' : 2, transition: 'margin 0.3s', mt: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} sx={{ ml: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Button startIcon={<ArrowBackIcon />} sx={{ width: 'fit-content' }} onClick={() => navigate('/nhan-vien/tour-du-lich/tour-mau-duoc-duyet')}>Quay lại</Button>
              <Typography variant="h4" sx={{ fontSize: '2.7rem', fontWeight: 600, color: 'primary.main', alignSelf: 'center', marginBottom: '1rem' }}>Tạo tour mới</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={8.5}>
            <TourTemplateInfo tourTemplate={tourTemplate} isLoading={isLoading} />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TourCalendar tourId={null} tours={tours} selectedMonth={selectedMonth} handleMonthChange={handleMonthChange} />
            </Box>
          </Grid>
          <Grid item xs={12} md={3.5}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', fontWeight: 700, mb: 0.5, color: 'primary.main'}}>
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
                      label="Ngày khởi hành" value={newTourData.startDate} format={DATE_FORMAT} minDate={dayjs()}
                      onChange={(value) => handleNewTourChange('startDate', value)}
                      slotProps={{textField: { fullWidth: true, inputProps: { style: { height: '15px' }}}}}
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
                        return result ? result.endDate.format(DATE_FORMAT) : '';
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
                  sx={{ mb: 2, mt: 1.5 }} inputProps={{ min: 0, style: { height: '15px' } }}
                />
                <TextField fullWidth type="number" label="Trẻ em (5-12 tuổi)" variant="outlined" value={newTourData.childPrice}
                  onChange={(e) => {
                    const newChildPrice = Number(e.target.value);
                    const adultPrice = Number(newTourData.adultPrice);
                    if (newChildPrice >= 0 && (!adultPrice || newChildPrice <= adultPrice)) {
                      handleNewTourChange('childPrice', e.target.value);
                    }
                  }}
                  sx={{ mb: 2 }} inputProps={{ min: 0, style: { height: '15px' } }}
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
                  sx={{ mb: 1.5 }} inputProps={{ min: 0, style: { height: '15px' } }}
                  error={Number(newTourData.infantPrice) > Number(newTourData.childPrice) || Number(newTourData.infantPrice) < 0}
                  helperText={Number(newTourData.infantPrice) > Number(newTourData.childPrice) ? "Giá em bé phải thấp hơn giá em bé" : ""}
                />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>Thời gian đăng ký</Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box sx={{ mb: 2, mt: 1.5 }}>
                    <DatePicker
                      label="Ngày mở đăng ký" format={DATE_FORMAT} value={newTourData.registerOpenDate}
                      onChange={(value) => handleNewTourChange('registerOpenDate', value)}
                      minDate={dayjs()}
                      maxDate={dayjs(newTourData.startDate).subtract(1, 'day')}
                      slotProps={{
                        textField: { fullWidth: true, inputProps: { style: { height: '15px' }},
                          error: newTourData.registerOpenDate && newTourData.startDate &&
                            dayjs(newTourData.registerOpenDate).isAfter(newTourData.startDate),
                          helperText: newTourData.registerOpenDate && newTourData.startDate &&
                            dayjs(newTourData.registerOpenDate).isAfter(newTourData.startDate) ?
                            "Ngày mở đăng ký phải trước ngày khởi hành" : ""
                        }
                      }}
                    />
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <DatePicker
                      label="Ngày đóng đăng ký" value={newTourData.registerCloseDate} format={DATE_FORMAT}
                      onChange={(value) => handleNewTourChange('registerCloseDate', value)}
                      minDate={newTourData.registerOpenDate || dayjs()}
                      maxDate={dayjs(newTourData.startDate).subtract(1, 'day')}
                      slotProps={{
                        textField: { fullWidth: true, inputProps: { style: { height: '15px' }},
                          error: newTourData.registerCloseDate &&
                            (dayjs(newTourData.registerCloseDate).isAfter(newTourData.startDate) || 
                            dayjs(newTourData.registerOpenDate).isAfter(newTourData.registerCloseDate)),
                          helperText: newTourData.registerCloseDate &&
                            (dayjs(newTourData.registerCloseDate).isAfter(newTourData.startDate) ||
                            dayjs(newTourData.registerOpenDate).isAfter(newTourData.registerCloseDate)) ?
                            "Ngày đóng đăng ký phải sau ngày mở đăng ký và trước ngày khởi hành" : ""
                        }
                      }}
                    />
                  </Box>
                </LocalizationProvider>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Chính sách hoàn tiền</Typography>
          {refundPolicies.map((policy, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center', backgroundColor: 'background.paper', p: 2, borderRadius: 1, boxShadow: 1 }} >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Hủy trước ngày" value={policy.cancelBefore} format={DATE_FORMAT}
                  onChange={(newValue) => handlePolicyChange(index, 'cancelBefore', newValue)}
                  maxDate={dayjs(newTourData.startDate).subtract(1, 'day')}
                  minDate={newTourData.registerOpenDate || dayjs()}
                  slotProps={{
                    textField: { fullWidth: true, inputProps: { style: { height: '15px' }},
                      error: policy.cancelBefore &&
                        (dayjs(policy.cancelBefore).isAfter(dayjs(newTourData.startDate)) ||
                        dayjs(newTourData.registerOpenDate).isAfter(dayjs(policy.cancelBefore))),
                      helperText: policy.cancelBefore &&
                        (dayjs(policy.cancelBefore).isAfter(dayjs(newTourData.startDate)) ||
                        dayjs(newTourData.registerOpenDate).isAfter(dayjs(policy.cancelBefore))) ?
                        "Ngày hủy phải trước ngày khởi hành và sau ngày mở đăng ký" : ""
                    }
                  }}
                />
              </LocalizationProvider>
              <TextField
                label="Tỷ lệ hoàn tiền (%)" type="number" sx={{ width: '30%' }} value={policy.refundRate}
                onChange={(e) => {
                  const value = Math.min(Math.max(0, Number(e.target.value)), 100);
                  handlePolicyChange(index, 'refundRate', value);
                }}
                InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
              />
              <Button variant="outlined" color="error" onClick={() => handleRemovePolicy(index)} disabled={refundPolicies.length === 1}>Xóa</Button>
            </Box>
          ))}
          <Box sx={{ display: 'flex', justifyContent: 'right', mt: 2 }}>
            <Button variant="outlined" onClick={handleAddPolicy} startIcon={<AddIcon />} >Thêm chính sách</Button>
          </Box>
        </Box>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}> Gửi </Button>
        </Box>
      </Box>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateTour;