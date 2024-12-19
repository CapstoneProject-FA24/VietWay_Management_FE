import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import SidebarManager from '@layouts/SidebarManager';
import { Helmet } from 'react-helmet';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import AttractionsOutlinedIcon from '@mui/icons-material/AttractionsOutlined';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import TourOutlinedIcon from '@mui/icons-material/TourOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import AirplaneTicketOutlinedIcon from '@mui/icons-material/AirplaneTicketOutlined';
import AttractionReviewChart from '@components/manager/attraction/AttractionReviewChart';
import BookingChart from '@components/manager/tour/BookingChart';
import TourUsingTemplateChart from '@components/manager/tour/TourUsingTemplateChart';
import TourTemplateReviewChart from '@components/manager/tour/TourTemplateReviewChart';
import TourTemplateRevenue from '@components/manager/tour/TourTemplateRevenue';
import TourTemplateChart from '@components/manager/tour/TourTemplateChart';
import DateRangeSelector from '@components/common/DateRangeSelector';
import dayjs from 'dayjs';
import { fetchReportSummary, fetchBookingReport, fetchRatingReport, fetchRevenueReport } from '@services/ReportService';
import { getErrorMessage } from '@hooks/Message';
import BookingQuarterChart from '@components/manager/tour/BookingQuarterChart';

const ManagerDashboard = () => {
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
    startDate: dayjs().subtract(6, 'month'),
    endDate: dayjs()
  });

  const [appliedGlobalDateRange, setAppliedGlobalDateRange] = useState({
    startDate: dayjs().subtract(6, 'month'),
    endDate: dayjs()
  });

  useEffect(() => {
    loadDashboardData();
  }, [appliedGlobalDateRange]);

  const loadDashboardData = async () => {
    try {
      // Get first day of the start month
      const startDate = appliedGlobalDateRange.startDate.startOf('month').format('MM/DD/YYYY');
      
      // Get end date based on whether it's current month
      let endDate;
      if (appliedGlobalDateRange.endDate.month() === dayjs().month() && 
          appliedGlobalDateRange.endDate.year() === dayjs().year()) {
        // If current month, use current date
        endDate = dayjs().format('MM/DD/YYYY');
      } else {
        // If not current month, use last day of that month
        endDate = appliedGlobalDateRange.endDate.endOf('month').format('MM/DD/YYYY');
      }

      // Fetch all reports in parallel
      const [summaryData, bookingData, ratingData, revenueData] = await Promise.all([
        fetchReportSummary(startDate, endDate),
        fetchBookingReport(startDate, endDate),
        fetchRatingReport(startDate, endDate),
        fetchRevenueReport(startDate, endDate)
      ]);
      console.log(bookingData);
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
    { title: 'Doanh thu', value: `${summaryStats.revenue.toLocaleString()} đ`, icon: <LocalAtmIcon sx={{ fontSize: 42, color: 'grey' }} /> },
    { title: 'Khách hàng mới', value: summaryStats.newCustomer, icon: <PersonOutlineOutlinedIcon sx={{ fontSize: 42, color: 'grey' }} /> },
    { title: 'Booking mới', value: summaryStats.newBooking, icon: <AirplaneTicketOutlinedIcon sx={{ fontSize: 42, color: 'grey' }} /> },
    { title: 'Tour mới', value: summaryStats.newTour, icon: <TourOutlinedIcon sx={{ fontSize: 42, color: 'grey' }} /> },
    { title: 'Điểm tham quan mới', value: summaryStats.newAttraction, icon: <AttractionsOutlinedIcon sx={{ fontSize: 42, color: 'grey' }} /> },
    { title: 'Bài viết mới', value: summaryStats.newPost, icon: <ArticleOutlinedIcon sx={{ fontSize: 42, color: 'grey' }} /> },
    { title: 'Đánh giá trung bình', value: summaryStats.averageTourRating.toFixed(1), icon: <StarHalfIcon sx={{ fontSize: 42, color: 'grey' }} /> },
  ];

  const chartHeight = '500px';

  return (
    <Box sx={{ display: 'flex', width: '98vw', minHeight: '100vh' }}>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>

      <SidebarManager
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <Box sx={{
        flexGrow: 1,
        p: 3,
        transition: 'margin-left 0.3s',
        marginLeft: isSidebarOpen ? '260px' : '20px'
      }}>
        <Typography sx={{ fontSize: '2.7rem', fontWeight: 600, color: 'primary.main', mb: 2, textAlign: 'center' }}> Dashboard - Thống kê </Typography>

        <Box sx={{ mb: 1, mt: 5, display: 'flex', justifyContent: 'center' }}>
          <DateRangeSelector
            startDate={globalDateRange.startDate}
            endDate={globalDateRange.endDate}
            onStartDateChange={handleGlobalStartDateChange}
            onEndDateChange={handleGlobalEndDateChange}
            onApply={handleGlobalApply}
          />
        </Box>

        <Grid container spacing={1}>
          <Grid item xs={12} sm={3} md={3}>
            <Paper elevation={3}
              sx={{
                p: 3, height: '100%', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', textAlign: 'center', borderRadius: 2
              }}
            >
              <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
                <Box color="primary.main" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {statCards[0].icon}
                  </Box>
                  <Typography color="textSecondary"
                    sx={{ fontSize: '1.2rem', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', width: '100%', ml: 1, fontWeight: 700 }}>
                    {statCards[0].title}
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ fontSize: '1.7rem', fontWeight: 'bold', textAlign: 'left', width: '100%', color: 'primary.main', ml: 0.5 }}>
                  {statCards[0].value}
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={9}>
            <Grid container spacing={1}>
              {statCards.slice(1).map((stat, index) => (
                <Grid item xs={12} md={4} key={index}>
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
                        <Typography color="textSecondary"
                          sx={{ fontSize: '1rem', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', lineHeight: '1.2', width: '100%' }}>
                          {stat.title}
                        </Typography>
                        <Typography variant="h5" sx={{ fontSize: '1.43rem', fontWeight: 'bold', textAlign: 'left', width: '100%', mb: -0.5 }}>
                          {stat.value}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>

        </Grid>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            {bookingStats.bookingByDay.dates[0]?.includes('Q') ? (
              <BookingQuarterChart bookingData={bookingStats.bookingByDay} />
            ) : (
              <BookingChart bookingData={bookingStats.bookingByDay} />
            )}
          </Grid>
          <Grid item xs={12}>
            <TourTemplateRevenue
              revenueData={revenueStats.revenueByTourTemplate}
              periodData={revenueStats.revenueByPeriod}
            />
          </Grid>
          <Grid item xs={12}>
            <TourTemplateReviewChart
              bookingData={bookingStats.bookingByTourTemplate}
              ratingData={ratingStats.tourTemplateRatingInPeriod}
            />
          </Grid>

          <Grid item xs={12}>
            <AttractionReviewChart
              ratingData={ratingStats.attractionRatingInPeriod}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ManagerDashboard;