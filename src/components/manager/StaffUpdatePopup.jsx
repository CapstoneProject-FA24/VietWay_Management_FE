import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, IconButton, InputAdornment } from '@mui/material';
import Grid from '@mui/material/Grid';
import CloseIcon from '@mui/icons-material/Close';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ActivatePopup from '@components/ActivatePopup';
import DeactivatePopup from '@components/DeactivatePopup';

const StaffUpdatePopup = ({ open, onClose, staff, onUpdate }) => {
    const [updatedStaff, setUpdatedStaff] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [openActivatePopup, setOpenActivatePopup] = useState(false);
    const [openDeactivatePopup, setOpenDeactivatePopup] = useState(false);

    useEffect(() => {
        if (staff) {
            setUpdatedStaff(staff);
        }
    }, [staff]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedStaff({ ...updatedStaff, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(updatedStaff);
        onClose();
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleOpenActivatePopup = () => {
        setOpenActivatePopup(true);
    };

    const handleOpenDeactivatePopup = () => {
        setOpenDeactivatePopup(true);
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
                                <TextField label="Họ tên" name="fullname" value={updatedStaff.fullname || ''} onChange={handleChange} fullWidth margin="normal" />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField label="Số điện thoại" name="phone" value={updatedStaff.phone || ''} onChange={handleChange} fullWidth margin="normal" />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField label="Email" name="email" value={updatedStaff.email || ''} onChange={handleChange} fullWidth margin="normal" />
                            </Grid>
                            {/*<Grid item xs={12}>
                                <TextField
                                    label="Mật khẩu"
                                    name="pass"
                                    type={showPassword ? 'text' : 'password'} // Kiểm soát loại hiển thị
                                    value={updatedStaff.pass || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    margin="normal"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={togglePasswordVisibility}>
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>*/}
                        </Grid>
                        <Grid>
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mt: 5 }}>
                                {staff && staff.status === 1 ? (
                                    <Button variant="contained" color="secondary" onClick={handleOpenDeactivatePopup} sx={{ backgroundColor: 'red', mr: 1, color: 'white' }}>
                                        Vô hiệu hóa
                                    </Button>
                                ) : (
                                    <Button variant="contained" color="primary" onClick={handleOpenActivatePopup} sx={{ backgroundColor: 'green', mr: 1 }}>
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
            {/* Popup for activating Staff */}
            <ActivatePopup
                open={openActivatePopup}
                onClose={() => setOpenActivatePopup(false)}
                user={staff}
                onActivate={(id) => {
                    console.log('Activated Staff ID:', id);
                    setOpenActivatePopup(false);
                }}
            />
            {/* Popup for deactivating Staff */}
            <DeactivatePopup
                open={openDeactivatePopup}
                onClose={() => setOpenDeactivatePopup(false)}
                user={staff}
                onDeactivate={(id) => {
                    console.log('Deactivated Staff ID:', id);
                    setOpenDeactivatePopup(false);
                }}
            />
        </>
    );
};

export default StaffUpdatePopup;