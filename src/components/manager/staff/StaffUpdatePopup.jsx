import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, IconButton, InputAdornment } from '@mui/material';
import Grid from '@mui/material/Grid';
import CloseIcon from '@mui/icons-material/Close';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import StatusPopup from '@components/StatusPopup';
import { updateStaff } from '@services/StaffService';

const StaffUpdatePopup = ({ open, onClose, staff, onUpdate }) => {
    const [updatedStaff, setUpdatedStaff] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [openPopup, setOpenPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (staff) {
            setUpdatedStaff({
                staffId: staff.staffId,
                fullName: staff.fullName,
                email: staff.email,
                phone: staff.phone
            });
        }
    }, [staff]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedStaff(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await updateStaff(updatedStaff);
            onUpdate(response.data);
            onClose();
        } catch (error) {
            console.error('Error updating staff:', error);
            setError(error.response?.data?.message || 'Failed to update staff');
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleOpenPopup = () => {
        setOpenPopup(true);
    };

    return (
        <>
            <Modal open={open} onClose={onClose} sx={{ mt: 5 }}>
                <Box sx={{ padding: 4, backgroundColor: 'white', borderRadius: 2, maxWidth: 600, margin: 'auto', position: 'relative' }}>
                    <CloseIcon onClick={onClose} sx={{ position: 'absolute', top: 16, right: 16, cursor: 'pointer' }} />
                    <Typography variant="h4" component="h2" gutterBottom align='center' color='primary'>
                        Cập nhật thông tin nhân viên
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField 
                                    label="Họ tên" 
                                    name="fullName"
                                    value={updatedStaff.fullName || ''} 
                                    onChange={handleChange} 
                                    fullWidth 
                                    margin="normal"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField 
                                    label="Số điện thoại" 
                                    name="phone" 
                                    value={updatedStaff.phone || ''} 
                                    onChange={handleChange} 
                                    fullWidth 
                                    margin="normal"
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField 
                                    label="Email" 
                                    name="email" 
                                    value={updatedStaff.email || ''} 
                                    onChange={handleChange} 
                                    fullWidth 
                                    margin="normal"
                                    required
                                    type="email"
                                />
                            </Grid>
                        </Grid>

                        {error && (
                            <Typography color="error" sx={{ mt: 2 }}>
                                {error}
                            </Typography>
                        )}

                        <Grid>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
                                <Button 
                                    onClick={onClose} 
                                    variant="outlined" 
                                    color="primary" 
                                    sx={{ mr: 1 }}
                                    disabled={loading}
                                >
                                    Hủy
                                </Button>
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    color="primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Đang cập nhật...' : 'Cập nhật'}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>

                </Box>
            </Modal>
            <StatusPopup
                open={openPopup}
                onClose={() => setOpenPopup(false)}
                user={staff}
                onOpen={(id) => {
                    console.log('Staff ID:', id);
                    setOpenPopup(false);
                }}
            />
        </>
    );
};

export default StaffUpdatePopup;