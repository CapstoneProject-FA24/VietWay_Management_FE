import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, Grid, Snackbar, Alert } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { updateTour } from '@services/TourService';
import { InputAdornment } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const validateRefundPolicies = (tourPolicies, registerOpenDate, startDate) => {
  if (tourPolicies.length === 0) {
    return { isValid: false, message: 'Vui lòng thêm ít nhất một chính sách hoàn tiền' };
  }

  const sortedPolicies = [...tourPolicies];
  
  // Check each policy individually and return index-specific errors
  for (let i = 0; i < sortedPolicies.length; i++) {
    const policy = sortedPolicies[i];
    if (!policy.cancelBefore || policy.refundPercent === '') {
      return { 
        isValid: false, 
        index: i,
        message: 'Vui lòng điền đầy đủ thông tin cho chính sách hoàn tiền' 
      };
    }
    
    if (Number(policy.refundPercent) < 0 || Number(policy.refundPercent) > 100) {
      return { 
        isValid: false, 
        index: i,
        message: 'Tỷ lệ hoàn tiền phải từ 0 đến 100%' 
      };
    }

    if (!dayjs(policy.cancelBefore).isSameOrAfter(dayjs(registerOpenDate)) ||
        !dayjs(policy.cancelBefore).isSameOrBefore(dayjs(startDate))) {
      return {
        isValid: false,
        index: i,
        message: 'Thời gian hủy tour phải nằm sau thời gian mở đăng ký và trước ngày khởi hành'
      };
    }
  }
  
  return { isValid: true };
};

const TourUpdateForm = ({ tour, onUpdateSuccess, maxPrice, minPrice }) => {
  const navigate = useNavigate();

  const initialStartTime = () => {
    const [hours, minutes] = tour.startTime.split(':');
    return dayjs().hour(parseInt(hours)).minute(parseInt(minutes));
  };

  const [tourData, setTourData] = useState({
    startLocation: tour.startLocation || '',
    startDate: dayjs(tour.startDate),
    startTime: initialStartTime(),
    defaultTouristPrice: tour.defaultTouristPrice || '',
    registerOpenDate: dayjs(tour.registerOpenDate),
    registerCloseDate: dayjs(tour.registerCloseDate),
    minParticipant: tour.minParticipant || '',
    maxParticipant: tour.maxParticipant || '',
    tourPrices: [
      { name: "Trẻ em", ageFrom: 5, ageTo: 12, price: tour.tourPrices?.find(p => p.name === "Trẻ em")?.price || 0 },
      { name: "Em bé", ageFrom: 0, ageTo: 4, price: tour.tourPrices?.find(p => p.name === "Em bé")?.price || 0 }
    ],
    tourPolicies: tour.tourPolicies?.map(policy => ({
      cancelBefore: dayjs(policy.cancelBefore),
      refundPercent: policy.refundPercent
    })) || [{ cancelBefore: null, refundPercent: '' }]
  });

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [policyErrors, setPolicyErrors] = useState({});

  const validatePrice = (price, minPrice, maxPrice) => {
    const numPrice = Number(price);
    return numPrice >= minPrice && numPrice <= maxPrice;
  };

  const roundToThousand = (price) => { return Math.round(price / 1000) * 1000; };

  const calculatePrices = (adultPrice) => {
    const roundedAdultPrice = roundToThousand(adultPrice);
    const childPrice = roundToThousand(roundedAdultPrice * 0.6);
    const infantPrice = roundToThousand(roundedAdultPrice * 0.3);
    return { childPrice, infantPrice };
  };

  // Update handlePriceChange to ensure positive values
  const handlePriceChange = (e) => {
    const newAdultPrice = e.target.value;
    
    // Allow empty or positive numbers only
    if (newAdultPrice === '' || Number(newAdultPrice) >= 0) {
      if (newAdultPrice === '') {
        setTourData(prev => ({
          ...prev,
          defaultTouristPrice: '',
          tourPrices: [
            { ...prev.tourPrices[0], price: '' },
            { ...prev.tourPrices[1], price: '' }
          ]
        }));
        return;
      }

      // Always update the adult price
      setTourData(prev => ({ ...prev, defaultTouristPrice: newAdultPrice }));

      // Only calculate child/infant prices if the adult price is valid
      if (validatePrice(Number(newAdultPrice), minPrice, maxPrice)) {
        const roundedPrice = roundToThousand(Number(newAdultPrice));
        const { childPrice, infantPrice } = calculatePrices(roundedPrice);
        setTourData(prev => ({
          ...prev,
          tourPrices: [
            { ...prev.tourPrices[0], price: childPrice.toString() },
            { ...prev.tourPrices[1], price: infantPrice.toString() }
          ]
        }));
      }
    }
  };

  // Update handlePriceTypeChange to ensure positive values
  const handlePriceTypeChange = (index, value) => {
    // Allow empty or positive numbers only
    if (value === '' || Number(value) >= 0) {
      const newPrices = [...tourData.tourPrices];
      newPrices[index] = { ...newPrices[index], price: value };
      setTourData(prev => ({ ...prev, tourPrices: newPrices }));
    }
  };

  // Update validateForm to include comprehensive price validation
  const validateForm = () => {
    const newErrors = {};

    if (!tourData.startLocation?.trim()) {
      newErrors.startLocation = "Vui lòng nhập địa điểm khởi hành";
    }

    if (!tourData.startDate) {
      newErrors.startDate = "Vui lòng chọn ngày khởi hành";
    }

    if (!tourData.startTime) {
      newErrors.startTime = "Vui lòng chọn giờ khởi hành";
    }

    if (!tourData.defaultTouristPrice) {
      newErrors.defaultTouristPrice = "Vui lòng nhập giá người lớn";
    } else if (!validatePrice(tourData.defaultTouristPrice, minPrice, maxPrice)) {
      newErrors.defaultTouristPrice = `Giá phải từ ${minPrice?.toLocaleString()} đến ${maxPrice?.toLocaleString()} VND`;
    }

    const adultPrice = Number(tourData.defaultTouristPrice);
    const childPrice = Number(tourData.tourPrices[0].price);
    const infantPrice = Number(tourData.tourPrices[1].price);

    if (!tourData.tourPrices[0].price) {
      newErrors.childPrice = "Vui lòng nhập giá trẻ em";
    } else if (childPrice <= 0) {
      newErrors.childPrice = "Giá trẻ em phải lớn hơn 0";
    } else if (childPrice >= adultPrice) {
      newErrors.childPrice = "Giá trẻ em phải thấp hơn giá người lớn";
    } 

    if (!tourData.tourPrices[1].price) {
      newErrors.infantPrice = "Vui lòng nhập giá em bé";
    } else if (infantPrice <= 0) {
      newErrors.infantPrice = "Giá em bé phải lớn hơn 0";
    } else if (infantPrice >= childPrice) {
      newErrors.infantPrice = "Giá em bé phải thấp hơn giá trẻ em";
    }

    if (!tourData.registerOpenDate) {
      newErrors.registerOpenDate = "Vui lòng chọn ngày mở đăng ký";
    } else if (dayjs(tourData.registerOpenDate).isAfter(tourData.startDate)) {
      newErrors.registerOpenDate = "Ngày mở đăng ký phải trước ngày khởi hành";
    }

    if (!tourData.registerCloseDate) {
      newErrors.registerCloseDate = "Vui lòng chọn ngày đóng đăng ký";
    } else if (dayjs(tourData.registerCloseDate).isAfter(tourData.startDate) ||
      dayjs(tourData.registerOpenDate).isAfter(tourData.registerCloseDate)) {
      newErrors.registerCloseDate = "Ngày đóng đăng ký phải sau ngày mở đăng ký và trước ngày khởi hành";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getMaxParticipantsError = () => {
    const max = Number(tourData.maxParticipant);
    const min = Number(tourData.minParticipant);

    if (!tourData.maxParticipant) return "Vui lòng nhập số khách tối đa";
    if (max <= 0) return "Số khách tối đa phải lớn hơn 0";
    if (max <= min) return "Số khách tối đa phải lớn hơn số khách tối thiểu";
    return "";
  };

  const getMinParticipantsError = () => {
    const max = Number(tourData.maxParticipant);
    const min = Number(tourData.minParticipant);

    if (!tourData.minParticipant) return "Vui lòng nhập số khách tối thiểu";
    if (min <= 0) return "Số khách tối thiểu phải lớn hơn 0";
    if (min >= max && max > 0) return "Số khách tối thiểu phải nhỏ hơn số khách tối đa";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: 'Vui lòng điền đầy đủ và chính xác thông tin',
        severity: 'error'
      });
      return;
    }

    const policyValidation = validateRefundPolicies(
      tourData.tourPolicies,
      tourData.registerOpenDate,
      tourData.startDate
    );

    if (!policyValidation.isValid) {
      if (policyValidation.index !== undefined) {
        // Set error for specific policy
        setPolicyErrors({ [policyValidation.index]: policyValidation.message });
      }
      setSnackbar({
        open: true,
        message: policyValidation.message,
        severity: 'error'
      });
      return;
    }

    // Clear policy errors if validation passes
    setPolicyErrors({});

    try {
      const startDateTime = dayjs(tourData.startDate)
        .hour(tourData.startTime.hour())
        .minute(tourData.startTime.minute())
        .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

      const formattedData = {
        startAddress: tourData.startLocation,
        startDate: startDateTime,
        adultPrice: Number(tourData.defaultTouristPrice),
        registerOpenDate: dayjs(tourData.registerOpenDate).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
        registerCloseDate: dayjs(tourData.registerCloseDate).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
        maxParticipants: Number(tourData.maxParticipant),
        minParticipants: Number(tourData.minParticipant),
        tourPrices: tourData.tourPrices.map(price => ({
          name: price.name, price: Number(price.price), ageFrom: price.ageFrom, ageTo: price.ageTo
        })),
        refundPolicies: tourData.tourPolicies.map(policy => ({
          cancelBefore: dayjs(policy.cancelBefore).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
          refundRate: Number(policy.refundPercent)
        }))
      };

      await updateTour(tour.id, formattedData);
      setSnackbar({ open: true, message: 'Cập nhật tour thành công', severity: 'success' });

      if (onUpdateSuccess) { onUpdateSuccess(); }
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật tour', severity: 'error' });
    }
  };

  // Add policy handlers
  const handleAddPolicy = () => {
    setTourData(prev => ({ ...prev, tourPolicies: [...prev.tourPolicies, { cancelBefore: null, refundPercent: '' }] }));
  };

  const handleRemovePolicy = (index) => {
    setTourData(prev => ({ ...prev, tourPolicies: prev.tourPolicies.filter((_, i) => i !== index) }));
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', fontWeight: 700, mb: 0.5, color: 'primary.main' }}> Thông tin tour </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>Thông tin khởi hành</Typography>
        <TextField
          label="Khởi hành từ" fullWidth variant="outlined" sx={{ mb: 1, mt: 1.5 }}
          value={tourData.startLocation} inputProps={{ style: { height: '15px' } }}
          onChange={(e) => setTourData(prev => ({ ...prev, startLocation: e.target.value }))}
          error={!!errors.startLocation} helperText={errors.startLocation}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ mb: 2, mt: 1.5 }}>
            <DatePicker
              label="Ngày khởi hành" value={tourData.startDate} format="DD/MM/YYYY"
              onChange={(value) => setTourData(prev => ({ ...prev, startDate: value }))}
              slotProps={{
                textField: {
                  fullWidth: true, inputProps: { style: { height: '15px' } },
                  error: !!errors.startDate, helperText: errors.startDate
                }
              }}
            />
          </Box>
          <Box sx={{ mb: 1 }}>
            <TimePicker
              label="Giờ khởi hành" value={tourData.startTime}
              onChange={(value) => setTourData(prev => ({ ...prev, startTime: value }))}
              slotProps={{
                textField: {
                  fullWidth: true, inputProps: { style: { height: '15px' } },
                  error: !!errors.startTime, helperText: errors.startTime
                }
              }}
            />
          </Box>
        </LocalizationProvider>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>Số lượng khách</Typography>
        <TextField
          label="Số khách tối đa" fullWidth type="number" variant="outlined" value={tourData.maxParticipant}
          onChange={(e) => setTourData(prev => ({ ...prev, maxParticipant: e.target.value }))} sx={{ mb: 2 }}
          error={!!getMaxParticipantsError()} helperText={getMaxParticipantsError()} inputProps={{ style: { height: '15px' } }}
        />
        <TextField
          label="Số khách tối thiểu" fullWidth type="number" variant="outlined" value={tourData.minParticipant}
          onChange={(e) => setTourData(prev => ({ ...prev, minParticipant: e.target.value }))}
          error={!!getMinParticipantsError()} helperText={getMinParticipantsError()} inputProps={{ style: { height: '15px' } }}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>Giá tour</Typography>
        <TextField
          fullWidth type="number" label="Người lớn (trên 12 tuổi)" variant="outlined"
          value={tourData.defaultTouristPrice} onChange={handlePriceChange}
          onBlur={(e) => {
            if (e.target.value) {
              const roundedPrice = roundToThousand(Number(e.target.value));
              setTourData(prev => ({ ...prev, defaultTouristPrice: roundedPrice.toString() }));
              if (validatePrice(roundedPrice, minPrice, maxPrice)) {
                const { childPrice, infantPrice } = calculatePrices(roundedPrice);
                setTourData(prev => ({
                  ...prev, tourPrices: [
                    { ...prev.tourPrices[0], price: childPrice.toString() },
                    { ...prev.tourPrices[1], price: infantPrice.toString() }
                  ]
                }));
              }
            }
          }}
          error={!!errors.defaultTouristPrice}
          helperText={errors.defaultTouristPrice || `Giá phải từ ${minPrice?.toLocaleString()} đến ${maxPrice?.toLocaleString()} VND`}
          sx={{ mb: 2, mt: 1.5 }}
          inputProps={{ min: 0, style: { height: '15px' } }}
          InputProps={{ endAdornment: <InputAdornment position="end">VND</InputAdornment> }}
        />
        {tourData.tourPrices.map((price, index) => (
          <TextField
            key={index} fullWidth type="number" label={`${price.name} (${price.ageFrom}-${price.ageTo} tuổi)`}
            variant="outlined" value={price.price} sx={{ mb: 2 }}
            onChange={(e) => handlePriceTypeChange(index, e.target.value)}
            inputProps={{ min: 0, style: { height: '15px' } }}
            InputProps={{ endAdornment: <InputAdornment position="end">VND</InputAdornment> }}
            error={!!errors[index === 0 ? 'childPrice' : 'infantPrice']}
            helperText={errors[index === 0 ? 'childPrice' : 'infantPrice']}
          />
        ))}
      </Box>

      <Box>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>Thời gian đăng ký</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ mb: 2, mt: 1.5 }}>
            <DatePicker
              label="Ngày mở đăng ký" value={tourData.registerOpenDate} format="DD/MM/YYYY"
              onChange={(value) => setTourData(prev => ({ ...prev, registerOpenDate: value }))}
              minDate={dayjs()}
              maxDate={dayjs(tourData.startDate).subtract(1, 'day')}
              slotProps={{
                textField: {
                  fullWidth: true,
                  inputProps: { style: { height: '15px' }},
                  error: !!errors.registerOpenDate,
                  helperText: errors.registerOpenDate
                }
              }}
            />
          </Box>
          <Box sx={{ mb: 1 }}>
            <DatePicker
              label="Ngày đóng đăng ký" value={tourData.registerCloseDate} format="DD/MM/YYYY"
              onChange={(value) => setTourData(prev => ({ ...prev, registerCloseDate: value }))}
              minDate={tourData.registerOpenDate || dayjs()}
              maxDate={dayjs(tourData.startDate).subtract(1, 'day')}
              slotProps={{
                textField: {
                  fullWidth: true, inputProps: { style: { height: '15px' }},
                  error: !!errors.registerCloseDate, helperText: errors.registerCloseDate
                }
              }}
            />
          </Box>
        </LocalizationProvider>
      </Box>

      {/* Refund Policies Section */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Chính sách hoàn tiền</Typography>
        {tourData.tourPolicies.map((policy, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 1, mb: 3, alignItems: 'flex-start', backgroundColor: 'background.paper' }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Hủy trước ngày" value={policy.cancelBefore} format="DD/MM/YYYY"
                onChange={(newValue) => {
                  const newPolicies = [...tourData.tourPolicies];
                  newPolicies[index] = { ...policy, cancelBefore: newValue };
                  setTourData(prev => ({ ...prev, tourPolicies: newPolicies }));
                  setPolicyErrors(prev => ({ ...prev, [index]: undefined }));
                }}
                minDate={dayjs(tourData.registerOpenDate)}
                maxDate={dayjs(tourData.startDate).subtract(1, 'day')}
                slotProps={{
                  textField: {
                    fullWidth: true, sx: { width: '50%' }, error: !!policyErrors[index], helperText: policyErrors[index]
                  }
                }}
              />
            </LocalizationProvider>
            <TextField
              label="Tỷ lệ hoàn" type="number" sx={{ width: '30%' }} value={policy.refundPercent}
              onChange={(e) => {
                const newPolicies = [...tourData.tourPolicies];
                newPolicies[index] = { ...policy, refundPercent: Math.min(Math.max(0, Number(e.target.value)), 100) };
                setTourData(prev => ({ ...prev, tourPolicies: newPolicies }));
              }}
              InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
            />
            <Button
              variant="outlined"
              color="error"
              sx={{ fontSize: '0.75rem', minWidth: 'auto' }}
              size="small"
              onClick={() => handleRemovePolicy(index)}
              disabled={tourData.tourPolicies.length === 1}
            >
              Xóa
            </Button>
          </Box>
        ))}
        <Box sx={{ display: 'flex', justifyContent: 'right', mt: 2 }}>
          <Button
            variant="outlined"
            onClick={() => setTourData(prev => ({
              ...prev,
              tourPolicies: [...prev.tourPolicies, { cancelBefore: null, refundPercent: '' }]
            }))}
            startIcon={<AddIcon />}
          > Thêm chính sách </Button>
        </Box>
      </Box>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Button type="submit" variant="contained" color="primary"> Cập nhật Tour </Button>
      </Box>
      <Snackbar
        open={snackbar.open} autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity} variant="filled"
        >{snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TourUpdateForm;