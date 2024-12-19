import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Snackbar, Alert } from '@mui/material';
import { createStaff } from '@services/StaffService';
import { getErrorMessage } from '@hooks/Message';

const StaffCreatePopup = ({ open, onClose, onCreate, onRefresh }) => {
  const [staffData, setStaffData] = useState({
    fullName: '',
    email: '',
    phoneNumber: ''
  });

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phoneNumber: ''
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      fullName: '',
      email: '',
      phoneNumber: ''
    };

    // Validate fullName
    if (!staffData.fullName.trim()) {
      newErrors.fullName = 'Họ tên không được để trống';
      isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!staffData.email.trim()) {
      newErrors.email = 'Email không được để trống';
      isValid = false;
    } else if (!emailRegex.test(staffData.email)) {
      newErrors.email = 'Email không hợp lệ';
      isValid = false;
    }

    // Validate phone number
    const phoneRegex = /^0\d{9}$/;
    if (!staffData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Số điện thoại không được để trống';
      isValid = false;
    } else if (!phoneRegex.test(staffData.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại phải bắt đầu bằng số 0 và có 10 chữ số';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For phone number, only allow numbers
    if (name === 'phoneNumber') {
      const numbersOnly = value.replace(/[^0-9]/g, '');
      setStaffData(prevData => ({ ...prevData, [name]: numbersOnly }));
    } else {
      setStaffData(prevData => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: 'Vui lòng điền đầy đủ và chính xác thông tin',
        severity: 'error'
      });
      return;
    }

    try {
      const newStaff = await createStaff(staffData);
      onCreate(newStaff);
      onRefresh(); // Refresh the staff list
      setStaffData({ fullName: '', email: '', phoneNumber: '' }); // Reset form
      setSnackbar({
        open: true,
        message: 'Tạo nhân viên mới thành công',
        severity: 'success'
      });
      onClose(); // Close the popup after successful creation
    } catch (error) {
      console.error('Error creating staff:', error);
      setSnackbar({
        open: true,
        message: getErrorMessage(error),
        severity: 'error'
      });
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Thêm nhân viên mới</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Họ tên"
            type="text"
            fullWidth
            name="fullName"
            value={staffData.fullName}
            onChange={handleChange}
            error={!!errors.fullName}
            helperText={errors.fullName}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            name="email"
            value={staffData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            margin="dense"
            label="Số điện thoại"
            type="text"
            fullWidth
            name="phoneNumber"
            value={staffData.phoneNumber}
            onChange={handleChange}
            error={!!errors.phoneNumber}
            helperText={errors.phoneNumber}
            inputProps={{ 
              maxLength: 10,
              inputMode: 'numeric',
              pattern: '[0-9]*'  // HTML5 pattern for numbers only
            }}
            onKeyPress={(e) => {
              // Allow only number keys and control keys (backspace, delete, etc.)
              if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                e.preventDefault();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Hủy
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Tạo
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default StaffCreatePopup;
