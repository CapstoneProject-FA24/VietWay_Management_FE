import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, Grid, TextField, InputAdornment, Snackbar, Alert, Collapse } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import SidebarStaff from '@layouts/SidebarStaff';
import { fetchTourTemplateById } from '@services/TourTemplateService';
import { fetchToursByTemplateId, createTour } from '@services/TourService';
import '@styles/Calendar.css';
import 'react-calendar/dist/Calendar.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import TourCalendar from '@components/tour/TourCalendar';
import TourTemplateInfo from '@components/tour/TourTemplateInfo';
import { Helmet } from 'react-helmet';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import TourMap from '@components/tour/TourMap';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
const DATE_FORMAT = "DD/MM/YYYY";
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
  const [tourData, setTourData] = useState({
    tourTemplateId: id, startAddress: '', startLocationPlaceId: '', startDate: null, startTime: null,
    adultPrice: '', registerOpenDate: null, registerCloseDate: null, maxParticipants: '', minParticipants: '',
    depositPercent: '', tourPrices: [], refundPolicies: [], paymentDeadline: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success', hide: 5000 });
  const [errors, setErrors] = useState({});
  const [startAddressError, setStartAddressError] = useState("");
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);

  useEffect(() => {
    const fetchTours = async () => {
      setIsLoading(true);
      try {
        const fetchedTours = await fetchToursByTemplateId(id);
        setTours(fetchedTours);
        const fetchedTourTemplate = await fetchTourTemplateById(id);
        setTourTemplate(fetchedTourTemplate);
        setIsLoading(false);
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
    setTourData(prev => ({ ...prev, [field]: value }));
  };

  const validatePrice = (price, minPrice, maxPrice) => {
    const numPrice = Number(price);
    if (isNaN(numPrice)) return false;
    if (!price) return true;
    return numPrice >= minPrice && numPrice <= maxPrice;
  };

  const handleAddPolicy = () => {
    setTourData(prev => ({
      ...prev,
      refundPolicies: [...prev.refundPolicies, { cancelBefore: null, refundRate: '' }]
    }));
  };

  const handleRemovePolicy = (index) => {
    setTourData(prev => ({
      ...prev,
      refundPolicies: prev.refundPolicies.filter((_, i) => i !== index)
    }));
  };

  const handlePolicyChange = (index, field, value) => {
    setTourData(prev => ({
      ...prev,
      refundPolicies: prev.refundPolicies.map((policy, i) =>
        i === index ? { ...policy, [field]: value } : policy
      )
    }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const validateRefundPolicies = (policies, registerOpenDate, startDate, paymentDeadline, depositPercent) => {
    const errors = {};

    // Check for duplicates
    for (let i = 0; i < policies.length; i++) {
      const currentPolicy = policies[i];
      
      for (let j = i + 1; j < policies.length; j++) {
        const otherPolicy = policies[j];
        
        // Skip if either policy is incomplete
        if (!currentPolicy.cancelBefore || !otherPolicy.cancelBefore || 
            currentPolicy.refundRate === '' || otherPolicy.refundRate === '') {
          continue;
        }

        // Check for same date
        if (dayjs(currentPolicy.cancelBefore).isSame(otherPolicy.cancelBefore, 'day')) {
          errors[`policy${i}Date`] = 'Không được trùng ngày với chính sách khác';
          errors[`policy${j}Date`] = 'Không được trùng ngày với chính sách khác';
        }

        // Check for same refund rate
        if (Number(currentPolicy.refundRate) === Number(otherPolicy.refundRate)) {
          errors[`policy${i}Rate`] = 'Không được trùng tỷ lệ phạt hủy tour với chính sách khác';
          errors[`policy${j}Rate`] = 'Không được trùng tỷ lệ phạt hủy tour với chính sách khác';
        }
      }

      // Existing validations
      if (!currentPolicy.cancelBefore) {
        errors[`policy${i}Date`] = 'Vui lòng nhập ngày hủy tour';
      } else if (!dayjs(currentPolicy.cancelBefore).isSameOrAfter(dayjs(registerOpenDate)) ||
        !dayjs(currentPolicy.cancelBefore).isSameOrBefore(dayjs(startDate))) {
        errors[`policy${i}Date`] = 'Thời gian hủy tour phải nằm sau thời gian mở đăng ký và trước ngày khởi hành';
      }

      if (currentPolicy.refundRate === '') {
        errors[`policy${i}Rate`] = 'Vui lòng nhập tỷ lệ phạt hủy tour';
      } else if (Number(currentPolicy.refundRate) <= 0 || Number(currentPolicy.refundRate) >= 100) {
        errors[`policy${i}Rate`] = 'Tỷ lệ phạt hủy tour phải từ 1 đến 99%';
      } else if (paymentDeadline && Number(depositPercent) < 100) {
        const refundPercent = Number(currentPolicy.refundRate);
        const deposit = Number(depositPercent);

        if (dayjs(currentPolicy.cancelBefore).isSameOrBefore(dayjs(paymentDeadline))) {
          if (refundPercent > deposit) {
            errors[`policy${i}Rate`] = `Trước hạn thanh toán, tỷ lệ phạt hủy tour không được vượt quá tỷ lệ đặt cọc (${deposit}%)`;
          }
        } else {
          if (refundPercent <= deposit) {
            errors[`policy${i}Rate`] = `Sau hạn thanh toán, tỷ lệ phạt hủy tour phải lớn hơn tỷ lệ đặt cọc (${deposit}%)`;
          }
        }
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors: errors
    };
  };

  const validateForm = () => {
    const newErrors = {};
    if (!tourData.startAddress) {
      newErrors.startAddress = "Vui lòng nhập địa điểm khởi hành";
    }

    if (!tourData.startDate) {
      newErrors.startDate = "Vui lòng chọn ngày khởi hành";
    } else if (!dayjs(tourData.startDate).isAfter(dayjs(), 'day')) {
      newErrors.startDate = "Ngày khởi hành phải sau ngày hiện tại ít nhất 1 ngày";
    }

    if (!tourData.startTime) {
      newErrors.startTime = "Vui lòng chọn giờ khởi hành";
    }

    if (!tourData.registerOpenDate) {
      newErrors.registerOpenDate = "Vui lòng chọn ngày mở đăng ký";
    } else if (dayjs(tourData.registerOpenDate).isAfter(tourData.startDate)) {
      newErrors.registerOpenDate = "Ngày mở đăng ký phải trước ngày khởi hành";
    } else if (dayjs(tourData.registerOpenDate).isBefore(dayjs(), 'day')) {
      newErrors.registerOpenDate = "Ngày mở đăng ký không được là ngày trong quá khứ";
    }

    if (!tourData.registerCloseDate) {
      newErrors.registerCloseDate = "Vui lòng chọn ngày đóng đăng ký";
    }

    if (tourData.registerOpenDate && tourData.startDate) {
      if (dayjs(tourData.registerOpenDate).isAfter(tourData.startDate)) {
        newErrors.registerOpenDate = "Ngày mở đăng ký phải trước ngày khởi hành";
      }
    }

    if (tourData.registerCloseDate && tourData.startDate) {
      if (dayjs(tourData.registerCloseDate).isAfter(tourData.startDate)) {
        newErrors.registerCloseDate = "Ngày đóng đăng ký phải trước ngày khởi hành";
      }
    }

    if (tourData.registerOpenDate && tourData.registerCloseDate) {
      if (dayjs(tourData.registerOpenDate).isAfter(tourData.registerCloseDate)) {
        newErrors.registerCloseDate = "Ngày đóng đăng ký phải sau ngày mở đăng ký";
      }
    }

    if (!tourData.depositPercent) {
      newErrors.depositPercent = "Vui lòng nhập phần trăm đặt cọc";
    } else {
      const depositPercent = Number(tourData.depositPercent);
      if (isNaN(depositPercent) || depositPercent < 30 || depositPercent > 100) {
        newErrors.depositPercent = "Phần trăm đặt cọc phải từ 30% đến 100%";
      }
    }

    if (Number(tourData.depositPercent) < 100) {
      if (!tourData.paymentDeadline) {
        newErrors.paymentDeadline = "Vui lòng chọn thời hạn thanh toán";
      } else if (tourData.paymentDeadline) {
        if (dayjs(tourData.paymentDeadline).isAfter(tourData.startDate)) {
          newErrors.paymentDeadline = "Thời hạn thanh toán phải trước ngày khởi hành";
        } else if (tourData.registerOpenDate && dayjs(tourData.paymentDeadline).isBefore(tourData.registerOpenDate)) {
          newErrors.paymentDeadline = "Thời hạn thanh toán phải sau ngày mở đăng ký";
        }
      }
    }

    if (!tourData.maxParticipants) {
      newErrors.maxParticipants = "Vui lòng nhập số khách tối đa";
    } else if (Number(tourData.maxParticipants) <= 0) {
      newErrors.maxParticipants = "Số khách tối đa phải lớn hơn 0";
    }

    if (!tourData.minParticipants) {
      newErrors.minParticipants = "Vui lòng nhập số khách tối thiểu";
    } else if (Number(tourData.minParticipants) <= 0) {
      newErrors.minParticipants = "Số khách tối thiểu phải lớn hơn 0";
    }

    if (tourData.minParticipants && tourData.maxParticipants) {
      if (Number(tourData.minParticipants) > Number(tourData.maxParticipants)) {
        newErrors.minParticipants = "Số khách tối thiểu không được lớn hơn số khách tối đa";
      }
    }

    if (!tourData.adultPrice) {
      newErrors.adultPrice = "Vui lòng nhập giá người lớn";
    } else if (!validatePrice(tourData.adultPrice, tourTemplate?.minPrice, tourTemplate?.maxPrice)) {
      newErrors.adultPrice = `Giá phải từ ${tourTemplate?.minPrice?.toLocaleString()} đến ${tourTemplate?.maxPrice?.toLocaleString()} VND`;
    }

    if (!tourData.childPrice) {
      newErrors.childPrice = "Vui lòng nhập giá trẻ em";
    } else if (!validatePrice(tourData.childPrice, tourTemplate?.minPrice, tourTemplate?.maxPrice)) {
      newErrors.childPrice = `Giá phải từ ${tourTemplate?.minPrice?.toLocaleString()} đến ${tourTemplate?.maxPrice?.toLocaleString()} VND`;
    } else if (tourData.childPrice === '0' || (Number(tourData.childPrice) > Number(tourData.adultPrice) && tourData.adultPrice)) {
      newErrors.childPrice = `Giá phải lớn hơn 0 VND và nhỏ hơn hoặc bằng giá người lớn`;
    }

    if (!tourData.infantPrice) {
      newErrors.infantPrice = "Vui lòng nhập giá em bé";
    } else if (!validatePrice(tourData.infantPrice, tourTemplate?.minPrice, tourTemplate?.maxPrice)) {
      newErrors.infantPrice = `Giá phải từ ${tourTemplate?.minPrice?.toLocaleString()} đến ${tourTemplate?.maxPrice?.toLocaleString()} VND`;
    } else if (tourData.infantPrice === '0' || (Number(tourData.infantPrice) > Number(tourData.childPrice) && tourData.childPrice)) {
      newErrors.infantPrice = `Giá phải lớn hơn 0 VND và nhỏ hơn hoặc bằng giá trẻ em`;
    }

    const policyValidation = validateRefundPolicies(
      tourData.refundPolicies,
      tourData.registerOpenDate,
      tourData.startDate,
      tourData.paymentDeadline,
      tourData.depositPercent
    );

    if (!policyValidation.isValid) {
      Object.assign(newErrors, policyValidation.errors);
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setSnackbar({
        open: true,
        severity: 'warning',
        hide: 5000,
        message: 'Vui lòng nhập đầy đủ và chính xác thông tin để lưu',
      });
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      const formattedPolicies = tourData.refundPolicies.map(policy => ({
        cancelBefore: dayjs(policy.cancelBefore).format('YYYY-MM-DD'),
        refundRate: Number(policy.refundRate)
      }));

      const tourPrices = [
        { name: "Trẻ em", price: Number(tourData.childPrice), ageFrom: 5, ageTo: 11 },
        { name: "Em bé", price: Number(tourData.infantPrice), ageFrom: 0, ageTo: 4 }
      ];

      const registerOpenDate = dayjs(tourData.registerOpenDate).startOf('day');
      const registerCloseDate = dayjs(tourData.registerCloseDate).endOf('day');

      const formData = {
        tourTemplateId: id,
        ...tourData,
        registerOpenDate: registerOpenDate.toDate(),
        registerCloseDate: registerCloseDate.toDate(),
        defaultTouristPrice: Number(tourData.adultPrice),
        tourPrices: tourPrices,
        refundPolicies: formattedPolicies,
        depositPercent: Number(tourData.depositPercent),
        paymentDeadline: Number(tourData.depositPercent) === 100 ? null : tourData.paymentDeadline
      };

      const response = await createTour(formData);
      setSnackbar({ open: true, message: 'Tạo tour thành công', severity: 'success', hide: 1500 });
      setTimeout(() => {
        navigate('/nhan-vien/tour-du-lich/chi-tiet/' + response.data);
      }, 1500);
    } catch (error) {
      setSnackbar({ open: true, message: 'Có lỗi xảy ra khi tạo tour', severity: 'error', hide: 5000 });
      console.error('Error creating tour:', error);
    }
  };

  const handleMaxParticipantsChange = (e) => {
    const value = e.target.value;
    handleNewTourChange('maxParticipants', value);
  };

  const handleMinParticipantsChange = (e) => {
    const value = e.target.value;
    handleNewTourChange('minParticipants', value);
  };

  const handlePriceChange = (e) => {
    const newAdultPrice = e.target.value;
    handleNewTourChange('adultPrice', newAdultPrice);
  };

  const handleSelectLocation = async (placeData) => {
    const template = await fetchTourTemplateById(id);
    if (!placeData || !placeData.address) {
      return;
    }

    const fullAddress = placeData.name === placeData.address
      ? placeData.address
      : `${placeData.name} - ${placeData.address}`;

    handleNewTourChange('startAddress', fullAddress);
    handleNewTourChange('startLocationPlaceId', placeData.place_id);

    const isValid = validateAddress(fullAddress, template);
    setStartAddressError(isValid ? '' :
      `Địa điểm phải thuộc ${template?.startingProvince?.provinceName}. Nếu bạn chắc chắn đúng địa điểm vui lòng bỏ qua thông báo này.`
    );
  };

  const validateAddress = (address, template) => {
    if (!address || !template?.startingProvince?.provinceName) {
      return false;
    }

    const normalize = (text) => {
      return text.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/\s+/g, '')
        .replace(/[,\.]/g, '');
    };

    const normalizedAddress = normalize(address);
    const normalizedProvince = normalize(template.startingProvince.provinceName);

    return normalizedAddress.includes(normalizedProvince);
  };

  const handleAddressChange = (e) => {
    const newAddress = e.target.value;
    handleNewTourChange('startAddress', newAddress);

    // Validate the new address
    const isValid = validateAddress(newAddress, tourTemplate);
    setStartAddressError(isValid ? '' :
      `Địa điểm phải thuộc ${tourTemplate?.startingProvince?.provinceName}. Nếu bạn chắc chắn đúng địa điểm vui lòng bỏ qua thông báo này.`
    );
  };

  return (
    <Box sx={{ display: 'flex', width: '98vw' }}>
      <Helmet><title>Tạo tour mới</title></Helmet>
      <SidebarStaff isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Box component="main" sx={{ flexGrow: 1, pl: 6, pr: 8, pt: 4, pb: 4, marginLeft: isSidebarOpen ? '280px' : 3, transition: 'margin 0.3s', mt: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} sx={{ ml: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Button startIcon={<ArrowBackIcon />} sx={{ width: 'fit-content' }} onClick={() => navigate('/nhan-vien/tour-du-lich/tour-mau-duoc-duyet')}>Quay lại</Button>
              <Typography variant="h4" sx={{ fontSize: '2.7rem', fontWeight: 600, color: 'primary.main', alignSelf: 'center', marginBottom: '1rem' }}>Tạo tour mới</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={12}><TourTemplateInfo tourTemplate={tourTemplate} isLoading={isLoading} /></Grid>
          <Grid item xs={12} md={12}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.secondary', textAlign: 'center', width: '85%', pl: 20 }}>
                  Lịch tour
                </Typography>
                <Button
                  onClick={() => setIsCalendarExpanded(!isCalendarExpanded)}
                  endIcon={isCalendarExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                >
                  {isCalendarExpanded ? 'Thu gọn' : 'Xem thêm'}
                </Button>
              </Box>

              <Collapse in={isCalendarExpanded}>
                <TourCalendar tourId={null} tours={tours} selectedMonth={selectedMonth} handleMonthChange={handleMonthChange} />
              </Collapse>
            </Paper>
          </Grid>
          <Grid item xs={12} md={12}>
            <Paper elevation={2} sx={{ pl: 5, pr: 5, pt: 2, pb: 3 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', fontWeight: 700, mb: 0.5, color: 'primary.main' }}>
                Thông tin tour
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>Thông tin khởi hành</Typography>
                <Typography sx={{ display: 'flex', justifyContent: 'flex-end', fontSize: '0.77rem', mb: -1.5 }}>
                  Tour phải khởi hành từ {tourTemplate?.startingProvince?.provinceName}
                </Typography>
                <TextField
                  label="Khởi hành từ * (có thể chọn từ bản đồ)" fullWidth variant="outlined"
                  value={tourData.startAddress} onChange={handleAddressChange}
                  error={!!errors.startAddress} helperText={errors.startAddress}
                  sx={{ mb: 2, mt: 1.5 }} inputProps={{ style: { height: '15px' } }}
                />
                <Typography sx={{ fontSize: '0.75rem', color: 'red', mt: -2, mb: 2 }} >
                  {startAddressError}
                </Typography>
                <Box sx={{
                  height: '500px', width: '100%', position: 'relative', mb: 3,
                  overflow: 'hidden', borderRadius: '10px', border: '1px solid #e0e0e0'
                }}>
                  <TourMap
                    onPlaceSelect={handleSelectLocation}
                    startingProvince={tourTemplate?.startingProvince?.provinceName}
                  />
                </Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Box sx={{ mb: 2 }}>
                    <DatePicker
                      label="Ngày khởi hành *" value={tourData.startDate}
                      onChange={(value) => handleNewTourChange('startDate', value)}
                      format={DATE_FORMAT} minDate={dayjs()}
                      slotProps={{
                        textField: {
                          fullWidth: true, error: !!errors.startDate,
                          helperText: errors.startDate, inputProps: { style: { height: '15px' } }
                        }
                      }}
                    />
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <TimePicker
                      label="Giờ khởi hành *" value={tourData.startTime}
                      onChange={(value) => handleNewTourChange('startTime', value)}
                      slotProps={{
                        textField: {
                          fullWidth: true, error: !!errors.startTime,
                          helperText: errors.startTime, inputProps: { style: { height: '15px' } }
                        }
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, mt: 2 }}>Thời gian đăng ký</Typography>
                    <Box sx={{ mb: 2, mt: 1.5 }}>
                      <DatePicker
                        label="Ngày mở đăng ký *" value={tourData.registerOpenDate} format={DATE_FORMAT}
                        onChange={(value) => handleNewTourChange('registerOpenDate', value)}
                        minDate={dayjs()} maxDate={dayjs(tourData.startDate).subtract(1, 'day')}
                        slotProps={{
                          textField: {
                            fullWidth: true, inputProps: { style: { height: '15px' } },
                            error: !!errors.registerOpenDate, helperText: errors.registerOpenDate
                          }
                        }}
                      />
                    </Box>
                    <Box sx={{ mb: 1 }}>
                      <DatePicker
                        label="Ngày đóng đăng ký *" value={tourData.registerCloseDate}
                        format={DATE_FORMAT} onChange={(value) => handleNewTourChange('registerCloseDate', value)}
                        minDate={tourData.registerOpenDate || dayjs()} maxDate={dayjs(tourData.startDate).subtract(1, 'day')}
                        slotProps={{
                          textField: {
                            fullWidth: true, inputProps: { style: { height: '15px' } },
                            error: !!errors.registerCloseDate, helperText: errors.registerCloseDate
                          }
                        }}
                      />
                    </Box>
                  </Box>
                </LocalizationProvider>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>Số lượng khách</Typography>
                <TextField
                  label="Số khách tối đa *" fullWidth type="number"
                  variant="outlined" sx={{ mb: 2, mt: 1.5 }} value={tourData.maxParticipants}
                  onChange={handleMaxParticipantsChange} error={!!errors.maxParticipants}
                  helperText={errors.maxParticipants} inputProps={{ style: { height: '15px' } }}
                />
                <TextField
                  label="Số khách tối thiểu *" fullWidth type="number"
                  variant="outlined" sx={{ mb: 1 }} value={tourData.minParticipants}
                  onChange={handleMinParticipantsChange} error={!!errors.minParticipants}
                  helperText={errors.minParticipants} inputProps={{ style: { height: '15px' } }}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2"><span style={{ fontWeight: 700 }}>Giá tour</span> (phải từ {tourTemplate?.minPrice?.toLocaleString()} đến {tourTemplate?.maxPrice?.toLocaleString()} VND)</Typography>
                <Typography sx={{ display: 'flex', justifyContent: 'flex-end', fontSize: '0.77rem', mb: -1.5 }}>
                  Giá phải từ {tourTemplate?.minPrice?.toLocaleString()} đến {tourTemplate?.maxPrice?.toLocaleString()} VND
                </Typography>
                <TextField
                  fullWidth type="number" label="Người lớn (từ 12 tuổi trở lên) *" variant="outlined"
                  value={tourData.adultPrice} onChange={handlePriceChange}
                  onBlur={(e) => {
                    if (e.target.value) {
                      const roundedPrice = roundToThousand(Number(e.target.value));
                      handleNewTourChange('adultPrice', roundedPrice.toString());
                    }
                  }}
                  error={!!errors.adultPrice} helperText={errors.adultPrice} sx={{ mb: 2, mt: 1.5 }}
                  inputProps={{ min: 0, style: { height: '15px' } }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">VND</InputAdornment>
                  }}
                />
                <Typography sx={{ display: 'flex', justifyContent: 'flex-end', fontSize: '0.77rem' }}>
                  Giá phải từ {tourTemplate?.minPrice?.toLocaleString()} đến {tourTemplate?.maxPrice?.toLocaleString()} VND và nhỏ hơn hoặc bằng giá người lớn.
                </Typography>
                <TextField
                  fullWidth type="number" label="Trẻ em (từ 5-11 tuổi) *" variant="outlined" value={tourData.childPrice}
                  onChange={(e) => handleNewTourChange('childPrice', e.target.value)}
                  onBlur={(e) => {
                    if (e.target.value) {
                      const roundedPrice = roundToThousand(Number(e.target.value));
                      handleNewTourChange('childPrice', roundedPrice.toString());
                    }
                  }}
                  error={!!errors.childPrice} helperText={errors.childPrice} sx={{ mb: 2 }}
                  inputProps={{ min: 0, style: { height: '15px' } }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">VND</InputAdornment>
                  }}
                />
                <Typography sx={{ display: 'flex', justifyContent: 'flex-end', fontSize: '0.77rem' }}>
                  Giá phải từ {tourTemplate?.minPrice?.toLocaleString()} đến {tourTemplate?.maxPrice?.toLocaleString()} VND và nhỏ hơn hoặc bằng giá trẻ em.
                </Typography>
                <TextField
                  fullWidth type="number" label="Em bé (dưới 5 tuổi) *" variant="outlined" value={tourData.infantPrice}
                  onChange={(e) => handleNewTourChange('infantPrice', e.target.value)}
                  onBlur={(e) => {
                    if (e.target.value) {
                      const roundedPrice = roundToThousand(Number(e.target.value));
                      handleNewTourChange('infantPrice', roundedPrice.toString());
                    }
                  }}
                  error={!!errors.infantPrice} helperText={errors.infantPrice} sx={{ mb: 1.5 }}
                  inputProps={{ min: 0, style: { height: '15px' } }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">VND</InputAdornment>
                  }}
                />
              </Box>
              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>Chính sách thanh toán</Typography>
                <Typography sx={{ display: 'flex', justifyContent: 'flex-end', fontSize: '0.77rem', mb: -1.2 }}>
                  Nhập 100 nếu tour yêu cầu thanh toán 100% và không đặt cọc
                </Typography>
                <TextField
                  label="Yêu cầu cọc (%) * - tính trên tổng tiền booking"
                  type="number" sx={{ width: '100%', mt: 1.5, mb: 2 }}
                  value={tourData.depositPercent}
                  onChange={(e) => {
                    handleNewTourChange('depositPercent', e.target.value);
                    if (Number(e.target.value) === 100) {
                      handleNewTourChange('paymentDeadline', null);
                    }
                  }}
                  error={!!errors.depositPercent} helperText={errors.depositPercent}
                  InputProps={{ style: { height: '50px' }, endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                />
                {Number(tourData.depositPercent) < 100 && (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Thời hạn thanh toán toàn bộ tổng tiền booking *" value={tourData.paymentDeadline}
                      onChange={(value) => handleNewTourChange('paymentDeadline', value)} format="DD/MM/YYYY"
                      minDate={tourData.registerOpenDate} maxDate={dayjs(tourData.startDate).subtract(1, 'day')}
                      slotProps={{
                        textField: {
                          fullWidth: true, error: !!errors.paymentDeadline,
                          helperText: errors.paymentDeadline, inputProps: { style: { height: '17px' } }
                        }
                      }}
                    />
                  </LocalizationProvider>
                )}
              </Box>
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>Chính sách hủy tour</Typography>
                  {tourData.refundPolicies.length === 0 && (
                    <Typography variant="body2" sx={{ color: 'warning.main', fontStyle: 'italic' }}>
                      * Nếu không thêm chính sách hủy tour, tour này sẽ không hỗ trợ hoàn tiền khi khách hàng hủy tour
                    </Typography>
                  )}
                </Box>
                {tourData.refundPolicies.map((policy, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Hủy trước ngày *" value={policy.cancelBefore}
                        onChange={(value) => handlePolicyChange(index, 'cancelBefore', value)} format={DATE_FORMAT}
                        minDate={tourData.registerOpenDate} maxDate={tourData.startDate}
                        slotProps={{
                          textField: {
                            fullWidth: true, error: !!errors[`policy${index}Date`], helperText: errors[`policy${index}Date`]
                          }
                        }}
                      />
                    </LocalizationProvider>
                    <TextField
                      label="Tỷ lệ phạt hủy tour (%) * - tính trên tổng tiền booking" type="number" value={policy.refundRate}
                      onChange={(e) => handlePolicyChange(index, 'refundRate', e.target.value)}
                      error={!!errors[`policy${index}Rate`]} helperText={errors[`policy${index}Rate`]} fullWidth
                    />
                    <Button
                      variant="outlined" color="error" sx={{ height: '2.5rem', mt: 1 }}
                      onClick={() => handleRemovePolicy(index)}
                    >
                      Xóa
                    </Button>
                  </Box>
                ))}
                {errors.refundPolicies && (
                  <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>  {errors.refundPolicies} </Typography>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'right', mt: 2 }}>
                  <Button variant="outlined" onClick={handleAddPolicy} startIcon={<AddIcon />} >Thêm chính sách</Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button variant="contained" color="primary" onClick={handleSubmit}> Gửi </Button>
        </Box>
      </Box>
      <Snackbar open={snackbar.open} autoHideDuration={snackbar.hide} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateTour;