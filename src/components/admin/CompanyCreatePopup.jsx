import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import CloseIcon from '@mui/icons-material/Close';

const CompanyCreatePopup = ({ open, onClose, onCreate }) => {
    const [newCompany, setNewCompany] = useState({});
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewCompany({ ...newCompany, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const newImageUrl = URL.createObjectURL(file);
            setNewCompany({ ...newCompany, imageUrl: newImageUrl });
            setImageUrl(newImageUrl);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate({ ...newCompany, imageFile });
        onClose();
    };

    const handleClose = () => {
        setNewCompany({});
        setImageFile(null);
        setImageUrl('');
        onClose();
    };

    return (
        <Modal open={open} onClose={handleClose} sx={{ mt: 5 }}>
            <Box sx={{ padding: 4, backgroundColor: 'white', borderRadius: 2, maxWidth: 600, margin: 'auto', position: 'relative' }}>
                <CloseIcon
                    onClick={handleClose}
                    sx={{ position: 'absolute', top: 16, right: 16, cursor: 'pointer' }}
                />
                <Typography variant="h4" component="h2" gutterBottom align='center' color='primary'>
                    Tạo công ty mới
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                label="Tên công ty"
                                name="name"
                                value={newCompany.name || ''}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Số điện thoại"
                                name="phone"
                                value={newCompany.phone || ''}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Email"
                                name="email"
                                value={newCompany.email || ''}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Địa chỉ"
                                name="address"
                                value={newCompany.address || ''}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Website"
                                name="website"
                                value={newCompany.website || ''}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Hình ảnh"
                                name="image"
                                value={imageUrl}
                                fullWidth
                                margin="normal"
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={6} sx={{ mt: -2 }}></Grid>
                        <Grid item xs={6} sx={{ mt: -2 }}>
                            <input
                                accept="image/*"
                                type="file"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                                id="image-upload"
                            />
                            <label htmlFor="image-upload">
                                <Button variant="contained" component="span" fullWidth margin="normal">
                                    Tải lên hình ảnh
                                </Button>
                            </label>
                        </Grid>
                    </Grid>
                    <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
                        <Button onClick={handleClose} variant="outlined" color="primary" sx={{ mr: 1 }}>
                            Hủy
                        </Button>
                        <Button type="submit" variant="contained" color="primary">
                            Tạo
                        </Button>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
};

export default CompanyCreatePopup;
