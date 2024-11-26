import { Box, Grid, Typography, Button, Paper } from '@mui/material';
import { getBookingStatusInfo } from '@services/StatusService';
import { BookingStatus } from '@hooks/Statuses';

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

const BookingDetail = ({ booking }) => {
    return (
        <Grid container spacing={1.5}>
            <Grid item xs={12} md={7}>
                <Paper elevation={3} sx={{ p: 3, borderRadius: '8px' }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Thông tin liên hệ</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2.5 }}>
                        <Typography variant="body1">Họ tên:</Typography>
                        <Typography variant="body1">{booking.contactFullName}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="body1">Email:</Typography>
                        <Typography variant="body1">{booking.contactEmail}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="body1">Số điện thoại:</Typography>
                        <Typography variant="body1">{booking.contactPhoneNumber}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="body1">Địa chỉ:</Typography>
                        <Typography variant="body1">{booking.contactAddress}</Typography>
                    </Box>
                </Paper>
                <Paper elevation={3} sx={{ p: 3, borderRadius: '8px', mt: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Chi tiết booking</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2.5 }}>
                        <Typography variant="body1">Mã booking:</Typography>
                        <Typography variant="body1">{booking.code}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="body1">Ngày đặt tour:</Typography>
                        <Typography variant="body1">{formatDateTime(booking.createdAt)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="body1">Trị giá booking:</Typography>
                        <Typography variant="body1">{booking.totalPrice.toLocaleString()} đ</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="body1">Tình trạng:</Typography>
                        <Typography variant="body1" sx={{ color: getBookingStatusInfo(booking.status).color }}>{getBookingStatusInfo(booking.status).text}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="body1">Ghi chú:</Typography>
                        <Typography variant="body1">{booking.note}</Typography>
                    </Box>
                </Paper>
            </Grid>
            <Grid item xs={12} md={5}>
                <Paper elevation={3} sx={{ p: 2, borderRadius: '8px' }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>Thông tin tour</Typography>
                    <img src={booking.tour?.imageUrl} alt={booking.tour?.name}
                        style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <Typography variant="h5" sx={{ mt: 1 }}>{booking.tour?.name}</Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}><strong>Mã tour:</strong> {booking.code}</Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}>
                        <strong>Ngày đi:</strong> {formatDateTime(booking.tour?.startDate)}
                    </Typography><hr />
                    <Typography variant="h5" color="primary.main" sx={{ mt: 1, fontWeight: 'bold' }}>
                        Tổng tiền: {booking.totalPrice.toLocaleString()} đ
                    </Typography>
                    {(booking.status === BookingStatus.Pending || booking.status === BookingStatus.Confirmed) && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                            <Button variant="contained" color="error" sx={{ width: '48%' }}>Hủy booking</Button>
                            <Button variant="contained" color="primary" sx={{ width: '48%' }}>Chuyển tour</Button>
                        </Box>
                    )}
                </Paper>
            </Grid>
        </Grid>
    );
};

export default BookingDetail;