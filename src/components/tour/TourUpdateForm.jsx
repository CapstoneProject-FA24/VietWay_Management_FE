import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, Grid, Snackbar, Alert } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { updateTour } from '@services/TourService';
import { InputAdornment } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const validateRefundPolicies = (policies, registerOpenDate, startDate, paymentDeadline, depositPercent) => {
  if (policies.length === 0) {
    return { isValid: false, message: 'Vui lòng thêm ít nhất một chính sách hoàn tiền' };
  }

  const errors = {};
  
  for (let i = 0; i < policies.length; i++) {
    const policy = policies[i];
    
    // Separate validation for cancelBefore
    if (!policy.cancelBefore) {
      errors[`policy${i}Date`] = 'Vui lòng nhập ngày hủy tour';
    } else if (!dayjs(policy.cancelBefore).isSameOrAfter(dayjs(registerOpenDate)) ||
               !dayjs(policy.cancelBefore).isSameOrBefore(dayjs(startDate))) {
      errors[`policy${i}Date`] = 'Thời gian hủy tour phải nằm sau thời gian mở đăng ký và trước ngày khởi hành';
    }

    // Separate validation for refundRate
    if (policy.refundPercent === '') {
      errors[`policy${i}Rate`] = 'Vui lòng nhập tỷ lệ hoàn tiền';
    } else if (Number(policy.refundPercent) < 0 || Number(policy.refundPercent) > 100) {
      errors[`policy${i}Rate`] = 'Tỷ lệ hoàn tiền phải từ 0 đến 100%';
    } else if (paymentDeadline && Number(depositPercent) < 100) {
      const refundPercent = Number(policy.refundPercent);
      const deposit = Number(depositPercent);

      if (dayjs(policy.cancelBefore).isSameOrBefore(dayjs(paymentDeadline))) {
        if (refundPercent > deposit) {
          errors[`policy${i}Rate`] = `Trước hạn thanh toán, tỷ lệ hoàn tiền không được vượt quá tỷ lệ đặt cọc (${deposit}%)`;
        }
      } else {
        if (refundPercent <= deposit) {
          errors[`policy${i}Rate`] = `Sau hạn thanh toán, tỷ lệ hoàn tiền phải lớn hơn tỷ lệ đặt cọc (${deposit}%)`;
        }
      }
    }
  }
  
  return { 
    isValid: Object.keys(errors).length === 0,
    errors: errors
  };
};

const TourUpdateForm = ({ tour, onUpdateSuccess, maxPrice, minPrice }) => {
  const navigate = useNavigate();

  const initialStartTime = () => {
    const [hours, minutes] = tour.startTime.split(':');
    return dayjs().hour(parseInt(hours)).minute(parseInt(minutes));
  };

  const [tourData, setTourData] = useState({
    startLocation: tour.startLocation || '',
    startLocationPlaceId: tour.startLocationPlaceId || '',
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
    })) || [{ cancelBefore: null, refundPercent: '' }],
    depositPercent: tour.depositPercent || '',
    paymentDeadline: dayjs(tour.paymentDeadline),
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

  // Update validateForm function
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

    if (!childPrice) {
      newErrors.childPrice = "Vui lòng nhập giá trẻ em";
    } else if (childPrice <= 0) {
      newErrors.childPrice = "Giá trẻ em phải lớn hơn 0";
    } else if (childPrice >= adultPrice) {
      newErrors.childPrice = "Giá trẻ em phải thấp hơn giá người lớn";
    } 

    if (!infantPrice) {
      newErrors.infantPrice = "Vui lòng nhập giá em bé";
    } else if (infantPrice <= 0) {
      newErrors.infantPrice = "Giá em bé phải lớn hơn 0";
    } else if (infantPrice >= childPrice) {
      console.log(infantPrice);
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

    // Add refund policy validation
    const policyValidation = validateRefundPolicies(
      tourData.tourPolicies,
      tourData.registerOpenDate,
      tourData.startDate,
      tourData.paymentDeadline,
      tourData.depositPercent
    );

    if (!policyValidation.isValid) {
      // Merge policy errors with other form errors
      Object.assign(newErrors, policyValidation.errors);
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
      tourData.startDate,
      tourData.paymentDeadline,
      tourData.depositPercent
    );

    if (!policyValidation.isValid) {
      if (policyValidation.index !== undefined) {
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
    setTourData(prev => ({
      ...prev,
      tourPolicies: [...prev.tourPolicies, { cancelBefore: null, refundPercent: '' }]
    }));
  };

  const handleRemovePolicy = (index) => {
    setTourData(prev => ({
      ...prev,
      tourPolicies: prev.tourPolicies.filter((_, i) => i !== index)
    }));
    // Clear any errors for the removed policy
    const newPolicyErrors = { ...policyErrors };
    delete newPolicyErrors[index];
    setPolicyErrors(newPolicyErrors);
  };

  const handlePolicyChange = (index, field, value) => {
    setTourData(prev => ({
      ...prev,
      tourPolicies: prev.tourPolicies.map((policy, i) =>
        i === index ? { ...policy, [field]: value } : policy
      )
    }));
    // Clear error when user makes changes
    if (policyErrors[index]) {
      const newPolicyErrors = { ...policyErrors };
      delete newPolicyErrors[index];
      setPolicyErrors(newPolicyErrors);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>Thông tin khởi hành</Typography>
        <TextField
          label="Khởi hành từ"
          fullWidth
          variant="outlined"
          value={tourData.startLocation}
          onChange={(e) => setTourData(prev => ({ ...prev, startLocation: e.target.value }))}
          error={!!errors.startLocation}
          helperText={errors.startLocation}
          sx={{ mb: 2, mt: 1.5 }}
          inputProps={{ style: { height: '15px' } }}
        />
        
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ mb: 2 }}>
            <DatePicker
              label="Ngày khởi hành"
              value={tourData.startDate}
              onChange={(value) => setTourData(prev => ({ ...prev, startDate: value }))}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.startDate,
                  helperText: errors.startDate,
                  inputProps: { style: { height: '15px' } }
                }
              }}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TimePicker
              label="Giờ khởi hành"
              value={tourData.startTime}
              onChange={(value) => setTourData(prev => ({ ...prev, startTime: value }))}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.startTime,
                  helperText: errors.startTime,
                  inputProps: { style: { height: '15px' } }
                }
              }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, mt: 2 }}>Thời gian đăng ký</Typography>
            <Box sx={{ mb: 2, mt: 1.5 }}>
              <DatePicker
                label="Ngày mở đăng ký"
                value={tourData.registerOpenDate}
                format="DD/MM/YYYY"
                onChange={(value) => setTourData(prev => ({ ...prev, registerOpenDate: value }))}
                minDate={dayjs()}
                maxDate={dayjs(tourData.startDate).subtract(1, 'day')}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    inputProps: { style: { height: '15px' } },
                    error: !!errors.registerOpenDate,
                    helperText: errors.registerOpenDate
                  }
                }}
              />
            </Box>
            <Box sx={{ mb: 1 }}>
              <DatePicker
                label="Ngày đóng đăng ký"
                value={tourData.registerCloseDate}
                format="DD/MM/YYYY"
                onChange={(value) => setTourData(prev => ({ ...prev, registerCloseDate: value }))}
                minDate={tourData.registerOpenDate || dayjs()}
                maxDate={dayjs(tourData.startDate).subtract(1, 'day')}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    inputProps: { style: { height: '15px' } },
                    error: !!errors.registerCloseDate,
                    helperText: errors.registerCloseDate
                  }
                }}
              />
            </Box>
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

      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>Yêu cầu thanh toán</Typography>
        <TextField
          label="Yêu cầu cọc"
          type="number"
          sx={{ width: '100%', mt: 1.5, mb: 2 }}
          value={tourData.depositPercent}
          onChange={(e) => {
            setTourData(prev => ({
              ...prev,
              depositPercent: e.target.value,
              paymentDeadline: Number(e.target.value) === 100 ? null : prev.paymentDeadline
            }));
          }}
          error={!!errors.depositPercent}
          helperText={errors.depositPercent || "Nhập 100 nếu tour yêu cầu thanh toán 100% và không đặt cọc"}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>
          }}
        />
        {Number(tourData.depositPercent) < 100 && (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Thời hạn thanh toán"
              value={tourData.paymentDeadline}
              onChange={(value) => setTourData(prev => ({ ...prev, paymentDeadline: value }))}
              format="DD/MM/YYYY"
              minDate={tourData.registerOpenDate}
              maxDate={dayjs(tourData.startDate).subtract(1, 'day')}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.paymentDeadline,
                  helperText: errors.paymentDeadline || "Phải thanh toán toàn bộ trước khi đặt tour",
                  inputProps: { style: { height: '15px' } }
                }
              }}
            />
          </LocalizationProvider>
        )}
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>Chính sách hoàn tiền</Typography>
        {tourData.tourPolicies.map((policy, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Hủy trước ngày"
                value={policy.cancelBefore}
                onChange={(value) => handlePolicyChange(index, 'cancelBefore', value)}
                format="DD/MM/YYYY"
                minDate={tourData.registerOpenDate}
                maxDate={tourData.startDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors[`policy${index}Date`],
                    helperText: errors[`policy${index}Date`]
                  }
                }}
              />
            </LocalizationProvider>
            <TextField
              label="Tỷ lệ hoàn tiền (%)"
              type="number"
              value={policy.refundPercent}
              onChange={(e) => handlePolicyChange(index, 'refundPercent', e.target.value)}
              error={!!errors[`policy${index}Rate`]}
              helperText={errors[`policy${index}Rate`]}
              fullWidth
              inputProps={{ min: 0, max: 100 }}
            />
            <Button
              variant="outlined"
              color="error"
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
            onClick={handleAddPolicy} 
            startIcon={<AddIcon />}
          >
            Thêm chính sách
          </Button>
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