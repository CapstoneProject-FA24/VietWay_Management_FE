import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, Button, Typography, Stack, TextField, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton } from '@mui/material';
import { getBookings, deleteBooking } from '@hooks/MockBooking';
import { Search, Visibility, Delete } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const ManageBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getBookings();
      setBookings(data);
    } catch (error) {
      console.error('Không thể tải danh sách đặt tour');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBooking(bookingToDelete);
      setDeleteDialogOpen(false);
      fetchBookings();
    } catch (error) {
      console.error('Không thể xóa đặt tour');
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/quan-ly/dat-tour/${id}`);
  };

  const statusColors = {
    'PENDING': 'warning',
    'CONFIRMED': 'info',
    'PAID': 'success',
    'CANCELLED': 'error',
    'COMPLETED': 'secondary'
  };

  const filteredBookings = bookings
    .filter(booking => 
      (statusFilter === 'ALL' || booking.status === statusFilter) &&
      (booking.bookingId.toLowerCase().includes(searchText.toLowerCase()) ||
       booking.contactFullName.toLowerCase().includes(searchText.toLowerCase()) ||
       booking.contactPhoneNumber.includes(searchText))
    );

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <Box sx={{ p: 2 }}>
          <Typography variant="h5" gutterBottom>Quản lý đặt tour</Typography>
          
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <TextField
              placeholder="Tìm kiếm theo mã, tên, số điện thoại"
              variant="outlined"
              size="small"
              sx={{ width: 300 }}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
            
            <TextField
              select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              size="small"
              sx={{ width: 150 }}
            >
              <MenuItem value="ALL">Tất cả</MenuItem>
              <MenuItem value="PENDING">Chờ xác nhận</MenuItem>
              <MenuItem value="CONFIRMED">Đã xác nhận</MenuItem>
              <MenuItem value="PAID">Đã thanh toán</MenuItem>
              <MenuItem value="CANCELLED">Đã hủy</MenuItem>
              <MenuItem value="COMPLETED">Hoàn thành</MenuItem>
            </TextField>
          </Stack>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Mã đặt tour</TableCell>
                  <TableCell>Tour</TableCell>
                  <TableCell>Khách hàng</TableCell>
                  <TableCell>Số điện thoại</TableCell>
                  <TableCell>Số người</TableCell>
                  <TableCell>Tổng tiền</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell align="right">Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.bookingId}>
                    <TableCell>{booking.bookingId}</TableCell>
                    <TableCell>{booking.tour.name}</TableCell>
                    <TableCell>{booking.contactFullName}</TableCell>
                    <TableCell>{booking.contactPhoneNumber}</TableCell>
                    <TableCell>{booking.numberOfParticipants}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.totalPrice)}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={booking.status} 
                        color={statusColors[booking.status]} 
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <IconButton
                          color="primary"
                          onClick={() => handleViewDetails(booking.bookingId)}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => {
                            setBookingToDelete(booking.bookingId);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Card>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa đặt tour này?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageBooking;
