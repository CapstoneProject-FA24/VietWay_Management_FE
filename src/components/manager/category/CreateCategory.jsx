import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const CreateCategory = ({ open, onClose, onSuccess, categoryType, isTourDuration }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    days: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Implement create API call based on categoryType
      // const response = await createCategory(categoryType, formData);
      onSuccess();
      setFormData({ name: '', description: '', days: '' });
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Thêm mới</DialogTitle>
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
  );
};

export default CreateCategory;