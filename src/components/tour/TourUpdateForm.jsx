import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, Grid, Snackbar, Alert } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { updateTour } from '@services/TourService';
import { InputAdornment } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const TourUpdateForm = ({ tour, onUpdateSuccess }) => {
  const navigate = useNavigate();
  const [tourData, setTourData] = useState({
    startLocation: tour.startLocation || '',
    startDate: dayjs(tour.startDate),
    startTime: dayjs(tour.startTime),
    defaultTouristPrice: tour.defaultTouristPrice || '',
    registerOpenDate: dayjs(tour.registerOpenDate),
    registerCloseDate: dayjs(tour.registerCloseDate),
    minParticipant: tour.minParticipant || '',
    maxParticipant: tour.maxParticipant || '',
    tourPrices: tour.tourPrices || [
      {
        name: "Trẻ em",
        price: 0,
        ageFrom: 5,
        ageTo: 12
      },
      {
        name: "Em bé",
        price: 0,
        ageFrom: 0,
        ageTo: 4
      }
    ],
    refundPolicies: tour.refundPolicies?.map(policy => ({
      cancelBefore: dayjs(policy.cancelBefore),
      refundPercent: policy.refundPercent
    })) || [{ cancelBefore: null, refundPercent: '' }]
  });

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Validation functions
  const validateForm = () => {
    const newErrors = {};

    if (!tourData.startLocation?.trim()) {
      newErrors.startLocation = "Vui lòng nhập địa điểm khởi hành";
    }

    if (!tourData.startDate) {
      newErrors.startDate = "Vui lòng chọn ngày khởi hành";
    }

    const max = Number(tourData.maxParticipant);
    const min = Number(tourData.minParticipant);

    if (!tourData.maxParticipant) {
      newErrors.maxParticipant = "Vui lòng nhập số khách tối đa";
    } else if (max <= 0) {
      newErrors.maxParticipant = "Số khách tối đa phải lớn hơn 0";
    } else if (max <= min) {
      newErrors.maxParticipant = "Số khách tối đa phải lớn hơn số khách tối thiểu";
    }

    // Add more validations as needed

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

    try {
      const formattedData = {
        ...tourData,
        startDate: dayjs(tourData.startDate).format(),
        registerOpenDate: dayjs(tourData.registerOpenDate).format(),
        registerCloseDate: dayjs(tourData.registerCloseDate).format(),
        refundPolicies: tourData.refundPolicies.map(policy => ({
          cancelBefore: dayjs(policy.cancelBefore).format(),
          refundPercent: Number(policy.refundPercent)
        }))
      };

      await updateTour(tour.tourId, formattedData);
      setSnackbar({
        open: true,
        message: 'Cập nhật tour thành công',
        severity: 'success'
      });
      
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật tour',
        severity: 'error'
      });
    }
  };

  // Add policy handlers
  const handleAddPolicy = () => {
    setTourData(prev => ({
      ...prev,
      refundPolicies: [...prev.refundPolicies, { cancelBefore: null, refundPercent: '' }]
    }));
  };

  const handleRemovePolicy = (index) => {
    setTourData(prev => ({
      ...prev,
      refundPolicies: prev.refundPolicies.filter((_, i) => i !== index)
    }));
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', fontWeight: 700, mb: 0.5, color: 'primary.main' }}>
        Thông tin tour
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>Thông tin khởi hành</Typography>
        <TextField
          label="Khởi hành từ"
          fullWidth
          variant="outlined"
          sx={{ mb: 1, mt: 1.5 }}
          value={tourData.startLocation}
          inputProps={{ style: { height: '15px' } }}
          onChange={(e) => setTourData(prev => ({ ...prev, startLocation: e.target.value }))}
          error={!!errors.startLocation}
          helperText={errors.startLocation}
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ mb: 2, mt: 1.5 }}>
            <DatePicker
              label="Ngày khởi hành"
              value={tourData.startDate}
              format="DD/MM/YYYY"
              onChange={(value) => setTourData(prev => ({ ...prev, startDate: value }))}
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
              value={tourData.startTime}
              onChange={(value) => setTourData(prev => ({ ...prev, startTime: value }))}
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
          value={tourData.maxParticipant}
          onChange={(e) => setTourData(prev => ({ ...prev, maxParticipant: e.target.value }))}
          error={!!errors.maxParticipant}
          helperText={errors.maxParticipant}
          inputProps={{ style: { height: '15px' } }}
        />
        <TextField
          label="Số khách tối thiểu"
          fullWidth
          type="number"
          variant="outlined"
          sx={{ mb: 1 }}
          value={tourData.minParticipant}
          onChange={(e) => setTourData(prev => ({ ...prev, minParticipant: e.target.value }))}
          error={!!errors.minParticipant}
          helperText={errors.minParticipant}
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
          value={tourData.defaultTouristPrice}
          onChange={(e) => setTourData(prev => ({ ...prev, defaultTouristPrice: e.target.value }))}
          error={!!errors.defaultTouristPrice}
          helperText={errors.defaultTouristPrice}
          sx={{ mb: 2, mt: 1.5 }}
          inputProps={{ min: 0, style: { height: '15px' } }}
        />
        {tourData.tourPrices.map((price, index) => (
          <TextField
            key={index}
            fullWidth
            type="number"
            label={`${price.name} (${price.ageFrom}-${price.ageTo} tuổi)`}
            variant="outlined"
            value={price.price}
            onChange={(e) => {
              const newPrices = [...tourData.tourPrices];
              newPrices[index] = { ...price, price: Number(e.target.value) };
              setTourData(prev => ({ ...prev, tourPrices: newPrices }));
            }}
            sx={{ mb: 2 }}
            inputProps={{ min: 0, style: { height: '15px' } }}
          />
        ))}
      </Box>

      <Box>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>Thời gian đăng ký</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box sx={{ mb: 2, mt: 1.5 }}>
            <DatePicker
              label="Ngày mở đăng ký"
              value={tourData.registerOpenDate}
              format="DD/MM/YYYY"
              onChange={(value) => setTourData(prev => ({ ...prev, registerOpenDate: value }))}
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
              label="Ngày đóng đăng ký"
              value={tourData.registerCloseDate}
              format="DD/MM/YYYY"
              onChange={(value) => setTourData(prev => ({ ...prev, registerCloseDate: value }))}
              slotProps={{
                textField: {
                  fullWidth: true,
                  inputProps: { style: { height: '15px' }},
                  error: !!errors.registerCloseDate,
                  helperText: errors.registerCloseDate
                }
              }}
            />
          </Box>
        </LocalizationProvider>
      </Box>

      {/* Refund Policies Section */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Chính sách hoàn tiền</Typography>
        {tourData.refundPolicies.map((policy, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center', backgroundColor: 'background.paper', p: 2, borderRadius: 1, boxShadow: 1 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Hủy trước ngày"
                value={policy.cancelBefore}
                format="DD/MM/YYYY"
                onChange={(newValue) => {
                  const newPolicies = [...tourData.refundPolicies];
                  newPolicies[index] = { ...policy, cancelBefore: newValue };
                  setTourData(prev => ({ ...prev, refundPolicies: newPolicies }));
                }}
                slotProps={{
                  textField: { fullWidth: true }
                }}
              />
            </LocalizationProvider>
            <TextField
              label="Tỷ lệ hoàn tiền (%)"
              type="number"
              sx={{ width: '30%' }}
              value={policy.refundPercent}
              onChange={(e) => {
                const newPolicies = [...tourData.refundPolicies];
                newPolicies[index] = { ...policy, refundPercent: Math.min(Math.max(0, Number(e.target.value)), 100) };
                setTourData(prev => ({ ...prev, refundPolicies: newPolicies }));
              }}
              InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
            />
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                const newPolicies = tourData.refundPolicies.filter((_, i) => i !== index);
                setTourData(prev => ({ ...prev, refundPolicies: newPolicies }));
              }}
              disabled={tourData.refundPolicies.length === 1}
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
              refundPolicies: [...prev.refundPolicies, { cancelBefore: null, refundPercent: '' }]
            }))}
            startIcon={<AddIcon />}
          >
            Thêm chính sách
          </Button>
        </Box>
      </Box>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Button type="submit" variant="contained" color="primary">
          Cập nhật Tour
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TourUpdateForm;