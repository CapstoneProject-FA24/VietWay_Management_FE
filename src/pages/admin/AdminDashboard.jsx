import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import Sidebar from '@layouts/Sidebar';
import { Helmet } from 'react-helmet';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import AttractionsOutlinedIcon from '@mui/icons-material/AttractionsOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import TourOutlinedIcon from '@mui/icons-material/TourOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import AirplaneTicketOutlinedIcon from '@mui/icons-material/AirplaneTicketOutlined';
import AttractionReviewChart from '@components/manager/attraction/AttractionReviewChart';
import BookingChart from '@components/manager/tour/BookingChart';
import TourTemplateReviewChart from '@components/manager/tour/TourTemplateReviewChart';
import TourTemplateRevenue from '@components/manager/tour/TourTemplateRevenue';
import DateRangeSelector from '@components/common/DateRangeSelector';
import dayjs from 'dayjs';
import { fetchReportSummary, fetchBookingReport, fetchRatingReport, fetchRevenueReport } from '@services/ReportService';
import { getErrorMessage } from '@hooks/Message';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [summaryStats, setSummaryStats] = useState({
    newCustomer: 0,
    newBooking: 0,
    newTour: 0,
    revenue: 0,
    newAttraction: 0,
    newPost: 0,
    averageTourRating: 0
  });
  
  const [bookingStats, setBookingStats] = useState({
    totalBooking: 0,
    bookingByDay: {
      dates: [],
      pendingBookings: [],
      depositedBookings: [],
      paidBookings: [],
      completedBookings: [],
      cancelledBookings: []
    },
    bookingByTourTemplate: [],
    bookingByTourCategory: [],
    bookingByParticipantCount: []
  });

  const [ratingStats, setRatingStats] = useState({
    attractionRatingInPeriod: [],
    tourTemplateRatingInPeriod: [],
    attractionRatingTotal: [],
    tourTemplateRatingTotal: []
  });

  const [revenueStats, setRevenueStats] = useState({
    totalRevenue: 0,
    revenueByPeriod: {
      periods: [],
      revenue: [],
      refund: []
    },
    revenueByTourTemplate: [],
    revenueByTourCategory: []
  });

  const [globalDateRange, setGlobalDateRange] = useState({
    startDate: dayjs().startOf('month'),
    endDate: dayjs()
  });

  const [appliedGlobalDateRange, setAppliedGlobalDateRange] = useState({
    startDate: dayjs().startOf('month'),
    endDate: dayjs()
  });

  useEffect(() => {
    loadDashboardData();
  }, [appliedGlobalDateRange]);

  const loadDashboardData = async () => {
    try {
      const startDate = appliedGlobalDateRange.startDate.startOf('month').format('MM/DD/YYYY');
      const endDate = appliedGlobalDateRange.endDate.format('MM/DD/YYYY');

      const [summaryData, bookingData, ratingData, revenueData] = await Promise.all([
        fetchReportSummary(startDate, endDate),
        fetchBookingReport(startDate, endDate),
        fetchRatingReport(startDate, endDate),
        fetchRevenueReport(startDate, endDate)
      ]);

      setSummaryStats(summaryData);
      setBookingStats(bookingData);
      setRatingStats(ratingData);
      setRevenueStats(revenueData);
    } catch (error) {
      console.error('Error loading dashboard data:', getErrorMessage(error));
    }
  };

  const handleGlobalStartDateChange = (newValue) => {
    setGlobalDateRange(prev => ({
      ...prev,
      startDate: newValue,
      endDate: newValue.isAfter(prev.endDate) ? newValue : prev.endDate
    }));
  };

  const handleGlobalEndDateChange = (newValue) => {
    setGlobalDateRange(prev => ({
      ...prev,
      endDate: newValue
    }));
  };

  const handleGlobalApply = () => {
    setAppliedGlobalDateRange(globalDateRange);
  };

  const statCards = [
    { title: 'Khách hàng', value: summaryStats.newCustomer, icon: <PersonOutlineOutlinedIcon sx={{ fontSize: 42, color: 'grey' }} /> },
    { title: 'Booking', value: summaryStats.newBooking, icon: <AirplaneTicketOutlinedIcon sx={{ fontSize: 42, color: 'grey' }} /> },
    { title: 'Tour mẫu', value: summaryStats.newTour, icon: <ContentCopyOutlinedIcon sx={{ fontSize: 42, color: 'grey' }} /> },
    { title: 'Doanh thu', value: summaryStats.revenue?.toLocaleString('vi-VN') + 'đ', icon: <TourOutlinedIcon sx={{ fontSize: 42, color: 'grey' }} /> },
    { title: 'Tỉnh thành', value: 63, icon: <LocationOnOutlinedIcon sx={{ fontSize: 42, color: 'grey' }} /> },
    { title: 'Điểm tham quan', value: summaryStats.newAttraction, icon: <AttractionsOutlinedIcon sx={{ fontSize: 42, color: 'grey' }} /> },
    { title: 'Bài viết', value: summaryStats.newPost, icon: <ArticleOutlinedIcon sx={{ fontSize: 42, color: 'grey' }} /> },
    { title: 'Đánh giá TB', value: summaryStats.averageTourRating?.toFixed(1), icon: <GroupOutlinedIcon sx={{ fontSize: 42, color: 'grey' }} /> },
  ];

  return (
    <Box sx={{ display: 'flex', width: '98vw', minHeight: '100vh' }}>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>

      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <Box sx={{
        flexGrow: 1,
        p: 3,
        transition: 'margin-left 0.3s',
        marginLeft: isSidebarOpen ? '260px' : '20px'
      }}>
        <Typography sx={{ fontSize: '2.7rem', fontWeight: 600, color: 'primary.main', mb: 2, textAlign: 'center' }}> 
          Dashboard - Thống kê 
        </Typography>

        <Grid container spacing={2}>
          {statCards.map((stat, index) => (
            <Grid item xs={12} sm={3} md={3} key={index}>
              <Paper elevation={3}
                sx={{
                  p: 2, height: '100%', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', textAlign: 'center', borderRadius: 2
                }}
              >
                <Box sx={{ display: 'flex', width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {stat.icon}
                  </Box>
                  <Box color="primary.main" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', ml: 1 }}>
                    <Typography variant="h5" sx={{ fontSize: '1.43rem', fontWeight: 'bold', textAlign: 'left', width: '100%', mb: -0.5 }}>
                      {stat.value}
                    </Typography>
                    <Typography color="textSecondary"
                      sx={{ fontSize: '1rem', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', lineHeight: '1.2', width: '100%' }}>
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mb: 1, mt: 5, display: 'flex', justifyContent: 'center' }}>
          <DateRangeSelector
            startDate={globalDateRange.startDate}
            endDate={globalDateRange.endDate}
            onStartDateChange={handleGlobalStartDateChange}
            onEndDateChange={handleGlobalEndDateChange}
            onApply={handleGlobalApply}
          />
        </Box>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <BookingChart bookingData={bookingStats.bookingByDay} />
          </Grid>
        </Grid>

        <Typography sx={{ fontSize: '2rem', fontWeight: 600, color: '#30529c', mt: 10 }}> Tour du lịch </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TourTemplateRevenue revenueData={revenueStats.revenueByTourTemplate} />
          </Grid>

          <Grid item xs={12}>
            <TourTemplateReviewChart ratingData={ratingStats.tourTemplateRatingInPeriod} />
          </Grid>
        </Grid>

        <Typography sx={{ fontSize: '2rem', fontWeight: 600, color: '#30529c', mt: 10 }}> Điểm tham quan </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <AttractionReviewChart ratingData={ratingStats.attractionRatingInPeriod} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminDashboard;