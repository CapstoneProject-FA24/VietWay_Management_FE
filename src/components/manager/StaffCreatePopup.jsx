import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography, MenuItem , FormControl, InputLabel, Select } from '@mui/material';
import Grid from '@mui/material/Grid';
import CloseIcon from '@mui/icons-material/Close';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { mockCompany } from '../../hooks/MockCompany';

const StaffCreatePopup = ({ open, onClose, onCreate }) => {
    const [newStaff, setNewStaff] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewStaff({ ...newStaff, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate(newStaff);
        onClose();
    };

    const handleClose = () => {
        setNewStaff({});
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
                    Tạo nhân viên
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField label="Họ tên" name="fullname" value={newStaff.fullname || ''} onChange={handleChange} fullWidth margin="normal" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Số điện thoại" name="phone" value={newStaff.phone || ''} onChange={handleChange} fullWidth margin="normal" />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Email" name="email" value={newStaff.email || ''} onChange={handleChange} fullWidth margin="normal" />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel sx={{ backgroundColor: 'white' }}>Chọn công ty</InputLabel>
                                <Select
                                    name="company"
                                    value={newStaff.company || ''}
                                    onChange={handleChange}
                                >
                                    {mockCompany.map((company) => (
                                        <MenuItem key={company.id} value={company.name}>
                                            {company.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        {/*<Grid item xs={12}>
                            <TextField
                                label="Mật khẩu"
                                name="pass"
                                type={showPassword ? 'text' : 'password'} // Điều khiển hiển thị hoặc ẩn mật khẩu
                                value={newStaff.pass || ''}
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
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
                        <Button onClick={handleClose} variant="outlined" color="primary" sx={{ mr: 1 }}>Hủy</Button>
                        <Button type="submit" variant="contained" color="primary">Tạo</Button>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
};

export default StaffCreatePopup;
