import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography, IconButton, InputAdornment } from '@mui/material';
import Grid from '@mui/material/Grid';
import CloseIcon from '@mui/icons-material/Close';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const ManagerCreatePopup = ({ open, onClose, onCreate }) => {
    const [newManager, setNewManager] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewManager({ ...newManager, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate(newManager);
        onClose();
    };

    const handleClose = () => {
        setNewManager({});
        onClose();
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Modal open={open} onClose={handleClose} sx={{ mt: 5 }}>
            <Box sx={{ padding: 4, backgroundColor: 'white', borderRadius: 2, maxWidth: 600, margin: 'auto', position: 'relative' }}>
                <CloseIcon onClick={handleClose} sx={{ position: 'absolute', top: 16, right: 16, cursor: 'pointer' }} />
                <Typography variant="h4" component="h2" gutterBottom align='center' color='primary'>
                    Tạo mới quản lý
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField label="Họ tên" name="fullname" value={newManager.fullname || ''} onChange={handleChange} fullWidth margin="normal" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Số điện thoại" name="phone" value={newManager.phone || ''} onChange={handleChange} fullWidth margin="normal" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Email" name="email" value={newManager.email || ''} onChange={handleChange} fullWidth margin="normal" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Mật khẩu"
                                name="pass"
                                type={showPassword ? 'text' : 'password'} // Điều khiển hiển thị hoặc ẩn mật khẩu
                                value={newManager.pass || ''}
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
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
                        <Button onClick={handleClose} variant="outlined" color="primary" sx={{ mr: 1 }}>Hủy</Button>
                        <Button type="submit" variant="contained" color="primary">Tạo</Button>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
};

export default ManagerCreatePopup;
