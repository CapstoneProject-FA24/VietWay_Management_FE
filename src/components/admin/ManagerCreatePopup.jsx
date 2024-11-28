import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { createManager } from '@services/ManagerService';

const ManagerCreatePopup = ({ open, onClose, onCreate, onRefresh }) => {
  const [managerData, setManagerData] = useState({
    fullName: '',
    email: '',
    phoneNumber: ''
  });

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phoneNumber: ''
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      fullName: '',
      email: '',
      phoneNumber: ''
    };

    // Validate fullName
    if (!managerData.fullName.trim()) {
      newErrors.fullName = 'Họ tên không được để trống';
      isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!managerData.email.trim()) {
      newErrors.email = 'Email không được để trống';
      isValid = false;
    } else if (!emailRegex.test(managerData.email)) {
      newErrors.email = 'Email không hợp lệ';
      isValid = false;
    }

    // Validate phone number
    const phoneRegex = /^0\d{9}$/;
    if (!managerData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Số điện thoại không được để trống';
      isValid = false;
    } else if (!phoneRegex.test(managerData.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại phải bắt đầu bằng số 0 và có 10 chữ số';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setManagerData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const newManager = await createManager(managerData);
      onCreate(newManager);
      onRefresh(); // Refresh the manager list
      setManagerData({ fullName: '', email: '', phoneNumber: '' }); // Reset form
      onClose(); // Close the popup after successful creation
    } catch (error) {
      console.error('Error creating manager:', error);
      // Consider adding error handling UI here
    }
  };

  return (
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
          value={managerData.fullName}
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
          value={managerData.email}
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
          value={managerData.phoneNumber}
          onChange={handleChange}
          error={!!errors.phoneNumber}
          helperText={errors.phoneNumber}
          inputProps={{ maxLength: 10 }}
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
  );
};

export default ManagerCreatePopup;
