import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, Typography, IconButton, InputAdornment } from '@mui/material';
import Grid from '@mui/material/Grid';
import CloseIcon from '@mui/icons-material/Close';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import StatusPopup from '@components/StatusPopup';

const ManagerUpdatePopup = ({ open, onClose, manager, onUpdate }) => {
    const [updatedManager, setUpdatedManager] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [openPopup, setOpenPopup] = useState(false);

    useEffect(() => {
        if (manager) {
            setUpdatedManager(manager);
        }
    }, [manager]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedManager({ ...updatedManager, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate(updatedManager);
        onClose();
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
                        Cập nhật thông tin quản lý
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField label="Họ tên" name="fullname" value={updatedManager.fullname || ''} onChange={handleChange} fullWidth margin="normal" />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField label="Số điện thoại" name="phone" value={updatedManager.phone || ''} onChange={handleChange} fullWidth margin="normal" />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField label="Email" name="email" value={updatedManager.email || ''} onChange={handleChange} fullWidth margin="normal" />
                            </Grid>
                            {/*<Grid item xs={12}>
                                <TextField
                                    label="Mật khẩu"
                                    name="pass"
                                    type={showPassword ? 'text' : 'password'} // Kiểm soát loại hiển thị
                                    value={updatedManager.pass || ''}
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
                                <Button variant="contained" color="secondary" onClick={setOpenPopup} sx={{ backgroundColor: updatedManager.status === 1 ? 'red' : 'green', mr: 1, color: 'white' }}>
                                    {updatedManager.status === 1 ? 'Vô hiệu hóa' : ' Kích hoạt'}
                                </Button>
                                <Box sx={{ display: 'flex' }}>
                                    <Button onClick={onClose} variant="outlined" color="primary" sx={{ mr: 1 }}>Hủy</Button>
                                    <Button type="submit" variant="contained" color="primary">Sửa</Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>

                </Box>
            </Modal>
            <StatusPopup
                open={openPopup}
                onClose={() => setOpenPopup(false)}
                user={manager}
                onOpen={(id) => {
                    console.log('Manager ID:', id);
                    setOpenPopup(false);
                }}
            />
        </>
    );
};

export default ManagerUpdatePopup;