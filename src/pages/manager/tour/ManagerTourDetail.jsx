import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, Grid, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert } from '@mui/material';
import dayjs from 'dayjs';
import SidebarManager from '@layouts/SidebarManager';
import { fetchTourTemplateById } from '@services/TourTemplateService';
import { fetchToursByTemplateId, fetchTourById, calculateEndDate, updateTourStatus } from '@services/TourService';
import '@styles/Calendar.css';
import 'react-calendar/dist/Calendar.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TourCalendar from '@components/tour/TourCalendar';
import TourTemplateInfo from '@components/tour/TourTemplateInfo';
import { getTourStatusInfo } from '@services/StatusService';
import { TourStatus } from '@hooks/Statuses';
import { Helmet } from 'react-helmet';

const ManagerTourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [tourTemplate, setTourTemplate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [tours, setTours] = useState([]);
  const [tour, setTour] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const fetchedTour = await fetchTourById(id);
        setTour(fetchedTour);
        const fetchedTourTemplate = await fetchTourTemplateById(fetchedTour.tourTemplateId);
        setTourTemplate(fetchedTourTemplate);
        const fetchedTours = await fetchToursByTemplateId(fetchedTour.tourTemplateId);
        setTours(fetchedTours);
      } catch (error) {
        console.error('Error fetching tour template:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleMonthChange = (newMonth) => {
    setSelectedMonth(newMonth);
    if (newMonth !== 'all') {
      const today = dayjs();
      let startDate;
      if (newMonth.isSame(today, 'month')) {
        startDate = today.toDate();
      } else {
        startDate = newMonth.startOf('month').toDate();
      }
      setStartDate(dayjs(startDate));
      setEndDate(dayjs(endDate));
    }
  };

  const handleApproveTour = async () => {
    try {
      await updateTourStatus(id, TourStatus.Scheduled);
      const updatedTour = await fetchTourById(id);
      setTour(updatedTour);
      setSnackbar({
        open: true,
        message: 'Đã duyệt tour thành công',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error approving tour:', error);
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi duyệt tour',
        severity: 'error'
      });
    }
  };

  const handleRejectTour = async () => {
    try {
      await updateTourStatus(id, TourStatus.Rejected, rejectReason);
      const updatedTour = await fetchTourById(id);
      setTour(updatedTour);
      setOpenRejectDialog(false);
      setRejectReason('');
      setSnackbar({
        open: true,
        message: 'Đã từ chối tour thành công',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error rejecting tour:', error);
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi từ chối tour',
        severity: 'error'
      });
    }
  };

  const handleDeleteTour = async () => {
    // Add your logic to delete the tour
    console.log('Tour deleted');
  };

  const handleOpenRejectDialog = () => {
    setOpenRejectDialog(true);
  };

  const handleCloseRejectDialog = () => {
    setOpenRejectDialog(false);
    setRejectReason('');
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ display: 'flex', width: '98vw' }}>
      <Helmet>
        <title>Chi tiết tour</title>
      </Helmet>
      <SidebarManager isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Box component="main" sx={{ flexGrow: 1, p: 2, marginLeft: isSidebarOpen ? '245px' : 2, transition: 'margin 0.3s', mt: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} sx={{ ml: 3 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{ color: 'grey' }}
            >
              Quay lại
            </Button>
            <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 2 }}>
              Chi tiết tour
            </Typography>
          </Grid>
          <Grid item xs={12} md={8.5}>
            <TourTemplateInfo
              tourTemplate={tourTemplate}
              isLoading={isLoading}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TourCalendar tourId={id} tours={tours} selectedMonth={selectedMonth} handleMonthChange={handleMonthChange} />
            </Box>
          </Grid>
          <Grid item xs={12} md={3.5}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', fontWeight: 700, mb: 0.5, color: 'primary.main' }}>
                Thông tin tour
              </Typography>
              {tour && (
                <>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>Thông tin khởi hành</Typography>
                    <Typography>Khởi hành từ: {tour.startLocation}</Typography>
                    <Typography>Ngày khởi hành: {dayjs(tour.startDate).format('DD/MM/YYYY')}</Typography>
                    <Typography>Giờ khởi hành: {tour.startTime}</Typography>
                    <Typography>
                      Ngày kết thúc: {(() => {
                        if (!tour.startDate || !tour.startTime || !tourTemplate) {
                          return '';
                        }
                        const result = calculateEndDate(dayjs(tour.startDate), dayjs(tour.startDate), tourTemplate.duration);
                        return result ? result.endDate.format('DD/MM/YYYY') : '';
                      })()}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>Số lượng khách</Typography>
                    <Typography>Số khách tối đa: {tour.maxParticipant}</Typography>
                    <Typography>Số khách tối thiểu: {tour.minParticipant}</Typography>
                    <Typography>Số khách hiện tại: {tour.currentParticipant}</Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>Trạng thái</Typography>
                    <Chip
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Box sx={{ width: 13, height: 13, borderRadius: '50%', backgroundColor: getTourStatusInfo(tour.status).color }} />
                          <Typography sx={{ color: getTourStatusInfo(tour.status).textColor, fontWeight: 600, fontSize: 13 }}>
                            {getTourStatusInfo(tour.status).text}
                          </Typography>
                        </Box>
                      }
                      size="small"
                      sx={{
                        pt: 1.7, pb: 1.7, pr: 0.3,
                        backgroundColor: getTourStatusInfo(tour.status).backgroundColor,
                        fontWeight: 600, '& .MuiChip-label': { px: 1 }
                      }}
                    />
                    {tour.status === TourStatus.Pending && (
                      <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Button
                          variant="contained"
                          color="primary"
                          size="medium"
                          onClick={() => handleApproveTour()}
                        >
                          Duyệt
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="medium"
                          onClick={handleOpenRejectDialog}
                        >
                          Từ chối
                        </Button>
                      </Box>
                    )}
                    {tour.status === TourStatus.Scheduled && (
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <Button
                          variant="contained"
                          color="error"
                          size="medium"
                          onClick={() => handleDeleteTour()}
                        >
                          Xóa
                        </Button>
                      </Box>
                    )}
                  </Box>
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
      
      <Dialog open={openRejectDialog} onClose={handleCloseRejectDialog}>
        <DialogTitle>Lý do từ chối</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Lý do"
            type="text"
            fullWidth
            multiline
            rows={4}
            sx={{ width: '30rem' }}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRejectDialog}>Hủy</Button>
          <Button 
            onClick={handleRejectTour} 
            variant="contained" 
            color="error"
            disabled={!rejectReason.trim()}
          >
            Từ chối
          </Button>
        </DialogActions>
      </Dialog>

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
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ManagerTourDetail;