import { Card, CardContent, CardActions, Typography, Button, Chip, Box, Grid } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { getBookingStatusInfo } from '@services/StatusService';
import { BookingStatus } from '@hooks/Statuses';
import ChangeBooking from '@components/booking/ChangeBooking';

const BookingCard = ({ booking, onDelete, onViewDetails }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [isChangeBookingOpen, setIsChangeBookingOpen] = useState(false);
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
              <Typography>{booking.tour?.name}</Typography>
            </Box>
            <Box sx={{ display: 'flex', mt: 1 }}>
              <Typography color="text.secondary" sx={{ fontWeight: 'bold', mr: 1 }}>Mã tour:</Typography>
              <Typography>{booking.code}</Typography>
            </Box>
            <Box sx={{ display: 'flex', mt: 1 }}>
              <Typography color="text.secondary" sx={{ fontWeight: 'bold', mr: 1 }}>Khởi hành lúc:</Typography>
              <Typography>{formatDateTime(booking.tour?.startDate)}</Typography>
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

      <ChangeBooking 
        open={isChangeBookingOpen}
        onClose={() => setIsChangeBookingOpen(false)}
        onTourSelect={handleTourSelect}
      />
    </Card>
  );
};

export default BookingCard;