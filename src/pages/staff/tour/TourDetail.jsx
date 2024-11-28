import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, Grid, Chip, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import dayjs from 'dayjs';
import SidebarStaff from '@layouts/SidebarStaff';
import { fetchTourTemplateById } from '@services/TourTemplateService';
import { fetchToursByTemplateId, fetchTourById, calculateEndDate } from '@services/TourService';
import '@styles/Calendar.css';
import 'react-calendar/dist/Calendar.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TourCalendar from '@components/tour/TourCalendar';
import TourTemplateInfo from '@components/tour/TourTemplateInfo';
import { getTourStatusInfo } from '@services/StatusService';
import { TourStatus } from '@hooks/Statuses';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Helmet } from 'react-helmet';
import BookingByTemplate from '@components/tourTemplate/BookingByTemplate';
import TourUpdateForm from '@components/tour/TourUpdateForm';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import CancelIcon from '@mui/icons-material/Cancel';

const TourDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [tourTemplate, setTourTemplate] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [tours, setTours] = useState([]);
  const [tour, setTour] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editTourData, setEditTourData] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [view, setView] = useState('details'); // 'details' or 'edit'
  const [isCancelPopupOpen, setIsCancelPopupOpen] = useState(false);

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

  const handleEditTour = () => {
    setIsEditing(true);
  };

  const handleEditTourChange = (field, value) => {
    setEditTourData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculatePrices = (adultPrice) => {
    const childPrice = Math.round(adultPrice * 0.6);
    const infantPrice = Math.round(adultPrice * 0.3);
    return { childPrice, infantPrice };
  };

  const validatePrice = (price, minPrice, maxPrice) => {
    const numPrice = Number(price);
    if (isNaN(numPrice)) return false;
    if (!price) return true;
    return numPrice >= minPrice && numPrice <= maxPrice;
  };

  const handleSaveDraft = async () => {
    // Implement save draft logic
  };

  const handleSubmitEdit = async () => {
    // Implement submit edit logic
  };

  const handleDeleteTour = async () => {
    console.log('Delete tour:', id);
  };

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
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
        severity: 'success'
      });
    } catch (error) {
      console.error('Error fetching updated tour:', error);
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi cập nhật tour',
        severity: 'error'
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

  return (
    <Box sx={{ display: 'flex', width: '98vw' }}>
      <Helmet>
        <title>Chi tiết tour</title>
      </Helmet>
      <SidebarStaff isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Box component="main" sx={{ flexGrow: 1, p: 2, marginLeft: isSidebarOpen ? '245px' : 2, transition: 'margin 0.3s', mt: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} sx={{ ml: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
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
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
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
            </Box>
          </Grid>

          <Grid item xs={12} md={8.5}>
            <TourTemplateInfo
              tourTemplate={tourTemplate}
              isLoading={isLoading}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TourCalendar
                tourId={id}
                tours={tours}
                selectedMonth={selectedMonth}
                handleMonthChange={handleMonthChange}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={3.5}>
            {view === 'details' ? (
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
                      {/* <Typography>
                        Ngày kết thúc: {(() => {
                          if (!tour.startDate || !tour.startTime || !tourTemplate) return '';
                          const result = calculateEndDate(
                            dayjs(tour.startDate),
                            dayjs(tour.startDate),
                            tourTemplate.duration
                          );
                          return result ? result.endDate.format('DD/MM/YYYY') : '';
                        })()}
                      </Typography> */}
                      
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>Thời gian đăng ký</Typography>
                        <Typography>Ngày mở đăng ký: {dayjs(tour.registerOpenDate).format('DD/MM/YYYY')}</Typography>
                        <Typography>Ngày đóng đăng ký: {dayjs(tour.registerCloseDate).format('DD/MM/YYYY')}</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>Số lượng khách</Typography>
                      <Typography>Số khách tối đa: {tour.maxParticipant}</Typography>
                      <Typography>Số khách tối thiểu: {tour.minParticipant}</Typography>
                      <Typography>Số khách hiện tại: {tour.currentParticipant}</Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>Giá tour</Typography>
                      <Typography>Người lớn: {tour.defaultTouristPrice?.toLocaleString()} đ</Typography>
                      {tour.tourPrices?.map((price, index) => (
                        <Typography key={index}>
                          {price.name} ({price.ageFrom}-{price.ageTo} tuổi): {price.price.toLocaleString()} đ
                        </Typography>
                      ))}
                    </Box>

                    {tour.tourPolicies && tour.tourPolicies.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>Chính sách hoàn tiền</Typography>
                        {tour.tourPolicies.map((policy, index) => (
                          <Box key={index} sx={{ mt: 1 }}>
                            <Typography>
                              Hủy trước {dayjs(policy.cancelBefore).format('DD/MM/YYYY')}:
                              Hoàn {policy.refundPercent}% tổng tiền
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                    
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
                    </Box>
                  </>
                )}
              </Paper>
            ) : (
              <TourUpdateForm
                tour={tour} maxPrice={tourTemplate.maxPrice} minPrice={tourTemplate.minPrice}
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
    </Box>
  );
};

export default TourDetail;