import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  TablePagination, Chip, Typography, Box, CircularProgress, Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import { getBookingStatusInfo } from '@services/StatusService';
import { getBookings } from '@services/BookingService';
import { getCookie } from '@services/AuthenService';

const BookingByTemplate = ({ tourId }) => {
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const response = await getBookings(
          rowsPerPage, page, null, null, null, null, tourId
        );
        setBookings(response.items);
        setTotalCount(response.total);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [tourId, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#3b485f', maxWidth: '120px' }}>Mã booking</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#3b485f' }}>Ngày tạo</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#3b485f' }}>Người đặt</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#3b485f' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#3b485f' }}>Số điện thoại</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#3b485f' }}>Số người</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#3b485f' }}>Tổng tiền</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#3b485f' }}>Trạng thái</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body1" sx={{ py: 2 }}>
                    Không có booking nào
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow hover key={booking.bookingId}>
                  <TableCell sx={{ wordWrap: 'break-word', maxWidth: '120px' }}>{booking.bookingId}</TableCell>
                  <TableCell>
                    {`${new Date(booking.createdAt).toLocaleString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })} ${new Date(booking.createdAt).toLocaleString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}`}
                  </TableCell>
                  <TableCell>{booking.contactFullName}</TableCell>
                  <TableCell>{booking.contactEmail}</TableCell>
                  <TableCell>{booking.contactPhoneNumber}</TableCell>
                  <TableCell>{booking.numberOfParticipants}</TableCell>
                  <TableCell>{booking.totalPrice.toLocaleString()} đ</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Box sx={{ 
                            width: 8, 
                            height: 8,
                            borderRadius: '50%', 
                            backgroundColor: getBookingStatusInfo(booking.status).color 
                          }} />
                          <Typography sx={{ fontSize: '0.85rem', }}>
                            {getBookingStatusInfo(booking.status).text}
                          </Typography>
                        </Box>
                      }
                      sx={{
                        backgroundColor: '#fff',
                        border: `1px solid ${getBookingStatusInfo(booking.status).color}`,
                        '& .MuiChip-label': { px: 1 }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained" size="small" component={Link}
                      sx={{ backgroundColor: '#7e8593', fontSize: '0.75rem' }}
                      to={`/${getCookie('role')}/booking/chi-tiet/${booking.bookingId}`}
                    >
                      Chi tiết
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Số hàng mỗi trang:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} trong ${count}`}
      />
    </Box>
  );
};

export default BookingByTemplate;