import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography, IconButton } from '@mui/material';
import { updateProvince } from '@services/ProvinceService';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';

const UpdateProvince = ({ open, handleClose, province, onUpdateSuccess }) => {
    const [formData, setFormData] = useState({
        provinceName: province?.provinceName || '',
        imageFile: null
    });
    const [previewImage, setPreviewImage] = useState(province?.imageURL || '');
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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

            const updateData = new FormData();
            updateData.append('provinceName', formData.provinceName);
            if (formData.imageFile) {
                updateData.append('imageFile', formData.imageFile);
            }

            await updateProvince(province.provinceId, updateData);
            onUpdateSuccess();
            handleClose();
        } catch (error) {
            setError('Có lỗi xảy ra khi cập nhật tỉnh thành');
            console.error('Error updating province:', error);
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
                    Cập nhật tỉnh thành
                </Typography>

                <Box sx={{ mt: 1 }}>
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

                    <Box sx={{ mt: 1, textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {previewImage && (
                            <img
                                src={previewImage}
                                alt="Preview"
                                style={{ 
                                    maxWidth: '100%', 
                                    maxHeight: '250px', 
                                    objectFit: 'cover', 
                                    marginBottom: '15px',
                                    borderRadius: '8px'
                                }}
                            />
                        )}
                        <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
                            Chọn ảnh mới
                            <input type="file" hidden accept="image/*" onChange={handleImageChange}/>
                        </Button>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button onClick={handleClose} variant="outlined" color="primary" sx={{ mr: 1 }}>
                            Hủy
                        </Button>
                        <Button onClick={handleSubmit} variant="contained" color="primary">
                            Cập nhật
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default UpdateProvince;
