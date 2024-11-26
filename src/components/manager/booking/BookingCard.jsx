import { Card, CardContent, CardActions, Typography, Button, Chip, Box, Grid, FormControl, InputLabel, FormHelperText } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { getBookingStatusInfo } from '@services/StatusService';
import { BookingStatus } from '@hooks/Statuses';
import { bankData } from '@hooks/Bank';
import { TextField, Select, MenuItem } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { createRefundTransaction, cancelBooking } from '@services/BookingService';
import ChangeBooking from '@components/booking/ChangeBooking';

const BookingCard = ({ booking, onDelete, onViewDetails, onRefund, onRefresh }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openRefundDialog, setOpenRefundDialog] = useState(false);
  const [refundData, setRefundData] = useState({
    note: '',
    bankCode: '',
    bankTransactionNumber: '',
    payTime: dayjs()
  });
  const [cancelDialog, setCancelDialog] = useState({
    reason: ''
  });
  const [refundErrors, setRefundErrors] = useState({});
  const statusInfo = getBookingStatusInfo(booking.status);
  const [isChangeBookingOpen, setIsChangeBookingOpen] = useState(false);

  const handleClickDelete = () => {
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await cancelBooking(booking.bookingId, cancelDialog.reason);
      setOpenDialog(false);
      // Reset form
      setCancelDialog({ reason: '' });
      // Call onRefresh instead of onDelete
      onRefresh();
    } catch (error) {
      console.error('Error canceling booking:', error);
      if (error.response?.data?.message) {
        onDelete(booking.bookingId, error.response.data.message);
      } else {
        onDelete(booking.bookingId, 'Có lỗi xảy ra khi hủy booking');
      }
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
    const errors = validateRefundData();
    if (Object.keys(errors).length > 0) {
      // Set errors to state to display them
      setRefundErrors(errors);
      return;
    }

    try {
      await onRefund(booking.bookingId, {
        note: refundData.note.trim(),
        bankCode: refundData.bankCode,
        bankTransactionNumber: refundData.bankTransactionNumber.trim(),
        payTime: refundData.payTime
      });
      
      setOpenRefundDialog(false);
      setRefundErrors({}); // Clear any errors
      setRefundData({
        note: '',
        bankCode: '',
        bankTransactionNumber: '',
        payTime: dayjs()
      });
      onRefresh();
    } catch (error) {
      console.error('Error during refund:', error);
    }
  };

  const formatDateTime = (dateString) => {
    return dayjs(dateString).format('DD/MM/YYYY HH:mm');
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
    <Card sx={{ pt: 1, pl: 1, pr: 1 }}>
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={12} md={7}>
            <Chip label={statusInfo.text} sx={{ backgroundColor: statusInfo.color, height: '1.5rem' }} />
            <Box sx={{ display: 'flex', mb: 0.5 }}>
              <Typography sx={{ fontWeight: 'bold', fontSize: '1.5rem', mr: 1 }}> Booking:</Typography>
              <Typography sx={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'primary.main' }}> {booking.bookingId}</Typography>
            </Box>
            <Grid container spacing={1.1}>
              <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography color="text.secondary" sx={{ fontWeight: 'bold', mr: 1 }}>Ngày đặt:</Typography>
                <Typography>{formatDateTime(booking.createdAt)}</Typography>
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography color="text.secondary" sx={{ fontWeight: 'bold', mr: 1 }}>Họ tên:</Typography>
                <Typography>{booking.contactFullName}</Typography>
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography color="text.secondary" sx={{ fontWeight: 'bold', mr: 1 }}>Email:</Typography>
                <Typography>{booking.contactEmail}</Typography>
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Typography color="text.secondary" sx={{ fontWeight: 'bold', mr: 1 }}>Số điện thoại:</Typography>
                <Typography>{booking.contactPhoneNumber}</Typography>
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Typography color="text.secondary" sx={{ fontWeight: 'bold', mr: 1 }}>Số lượng khách:</Typography>
                <Typography>{booking.numberOfParticipants}</Typography>
              </Grid>
              <Grid item xs={12} md={12} sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ mr: 1, fontSize: '1.3rem' }}>Tổng tiền:</Typography>
                  <Typography color="error" sx={{ fontWeight: 'bold', fontSize: '1.3rem' }}>{booking.totalPrice.toLocaleString()} đ</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', ml: -1 }}>
                  <CardActions>
                    <Button variant="outlined" onClick={() => onViewDetails(booking.bookingId)}>Chi tiết</Button>
                    {(booking.status === BookingStatus.Pending || booking.status === BookingStatus.Confirmed) && (
                      <>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          onClick={handleChangeTour}
                        >
                          Đổi tour
                        </Button>
                        <Button variant="contained" color="error" onClick={handleClickDelete}>Hủy booking</Button>
                      </>
                    )}
                    {/* {booking.status === BookingStatus.PendingRefund && (
                      <Button
                        variant="contained"
                        color="warning"
                        onClick={handleRefund}
                      >
                        Hoàn tiền
                      </Button>
                    )} */}
                  </CardActions>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ backgroundColor: 'grey', width: '1px', height: '230px', mr: 1 }} />
          </Box>
          <Grid item xs={12} md={4.8} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography sx={{ fontWeight: 'bold', fontSize: '1.3rem', mb: 1 }}> Thông tin tour:</Typography>
            <Box sx={{ display: 'flex' }}>
              <Typography color="text.secondary" sx={{ fontWeight: 'bold', mr: 1 }}>Tour:</Typography>
              <Typography>{booking.tourName}</Typography>
            </Box>
            <Box sx={{ display: 'flex', mt: 1 }}>
              <Typography color="text.secondary" sx={{ fontWeight: 'bold', mr: 1 }}>Mã tour:</Typography>
              <Typography>{booking.tourCode}</Typography>
            </Box>
            <Box sx={{ display: 'flex', mt: 1 }}>
              <Typography color="text.secondary" sx={{ fontWeight: 'bold', mr: 1 }}>Khởi hành lúc:</Typography>
              <Typography>{formatDateTime(booking.startDate)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', mt: 1 }}>
              <Typography color="text.secondary" sx={{ fontWeight: 'bold', mr: 1 }}>Khởi hành từ:</Typography>
              <Typography>TP Hồ Chí Minh</Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
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
            value={cancelDialog.reason}
            onChange={(e) => setCancelDialog(prev => ({ ...prev, reason: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            autoFocus
            disabled={!cancelDialog.reason.trim()}
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openRefundDialog} onClose={() => setOpenRefundDialog(false)}>
        <DialogTitle>Hoàn tiền booking</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }} error={!!refundErrors.bankCode}>
            <InputLabel>Ngân hàng</InputLabel>
            <Select
              value={refundData.bankCode}
              onChange={(e) => setRefundData(prev => ({ ...prev, bankCode: e.target.value }))}
              label="Ngân hàng"
            >
              <MenuItem value="VCB">Vietcombank</MenuItem>
              <MenuItem value="TCB">Techcombank</MenuItem>
              {/* Add other banks as needed */}
            </Select>
            {refundErrors.bankCode && (
              <FormHelperText>{refundErrors.bankCode}</FormHelperText>
            )}
          </FormControl>

          <TextField
            fullWidth
            margin="dense"
            label="Mã giao dịch"
            value={refundData.bankTransactionNumber}
            onChange={(e) => setRefundData(prev => ({ ...prev, bankTransactionNumber: e.target.value }))}
            error={!!refundErrors.bankTransactionNumber}
            helperText={refundErrors.bankTransactionNumber}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Thời gian hoàn tiền"
              value={refundData.payTime}
              onChange={(newValue) => setRefundData(prev => ({ ...prev, payTime: newValue }))}
              maxDateTime={dayjs()}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "dense",
                  error: !!refundErrors.payTime,
                  helperText: refundErrors.payTime
                }
              }}
            />
          </LocalizationProvider>

          <TextField
            fullWidth
            margin="dense"
            label="Ghi chú"
            multiline
            rows={3}
            value={refundData.note}
            onChange={(e) => setRefundData(prev => ({ ...prev, note: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenRefundDialog(false);
            setRefundErrors({});
            setRefundData({
              note: '',
              bankCode: '',
              bankTransactionNumber: '',
              payTime: dayjs()
            });
          }}>
            Hủy
          </Button>
          <Button onClick={handleConfirmRefund} variant="contained">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <ChangeBooking 
        open={isChangeBookingOpen}
        onClose={() => setIsChangeBookingOpen(false)}
        onTourSelect={handleTourSelect}
      />
    </Card>
  );
};

export default BookingCard;