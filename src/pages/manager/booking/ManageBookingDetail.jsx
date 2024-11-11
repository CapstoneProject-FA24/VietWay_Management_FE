import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Card, Button, Typography, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Stack, Grid } from '@mui/material';
import { getBookingById, updateBookingStatus } from '../../../hooks/MockBooking';
import { ArrowBack, CalendarToday } from '@mui/icons-material';

const ManageBookingDetail = () => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookingDetail();
  }, [id]);

  const fetchBookingDetail = async () => {
    try {
      setLoading(true);
      const data = await getBookingById(id);
      setBooking(data);
    } catch (error) {
      console.error('Không thể tải thông tin đặt tour');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateBookingStatus(id, newStatus);
      console.log('Cập nhật trạng thái thành công');
      fetchBookingDetail();
    } catch (error) {
      console.error('Không thể cập nhật trạng thái');
    }
  };

  const statusColors = {
    'PENDING': 'warning',
    'CONFIRMED': 'info',
    'PAID': 'success',
    'CANCELLED': 'error',
    'COMPLETED': 'secondary'
  };

  const touristColumns = [
    { id: 'fullName', label: 'Họ tên' },
    { id: 'phoneNumber', label: 'Số điện thoại' },
    { id: 'gender', label: 'Giới tính' },
    { id: 'dateOfBirth', label: 'Ngày sinh' },
    { id: 'price', label: 'Giá' }
  ];

  const paymentColumns = [
    { id: 'paymentId', label: 'Mã thanh toán' },
    { id: 'amount', label: 'Số tiền' },
    { id: 'bankCode', label: 'Ngân hàng' },
    { id: 'bankTransactionNumber', label: 'Mã giao dịch' },
    { id: 'note', label: 'Ghi chú' },
    { id: 'createAt', label: 'Thời gian' },
    { id: 'status', label: 'Trạng thái' }
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack spacing={3} width="100%">
        <Stack direction="row" spacing={2}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/quan-ly/dat-tour')}
            variant="outlined"
          >
            Quay lại
          </Button>
          {booking?.status === 'PENDING' && (
            <Button variant="contained" onClick={() => handleStatusUpdate('CONFIRMED')}>
              Xác nhận đặt tour
            </Button>
          )}
          {booking?.status === 'CONFIRMED' && (
            <Button variant="contained" onClick={() => handleStatusUpdate('PAID')}>
              Xác nhận thanh toán
            </Button>
          )}
          {(booking?.status === 'CONFIRMED' || booking?.status === 'PENDING') && (
            <Button color="error" variant="contained" onClick={() => handleStatusUpdate('CANCELLED')}>
              Hủy đặt tour
            </Button>
          )}
        </Stack>

        {booking && (
          <Box>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Thông tin đặt tour" />
              <Tab label="Danh sách khách" />
              <Tab label="Lịch sử thanh toán" />
            </Tabs>

            {activeTab === 0 && (
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
                        <Typography variant="h5">{booking.tour?.name}</Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <CalendarToday fontSize="small" />
                          <Typography>
                            {new Date(booking.tour?.startDate).toLocaleDateString('vi-VN')} - {new Date(booking.tour?.endDate).toLocaleDateString('vi-VN')}
                          </Typography>
                        </Stack>
                        <Chip label={booking.status} color={statusColors[booking.status]} />
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
                          <TableCell component="th">Số người</TableCell>
                          <TableCell>{booking.numberOfParticipants}</TableCell>
                          <TableCell component="th">Tổng tiền</TableCell>
                          <TableCell>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.totalPrice)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th">Người liên hệ</TableCell>
                          <TableCell>{booking.contactFullName}</TableCell>
                          <TableCell component="th">Email</TableCell>
                          <TableCell>{booking.contactEmail}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th">Số điện thoại</TableCell>
                          <TableCell>{booking.contactPhoneNumber}</TableCell>
                          <TableCell component="th">Địa chỉ</TableCell>
                          <TableCell>{booking.contactAddress}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th">Ghi chú</TableCell>
                          <TableCell colSpan={3}>{booking.note}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Stack>
              </Card>
            )}

            {activeTab === 1 && (
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {touristColumns.map((column) => (
                        <TableCell key={column.id}>{column.label}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {booking.bookingTourists.map((tourist) => (
                      <TableRow key={tourist.touristId}>
                        <TableCell>{tourist.fullName}</TableCell>
                        <TableCell>{tourist.phoneNumber}</TableCell>
                        <TableCell>{tourist.gender === 'MALE' ? 'Nam' : 'Nữ'}</TableCell>
                        <TableCell>{new Date(tourist.dateOfBirth).toLocaleDateString('vi-VN')}</TableCell>
                        <TableCell>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tourist.price)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {activeTab === 2 && (
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {paymentColumns.map((column) => (
                        <TableCell key={column.id}>{column.label}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {booking.bookingPayments.map((payment) => (
                      <TableRow key={payment.paymentId}>
                        <TableCell>{payment.paymentId}</TableCell>
                        <TableCell>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payment.amount)}</TableCell>
                        <TableCell>{payment.bankCode}</TableCell>
                        <TableCell>{payment.bankTransactionNumber}</TableCell>
                        <TableCell>{payment.note}</TableCell>
                        <TableCell>{new Date(payment.createAt).toLocaleString('vi-VN')}</TableCell>
                        <TableCell>
                          <Chip 
                            label={payment.status}
                            color={payment.status === 'COMPLETED' ? 'success' : 'warning'}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default ManageBookingDetail;
