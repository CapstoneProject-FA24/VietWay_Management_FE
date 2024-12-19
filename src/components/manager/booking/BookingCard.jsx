import { Card, CardContent, CardActions, Typography, Button, Chip, Box, Grid, TextField } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { getBookingStatusInfo } from '@services/StatusService';
import { BookingStatus } from '@hooks/Statuses';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { cancelBooking } from '@services/BookingService';
import ChangeBooking from '@components/booking/ChangeBooking';
import { getErrorMessage } from '@hooks/Message';

const BookingCard = ({ booking, onDelete, onViewDetails, onRefresh, onShowSnackbar }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [cancelDialog, setCancelDialog] = useState({ reason: '' });
  const statusInfo = getBookingStatusInfo(booking.status);
  const [isChangeBookingOpen, setIsChangeBookingOpen] = useState(false);

  const handleClickDelete = () => {
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await cancelBooking(booking.bookingId, cancelDialog.reason);
      setOpenDialog(false);
      setCancelDialog({ reason: '' });
      onRefresh();
      onShowSnackbar('Hủy booking thành công', 'success');
    } catch (error) {
      console.error('Error canceling booking:', error);
      onDelete(booking.bookingId, getErrorMessage(error));
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
    setIsChangeBookingOpen(false);
  };

  return (
    <Card sx={{ pt: 1, pl: 1, pr: 1 }}>
      <CardContent>
        <Grid container spacing={1}>
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip label={statusInfo.text} sx={{ backgroundColor: statusInfo.color, height: '1.5rem' }} />
              {booking.havePendingRefund && (
                <Chip label="Chờ hoàn tiền" sx={{ backgroundColor: 'warning.light', height: '1.5rem' }} />
              )}
            </Box>
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
                    {(booking.status === BookingStatus.Pending || booking.status === BookingStatus.Deposited || booking.status === BookingStatus.Paid) && (
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
              <Typography>{booking.startLocation}</Typography>
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

      <ChangeBooking
        open={isChangeBookingOpen}
        onClose={() => setIsChangeBookingOpen(false)}
        onTourSelect={handleTourSelect}
        booking={booking}
        onRefresh={onRefresh}
      />
    </Card>
  );
};

export default BookingCard;