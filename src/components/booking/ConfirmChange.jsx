import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Grid, Divider, Paper, TextField, Snackbar, Alert } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import OldTourInfo from '@components/booking/OldTourInfo';
import NewTourInfo from '@components/booking/NewTourInfo';
import { changeBookingTour } from '@services/BookingService';

const ConfirmChange = ({ open, onClose, currentBooking, newTour, onConfirm, onRefresh }) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return price?.toLocaleString('vi-VN') + ' đ';
  };

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setSnackbarMessage('Vui lòng nhập lý do thay đổi tour');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await changeBookingTour(currentBooking.bookingId, newTour.tourId, reason);
      setSnackbarMessage('Thay đổi tour thành công');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      onClose();
      setTimeout(() => {
        onConfirm();
        onRefresh();
      }, 2000);
    } catch (error) {
      setSnackbarMessage('Có lỗi xảy ra khi thay đổi tour');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: '600px'
          }
        }}
      >
        <DialogTitle sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 2,
          fontSize: '1.4rem'
        }}>
          Xác nhận thay đổi tour
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {/* Customer Info Section */}
          <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{
                  display: 'flex',
                  mb: 2,
                  pb: 1,
                  borderBottom: '2px solid',
                  borderColor: 'primary.main'
                }}>
                  <Typography sx={{ fontWeight: 'bold', fontSize: '1.3rem', mr: 1 }}>
                    Booking:
                  </Typography>
                  <Typography sx={{
                    fontWeight: 'bold',
                    fontSize: '1.3rem',
                    color: 'primary.main'
                  }}>
                    {currentBooking?.bookingId}
                  </Typography>
                </Box>
              </Grid>

              {/* Customer Info Section */}
              <Grid item xs={12}>
                <Typography sx={{
                  fontWeight: 'bold',
                  fontSize: '1.4rem',
                  color: 'text.secondary',
                  textAlign: 'center'
                }}>
                  Thông tin khách hàng
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ '& > *': { mb: 1.5 } }}>
                  <Typography>
                    <strong>Ngày đặt:</strong> {formatDateTime(currentBooking?.createdAt)}
                  </Typography>
                  <Typography>
                    <strong>Email:</strong> {currentBooking?.contactEmail}
                  </Typography>
                  <Typography>
                    <strong>Số lượng khách:</strong> {currentBooking?.numberOfParticipants}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ '& > *': { mb: 1.5 } }}>
                  <Typography>
                    <strong>Họ tên:</strong> {currentBooking?.contactFullName}
                  </Typography>
                  <Typography>
                    <strong>Số điện thoại:</strong> {currentBooking?.contactPhoneNumber}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Old Tour Info */}
          <OldTourInfo
            currentBooking={currentBooking}
            formatDateTime={formatDateTime}
            formatPrice={formatPrice}
          />

          {/* Arrow Down */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            my: 2,
            position: 'relative'
          }}>
            <Box sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '2px',
              height: '40px',
              bgcolor: 'primary.main',
              opacity: 0.3
            }} />
            <KeyboardArrowDownIcon sx={{
              fontSize: 40,
              color: 'primary.main',
              bgcolor: 'white',
              borderRadius: '50%',
              p: 0.5,
              boxShadow: 1,
              zIndex: 1
            }} />
          </Box>

          {/* New Tour Info */}
          <NewTourInfo
            newTour={newTour}
            formatDateTime={formatDateTime}
            formatPrice={formatPrice}
          />

          {/* Add Reason Input */}
          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Lý do thay đổi tour"
              multiline
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              error={!reason.trim()}
              helperText={!reason.trim() ? "Vui lòng nhập lý do thay đổi tour" : ""}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{ minWidth: 100 }}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            sx={{ minWidth: 100 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Xác nhận'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }} variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ConfirmChange;
