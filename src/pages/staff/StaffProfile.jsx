import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Snackbar, Paper, Button, TextField, Grid, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, InputAdornment } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SidebarStaff from '@layouts/SidebarStaff';
import { mockManager } from '@hooks/MockAccount';
import TodayIcon from '@mui/icons-material/Today';
import { Helmet } from 'react-helmet';
import { changeStaffPassword } from '@services/StaffService';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const StaffProfile = () => {
    const [profile, setProfile] = useState({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [showPassword, setShowPassword] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false
    });
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const managerProfile = mockManager[0];
        setProfile(managerProfile);
    }, []);

    const fields = [
        { key: 'fullname', label: 'Tên', icon: <PersonIcon /> },
        { key: 'email', label: 'Email', icon: <EmailIcon /> },
        { key: 'phone', label: 'Số điện thoại', icon: <PhoneIcon /> },
        { key: 'createDate', label: 'Ngày đăng ký', icon: <TodayIcon /> },
    ];

    const handlePasswordChange = (field) => (event) => {
        setPasswordForm(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const validatePasswordForm = () => {
        const newErrors = {};
        if (!passwordForm.currentPassword) {
            newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
        }
        if (!passwordForm.newPassword) {
            newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
        } else {
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;
            if (!passwordRegex.test(passwordForm.newPassword)) {
                newErrors.newPassword = 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt';
            }
        }
        if (!passwordForm.confirmPassword) {
            newErrors.confirmPassword = 'Vui lòng nhập lại mật khẩu mới';
        } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu không khớp';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdatePassword = async () => {
        if (validatePasswordForm()) {
            try {
                await changeStaffPassword(passwordForm.currentPassword, passwordForm.newPassword);
                setOpenPasswordDialog(false);
                setPasswordForm({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setSnackbar({
                    open: true,
                    message: 'Mật khẩu đã được cập nhật thành công',
                    severity: 'success'
                });
            } catch (error) {
                setSnackbar({
                    open: true,
                    message: error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật mật khẩu',
                    severity: 'error'
                });
            }
        }
    };

    const handleClosePasswordDialog = () => {
        setOpenPasswordDialog(false);
        setPasswordForm({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setErrors({});
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleClickShowPassword = (field) => () => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Helmet>
                <title>Thông tin tài khoản</title>
            </Helmet>
            <SidebarStaff isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <Box sx={{ flexGrow: 1, transition: 'margin-left 0.3s', marginLeft: isSidebarOpen ? '250px' : 0, mt: -12 }}>
                <Box component="header" sx={{ width: isSidebarOpen ? 'calc(100vw - 250px)' : '100vw', position: 'relative', height: '400px', borderRadius: '0 0 30px 30px', overflow: 'hidden' }}>
                    <Box className="hero-text" sx={{
                        width: "100%", height: "100%", display: 'flex', flexDirection: 'column', justifyContent: 'center',
                        alignItems: 'center', textAlign: 'center', position: "relative", zIndex: 1
                    }}>
                        <Box sx={{
                            width: "100%", height: "100%", backgroundColor: 'rgba(89, 120, 183, 0.5)',
                            position: "absolute", top: 0, left: 0, zIndex: 0
                        }}></Box>
                        <Typography variant="h1" sx={{ fontSize: '3.2rem', mb: 1, zIndex: 2, color: 'white', mt: -25 }}>
                            {profile.fullname}
                        </Typography>
                        <Typography variant="h5" sx={{ width: "40%", zIndex: 2, color: 'white' }}>{profile.email}</Typography>
                        <img
                            src="/account-background.jpg" alt="Wave"
                            style={{ width: "100%", height: "100%", bottom: 0, left: 0, position: "absolute", zIndex: -1 }}
                        />
                    </Box>
                </Box>
                <Container sx={{ mt: -35, position: "relative", zIndex: 1, width: '70vw' }}>
                    <Box sx={{ my: 5 }}>
                        <Typography variant="h5" sx={{ mb: 1, color: 'white', fontWeight: 'bold' }}>
                            Thông tin tài khoản
                        </Typography>
                        <Paper sx={{ p: 6, borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                            {fields.map((field) => (
                                <Grid container spacing={1} key={field.key} sx={{ mb: 3 }}>
                                    <Grid item xs={12} sm={2} md={0.6}>
                                        <Box sx={{ color: 'primary.main', mt: 0.5 }}>{field.icon}</Box>
                                    </Grid>
                                    <Grid item xs={12} sm={10} md={4}>
                                        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.3rem' }}>
                                            {field.label}:
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={7.4}>
                                        <Typography variant="body1" sx={{ fontWeight: 'medium', fontSize: '1.3rem' }}>
                                            {profile[field.key] || 'N/A'}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            ))}
                            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    variant="contained"
                                    startIcon={<LockIcon />}
                                    sx={{ borderRadius: '20px' }}
                                    onClick={() => setOpenPasswordDialog(true)}
                                >
                                    Đổi mật khẩu
                                </Button>
                            </Box>
                        </Paper>
                    </Box>
                </Container>

                {/* Password Update Dialog */}
                <Dialog open={openPasswordDialog} onClose={handleClosePasswordDialog}>
                    <DialogTitle>Đổi mật khẩu</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            label="Mật khẩu hiện tại"
                            type={showPassword.currentPassword ? 'text' : 'password'}
                            fullWidth
                            required
                            value={passwordForm.currentPassword}
                            onChange={handlePasswordChange('currentPassword')}
                            error={!!errors.currentPassword}
                            helperText={errors.currentPassword}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleClickShowPassword('currentPassword')}
                                            edge="end"
                                        >
                                            {showPassword.currentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            margin="dense"
                            label="Mật khẩu mới"
                            type={showPassword.newPassword ? 'text' : 'password'}
                            fullWidth
                            required
                            value={passwordForm.newPassword}
                            onChange={handlePasswordChange('newPassword')}
                            error={!!errors.newPassword}
                            helperText={errors.newPassword}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleClickShowPassword('newPassword')}
                                            edge="end"
                                        >
                                            {showPassword.newPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            margin="dense"
                            label="Nhập lại mật khẩu mới"
                            type={showPassword.confirmPassword ? 'text' : 'password'}
                            fullWidth
                            required
                            value={passwordForm.confirmPassword}
                            onChange={handlePasswordChange('confirmPassword')}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleClickShowPassword('confirmPassword')}
                                            edge="end"
                                        >
                                            {showPassword.confirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClosePasswordDialog}>Hủy</Button>
                        <Button onClick={handleUpdatePassword} variant="contained">
                            Cập nhật
                        </Button>
                    </DialogActions>
                </Dialog>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
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
            </Box>
        </Box>
    );
};

export default StaffProfile;
