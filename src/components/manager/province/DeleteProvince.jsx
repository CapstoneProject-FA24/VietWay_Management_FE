import React, { useState } from 'react';
import { Modal, Box, Button, Typography, Snackbar, Alert, CircularProgress } from '@mui/material';
import { deleteProvince } from '@services/ProvinceService';
import CloseIcon from '@mui/icons-material/Close';

const DeleteProvince = ({ open, handleClose, province, onDeleteSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({
            ...prev,
            open: false
        }));
    };

    const handleDelete = async () => {
        try {
            setIsLoading(true);
            await deleteProvince(province.provinceId);
            
            setSnackbar({
                open: true,
                message: 'Xóa tỉnh thành thành công!',
                severity: 'success'
            });

            onDeleteSuccess();
            handleClose();
        } catch (error) {
            console.error('Error deleting province:', error);
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Có lỗi xảy ra khi xóa tỉnh thành',
                severity: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
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
                        <Button 
                            onClick={handleClose} 
                            variant="outlined" 
                            color="primary" 
                            sx={{ mr: 1 }}
                            disabled={isLoading}
                        >
                            Hủy
                        </Button>
                        <Button 
                            onClick={handleDelete} 
                            variant="contained" 
                            sx={{ backgroundColor: 'red' }}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                                    Đang xử lý...
                                </Box>
                            ) : (
                                'Xóa'
                            )}
                        </Button>
                    </Box>
                </Box>
            </Modal>

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

export default DeleteProvince;
