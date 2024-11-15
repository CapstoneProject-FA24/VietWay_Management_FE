import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import { createProvince } from '@services/ProvinceService';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';

const CreateProvince = ({ open, handleClose, onCreateSuccess }) => {
    const [formData, setFormData] = useState({
        provinceName: '',
        imageFile: null
    });
    const [previewImage, setPreviewImage] = useState('');
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('Kích thước ảnh không được vượt quá 5MB');
                return;
            }
            setFormData(prev => ({
                ...prev,
                imageFile: file
            }));
            setPreviewImage(URL.createObjectURL(file));
            setError('');
        }
    };

    const handleSubmit = async () => {
        try {
            if (!formData.provinceName.trim()) {
                setError('Vui lòng nhập tên tỉnh thành');
                return;
            }

            await createProvince(formData.provinceName);
            onCreateSuccess();
            handleClose();
            // Reset form
            setFormData({
                provinceName: '',
                imageFile: null
            });
            setPreviewImage('');
            setError('');
        } catch (error) {
            setError('Có lỗi xảy ra khi thêm tỉnh thành');
            console.error('Error creating province:', error);
        }
    };

    return (
        <Modal open={open} onClose={handleClose} sx={{ mt: 5 }}>
            <Box sx={{
                padding: 4,
                backgroundColor: 'white',
                borderRadius: 2,
                maxWidth: 600,
                margin: 'auto',
                position: 'relative'
            }}>
                <CloseIcon 
                    onClick={handleClose} 
                    sx={{ position: 'absolute', top: 16, right: 16, cursor: 'pointer' }}
                />
                <Typography variant="h4" component="h2" gutterBottom align='center' color='primary'>
                    Thêm tỉnh thành mới
                </Typography>

                <Box sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        label="Tên tỉnh thành"
                        name="provinceName"
                        value={formData.provinceName}
                        onChange={handleInputChange}
                        margin="normal"
                        error={!!error && !formData.provinceName}
                        helperText={error && !formData.provinceName ? error : ''}
                    />

                    <Box sx={{ 
                        mt: 3, 
                        textAlign: 'center', 
                        width: '100%', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center' 
                    }}>
                        {previewImage && (
                            <img
                                src={previewImage}
                                alt="Preview"
                                style={{ 
                                    maxWidth: '100%', 
                                    maxHeight: '200px', 
                                    objectFit: 'cover', 
                                    marginBottom: '15px',
                                    borderRadius: '8px'
                                }}
                            />
                        )}
                        <Button 
                            variant="outlined" 
                            component="label" 
                            startIcon={<CloudUploadIcon />}
                            sx={{ mt: 1 }}
                        >
                            Chọn ảnh
                            <input 
                                type="file" 
                                hidden 
                                accept="image/*" 
                                onChange={handleImageChange}
                            />
                        </Button>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button onClick={handleClose} variant="outlined" color="primary" sx={{ mr: 1 }}>
                            Hủy
                        </Button>
                        <Button onClick={handleSubmit} variant="contained" color="primary">
                            Thêm tỉnh thành
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default CreateProvince;
