import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography, CircularProgress, Snackbar, Alert } from '@mui/material';
import { createProvince, addOrUpdateProvinceImage } from '@services/ProvinceService';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';

const CreateProvince = ({ open, handleClose, onCreateSuccess }) => {
    const [formData, setFormData] = useState({
        provinceName: '',
        description: '',
        imageFile: null
    });
    const [previewImage, setPreviewImage] = useState('');
    const [errors, setErrors] = useState({
        provinceName: '',
        description: '',
        image: ''
    });
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setErrors(prev => ({
            ...prev,
            [name]: ''
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    image: 'Kích thước ảnh không được vượt quá 5MB'
                }));
                return;
            }
            setFormData(prev => ({
                ...prev,
                imageFile: file
            }));
            setPreviewImage(URL.createObjectURL(file));
            setErrors(prev => ({
                ...prev,
                image: ''
            }));
        }
    };

    const handleSubmit = async () => {
        try {
            const newErrors = {
                provinceName: '',
                description: '',
                image: ''
            };
            let hasError = false;

            if (!formData.provinceName.trim()) {
                newErrors.provinceName = 'Vui lòng nhập tên tỉnh thành';
                hasError = true;
            }

            if (!formData.imageFile) {
                newErrors.image = 'Vui lòng thêm hình ảnh';
                hasError = true;
            }

            if (hasError) {
                setErrors(newErrors);
                return;
            }

            setIsLoading(true);

            const provinceData = {
                name: formData.provinceName,
                description: formData.description
            };

            const provinceResponse = await createProvince(provinceData);
            
            if (provinceResponse.data) {
                await addOrUpdateProvinceImage(provinceResponse.data, formData.imageFile);
                
                setSnackbar({
                    open: true,
                    message: 'Thêm tỉnh thành thành công!',
                    severity: 'success'
                });

                onCreateSuccess();
                handleClose();
                // Reset form
                setFormData({
                    provinceName: '',
                    description: '',
                    imageFile: null
                });
                setPreviewImage('');
                setErrors({
                    provinceName: '',
                    description: '',
                    image: ''
                });
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(prev => ({
                    ...prev,
                    provinceName: error.response.data.message || 'Có lỗi xảy ra khi thêm tỉnh thành',
                    description: error.response.data.message || 'Có lỗi xảy ra khi thêm tỉnh thành',
                    image: error.response.data.message || 'Có lỗi xảy ra khi thêm tỉnh thành'
                }));
                setSnackbar({
                    open: true,
                    message: error.response.data.message || 'Có lỗi xảy ra khi thêm tỉnh thành',
                    severity: 'error'
                });
            } else {
                setErrors(prev => ({
                    ...prev,
                    provinceName: 'Có lỗi xảy ra khi thêm tỉnh thành',
                    description: 'Có lỗi xảy ra khi thêm tỉnh thành',
                    image: 'Có lỗi xảy ra khi thêm tỉnh thành'
                }));
                setSnackbar({
                    open: true,
                    message: 'Có lỗi xảy ra khi thêm tỉnh thành',
                    severity: 'error'
                });
            }
            console.error('Error creating province:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Modal open={open} onClose={handleClose} sx={{ mt: 5 }}>
                <Box sx={{
                    padding: 3,
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
                    <Typography variant="h4" component="h2" gutterBottom align='center' color='primary' fontWeight='bold'>
                        Thêm tỉnh thành mới
                    </Typography>

                    <Box>
                        <TextField
                            fullWidth
                            label="Tên tỉnh thành"
                            name="provinceName"
                            value={formData.provinceName}
                            onChange={handleInputChange}
                            margin="normal"
                            error={!!errors.provinceName}
                            helperText={errors.provinceName}
                            required
                        />

                        <TextField
                            fullWidth
                            label="Mô tả"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            margin="normal"
                            multiline
                            rows={3}
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
                            <Button 
                                variant="outlined" 
                                component="label" 
                                startIcon={<CloudUploadIcon />}
                            >
                                Chọn ảnh
                                <input 
                                    type="file" 
                                    hidden 
                                    accept="image/*" 
                                    onChange={handleImageChange}
                                    required
                                />
                            </Button>
                            {errors.image && (
                                <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                                    {errors.image}
                                </Typography>
                            )}
                        </Box>

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
                                onClick={handleSubmit} 
                                variant="contained" 
                                color="primary"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                                        Đang xử lý...
                                    </Box>
                                ) : (
                                    'Thêm tỉnh thành'
                                )}
                            </Button>
                        </Box>
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

export default CreateProvince;
