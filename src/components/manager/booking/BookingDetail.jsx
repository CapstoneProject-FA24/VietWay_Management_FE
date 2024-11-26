import { useState } from 'react';
import { Box, Grid, Typography, Button, Paper, Dialog, DialogTitle, DialogContent, 
         DialogContentText, DialogActions, TextField, Snackbar, Alert } from '@mui/material';
import { CalendarToday } from '@mui/icons-material';
import { getBookingStatusInfo, getRoleName } from '@services/StatusService';
import { BookingStatus } from '@hooks/Statuses';
import { cancelBooking } from '@services/BookingService';

const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    const formattedTime = date.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
    });
    return `${formattedDate} ${formattedTime}`;
};

const BookingDetail = ({ booking }) => {
    const [openCancelDialog, setOpenCancelDialog] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const handleCancelClick = () => {
        setOpenCancelDialog(true);
    };

    const handleConfirmCancel = async () => {
        try {
            await cancelBooking(booking.bookingId, cancelReason);
            setOpenCancelDialog(false);
            setCancelReason('');
            setSnackbar({
                open: true,
                message: 'Hủy booking thành công',
                severity: 'success'
            });
            // Optionally refresh the booking data here
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Có lỗi xảy ra khi hủy booking',
                severity: 'error'
            });
        }
    };

    return (
        <>
            <Grid container spacing={1.5}>
                <Grid item xs={12} md={7}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: '8px' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Thông tin liên hệ</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2.5 }}>
                            <Typography variant="body1">Họ tên:</Typography>
                            <Typography variant="body1">{booking.contactFullName}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="body1">Email:</Typography>
                            <Typography variant="body1">{booking.contactEmail}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="body1">Số điện thoại:</Typography>
                            <Typography variant="body1">{booking.contactPhoneNumber}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="body1">Địa chỉ:</Typography>
                            <Typography variant="body1">{booking.contactAddress}</Typography>
                        </Box>
                    </Paper>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: '8px', mt: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Chi tiết booking</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2.5 }}>
                            <Typography variant="body1">Mã booking:</Typography>
                            <Typography variant="body1">{booking.code}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="body1">Ngày đặt tour:</Typography>
                            <Typography variant="body1">{formatDateTime(booking.createdAt)}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="body1">Trị giá booking:</Typography>
                            <Typography variant="body1">{booking.totalPrice.toLocaleString()} đ</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="body1">Tình trạng:</Typography>
                            <Typography variant="body1" sx={{ color: getBookingStatusInfo(booking.status).color }}>{getBookingStatusInfo(booking.status).text}</Typography>
                        </Box>
                        {(booking.status === BookingStatus.PendingRefund || booking.status === BookingStatus.Refunded) && (
                            <>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                    <Typography variant="body1">Hủy lúc:</Typography>
                                    <Typography variant="body1">{formatDateTime(booking.cancelAt)}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                    <Typography variant="body1">Hủy bởi:</Typography>
                                    <Typography variant="body1">{getRoleName(booking.cancelBy)}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                    <Typography variant="body1">
                                        {booking.status === BookingStatus.PendingRefund ? 'Tổng tiền cần hoàn:' : 'Tổng tiền đã hoàn:'}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: 'red'}}>{booking.refundAmount.toLocaleString()} đ</Typography>
                                </Box>
                            </>
                        )}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="body1">Ghi chú:</Typography>
                            <Typography variant="body1">{booking.note}</Typography>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Paper elevation={3} sx={{ p: 2, borderRadius: '8px' }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>Thông tin tour</Typography>
                        <Typography variant="h5" sx={{ mt: 1 }}>{booking.tourName}</Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}><strong>Mã tour:</strong> {booking.tourCode}</Typography>
                        <Typography variant="body1" sx={{ mt: 1 }}>
                            <strong>Ngày đi:</strong> {formatDateTime(booking.startDate)}
                        </Typography><hr />
                        <Typography variant="h5" color="primary.main" sx={{ mt: 1, fontWeight: 'bold' }}>
                            Tổng tiền: {booking.totalPrice.toLocaleString()} đ
                        </Typography>
                        {(booking.status === BookingStatus.Pending || booking.status === BookingStatus.Confirmed) && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                                <Button 
                                    variant="contained" 
                                    color="error" 
                                    sx={{ width: '48%' }}
                                    onClick={handleCancelClick}
                                >
                                    Hủy booking
                                </Button>
                                <Button variant="contained" color="primary" sx={{ width: '48%' }}>
                                    Chuyển tour
                                </Button>
                            </Box>
                        )}
                        {booking.status === BookingStatus.PendingRefund && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                <Button variant="contained" color="warning" sx={{ width: '48%' }}>Hoàn tiền</Button>
                            </Box>
                        )}

                        {booking.tourPolicies && booking.tourPolicies.length > 0 && (
                            <>
                                <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 'bold' }}>
                                    Chính sách hủy tour
                                </Typography>
                                {booking.tourPolicies.map((policy, index) => (
                                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                        <Typography variant="body2">
                                            Hủy trước {formatDateTime(policy.cancelBefore)} ngày:
                                        </Typography>
                                        <Typography variant="body2" color="primary">
                                            Hoàn {policy.refundPercent}% tổng tiền
                                        </Typography>
                                    </Box>
                                ))}
                            </>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* Cancel Booking Dialog */}
            <Dialog
                open={openCancelDialog}
                onClose={() => setOpenCancelDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Xác nhận hủy booking</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn hủy booking này? Vui lòng nhập lý do hủy booking.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Lý do hủy"
                        fullWidth
                        multiline
                        rows={3}
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCancelDialog(false)}>Hủy</Button>
                    <Button 
                        onClick={handleConfirmCancel} 
                        color="error" 
                        variant="contained"
                        disabled={!cancelReason.trim()}
                    >
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar Notification */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert 
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                    variant='filled'
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default BookingDetail;