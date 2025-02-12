import React from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const StatusPopup = ({ open, onClose, user, onOpen }) => {
    const handleSubmit = () => {
        if (user && user.id) {
            onOpen(user.id); 
        }
        onClose();
    };

    const getUserRoleText = (role) => {
        switch(role) {
            case 0:
                return 'người dùng';
            case 2:
                return 'nhân viên';
            case 3:
                return 'quản lý';
            default:
                return 'người dùng không xác định';
        }
    };

    return (
        <Modal open={open} onClose={onClose} sx={{ mt: 15 }}>
            <Box sx={{ padding: 4, backgroundColor: 'white', borderRadius: 2, maxWidth: 500, margin: 'auto', position: 'relative' }}>
                <CloseIcon 
                    onClick={onClose} 
                    sx={{ position: 'absolute', top: 16, right: 16, cursor: 'pointer' }}
                />
                <Typography variant="h5" component="h2" gutterBottom align='center' color='primary'>
                    Xác nhận {user && user.status === 1 ? 'vô hiệu hóa' : 'kích hoạt'} {user ? getUserRoleText(user.role) : 'người dùng không xác định'}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Bạn có xác nhận {user && user.status === 1 ? 'vô hiệu hóa' : 'kích hoạt'} {user ? getUserRoleText(user.role) : 'người dùng không xác định'} <strong>{user ? user.fullname : 'người dùng không xác định'}</strong> không?
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button onClick={onClose} variant="outlined" color="primary" sx={{ mr: 1 }}>
                        Hủy
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" sx={{ backgroundColor: user && user.status === 1 ? 'red' : 'green'}}>
                        Xác nhận
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default StatusPopup;
