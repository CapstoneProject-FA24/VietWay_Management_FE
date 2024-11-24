import { Card, CardContent, CardActions, Typography, Button, Chip, Box, Grid, FormControl, InputLabel } from '@mui/material';
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
import { createRefundTransaction } from '@services/BookingService';

const BookingCard = ({ booking, onDelete, onViewDetails, onRefund }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [openRefundDialog, setOpenRefundDialog] = useState(false);
  const [refundData, setRefundData] = useState({
    note: '',
    bankCode: '',
    bankTransactionNumber: '',
    payTime: dayjs()
  });
  const statusInfo = getBookingStatusInfo(booking.status);

  const handleClickDelete = () => {
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete(booking.bookingId);
    setOpenDialog(false);
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

  const handleConfirmRefund = () => {
    if (!refundData.bankCode || !refundData.bankTransactionNumber || !refundData.payTime) {
      return;
    }

    onRefund(booking.bookingId, {
      note: refundData.note.trim(),
      bankCode: refundData.bankCode,
      bankTransactionNumber: refundData.bankTransactionNumber.trim(),
      payTime: refundData.payTime // dayjs object
    });

    setOpenRefundDialog(false);
    // Reset form
    setRefundData({
      note: '',
      bankCode: '',
      bankTransactionNumber: '',
      payTime: dayjs()
    });
  };

  const formatDateTime = (dateString) => {
    return dayjs(dateString).format('DD/MM/YYYY HH:mm');
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
                        <Button variant="contained" color="primary" >Đổi tour</Button>
                        <Button variant="contained" color="error" onClick={handleClickDelete}>Hủy booking</Button>
                      </>
                    )}
                    {booking.status === BookingStatus.PendingRefund && (
                      <Button
                        variant="contained"
                        color="warning"
                        onClick={handleRefund}
                      >
                        Hoàn tiền
                      </Button>
                    )}
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Xác nhận hủy booking</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn hủy booking này?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>Xác nhận</Button>
        </DialogActions>
      </Dialog>

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
    </Card>
  );
};

export default BookingCard;