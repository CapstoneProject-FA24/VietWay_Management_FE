import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Snackbar, Alert } from '@mui/material';
import { createTourCategory } from '@services/TourCategoryService';

const CreateCategory = ({ open, onClose, onSuccess, categoryType, isTourDuration }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    days: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (categoryType === 'tour-categories') {
        await createTourCategory({
          name: formData.name,
          description: formData.description
        });
        
        setSnackbar({
          open: true,
          message: 'Thêm loại tour thành công!',
          severity: 'success'
        });

        // Reset form
        setFormData({ name: '', description: '', days: '' });
        
        // Close modal and reload list
        onSuccess();
      }
      // Add other category types here when their services are ready
      
    } catch (error) {
      console.error('Error creating category:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi thêm mới',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  const getCategoryTypeText = () => {
    switch (categoryType) {
      case 'attraction-types':
        return 'loại điểm tham quan';
      case 'tour-categories':
        return 'loại tour';
      case 'tour-durations':
        return 'thời lượng tour';
      case 'post-categories':
        return 'loại bài viết';
      default:
        return categoryType;
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Thêm mới {getCategoryTypeText()}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              label="Tên"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Mô tả"
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              sx={{ mb: 2 }}
            />
            {isTourDuration && (
              <TextField
                fullWidth
                type="number"
                label="Số ngày"
                value={formData.days}
                onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                required
                inputProps={{ min: 1 }}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Hủy</Button>
            <Button type="submit" variant="contained">Thêm mới</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
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

export default CreateCategory;