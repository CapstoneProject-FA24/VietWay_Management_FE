import { Card, CardContent, CardActions, Typography, Button, Chip, Stack, Grid } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { getBookingStatusInfo } from '@services/StatusService';
import { BookingStatus } from '@hooks/Statuses';

const BookingCard = ({ booking, onDelete, onViewDetails }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const statusInfo = getBookingStatusInfo(booking.status);

  const handleClickDelete = () => {
    setOpenDialog(true);
  };

  const handleConfirmDelete = () => {
    onDelete(booking.bookingId);
    setOpenDialog(false);
  };

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

  return (
    <Card sx={{ pt: 1, pl: 1, pr: 1 }}>
      <CardContent>
        <Chip label={statusInfo.text} sx={{ backgroundColor: statusInfo.color, height: '1.5rem' }} />
        <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: -1, mt: 1 }}>{booking.tour?.name}</Typography>
        <Grid container spacing={1}>
          <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography color="text.secondary" sx={{ fontWeight: 'bold', mr: 1 }}>Mã tour:</Typography>
            <Typography>{booking.code}</Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography color="text.secondary" sx={{ fontWeight: 'bold', mr: 1 }}>Thời gian khởi hành:</Typography>
            <Typography>{formatDateTime(booking.tour?.startDate)}</Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography color="text.secondary" sx={{ fontWeight: 'bold', mr: 1 }}>Bắt đầu từ:</Typography>
            <Typography>TP Hồ Chí Minh</Typography>
          </Grid>

          <Grid item xs={12} md={12}>
            <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem', mt: 1 }}> Thông tin Booking: </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography color="text.secondary" sx={{ fontWeight: 'bold', mr: 1 }}>Mã booking:</Typography>
            <Typography>{booking.bookingId}</Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography color="text.secondary" sx={{ fontWeight: 'bold', mr: 1 }}>Ngày đặt:</Typography>
            <Typography>{formatDateTime(booking.createdAt)}</Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography color="text.secondary" sx={{ fontWeight: 'bold', mr: 1 }}>Số lượng khách:</Typography>
            <Typography>{booking.numberOfParticipants}</Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography color="text.secondary" sx={{ fontWeight: 'bold', mr: 1 }}>Họ tên:</Typography>
            <Typography>{booking.contactFullName}</Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography color="text.secondary" sx={{ fontWeight: 'bold', mr: 1 }}>Email:</Typography>
            <Typography>{booking.contactEmail}</Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'flex-start' }}>
            <Typography color="text.secondary" sx={{ fontWeight: 'bold', mr: 1 }}>Số điện thoại:</Typography>
            <Typography>{booking.contactPhoneNumber}</Typography>
          </Grid>

          <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ mr: 1, fontSize: '1.3rem' }}>Tổng tiền:</Typography>
            <Typography color="error" sx={{ fontWeight: 'bold', fontSize: '1.3rem' }}>{booking.totalPrice.toLocaleString()} đ</Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <CardActions>
              <Button variant="outlined" onClick={() => onViewDetails(booking.bookingId)}>Chi tiết</Button>
              {(booking.status === BookingStatus.Pending || booking.status === BookingStatus.Confirmed) && (
                  <>
                    <Button variant="contained" color="primary" >Đổi tour</Button>
                    <Button variant="contained" color="error" onClick={handleClickDelete}>Hủy booking</Button>
                  </>
                )}
            </CardActions>
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
    </Card>
  );
};

export default BookingCard;