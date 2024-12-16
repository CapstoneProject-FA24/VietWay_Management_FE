import React from 'react';
import { Modal, Box, Button, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const AttractionDeletePopup = ({ open, onClose, attraction, onDelete }) => {
    const handleSubmit = () => {
        if (attraction && attraction.attractionId) {
            onDelete(attraction.attractionId);
        }
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose} sx={{ mt: 15 }}>
            <Box sx={{ padding: 4, backgroundColor: 'white', borderRadius: 2, maxWidth: 600, margin: 'auto', position: 'relative' }}>
                <CloseIcon
                    onClick={onClose}
                    sx={{ position: 'absolute', top: 16, right: 16, cursor: 'pointer' }}
                />
                <Typography variant="h5" component="h2" gutterBottom align='center' color='primary'>
                    Xác nhận xóa điểm tham quan
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Bạn có xác nhận xóa điểm tham quan <strong>{attraction ? attraction.name : 'Không tìm thấy'}</strong> không?
                </Typography>
                <Typography variant="body2" sx={{ color: 'red', fontStyle: 'italic' }} gutterBottom>
                    Lưu ý: Hành động này không thể hoàn tác.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button onClick={onClose} variant="outlined" color="primary" sx={{ mr: 1 }}>
                        Hủy
                    </Button>
                    <Button onClick={handleSubmit} variant="contained" sx={{ backgroundColor: 'red' }}>
                        Xóa
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AttractionDeletePopup;
