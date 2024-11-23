import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography, IconButton, CircularProgress, Snackbar, Alert } from '@mui/material';
import { updateProvince, addOrUpdateProvinceImage } from '@services/ProvinceService';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';

const UpdateProvince = ({ open, handleClose, province, onUpdateSuccess }) => {
    const [formData, setFormData] = useState({
        provinceName: province?.provinceName || '',
        description: province?.description || '',
        imageFile: null
    });
    const [previewImage, setPreviewImage] = useState(province?.imageUrl || '');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

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

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({
            ...prev,
            open: false
        }));
    };

    const handleSubmit = async () => {
        try {
            if (!formData.provinceName.trim()) {
                setError('Vui lòng nhập tên tỉnh thành');
                return;
            }

            setIsLoading(true);

            const provinceData = {
                name: formData.provinceName,
                description: formData.description
            };

            await updateProvince(province.provinceId, provinceData);

            if (formData.imageFile) {
                await addOrUpdateProvinceImage(province.provinceId, formData.imageFile);
            }

            setSnackbar({
                open: true,
                message: 'Cập nhật tỉnh thành thành công!',
                severity: 'success'
            });

            onUpdateSuccess();
            handleClose();
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.message || 'Có lỗi xảy ra khi cập nhật tỉnh thành');
                setSnackbar({
                    open: true,
                    message: error.response.data.message || 'Có lỗi xảy ra khi cập nhật tỉnh thành',
                    severity: 'error'
                });
            } else {
                setError('Có lỗi xảy ra khi cập nhật tỉnh thành');
                setSnackbar({
                    open: true,
                    message: 'Có lỗi xảy ra khi cập nhật tỉnh thành',
                    severity: 'error'
                });
            }
            console.error('Error updating province:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
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
                            <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
                                Chọn ảnh mới
                                <input type="file" hidden accept="image/*" onChange={handleImageChange}/>
                            </Button>
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
                                    'Cập nhật'
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

export default UpdateProvince;
