import React from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const CustomerActivatePopup = ({ open, onClose, user, onActivate }) => {
    const handleActivate = () => {
        if (user && user.id) {
            onActivate(user.id); // Assuming user has an id property
        }
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose} sx={{ mt: 15 }}>
            <Box sx={{ padding: 4, backgroundColor: 'white', borderRadius: 2, maxWidth: 500, margin: 'auto', position: 'relative' }}>
                <CloseIcon 
                    onClick={onClose} 
                    sx={{ position: 'absolute', top: 16, right: 16, cursor: 'pointer' }}
                />
                <Typography variant="h5" component="h2" gutterBottom align='center' color='primary'>
                    Xác nhận kích hoạt người dùng
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Bạn có xác nhận kích hoạt người dùng <strong>{user ? user.fullname : 'người dùng không xác định'}</strong> không?
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button onClick={onClose} variant="outlined" color="primary" sx={{ mr: 1 }}>
                        Hủy
                    </Button>
                    <Button onClick={handleActivate} variant="contained" sx={{ backgroundColor: 'green'}}>
                        Kích hoạt
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default CustomerActivatePopup;
