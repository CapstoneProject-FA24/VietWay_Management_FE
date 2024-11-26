import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import SidebarManager from '@layouts/SidebarManager';
import { Helmet } from 'react-helmet';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import AttractionsOutlinedIcon from '@mui/icons-material/AttractionsOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import TourOutlinedIcon from '@mui/icons-material/TourOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import AirplaneTicketOutlinedIcon from '@mui/icons-material/AirplaneTicketOutlined';
import AttractionReviewByProvinceChart from '@components/manager/attraction/AttractionReviewByProvinceChart';
import BookingChart from '@components/manager/tour/BookingChart';
import CustomerStatisticsChart from '@components/manager/tour/CustomerStatisticsChart';
import TourUsingTemplateChart from '@components/manager/tour/TourUsingTemplateChart';
import BookingAndReviewFromTourTemplate from '@components/manager/tour/BookingAndReviewFromTourTemplate';
import TourTemplateRevenue from '@components/manager/tour/TourTemplateRevenue';
import TourTemplateChart from '@components/manager/tour/TourTemplateChart';
import DateRangeSelector from '@components/common/DateRangeSelector';
import dayjs from 'dayjs';

const ManagerDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    totalTours: 0,
    totalPosts: 0,
    totalAttractions: 0,
    totalStaff: 0
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
    // Mock data - replace with actual API calls
    setStats({
      totalProvince: 63,
      totalPosts: 45,
      totalAttractions: 89,
      totalToursSample: 32,
      totalTours: 150,
      totalCustomers: 1000,
      totalBookings: 592,
      totalStaff: 12
    });
  }, []);

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
    { title: 'Khách hàng', value: stats.totalCustomers, icon: <PersonOutlineOutlinedIcon sx={{ fontSize: 42, color: 'grey' }} /> },
    { title: 'Booking', value: stats.totalBookings, icon: <AirplaneTicketOutlinedIcon sx={{ fontSize: 42, color: 'grey' }} /> },
    { title: 'Tour mẫu', value: stats.totalToursSample, icon: <ContentCopyOutlinedIcon sx={{ fontSize: 42, color: 'grey' }} /> },
    { title: 'Tour du lịch', value: stats.totalTours, icon: <TourOutlinedIcon sx={{ fontSize: 42, color: 'grey' }} /> },
    { title: 'Tỉnh thành', value: stats.totalTours, icon: <LocationOnOutlinedIcon sx={{ fontSize: 42, color: 'grey' }} /> },
    { title: 'Điểm tham quan', value: stats.totalAttractions, icon: <AttractionsOutlinedIcon sx={{ fontSize: 42, color: 'grey' }} /> },
    { title: 'Bài viết', value: stats.totalPosts, icon: <ArticleOutlinedIcon sx={{ fontSize: 42, color: 'grey' }} /> },
    { title: 'Nhân viên', value: stats.totalStaff, icon: <GroupOutlinedIcon sx={{ fontSize: 42, color: 'grey' }} /> },
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
          <Grid item xs={6}>
            <BookingChart dateRange={appliedGlobalDateRange} />
          </Grid>
          <Grid item xs={6}>
            <CustomerStatisticsChart dateRange={appliedGlobalDateRange} />
          </Grid>
        </Grid>

        <Typography sx={{ fontSize: '2rem', fontWeight: 600, color: '#30529c', mt: 10 }}> Tour du lịch </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TourTemplateRevenue/>
          </Grid>
          {/* <Grid item xs={6}>
            <Box sx={{ height: chartHeight }}>
              <TourTemplateChart fixedHeight={chartHeight} />
            </Box>
          </Grid> */}

          <Grid item xs={12}>
            <BookingAndReviewFromTourTemplate />
          </Grid>
          <Grid item xs={12}>
            <TourUsingTemplateChart />
          </Grid>
        </Grid>

        <Typography sx={{ fontSize: '2rem', fontWeight: 600, color: '#30529c', mt: 10 }}> Điểm tham quan </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <AttractionReviewByProvinceChart />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ManagerDashboard;