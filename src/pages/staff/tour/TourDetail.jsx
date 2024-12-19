import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, Grid, Chip, Collapse, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, IconButton } from '@mui/material';
import dayjs from 'dayjs';
import SidebarStaff from '@layouts/SidebarStaff';
import { fetchTourTemplateById } from '@services/TourTemplateService';
import { fetchToursByTemplateId, fetchTourById, deleteTour } from '@services/TourService';
import '@styles/Calendar.css';
import 'react-calendar/dist/Calendar.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import TourCalendar from '@components/tour/TourCalendar';
import TourTemplateInfo from '@components/tour/TourTemplateInfo';
import { getTourStatusInfo } from '@services/StatusService';
import { TourStatus } from '@hooks/Statuses';
import { Helmet } from 'react-helmet';
import BookingByTemplate from '@components/tourTemplate/BookingByTemplate';
import TourUpdateForm from '@components/tour/TourUpdateForm';
import CancelIcon from '@mui/icons-material/Cancel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import TourDeletePopup from '@components/tour/TourDeletePopup';
import HistoryIcon from '@mui/icons-material/History';
import VersionHistory from '@components/common/VersionHistory';

const TourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [tourTemplate, setTourTemplate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [tours, setTours] = useState([]);
  const [tour, setTour] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success', hide: 5000 });
  const [isEditing, setIsEditing] = useState(false);
  const [editTourData, setEditTourData] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [view, setView] = useState('details');
  const [isCancelPopupOpen, setIsCancelPopupOpen] = useState(false);
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

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

  useEffect(() => {
    if (tour && !editTourData) {
      setEditTourData({
        startLocationPlaceId: tour.startLocationPlaceId,
        startAddress: tour.startLocation,
        startDate: dayjs(tour.startDate),
        startTime: dayjs(tour.startTime),
        maxParticipants: tour.maxParticipant,
        minParticipants: tour.minParticipant,
        adultPrice: tour.price,
        childPrice: tour.childPrice,
        infantPrice: tour.infantPrice,
        registerOpenDate: dayjs(tour.registerOpenDate),
        registerCloseDate: dayjs(tour.registerCloseDate)
      });
    }
  }, [tour]);

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

  const handleDeleteTour = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTour(id);
      setOpenDeleteDialog(false);
      setSnackbar({
        open: true,
        message: 'Xóa tour thành công',
        severity: 'success', hide: 1500
      });
      setTimeout(() => {
        navigate('/nhan-vien/tour-du-lich');
      }, 1500);
    } catch (error) {
      console.error('Error deleting tour:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi xóa tour',
        severity: 'error', hide: 5000
      });
      setOpenDeleteDialog(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelClick = () => {
    setIsCancelPopupOpen(true);
  };

  const handleCloseCancelPopup = () => {
    setIsCancelPopupOpen(false);
  };

  const handleCancelConfirm = () => {
    setView('details');
    setIsCancelPopupOpen(false);
  };

  const handleUpdateSuccess = async () => {
    try {
      const updatedTour = await fetchTourById(id);
      setTour(updatedTour);
      setView('details');
      setSnackbar({
        open: true,
        message: 'Cập nhật tour thành công',
        severity: 'success', hide: 5000
      });
    } catch (error) {
      console.error('Error fetching updated tour:', error);
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi cập nhật tour',
        severity: 'error', hide: 5000
      });
    }
  };

  const CancelConfirmationDialog = () => (
    <Dialog open={isCancelPopupOpen} onClose={handleCloseCancelPopup}>
      <DialogTitle sx={{ fontWeight: 600 }}>
        Xác nhận hủy
      </DialogTitle>
      <DialogContent>
        <Typography>
          Bạn có chắc chắn muốn hủy cập nhật? Các thay đổi sẽ không được lưu.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={handleCloseCancelPopup} sx={{ color: '#666666' }}>
          Không
        </Button>
        <Button
          onClick={handleCancelConfirm}
          variant="contained"
          sx={{ backgroundColor: '#DC2626', '&:hover': { backgroundColor: '#B91C1C' } }}
        >
          Có
        </Button>
      </DialogActions>
    </Dialog>
  );

  const canUpdate = tour?.status === TourStatus.Rejected || tour?.status === TourStatus.Pending;

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleHistoryClick = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };

  return (
    <Box sx={{ display: 'flex', width: '98vw' }}>
      <Helmet>
        <title>Chi tiết tour</title>
      </Helmet>
      <SidebarStaff isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Box component="main" sx={{ flexGrow: 1, pl: 6, pr: 8, pt: 4, pb: 4, marginLeft: isSidebarOpen ? '280px' : 3, transition: 'margin 0.3s', mt: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} sx={{ ml: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/nhan-vien/tour-du-lich')}
                sx={{ color: 'grey' }}
              >
                Quay lại
              </Button>
              <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 2 }}>
                Chi tiết tour
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton onClick={handleHistoryClick}
                sx={{
                  backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  '&:hover': { backgroundColor: '#f5f5f5' }, mr: 2
                }}
              > <HistoryIcon color="primary" /> </IconButton>
              <Collapse in={isHistoryOpen} timeout="auto" unmountOnExit
                sx={{ position: 'absolute', top: 120, right: 30, width: '400px', zIndex: 1000 }}
              >
                <Paper elevation={3} sx={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden' }} >
                  <VersionHistory entityId={id} entityType={9} />
                </Paper>
              </Collapse>
              {canUpdate && (
                <>
                  {view === 'edit' ? (
                    <Button
                      variant="contained"
                      startIcon={<CancelIcon />}
                      onClick={handleCancelClick}
                      sx={{ backgroundColor: '#767676', '&:hover': { backgroundColor: '#575757' }, height: '45px' }}
                    >
                      Hủy sửa
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={() => setView('edit')}
                      sx={{ backgroundColor: '#3572EF', '&:hover': { backgroundColor: '#1C4ED8' }, height: '45px' }}
                    >
                      Sửa
                    </Button>
                  )}
                </>
              )}
              <Button
                variant="contained"
                onClick={handleDeleteTour}
                color="error"
                disabled={isDeleting}
              >
                {isDeleting ? 'Đang xóa...' : 'Xóa'}
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={12}>
            <TourTemplateInfo
              tourTemplate={tourTemplate}
              isLoading={isLoading}
            />
            <Paper elevation={2} sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.secondary', textAlign: 'center', width: '85%', pl: 20 }}>
                  Lịch tour
                </Typography>
                <Button
                  onClick={() => setIsCalendarExpanded(!isCalendarExpanded)}
                  endIcon={isCalendarExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                >
                  {isCalendarExpanded ? 'Thu gọn' : 'Xem thêm'}
                </Button>
              </Box>

              <Collapse in={isCalendarExpanded}>
                <TourCalendar
                  tourId={id}
                  tours={tours}
                  selectedMonth={selectedMonth}
                  handleMonthChange={handleMonthChange}
                />
              </Collapse>
            </Paper>
          </Grid>

          <Grid item xs={12} md={12}>
            {view === 'details' ? (
              <Paper elevation={2} sx={{ pl: 5, pr: 5, pt: 2, pb: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', fontWeight: 700, mb: 0.5, color: 'primary.main' }}>
                  Thông tin tour
                </Typography>
                {tour && (
                  <>
                    <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>Trạng thái:</Typography>
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
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>Thông tin khởi hành</Typography>
                      <Typography>Khởi hành từ: {tour.startLocation}</Typography>
                      <Typography>Ngày khởi hành: {dayjs(tour.startDate).format('DD/MM/YYYY')}</Typography>
                      <Typography>Giờ khởi hành: {tour.startTime}</Typography>

                      <Box sx={{ mt: 3 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>Thời gian đăng ký</Typography>
                        <Typography>Ngày mở đăng ký: {dayjs(tour.registerOpenDate).format('DD/MM/YYYY')}</Typography>
                        <Typography>Ngày đóng đăng ký: {dayjs(tour.registerCloseDate).format('DD/MM/YYYY')}</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>Số lượng khách</Typography>
                      <Typography>Số khách tối đa: {tour.maxParticipant}</Typography>
                      <Typography>Số khách tối thiểu: {tour.minParticipant}</Typography>
                      <Typography>Số khách hiện tại: {tour.currentParticipant}</Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>Giá tour</Typography>
                      <Typography>Người lớn (từ 12 tuổi trở lên): {tour.defaultTouristPrice?.toLocaleString()} VND</Typography>
                      {tour.tourPrices?.map((price, index) => (
                        <Typography key={index}>
                          {price.name} ({price.ageFrom}-{price.ageTo} tuổi): {price.price.toLocaleString()} VND
                        </Typography>
                      ))}
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>Yêu cầu thanh toán</Typography>
                      {tour.depositPercent === 100 ? (
                        <Typography>Yêu cầu thanh toán 100% khi đăng ký</Typography>
                      ) : (
                        <>
                          <Typography>Yêu cầu cọc: {tour.depositPercent}% tổng tiền booking</Typography>
                          <Typography>Thời hạn thanh toán toàn bộ: {dayjs(tour.paymentDeadline).format('DD/MM/YYYY')}</Typography>
                        </>
                      )}
                    </Box>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>Chính sách hoàn tiền</Typography>
                      {(tour.tourPolicies && tour.tourPolicies.length > 0) ? (
                        <>
                          {tour.tourPolicies.map((policy, index) => (
                            <Box key={index} sx={{ mt: 1, mb: 0.5 }}>
                              <Typography sx={{ lineHeight: 1 }}>
                                Hủy trước {dayjs(policy.cancelBefore).format('DD/MM/YYYY')}:
                                Chi phí hủy tour là {policy.refundPercent}% tổng tiền booking
                              </Typography>
                            </Box>
                          ))}
                          <Typography>
                            Hủy từ ngày {dayjs(tour.tourPolicies[tour.tourPolicies.length - 1].cancelBefore).format('DD/MM/YYYY')}: Chi phí hủy tour là 100% tổng giá trị booking
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Typography>Tour này không hỗ trợ hoàn tiền khi khách hàng hủy tour.</Typography>
                        </>
                      )}
                    </Box>
                  </>
                )}
              </Paper>
            ) : (
              <TourUpdateForm
                tour={tour}
                maxPrice={tourTemplate.maxPrice}
                minPrice={tourTemplate.minPrice}
                startingProvince={tourTemplate.startingProvince}
                onUpdateSuccess={handleUpdateSuccess}
              />
            )}
          </Grid>

          {tour?.totalBookings > 0 && view === 'details' && (
            <Grid item xs={12} md={12} sx={{ ml: 3, mt: 5, mr: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Thông tin các booking</Typography>
              <BookingByTemplate tourId={id} />
            </Grid>
          )}
        </Grid>
      </Box>

      <CancelConfirmationDialog />
      <TourDeletePopup
        open={openDeleteDialog} onClose={handleCloseDeleteDialog}
        onDelete={handleConfirmDelete} tour={{
          tourId: id,
          tourName: tourTemplate?.tourName,
          startDate: tour?.startDate
        }} />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.hide}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TourDetail;