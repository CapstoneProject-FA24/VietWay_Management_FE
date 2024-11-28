import { useState } from 'react';
import {
    Box, Grid, Typography, Button, Paper, Dialog, DialogTitle, DialogContent,
    DialogContentText, DialogActions, TextField, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem, FormHelperText
} from '@mui/material';
import { CalendarToday } from '@mui/icons-material';
import { getBookingStatusInfo, getRoleName } from '@services/StatusService';
import { BookingStatus } from '@hooks/Statuses';
import { cancelBooking, createRefundTransaction } from '@services/BookingService';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { bankData } from '@hooks/Bank';
import 'dayjs/locale/vi';

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
    const [openRefundDialog, setOpenRefundDialog] = useState(false);
    const [refundData, setRefundData] = useState({
        note: '',
        bankCode: '',
        bankTransactionNumber: '',
        payTime: dayjs()
    });
    const [refundErrors, setRefundErrors] = useState({});

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

    const handleRefund = () => {
        setOpenRefundDialog(true);
    };

    const handleRefundDataChange = (field, value) => {
        setRefundData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const validateRefundData = () => {
        const errors = {};

        if (!refundData.bankCode) {
            errors.bankCode = 'Vui lòng chọn ngân hàng';
        }

        if (!refundData.bankTransactionNumber) {
            errors.bankTransactionNumber = 'Vui lòng nhập mã giao dịch';
        }

        if (!refundData.payTime) {
            errors.payTime = 'Vui lòng chọn thời gian hoàn tiền';
        } else if (dayjs(refundData.payTime).isAfter(dayjs())) {
            errors.payTime = 'Thời gian hoàn tiền không thể sau thời điểm hiện tại';
        }

        return errors;
    };

    const handleConfirmRefund = async () => {
        if (!refundData.bankCode || !refundData.bankTransactionNumber || !refundData.payTime) {
            return;
        }

        try {
            await createRefundTransaction(booking.bookingId, {
                note: refundData.note.trim(),
                bankCode: refundData.bankCode,
                bankTransactionNumber: refundData.bankTransactionNumber.trim(),
                payTime: refundData.payTime
            });
            
            setOpenRefundDialog(false);
            setRefundData({
                note: '',
                bankCode: '',
                bankTransactionNumber: '',
                payTime: dayjs()
            });
            setSnackbar({
                open: true,
                message: 'Hoàn tiền thành công',
                severity: 'success'
            });
            window.location.reload();
        } catch (error) {
            setSnackbar({
                open: true,
                message: error.response?.data?.message || 'Có lỗi xảy ra khi hoàn tiền',
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
                                    <Typography variant="body1" sx={{ color: 'red' }}>{booking.refundAmount?.toLocaleString()} đ</Typography>
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
                                <Button
                                    variant="contained"
                                    color="warning"
                                    sx={{ width: '48%' }}
                                    onClick={handleRefund}
                                >
                                    Hoàn tiền
                                </Button>
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

            {/* Refund Dialog */}
            <Dialog
                open={openRefundDialog}
                onClose={() => setOpenRefundDialog(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Xác nhận hoàn tiền</DialogTitle>
                <DialogContent>
                    <Typography sx={{ color: 'red' }}>
                        Lưu ý: Nhân viên vui lòng thực hiện hoàn tiền thành công trước khi thực hiện thêm thông tin xác nhận tại đây
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Ghi chú"
                            multiline
                            rows={3}
                            value={refundData.note}
                            onChange={(e) => handleRefundDataChange('note', e.target.value)}
                        />

                        <FormControl fullWidth>
                            <InputLabel id="bank-select-label">Ngân hàng *</InputLabel>
                            <Select
                                labelId="bank-select-label"
                                id="bank-select"
                                value={refundData.bankCode}
                                onChange={(e) => handleRefundDataChange('bankCode', e.target.value)}
                                label="Ngân hàng"
                            >
                                <MenuItem value="" disabled>Chọn ngân hàng *</MenuItem>
                                {bankData.map((bank) => (
                                    <MenuItem key={bank.code} value={bank.code}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <img
                                                src={bank.imageUrl}
                                                alt={bank.name}
                                                style={{ width: 24, height: 24 }}
                                            />
                                            {bank.name}
                                        </Box>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Mã giao dịch"
                            required
                            value={refundData.bankTransactionNumber}
                            onChange={(e) => handleRefundDataChange('bankTransactionNumber', e.target.value)}
                        />

                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
                            <DateTimePicker
                                label="Thời gian hoàn tiền *"
                                required
                                value={refundData.payTime}
                                onChange={(newValue) => handleRefundDataChange('payTime', newValue)}
                                format="DD/MM/YYYY HH:mm"
                            />
                        </LocalizationProvider>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenRefundDialog(false)}>Hủy</Button>
                    <Button
                        onClick={handleConfirmRefund}
                        color="warning"
                        variant="contained"
                        disabled={!refundData.bankCode || !refundData.bankTransactionNumber || !refundData.payTime}
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