import React from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const CompanyHidePopup = ({ open, onClose, company, onDelete }) => {
    const handleDelete = () => {
        if (company && company.id) {
            onDelete(company.id); // Assuming company has an id property
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
                <Typography variant="h4" component="h2" gutterBottom align='center' color='primary'>
                    Xác nhận ẩn công ty
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Bạn có xác nhận ẩn công ty <strong>{company ? company.name : 'công ty không xác định'}</strong> không?
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button onClick={onClose} variant="outlined" color="primary" sx={{ mr: 1 }}>
                        Hủy
                    </Button>
                    <Button onClick={handleDelete} variant="contained" sx={{ backgroundColor: 'red'}}>
                        Xác nhận
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default CompanyHidePopup;
