import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const DeleteCategory = ({ open, onClose, onSuccess, category, categoryType }) => {
  const handleDelete = async () => {
    try {
      // Implement delete API call based on categoryType
      // await deleteCategory(categoryType, category.id);
      onSuccess();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Xác nhận xóa</DialogTitle>
      <DialogContent>
        <Typography>
          Bạn có chắc chắn muốn xóa "{category?.name}"?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleDelete} color="error" variant="contained">
          Xóa
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteCategory;