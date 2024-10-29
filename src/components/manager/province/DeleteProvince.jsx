import React from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';
import { deleteProvince } from '@services/ProvinceService';
import CloseIcon from '@mui/icons-material/Close';

const DeleteProvince = ({ open, handleClose, province, onDeleteSuccess }) => {
    const handleDelete = async () => {
        try {
            await deleteProvince(province.provinceId);
            onDeleteSuccess();
            handleClose();
        } catch (error) {
            console.error('Error deleting province:', error);
        }
    };

    return (
        <Modal open={open} onClose={handleClose} sx={{ mt: 15 }}>
            <Box sx={{
                padding: 4,
                backgroundColor: 'white',
                borderRadius: 2,
                maxWidth: 500,
                margin: 'auto',
                position: 'relative'
            }}>
                <CloseIcon 
                    onClick={handleClose} 
                    sx={{ position: 'absolute', top: 16, right: 16, cursor: 'pointer' }}
                />
                <Typography variant="h5" component="h2" gutterBottom align='center' color='primary'>
                    Xác nhận xóa tỉnh thành
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Bạn có chắc chắn muốn xóa tỉnh thành <strong>{province?.provinceName}</strong> không?
                </Typography>
                <Typography variant="body2" sx={{ color: 'red', fontStyle: 'italic' }} gutterBottom>
                    Lưu ý: Hành động này không thể hoàn tác.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button onClick={handleClose} variant="outlined" color="primary" sx={{ mr: 1 }}>
                        Hủy
                    </Button>
                    <Button onClick={handleDelete} variant="contained" sx={{ backgroundColor: 'red' }}>
                        Xóa
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default DeleteProvince;
