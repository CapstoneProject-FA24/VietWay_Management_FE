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
import TourCalendar from '@components/tour/TourCalendar';
import TourTemplateInfo from '@components/tour/TourTemplateInfo';
import { Helmet } from 'react-helmet';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const DATE_FORMAT = "DD/MM/YYYY";

// Add this function to round price to nearest thousand
const roundToThousand = (price) => {
  return Math.round(price / 1000) * 1000;
};

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
  const [errors, setErrors] = useState({});

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
    // Round adult price first
    const roundedAdultPrice = roundToThousand(adultPrice);
    // Calculate and round child and infant prices
    const childPrice = roundToThousand(roundedAdultPrice * 0.6);
    const infantPrice = roundToThousand(roundedAdultPrice * 0.3);
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

    // Validate data completion and percentage range
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

    // Validate date range (between registration open date and tour start date)
    const isValidDates = sortedPolicies.every(policy => 
      dayjs(policy.cancelBefore).isSameOrAfter(dayjs(newTourData.registerOpenDate)) && 
      dayjs(policy.cancelBefore).isSameOrBefore(dayjs(newTourData.startDate))
    );
    if (!isValidDates) {
      setSnackbar({ 
        open: true, 
        message: 'Thời gian hủy tour phải nằm sau thời gian mở đăng ký và trước ngày khởi hành', 
        severity: 'error' 
      });
      return false;
    }

    return true;
  };

  // Validation functions
  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!newTourData.startAddress?.trim()) {
      newErrors.startAddress = "Vui lòng nhập địa điểm khởi hành";
    }

    if (!newTourData.startDate) {
      newErrors.startDate = "Vui lòng chọn ngày khởi hành";
    }

    if (!newTourData.startTime) {
      newErrors.startTime = "Vui lòng chọn giờ khởi hành";
    }

    // Participants validation
    const max = Number(newTourData.maxParticipants);
    const min = Number(newTourData.minParticipants);

    if (!newTourData.maxParticipants) {
      newErrors.maxParticipants = "Vui lòng nhập số khách tối đa";
    } else if (max <= 0) {
      newErrors.maxParticipants = "Số khách tối đa phải lớn hơn 0";
    } else if (max <= min) {
      newErrors.maxParticipants = "Số khách tối đa phải lớn hơn số khách tối thiểu";
    }

    if (!newTourData.minParticipants) {
      newErrors.minParticipants = "Vui lòng nhập số khách tối thiểu";
    } else if (min <= 0) {
      newErrors.minParticipants = "Số khách tối thiểu phải lớn hơn 0";
    } else if (min >= max && max > 0) {
      newErrors.minParticipants = "Số khách tối thiểu phải nhỏ hơn số khách tối đa";
    }

    // Price validation
    if (!newTourData.adultPrice) {
      newErrors.adultPrice = "Vui lòng nhập giá người lớn";
    } else if (!validatePrice(newTourData.adultPrice, tourTemplate?.minPrice, tourTemplate?.maxPrice)) {
      newErrors.adultPrice = `Giá phải từ ${tourTemplate?.minPrice?.toLocaleString()} đến ${tourTemplate?.maxPrice?.toLocaleString()} VND`;
    }

    if (!newTourData.childPrice) {
      newErrors.childPrice = "Vui lòng nhập giá trẻ em";
    } else if (Number(newTourData.childPrice) > Number(newTourData.adultPrice)) {
      newErrors.childPrice = "Giá trẻ em phải thấp hơn giá người lớn";
    }

    if (!newTourData.infantPrice) {
      newErrors.infantPrice = "Vui lòng nhập giá em bé";
    } else if (Number(newTourData.infantPrice) > Number(newTourData.childPrice)) {
      newErrors.infantPrice = "Giá em bé phải thấp hơn giá trẻ em";
    }

    // Registration dates validation
    if (!newTourData.registerOpenDate) {
      newErrors.registerOpenDate = "Vui lòng chọn ngày mở đăng ký";
    } else if (dayjs(newTourData.registerOpenDate).isAfter(newTourData.startDate)) {
      newErrors.registerOpenDate = "Ngày mở đăng ký phải trước ngày khởi hành";
    }

    if (!newTourData.registerCloseDate) {
      newErrors.registerCloseDate = "Vui lòng chọn ngày đóng đăng ký";
    } else if (dayjs(newTourData.registerCloseDate).isAfter(newTourData.startDate) || 
               dayjs(newTourData.registerOpenDate).isAfter(newTourData.registerCloseDate)) {
      newErrors.registerCloseDate = "Ngày đóng đăng ký phải sau ngày mở đăng ký và trước ngày khởi hành";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: 'Vui lòng điền đầy đủ và chính xác thông tin',
        severity: 'error'
      });
      return;
    }

    // Validate refund policies
    if (!validateRefundPolicies()) {
      return;
    }

    const formattedPolicies = refundPolicies.map(policy => ({
      cancelBefore: dayjs(policy.cancelBefore).format('YYYY-MM-DD'),
      refundRate: Number(policy.refundRate)
    }));

    // Create tourPrices array only for child and infant prices
    const tourPrices = [
      {
        name: "Trẻ em",
        price: Number(newTourData.childPrice),
        ageFrom: 5,
        ageTo: 12
      },
      {
        name: "Em bé",
        price: Number(newTourData.infantPrice),
        ageFrom: 0,
        ageTo: 4
      }
    ];

    const tourData = {
      tourTemplateId: id,
      ...newTourData,
      defaultTouristPrice: Number(newTourData.adultPrice), // Set adult price as defaultTouristPrice
      tourPrices: tourPrices,
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

  const handleMaxParticipantsChange = (e) => {
    const value = e.target.value;
    // Allow empty value or any number
    handleNewTourChange('maxParticipants', value);
  };

  const handleMinParticipantsChange = (e) => {
    const value = e.target.value;
    // Allow empty value or any number
    handleNewTourChange('minParticipants', value);
  };

  // Validate functions for showing error messages
  const getMaxParticipantsError = () => {
    const max = Number(newTourData.maxParticipants);
    const min = Number(newTourData.minParticipants);
    
    if (!newTourData.maxParticipants) return "Vui lòng nhập số khách tối đa";
    if (max <= 0) return "Số khách tối đa phải lớn hơn 0";
    if (max <= min) return "Số khách tối đa phải lớn hơn số khách tối thiểu";
    return "";
  };

  const getMinParticipantsError = () => {
    const max = Number(newTourData.maxParticipants);
    const min = Number(newTourData.minParticipants);
    
    if (!newTourData.minParticipants) return "Vui lòng nhập số khách tối thiểu";
    if (min <= 0) return "Số khách tối thiểu phải lớn hơn 0";
    if (min >= max && max > 0) return "Số khách tối thiểu phải nhỏ hơn số khách tối đa";
    return "";
  };

  // Update price change handler
  const handlePriceChange = (e) => {
    const newAdultPrice = e.target.value;
    if (newAdultPrice === '') {
      handleNewTourChange('adultPrice', '');
      handleNewTourChange('childPrice', '');
      handleNewTourChange('infantPrice', '');
      return;
    }

    // Allow typing but don't calculate child/infant prices until it's a valid price
    handleNewTourChange('adultPrice', newAdultPrice);
    
    if (validatePrice(newAdultPrice, tourTemplate?.minPrice, tourTemplate?.maxPrice)) {
      const { childPrice, infantPrice } = calculatePrices(Number(newAdultPrice));
      handleNewTourChange('childPrice', childPrice.toString());
      handleNewTourChange('infantPrice', infantPrice.toString());
    }
  };

  return (
    <Box sx={{ display: 'flex', width: '98vw' }}>
      <Helmet>
        <title>Tạo tour mới</title>
      </Helmet>
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
                  label="Khởi hành từ"
                  fullWidth
                  variant="outlined"
                  sx={{ mb: 1, mt: 1.5 }}
                  value={newTourData.startAddress}
                  inputProps={{ style: { height: '15px' } }}
                  onChange={(e) => handleNewTourChange('startAddress', e.target.value)}
                  error={!!errors.startAddress}
                  helperText={errors.startAddress}
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box sx={{ mb: 2, mt: 1.5 }}>
                    <DatePicker
                      label="Ngày khởi hành"
                      value={newTourData.startDate}
                      format={DATE_FORMAT}
                      minDate={dayjs()}
                      onChange={(value) => handleNewTourChange('startDate', value)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          inputProps: { style: { height: '15px' }},
                          error: !!errors.startDate,
                          helperText: errors.startDate
                        }
                      }}
                    />
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <TimePicker
                      label="Giờ khởi hành"
                      value={newTourData.startTime}
                      onChange={(value) => handleNewTourChange('startTime', value)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          inputProps: { style: { height: '15px' }},
                          error: !!errors.startTime,
                          helperText: errors.startTime
                        }
                      }}
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
                  label="Số khách tối đa"
                  fullWidth
                  type="number"
                  variant="outlined"
                  sx={{ mb: 2, mt: 1.5 }}
                  value={newTourData.maxParticipants}
                  onChange={handleMaxParticipantsChange}
                  error={!!getMaxParticipantsError()}
                  helperText={getMaxParticipantsError()}
                  inputProps={{ style: { height: '15px' } }}
                />
                <TextField
                  label="Số khách tối thiểu"
                  fullWidth
                  type="number"
                  variant="outlined"
                  sx={{ mb: 1 }}
                  value={newTourData.minParticipants}
                  onChange={handleMinParticipantsChange}
                  error={!!getMinParticipantsError()}
                  helperText={getMinParticipantsError()}
                  inputProps={{ style: { height: '15px' } }}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>Giá tour</Typography>
                <TextField 
                  fullWidth 
                  type="number" 
                  label="Người lớn (trên 12 tuổi)" 
                  variant="outlined" 
                  value={newTourData.adultPrice}
                  onChange={handlePriceChange}
                  onBlur={(e) => {
                    if (e.target.value) {
                      // Round the price when the field loses focus
                      const roundedPrice = roundToThousand(Number(e.target.value));
                      handleNewTourChange('adultPrice', roundedPrice.toString());
                      if (validatePrice(roundedPrice, tourTemplate?.minPrice, tourTemplate?.maxPrice)) {
                        const { childPrice, infantPrice } = calculatePrices(roundedPrice);
                        handleNewTourChange('childPrice', childPrice.toString());
                        handleNewTourChange('infantPrice', infantPrice.toString());
                      }
                    }
                  }}
                  error={!!errors.adultPrice}
                  helperText={errors.adultPrice || `Giá phải từ ${tourTemplate?.minPrice?.toLocaleString()} đến ${tourTemplate?.maxPrice?.toLocaleString()} VND`}
                  sx={{ mb: 2, mt: 1.5 }} 
                  inputProps={{ min: 0, style: { height: '15px' } }}
                />
                <TextField 
                  fullWidth 
                  type="number" 
                  label="Trẻ em (5-12 tuổi)" 
                  variant="outlined" 
                  value={newTourData.childPrice}
                  onChange={(e) => {
                    const newChildPrice = e.target.value;
                    handleNewTourChange('childPrice', newChildPrice);
                  }}
                  onBlur={(e) => {
                    if (e.target.value) {
                      const roundedPrice = roundToThousand(Number(e.target.value));
                      handleNewTourChange('childPrice', roundedPrice.toString());
                    }
                  }}
                  error={!!errors.childPrice}
                  helperText={errors.childPrice}
                  sx={{ mb: 2 }} 
                  inputProps={{ min: 0, style: { height: '15px' } }}
                />
                <TextField 
                  fullWidth 
                  type="number" 
                  label="Em bé (dưới 5 tuổi)" 
                  variant="outlined" 
                  value={newTourData.infantPrice}
                  onChange={(e) => {
                    const newInfantPrice = e.target.value;
                    handleNewTourChange('infantPrice', newInfantPrice);
                  }}
                  onBlur={(e) => {
                    if (e.target.value) {
                      const roundedPrice = roundToThousand(Number(e.target.value));
                      handleNewTourChange('infantPrice', roundedPrice.toString());
                    }
                  }}
                  error={!!errors.infantPrice}
                  helperText={errors.infantPrice}
                  sx={{ mb: 1.5 }} 
                  inputProps={{ min: 0, style: { height: '15px' } }}
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
                  label="Hủy trước ngày" 
                  value={policy.cancelBefore} 
                  format={DATE_FORMAT}
                  onChange={(newValue) => handlePolicyChange(index, 'cancelBefore', newValue)}
                  minDate={dayjs(newTourData.registerOpenDate)}
                  maxDate={dayjs(newTourData.startDate).subtract(1, 'day')}
                  slotProps={{
                    textField: { 
                      fullWidth: true, 
                      inputProps: { style: { height: '15px' }},
                      error: policy.cancelBefore && (
                        dayjs(policy.cancelBefore).isBefore(dayjs(newTourData.registerOpenDate)) ||
                        dayjs(policy.cancelBefore).isAfter(dayjs(newTourData.startDate))
                      ),
                      helperText: policy.cancelBefore && (
                        dayjs(policy.cancelBefore).isBefore(dayjs(newTourData.registerOpenDate)) ||
                        dayjs(policy.cancelBefore).isAfter(dayjs(newTourData.startDate))
                      ) ? 
                        "Thời gian hủy tour phải nằm sau thời gian mở đăng ký và trước ngày khởi hành" : 
                        ""
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