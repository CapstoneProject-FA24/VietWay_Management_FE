import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Card, 
  Typography, 
  Stack, 
  TextField, 
  MenuItem, 
  Grid,
  Button,
  Tabs,
  Tab,
  Select,
  Pagination,
  InputAdornment
} from '@mui/material';
import { getBookings, deleteBooking } from '@hooks/MockBooking';
import { Search, FilterList } from '@mui/icons-material';
import BookingCard from '@components/manager/booking/BookingCard';
import { Snackbar, Alert } from '@mui/material';
import SidebarManager from '@layouts/SidebarManager';
import { Helmet } from 'react-helmet';
import { BookingStatus } from '@hooks/Statuses';

const ManageBooking = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [tempSearchText, setTempSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOrder, setSortOrder] = useState('newest');
  const navigate = useNavigate();

  const statusDisplay = {
    [BookingStatus.Pending]: {
      label: 'Chờ xác nhận',
      color: 'warning'
    },
    [BookingStatus.Confirmed]: {
      label: 'Đã xác nhận',
      color: 'info'
    },
    [BookingStatus.Completed]: {
      label: 'Hoàn thành',
      color: 'success'
    },
    [BookingStatus.Expired]: {
      label: 'Hết hạn',
      color: 'error'
    },
    [BookingStatus.Cancelled]: {
      label: 'Đã hủy',
      color: 'error'
    },
    [BookingStatus.PendingRefund]: {
      label: 'Chờ hoàn tiền',
      color: 'warning'
    },
    [BookingStatus.Refunded]: {
      label: 'Đã hoàn tiền',
      color: 'success'
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page, pageSize, searchText, statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getBookings();
      setBookings(data);
      setTotalPages(Math.ceil(data.length / pageSize));
    } catch (error) {
      showSnackbar('Không thể tải danh sách đặt tour', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBooking(id);
      showSnackbar('Xóa đặt tour thành công', 'success');
      fetchBookings();
    } catch (error) {
      showSnackbar('Không thể xóa đặt tour', 'error');
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/quan-ly/booking/chi-tiet/${id}`);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value));
    setPage(1);
  };

  const handleSearch = () => {
    setSearchText(tempSearchText);
    setPage(1);
  };

  const handleStatusChange = (event, newValue) => {
    setStatusFilter(newValue);
    setPage(1);
  };

  const sortedAndFilteredBookings = bookings
    .filter(booking => 
      (statusFilter === 'ALL' || booking.status === parseInt(statusFilter)) &&
      (booking.bookingId.toLowerCase().includes(searchText.toLowerCase()) ||
       booking.contactFullName.toLowerCase().includes(searchText.toLowerCase()) ||
       booking.contactPhoneNumber.includes(searchText))
    )
    .sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'priceHighToLow':
          return b.totalPrice - a.totalPrice;
        case 'priceLowToHigh':
          return a.totalPrice - b.totalPrice;
        default:
          return 0;
      }
    })
    .slice((page - 1) * pageSize, page * pageSize);

  return (
    <Box sx={{ display: 'flex', width: '98vw', minHeight: '100vh' }}>
      <Helmet>
        <title>Quản lý đặt tour</title>
      </Helmet>
      <SidebarManager isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <Box sx={{ 
        flexGrow: 1, 
        p: 3, 
        transition: 'margin-left 0.3s', 
        marginLeft: isSidebarOpen ? '260px' : '20px', 
        width: isSidebarOpen ? 'calc(100vw - 260px)' : 'calc(100vw - 20px)', 
        overflowX: 'hidden' 
      }}>
        <Grid container spacing={3} sx={{ mb: 3, mt: 2 }}>
          <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Typography sx={{ fontSize: '3rem', fontWeight: 600, color: 'primary.main' }}>
              Quản lý đặt tour
            </Typography>
          </Grid>

          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                variant="outlined"
                placeholder="Tìm kiếm theo mã, tên, số điện thoại..."
                size="small"
                sx={{ width: '100%', maxWidth: '400px', mr: 1 }}
                value={tempSearchText}
                onChange={(e) => setTempSearchText(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
              <Button 
                variant="contained" 
                onClick={handleSearch}
                sx={{ backgroundColor: 'lightGray', color: 'black' }}
              >
                Tìm kiếm
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={5} sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Typography>Sắp xếp theo</Typography>
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              variant="outlined"
              sx={{ width: '200px', ml: 2, height: '40px' }}
            >
              <MenuItem value="newest">Mới nhất</MenuItem>
              <MenuItem value="oldest">Cũ nhất</MenuItem>
              <MenuItem value="priceHighToLow">Giá cao - thấp</MenuItem>
              <MenuItem value="priceLowToHigh">Giá thấp - cao</MenuItem>
            </Select>
          </Grid>

          <Grid item xs={12}>
            <Tabs 
              value={statusFilter} 
              onChange={handleStatusChange} 
              aria-label="booking status tabs"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Tất cả" value="ALL" />
              <Tab 
                label={statusDisplay[BookingStatus.Pending].label} 
                value={BookingStatus.Pending.toString()} 
              />
              <Tab 
                label={statusDisplay[BookingStatus.Confirmed].label} 
                value={BookingStatus.Confirmed.toString()} 
              />
              <Tab 
                label={statusDisplay[BookingStatus.Completed].label} 
                value={BookingStatus.Completed.toString()} 
              />
              <Tab 
                label={statusDisplay[BookingStatus.Cancelled].label} 
                value={BookingStatus.Cancelled.toString()} 
              />
              <Tab 
                label={statusDisplay[BookingStatus.PendingRefund].label} 
                value={BookingStatus.PendingRefund.toString()} 
              />
              <Tab 
                label={statusDisplay[BookingStatus.Refunded].label} 
                value={BookingStatus.Refunded.toString()} 
              />
            </Tabs>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          {sortedAndFilteredBookings.map((booking) => (
            <Grid item xs={12} md={6} key={booking.bookingId}>
              <BookingCard
                booking={booking}
                onDelete={handleDelete}
                onViewDetails={handleViewDetails}
              />
            </Grid>
          ))}
          {sortedAndFilteredBookings.length === 0 && (
            <Grid item xs={12}>
              <Typography variant="body1" align="center" color="error">
                Không tìm thấy đặt tour phù hợp.
              </Typography>
            </Grid>
          )}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            sx={{ m: '0 auto' }}
          />
          <Select
            value={pageSize}
            onChange={handlePageSizeChange}
            variant="outlined"
            sx={{ height: '40px' }}
          >
            <MenuItem value={5}>5 / trang</MenuItem>
            <MenuItem value={10}>10 / trang</MenuItem>
            <MenuItem value={20}>20 / trang</MenuItem>
          </Select>
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default ManageBooking;
