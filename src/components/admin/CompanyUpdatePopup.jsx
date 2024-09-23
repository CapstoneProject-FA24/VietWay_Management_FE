import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CompanyHidePopup from './CompanyHidePopup';
import CompanyShowPopup from './CompanyShowPopup';

const CompanyUpdatePopup = ({ open, onClose, company, onUpdate }) => {
    const [updatedCompany, setUpdatedCompany] = useState({});
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [openHidePopup, setOpenHidePopup] = useState(false);
    const [openShowPopup, setOpenShowPopup] = useState(false);

    useEffect(() => {
        if (company) {
            setUpdatedCompany(company);
            setImageUrl(company.imageUrl || '');
        }
    }, [company]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedCompany({ ...updatedCompany, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const newImageUrl = URL.createObjectURL(file);
            setUpdatedCompany({ ...updatedCompany, imageUrl: newImageUrl });
            setImageUrl(newImageUrl);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate({ ...updatedCompany, imageFile });
        onClose();
    };

    return (
        <>
            <Modal open={open} onClose={onClose} sx={{ mt: 5 }}>
                <Box sx={{ padding: 4, backgroundColor: 'white', borderRadius: 2, maxWidth: 600, margin: 'auto', position: 'relative' }}>
                    <CloseIcon
                        onClick={onClose}
                        sx={{ position: 'absolute', top: 16, right: 16, cursor: 'pointer' }}
                    />
                    <Typography variant="h4" component="h2" gutterBottom align='center' color='primary'>
                        Cập nhật thông tin công ty
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    label="Tên công ty"
                                    name="name"
                                    value={updatedCompany.name || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Số điện thoại"
                                    name="phone"
                                    value={updatedCompany.phone || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Email"
                                    name="email"
                                    value={updatedCompany.email || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Địa chỉ"
                                    name="address"
                                    value={updatedCompany.address || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    label="Website"
                                    name="website"
                                    value={updatedCompany.website || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                />
                            </Grid>
                            {imageUrl && (
                                <Grid item xs={6}>
                                    <TextField
                                        label="Hình ảnh"
                                        name="image"
                                        value={imageUrl}
                                        onChange={handleChange}
                                        fullWidth
                                        margin="normal"
                                    />
                                </Grid>
                            )}
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
                        <Grid>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mt: 5 }}>
                                {updatedCompany.status === 1 ? (
                                    <Button variant="contained" color="secondary" onClick={setOpenHidePopup} sx={{ backgroundColor: 'red', mr: 1, color: 'white' }}>
                                        Vô hiệu hóa
                                    </Button>
                                ) : (
                                    <Button variant="contained" color="primary" onClick={setOpenShowPopup} sx={{ backgroundColor: 'green', mr: 1 }}>
                                        Kích hoạt
                                    </Button>
                                )}
                                <Box sx={{ display: 'flex' }}>
                                    <Button onClick={onClose} variant="outlined" color="primary" sx={{ mr: 1 }}>Hủy</Button>
                                    <Button type="submit" variant="contained" color="primary">Sửa</Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Modal>
            <CompanyHidePopup
                open={openHidePopup}
                onClose={() => setOpenHidePopup(false)}
                company={updatedCompany}
                onDelete={(id) => {
                    console.log('Hidden Company ID:', id);
                    setOpenHidePopup(false);
                }}
            />
            <CompanyShowPopup
                open={openShowPopup}
                onClose={() => setOpenShowPopup(false)}
                company={updatedCompany}
                onShow={(id) => {
                    console.log('Shown Company ID:', id);
                    setOpenShowPopup(false);
                }}
            />
        </>
    );
};

export default CompanyUpdatePopup;
