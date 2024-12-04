import { useState, useEffect } from 'react';
import {
    Box, Grid, Typography, Button, Paper, Dialog, DialogTitle, DialogContent,
    DialogContentText, DialogActions, TextField, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem, FormHelperText
} from '@mui/material';
import { CalendarToday } from '@mui/icons-material';
import { getBookingStatusInfo, getRefundStatusInfo, getEntityModifyActionInfo, getRoleName } from '@services/StatusService';
import { BookingStatus, RefundStatus, EntityModifyAction } from '@hooks/Statuses';
import { cancelBooking, createRefundTransaction, getBookingHistory } from '@services/BookingService';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { bankData } from '@hooks/Bank';
import 'dayjs/locale/vi';
import ChangeBooking from '@components/booking/ChangeBooking';

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
        payTime: dayjs(),
        refundId: null
    });
    const [refundErrors, setRefundErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [bookingData, setBooking] = useState(booking);
    const [isChangeBookingOpen, setIsChangeBookingOpen] = useState(false);

    useEffect(() => {
        fetchBookingDetail();
    }, [booking.bookingId]);

    const fetchBookingDetail = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getBookingHistory(booking.bookingId);
            setBooking(data);
        } catch (error) {
            setError('Không thể tải lịch sử đặt tour');
        } finally {
            setLoading(false);
        }
    };

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

    const handleRefund = (refundId) => () => {
        setRefundData(prev => ({
            ...prev,
            refundId
        }));
        setOpenRefundDialog(true);
    };

    const handleRefundDataChange = (field, value) => {
        setRefundData(prev => ({
            ...prev,
            [field]: value
        }));
        setRefundErrors(prev => ({
            ...prev,
            [field]: undefined
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
        const errors = validateRefundData();
        if (Object.keys(errors).length > 0) {
            setRefundErrors(errors);
            return;
        }

        try {
            await createRefundTransaction(refundData.refundId, {
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

    const handleChangeTour = () => {
        setIsChangeBookingOpen(true);
    };

    const handleTourSelect = (selectedTour) => {
        console.log('Selected new tour:', selectedTour);
        // Here you would implement the logic to change the tour
        setIsChangeBookingOpen(false);
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
                            <Typography variant="body1" sx={{ fontWeight: 700 }}>{booking.totalPrice.toLocaleString()} đ</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="body1">Tình trạng:</Typography>
                            <Typography variant="body1" sx={{ color: getBookingStatusInfo(booking.status).color }}>{getBookingStatusInfo(booking.status).text}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="body1">Ghi chú:</Typography>
                            <Typography variant="body1">{booking.note}</Typography>
                        </Box>
                    </Paper>
                    <Paper elevation={3} sx={{ p: 2, borderRadius: '8px', mt: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>Lịch sử</Typography>
                        {bookingData && bookingData.length > 0 ? (
                            bookingData.map((historyItem, index) => (
                                <Box key={index} sx={{ mb: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                        <Typography variant="body1">Ngày:</Typography>
                                        <Typography variant="body1">{formatDateTime(historyItem.timestamp)}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                        <Typography variant="body1">Hành động:</Typography>
                                        <Typography variant="body1">{getEntityModifyActionInfo(historyItem.action).text}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                        <Typography variant="body1">Thực hiện bởi:</Typography>
                                        <Typography variant="body1">{getRoleName(historyItem.modifierRole)}</Typography>
                                    </Box>
                                    {historyItem.action !== EntityModifyAction.Create && historyItem.action !== EntityModifyAction.Delete && (
                                        <>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                                <Typography variant="body1">Trạng thái cũ:</Typography>
                                                <Typography variant="body1">{getBookingStatusInfo(historyItem.oldStatus).text}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                                <Typography variant="body1">Trạng thái mới:</Typography>
                                                <Typography variant="body1">{getBookingStatusInfo(historyItem.newStatus).text}</Typography>
                                            </Box>
                                        </>
                                    )}
                                    {historyItem.action !== EntityModifyAction.Create && (
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                            <Typography variant="body1">Lý do:</Typography>
                                            <Typography variant="body1">{historyItem.reason}</Typography>
                                        </Box>
                                    )}
                                    {index !== bookingData.length - 1 && <hr />}
                                </Box>
                            ))
                        ) : (
                            <Typography variant="body1">Không có lịch sử đặt tour</Typography>
                        )}
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
                        {booking.tourPolicies && booking.tourPolicies.length > 0 && (
                            <>
                                <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 'bold' }}>
                                    Chính sách hủy tour
                                </Typography>
                                {booking.tourPolicies.map((policy, index) => (
                                    <Typography key={index} variant="body2">
                                        Hủy trước ngày {new Date(policy.cancelBefore).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}: Chi phí hủy là {policy.refundPercent}% tổng tiền booking
                                    </Typography>
                                ))}<hr />
                            </>
                        )}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold' }}>Tổng tiền:</Typography>
                            <Typography variant="h5" sx={{ mt: 1, fontWeight: 'bold', color: 'primary.main' }}>{booking.totalPrice.toLocaleString()} đ</Typography>
                        </Box>
                        {(booking.status === BookingStatus.Pending || booking.status === BookingStatus.Deposited || booking.status === BookingStatus.Paid) && (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    sx={{ width: '48%' }}
                                    onClick={handleCancelClick}
                                >
                                    Hủy booking
                                </Button>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    sx={{ width: '48%' }}
                                    onClick={handleChangeTour}
                                >
                                    Chuyển tour
                                </Button>
                            </Box>
                        )}
                    </Paper>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: '8px', mt: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Thông tin hoàn tiền</Typography>
                        {booking.refundRequests?.map((refund, index) => (
                            <>
                                <Typography variant="body1"><span style={{ fontWeight: 700 }}>{index + 1}. Hoàn tiền do: </span>{refund.refundReason}</Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                    <Typography variant="body1">Tình trạng:</Typography>
                                    <Typography variant="body1" sx={{ color: `${getRefundStatusInfo(refund.refundStatus).color}` }}>{getRefundStatusInfo(refund.refundStatus).text}</Typography>
                                </Box>
                                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                    <Typography variant="body1">
                                        {refund.refundStatus === RefundStatus.Pending ? 'Số tiền cần hoàn:' : 'Số tiền đã hoàn:'}
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 700 }}>{refund.refundAmount?.toLocaleString()} đ</Typography>
                                </Box>
                                {refund.refundStatus === RefundStatus.Refunded && (
                                    <>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                            <Typography variant="body1">Ngày hoàn:</Typography>
                                            <Typography variant="body1">{formatDateTime(refund.refundDate)}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                            <Typography variant="body1">Ngân hàng:</Typography>
                                            <Typography variant="body1">{bankData.find(bank => bank.code === refund.bankCode)?.name} ({refund.bankCode})</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                            <Typography variant="body1">Mã giao dịch:</Typography>
                                            <Typography variant="body1">{refund.bankTransactionNumber}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                            <Typography variant="body1">Ghi chú:</Typography>
                                            <Typography variant="body1">{refund.refundNote}</Typography>
                                        </Box>
                                    </>
                                )}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                    <Typography variant="body1">Ngày hủy tour:</Typography>
                                    <Typography variant="body1">{formatDateTime(refund.createdAt)}</Typography>
                                </Box>
                                {refund.refundStatus === RefundStatus.Pending && (
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                                        <Button
                                            variant="contained"
                                            color="warning"
                                            onClick={handleRefund(refund.refundId)}
                                        >
                                            Hoàn tiền
                                        </Button>
                                    </Box>
                                )}
                                {index !== booking.refundRequests.length - 1 && <hr />}
                            </>
                        ))}
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
                onClose={() => {
                    setOpenRefundDialog(false);
                    setRefundErrors({});
                }}
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

                        <FormControl fullWidth error={!!refundErrors.bankCode}>
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
                            {refundErrors.bankCode && (
                                <FormHelperText>{refundErrors.bankCode}</FormHelperText>
                            )}
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Mã giao dịch"
                            required
                            value={refundData.bankTransactionNumber}
                            onChange={(e) => handleRefundDataChange('bankTransactionNumber', e.target.value)}
                            error={!!refundErrors.bankTransactionNumber}
                            helperText={refundErrors.bankTransactionNumber}
                        />

                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
                            <DateTimePicker
                                label="Thời gian hoàn tiền *"
                                required
                                value={refundData.payTime}
                                onChange={(newValue) => handleRefundDataChange('payTime', newValue)}
                                format="DD/MM/YYYY HH:mm"
                                slotProps={{
                                    textField: {
                                        error: !!refundErrors.payTime,
                                        helperText: refundErrors.payTime
                                    }
                                }}
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

            <ChangeBooking
                open={isChangeBookingOpen}
                onClose={() => setIsChangeBookingOpen(false)}
                onTourSelect={handleTourSelect}
                booking={booking}
            />
        </>
    );
};

export default BookingDetail;