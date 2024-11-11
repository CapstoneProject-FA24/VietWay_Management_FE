import { Box, Card, Grid, Stack, Typography, Chip, TableContainer, Table, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import { CalendarToday } from '@mui/icons-material';
import { getBookingStatusInfo } from '@services/StatusService';

const BookingDetail = ({ booking }) => {
  const statusInfo = getBookingStatusInfo(booking.status);

  return (
    <Card sx={{ p: 2, mt: 2 }}>
      <Stack spacing={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box
              component="img"
              src={booking.tour?.thumbnailUrl}
              alt={booking.tour?.name}
              sx={{ width: '100%', borderRadius: 1 }}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Stack spacing={2}>
              <Chip
                label={statusInfo.text}
                sx={{
                  backgroundColor: statusInfo.color,
                  color: '#000000',
                  fontWeight: 600
                }}
              />
              <Typography variant="h5">{booking.tour?.name}</Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <CalendarToday fontSize="small" />
                <Typography>
                  {new Date(booking.tour?.startDate).toLocaleDateString('vi-VN')} - {new Date(booking.tour?.endDate).toLocaleDateString('vi-VN')}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell component="th">Mã đặt tour</TableCell>
                <TableCell>{booking.bookingId}</TableCell>
                <TableCell component="th">Ngày đặt</TableCell>
                <TableCell>{new Date(booking.createdAt).toLocaleString('vi-VN')}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th">Người đặt</TableCell>
                <TableCell>{booking.customerName}</TableCell>
                <TableCell component="th">Số điện thoại</TableCell>
                <TableCell>{booking.customerPhone}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th">Email</TableCell>
                <TableCell>{booking.customerEmail}</TableCell>
                <TableCell component="th">Số lượng khách</TableCell>
                <TableCell>{booking.bookingTourists?.length || 0} người</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th">Tổng tiền</TableCell>
                <TableCell>
                  {new Intl.NumberFormat('vi-VN', { 
                    style: 'currency', 
                    currency: 'VND' 
                  }).format(booking.totalPrice)}
                </TableCell>
                <TableCell component="th">Đã thanh toán</TableCell>
                <TableCell>
                  {new Intl.NumberFormat('vi-VN', { 
                    style: 'currency', 
                    currency: 'VND' 
                  }).format(booking.paidAmount)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th">Ghi chú</TableCell>
                <TableCell colSpan={3}>{booking.note || 'Không có ghi chú'}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Card>
  );
};

export default BookingDetail;