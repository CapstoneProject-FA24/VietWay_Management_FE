import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, Typography, TextField, MenuItem, Grid, Button, Tabs, Tab, Select, Pagination, InputAdornment } from '@mui/material';
import { getBookings, createRefundTransaction } from '@services/BookingService';
import { Search } from '@mui/icons-material';
import BookingCard from '@components/manager/booking/BookingCard';
import { Snackbar, Alert } from '@mui/material';
import SidebarManager from '@layouts/SidebarManager';
import { Helmet } from 'react-helmet';
import { BookingStatus } from '@hooks/Statuses';
import { getBookingStatusInfo } from '@services/StatusService';

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
  const [searchByCode, setSearchByCode] = useState('');
  const [tempSearchByCode, setTempSearchByCode] = useState('');
  const navigate = useNavigate();

  const statusDisplay = {
    [BookingStatus.Pending]: {
      label: getBookingStatusInfo(BookingStatus.Pending).text,
      color: getBookingStatusInfo(BookingStatus.Pending).color
    },
    [BookingStatus.Deposited]: {
      label: getBookingStatusInfo(BookingStatus.Deposited).text,
      color: getBookingStatusInfo(BookingStatus.Deposited).color
    },
    [BookingStatus.Paid]: {
      label: getBookingStatusInfo(BookingStatus.Paid).text,
      color: getBookingStatusInfo(BookingStatus.Paid).color
    },
    [BookingStatus.Completed]: {
      label: getBookingStatusInfo(BookingStatus.Completed).text,
      color: getBookingStatusInfo(BookingStatus.Completed).color
    },
    [BookingStatus.Cancelled]: {
      label: getBookingStatusInfo(BookingStatus.Cancelled).text,
      color: getBookingStatusInfo(BookingStatus.Cancelled).color
    },
    [BookingStatus.PendingChangeConfirmation]: {
      label: getBookingStatusInfo(BookingStatus.PendingChangeConfirmation).text,
      color: getBookingStatusInfo(BookingStatus.PendingChangeConfirmation).color
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page, pageSize, searchText, searchByCode, statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const isNumber = /^\d+$/.test(searchText);

      const response = await getBookings(
        pageSize,
        page,
        searchByCode,
        isNumber ? undefined : searchText,
        isNumber ? searchText : undefined,
        statusFilter !== 'ALL' ? parseInt(statusFilter) : undefined
      );
      
      setBookings(response.items || []);
      setTotalPages(Math.ceil(response.total / pageSize));
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
      showSnackbar('Không thể tải danh sách đặt tour', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setCancelDialog({
      open: true,
      bookingId: id,
      reason: ''
    });
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

  const handleSearchByCode = () => {
    setSearchByCode(tempSearchByCode);
    setPage(1);
  };

  const sortedBookings = bookings
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
    });

  return (
    <Box sx={{ display: 'flex', width: '98vw', minHeight: '100vh' }}>
      <Helmet> <title>Quản lý đặt tour</title> </Helmet>
      <SidebarManager isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <Box sx={{ 
        flexGrow: 1, 
        p: 4, 
        transition: 'margin-left 0.3s', 
        marginLeft: isSidebarOpen ? '260px' : '20px', 
        width: isSidebarOpen ? 'calc(100vw - 260px)' : 'calc(100vw - 20px)', 
        overflowX: 'hidden' 
      }}>
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Typography sx={{ fontSize: '2.7rem', fontWeight: 600, color: 'primary.main' }}> Quản lý đặt tour </Typography>
          </Grid>

          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                variant="outlined"
                placeholder="Tìm kiếm theo mã booking"
                size="small"
                sx={{ width: '100%', maxWidth: '400px', mr: 1 }}
                value={tempSearchByCode}
                onChange={(e) => setTempSearchByCode(e.target.value)}
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
                onClick={handleSearchByCode}
                sx={{ backgroundColor: 'lightGray', color: 'black' }}
              >
                Tìm kiếm
              </Button>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <TextField
                variant="outlined"
                placeholder="Tìm kiếm theo tên, số điện thoại"
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
              <Tab 
                label={statusDisplay[BookingStatus.Pending].label} 
                value={BookingStatus.Pending.toString()} 
              />
              <Tab 
                label={statusDisplay[BookingStatus.Deposited].label} 
                value={BookingStatus.Deposited.toString()} 
              />
              <Tab 
                label={statusDisplay[BookingStatus.Paid].label} 
                value={BookingStatus.Paid.toString()} 
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
                label={statusDisplay[BookingStatus.PendingChangeConfirmation].label} 
                value={BookingStatus.PendingChangeConfirmation.toString()} 
              />
              <Tab label="Tất cả" value="ALL" />
            </Tabs>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          {sortedBookings.map((booking) => (
            <Grid item xs={12} md={12} key={booking.bookingId}>
              <BookingCard
                booking={booking}
                onDelete={handleDelete}
                onViewDetails={handleViewDetails}
                onRefresh={fetchBookings}
                onShowSnackbar={showSnackbar}
              />
            </Grid>
          ))}
          {sortedBookings.length === 0 && (
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
