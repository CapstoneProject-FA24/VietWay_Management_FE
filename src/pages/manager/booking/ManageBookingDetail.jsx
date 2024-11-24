import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Tabs, Tab, CircularProgress, Alert } from '@mui/material';
import { fetchBookingById } from '@services/BookingService';
import { ArrowBack, Person, Payment, Info } from '@mui/icons-material';
import SidebarManager from '@layouts/SidebarManager';
import { Helmet } from 'react-helmet';
import BookingDetail from '@components/manager/booking/BookingDetail';
import Participant from '@components/manager/booking/Participant';
import PaymentDetail from '@components/manager/booking/PaymentDetail';

const ManageBookingDetail = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const pageTopRef = useRef(null);

  useEffect(() => {
    fetchBookingDetail();
  }, [id]);

  const fetchBookingDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchBookingById(id);
      setBooking(data);
    } catch (error) {
      setError('Không thể tải thông tin đặt tour');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }} ref={pageTopRef}>
      <Helmet><title>Chi tiết đặt tour</title></Helmet>
      <SidebarManager isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}/>
      <Box sx={{
        flexGrow: 1, transition: 'margin-left 0.3s', marginLeft: isSidebarOpen ? '250px' : 0,
        width: isSidebarOpen ? 'calc(98.8vw - 250px)' : '98.8vw'
      }}>
        <Box sx={{
          boxShadow: 2, pt: 4, pl: 4, pr: 4, pb: 1, mb: 0, display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', backgroundColor: 'white'
        }}>
          <Button
            onClick={() => navigate(-1)} variant="contained" startIcon={<ArrowBack />}
            sx={{
              height: '55px', backgroundColor: 'transparent', boxShadow: 0, color: 'gray', mt: -1,
              ":hover": { backgroundColor: 'transparent', boxShadow: 0, color: 'black', fontWeight: 700 }
            }}
          >
            Quay lại
          </Button>
          <Typography
            variant="h4" gutterBottom
            sx={{
              fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'center',
              color: '#05073C', flexGrow: 1, ml: -15
            }}
          >
            Chi tiết đặt tour
          </Typography>
        </Box>
        {error && (<Alert severity="error" sx={{ mt: 2, mx: 2 }}>{error}</Alert>)}
        {booking && (
          <Box sx={{ pl: 8, pr: 8, pt: 3, pb: 5 }}>
            <Tabs
              value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}
              sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
            >
              <Tab icon={<Info />} label="Thông tin đặt tour" iconPosition="start" />
              <Tab icon={<Person />} label="Danh sách khách" iconPosition="start" />
              <Tab icon={<Payment />} label="Lịch sử thanh toán" iconPosition="start" />
            </Tabs>
            {activeTab === 0 && <BookingDetail booking={booking} />}
            {activeTab === 1 && <Participant participants={booking.tourists} />}
            {activeTab === 2 && <PaymentDetail payments={booking.payments} />}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ManageBookingDetail;