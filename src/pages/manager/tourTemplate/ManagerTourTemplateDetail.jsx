import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Grid, Paper, Chip, Button, Collapse, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Snackbar, Alert } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faIcons, faClock, faMoneyBill1, faCalendarAlt, faQrcode, faBus } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import '@styles/AttractionDetails.css'
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { fetchTourTemplateById, changeTourTemplateStatus, deleteTourTemplate } from '@services/TourTemplateService';
import TourTemplateDeletePopup from '@components/tourTemplate/TourTemplateDeletePopup';
import SidebarManager from '@layouts/SidebarManager';
import { TourTemplateStatus } from '@hooks/Statuses';
import { getTourTemplateStatusInfo } from '@services/StatusService';
import ReviewListTour from '@components/review/ReviewListTour';
import { fetchToursByTemplateId } from '@services/TourService';
import dayjs from 'dayjs';
import TourTable from '@components/tourTemplate/TourTable';
import HistoryIcon from '@mui/icons-material/History';
import VersionHistory from '@components/common/VersionHistory';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import CategoryIcon from '@mui/icons-material/Category';
import FlightIcon from '@mui/icons-material/Flight';
import DirectionsTransitIcon from '@mui/icons-material/DirectionsTransit';
import DirectionsCarFilledIcon from '@mui/icons-material/DirectionsCarFilled';

const ManagerTourTemplateDetails = () => {
  const [tourTemplate, setTourTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const pageTopRef = useRef(null);
  const [expandedDay, setExpandedDay] = useState(null);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isApprovePopupOpen, setIsApprovePopupOpen] = useState(false);
  const [isRejectPopupOpen, setIsRejectPopupOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [tours, setTours] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedTourTemplate = await fetchTourTemplateById(id);
        setTourTemplate(fetchedTourTemplate);
        const fetchedTours = await fetchToursByTemplateId(id);
        setTours(fetchedTours);
      } catch (error) {
        console.error('Error fetching tour template:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (pageTopRef.current) {
      pageTopRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [tourTemplate]);

  const handleDayClick = (day) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleDelete = () => {
    setIsDeletePopupOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteTourTemplate(id);
      setSnackbar({
        open: true,
        message: 'Xóa tour mẫu thành công',
        severity: 'success'
      });
      // Close delete popup
      setIsDeletePopupOpen(false);
      // Navigate after a short delay to allow snackbar to be seen
      setTimeout(() => {
        navigate('/quan-ly/tour-mau');
      }, 1500);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi xóa tour mẫu',
        severity: 'error'
      });
      setIsDeletePopupOpen(false);
    }
  };

  const handleCloseDeletePopup = () => {
    setIsDeletePopupOpen(false);
  };

  // Function to handle approval
  const handleApprove = async () => {
    try {
      await changeTourTemplateStatus(id, 2);
      setTourTemplate({ ...tourTemplate, status: 2 });
      setSnackbar({
        open: true,
        message: 'Tour mẫu đã được duyệt',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Lỗi khi duyệt tour mẫu',
        severity: 'error'
      });
    } finally {
      setIsApprovePopupOpen(false);
    }
  };

  // Function to handle rejection
  const handleReject = async () => {
    try {
      await changeTourTemplateStatus(id, 3, rejectReason);
      setTourTemplate({ ...tourTemplate, status: 3 });
      setSnackbar({
        open: true,
        message: 'Tour mẫu đã bị từ chối',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Lỗi khi từ chối tour mẫu',
        severity: 'error'
      });
    } finally {
      setIsRejectPopupOpen(false);
      setRejectReason('');
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleMonthChange = (newMonth) => {
    setSelectedMonth(newMonth);
  };

  const handleHistoryClick = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };

  if (!tourTemplate) {
    return <Typography sx={{ width: '100vw', textAlign: 'center' }}>Loading...</Typography>;
  }

  return (
    <Box className='main' sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      marginLeft: isSidebarOpen ? '250px' : '0px',
      transition: 'margin-left 0.3s'
    }} ref={pageTopRef}>
      <SidebarManager isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Helmet>
        <title>Chi tiết tour mẫu</title>
      </Helmet>
      <Box sx={{ m: '-60px', boxShadow: 2, pt: 4, pl: 4, pr: 4, pb: 1, mb: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Button
          component={Link}
          to="/quan-ly/tour-mau"
          variant="contained"
          startIcon={<ArrowBackIosNewOutlinedIcon />}
          sx={{ height: '55px', backgroundColor: 'transparent', boxShadow: 0, color: 'gray', mt: -1, ":hover": { backgroundColor: 'transparent', boxShadow: 0, color: 'black', fontWeight: 700 } }}>
          Quay lại
        </Button>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'center', color: '#05073C', flexGrow: 1 }}>
          Chi tiết tour mẫu
        </Typography>
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
            <VersionHistory entityId={id} entityType={13} />
          </Paper>
        </Collapse>
        {tourTemplate?.status === TourTemplateStatus.Pending && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
            <Button
              variant="contained"
              sx={{ width: 'fit-content', pl: 2, pr: 2, backgroundColor: 'primary.main' }}
              onClick={() => setIsApprovePopupOpen(true)}
            >
              Duyệt
            </Button>
            <Button
              variant="contained"
              sx={{ width: 'fit-content', pl: 2, pr: 2, backgroundColor: 'red' }}
              onClick={() => setIsRejectPopupOpen(true)}
            >
              Từ chối
            </Button>
          </Box>
        )}
        {tourTemplate?.status === TourTemplateStatus.Approved && (
          <Box sx={{ display: 'flex', gap: 2, position: 'relative' }}>
            <Button
              variant="contained"
              sx={{ width: 'fit-content', p: 1.1, backgroundColor: 'red' }}
              onClick={handleDelete}
            >
              Xóa
            </Button>
          </Box>
        )}
      </Box>
      <Box sx={{ p: 3, flexGrow: 1, mt: 5 }}>
        <Typography gutterBottom sx={{ fontFamily: 'Inter, sans-serif', textAlign: 'left', color: 'grey', fontSize: '1.1rem' }}>
          Tour đi: <strong>{tourTemplate.provinces.map(province => province.provinceName).join(' - ')}</strong>
        </Typography>
        <Typography gutterBottom sx={{ fontFamily: 'Inter, sans-serif', textAlign: 'left', color: 'grey', fontSize: '1.1rem' }}>
          Khởi hành từ: <strong>{tourTemplate.startingProvince?.provinceName}</strong>
        </Typography>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C' }}>
          {tourTemplate.tourName}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', minWidth: '100%', height: '450px', mb: 3 }}>
              <Box sx={{ flex: '0 0 59.5%', mr: '1%', position: 'relative' }}>
                <img src={tourTemplate.imageUrls[0]?.imageUrl || "/no-image-available.png"} alt={tourTemplate.tourName} style={{ width: '100%', height: '450px', objectFit: 'cover' }} />
              </Box>
              <Box sx={{ flex: '0 0 39.5%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ flex: '0 0 50%', mb: 1.2, position: 'relative' }}>
                  <img src={tourTemplate.imageUrls[1]?.imageUrl || "/no-image-available.png"} alt={tourTemplate.tourName} style={{ width: '100%', height: '219px', objectFit: 'cover' }} />
                </Box>
                <Box sx={{ flex: '0 0 50%', display: 'flex' }}>
                  <Box sx={{ flex: '0 0 48.5%', mr: '3%', position: 'relative' }}>
                    <img src={tourTemplate.imageUrls[2]?.imageUrl || "/no-image-available.png"} alt={tourTemplate.tourName} style={{ width: '100%', height: '214px', objectFit: 'cover' }} />
                  </Box>
                  <Box sx={{ flex: '0 0 48.5%', position: 'relative' }}>
                    <img src={tourTemplate.imageUrls[3]?.imageUrl || "/no-image-available.png"} alt={tourTemplate.tourName} style={{ width: '100%', height: '214px', objectFit: 'cover' }} />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
                <AccessTimeFilledIcon sx={{ fontSize: '2rem', color: '#3572EF' }} />
                <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', ml: 2 }}>
                  <Typography sx={{ color: '#05073C', fontWeight: 600, fontSize: '1.1rem' }}>Thời lượng:</Typography>
                  <Typography sx={{ color: '#05073C', fontSize: '1.1rem' }}>{tourTemplate.duration.durationName}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
                <CategoryIcon sx={{ fontSize: '2rem', color: '#3572EF' }} />
                <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', ml: 2 }}>
                  <Typography sx={{ color: '#05073C', fontWeight: 600, fontSize: '1.1rem' }}>Loại tour:</Typography>
                  <Typography sx={{ color: '#05073C', fontSize: '1.1rem' }}>{tourTemplate.tourCategoryName}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
                {tourTemplate.transportation === 'Máy bay' && (<FlightIcon sx={{ fontSize: '2rem', color: '#3572EF' }} />)}
                {tourTemplate.transportation === 'Tàu hỏa' && (<DirectionsTransitIcon sx={{ fontSize: '2rem', color: '#3572EF' }} />)}
                {tourTemplate.transportation === 'Xe du lịch' && (<DirectionsCarFilledIcon sx={{ fontSize: '2rem', color: '#3572EF' }} />)}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', ml: 2 }}>
                  <Typography sx={{ color: '#05073C', fontWeight: 600, fontSize: '1.1rem' }}>Phương tiện:</Typography>
                  <Typography sx={{ color: '#05073C', fontSize: '1.1rem' }}>{tourTemplate.transportation}</Typography>
                </Box>
              </Box>
            </Box>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C' }}>Tổng quan</Typography>
              <Box
                dangerouslySetInnerHTML={{ __html: tourTemplate.description }}
                sx={{
                  '& img': { width: '100%', height: 'auto', borderRadius: '4px', my: 2 },
                  '& p': { lineHeight: 1.7, mb: 2, color: '#05073C', textAlign: 'justify' },
                  flexGrow: 1, width: '100%', margin: '0 auto'
                }}
              />
            </Box>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C', mb: 3 }}>Lịch trình</Typography>
              {tourTemplate.schedule.map((s, index, array) => (
                <Box key={s.dayNumber} sx={{ pl: 6, position: 'relative' }}>
                  {(index === 0 || index === array.length - 1) && (
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 0,
                        top: '18px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: '2px solid #3572EF',
                        backgroundColor: 'white',
                        transform: 'translateY(-50%)',
                        zIndex: 1,
                      }}
                    />
                  )}
                  {(index !== 0 && index !== array.length - 1) && (
                    <Box
                      sx={{
                        position: 'absolute',
                        left: '4px',
                        top: '17px',
                        width: '15px',
                        height: '15px',
                        borderRadius: '50%',
                        backgroundColor: '#3572EF',
                        transform: 'translateY(-50%)',
                        zIndex: 1,
                      }}
                    />
                  )}
                  {index !== array.length - 1 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 10.5,
                        top: '24px',
                        bottom: -20,
                        width: '2px',
                        backgroundColor: '#3572EF',
                        zIndex: 0,
                      }}
                    />
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'relative', ml: 1 }} onClick={() => handleDayClick(s.dayNumber)}>
                    <Typography variant="h6" sx={{ fontWeight: '500', mr: 1 }}>
                      {`Ngày ${s.dayNumber}: ${s.title}`}
                    </Typography>
                    <IconButton size="small">
                      {expandedDay === s.dayNumber ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Box>
                  <Collapse in={expandedDay === s.dayNumber} sx={{ ml: 1 }}>
                    <Typography sx={{ mb: -1.5 }}>Các điểm đến:</Typography>
                    <ul>
                      {s.attractions.map((attraction, i) => (
                        <li key={attraction.attractionId}>
                          {attraction.name}
                        </li>
                      ))}
                    </ul>
                    <Typography>Chi tiết:</Typography>
                    <Box dangerouslySetInnerHTML={{ __html: s.description }} sx={{ '& p': { lineHeight: 1.2, mt: 1, textAlign: 'justify' } }} />
                  </Collapse>
                </Box>
              ))}
            </Box>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C' }}>
                Lưu ý
              </Typography>
              <Box
                dangerouslySetInnerHTML={{ __html: tourTemplate.note }} />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 4, mb: 3, borderRadius: '10px' }}>
              <Typography variant="h6" sx={{ fontWeight: '600', mb: 1, color: '#05073C' }}>Thông tin tour mẫu</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FontAwesomeIcon icon={faQrcode} style={{ marginRight: '10px', color: '#3572EF' }} />
                <Typography sx={{ color: '#05073C', display: 'flex' }}>
                  Mã tour mẫu:
                  <Typography sx={{ ml: 1, color: 'primary.main', fontWeight: 700 }}>{tourTemplate.code}</Typography>
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '10px', color: '#3572EF' }} />
                <Typography sx={{ color: '#05073C' }}>Ngày tạo: {new Date(tourTemplate.createdDate).toLocaleDateString('vi-VN')}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FontAwesomeIcon icon={faMoneyBill1} style={{ marginRight: '10px', color: '#3572EF' }} />
                <Typography sx={{ color: '#05073C' }}>
                  Giá từ: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tourTemplate.minPrice)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <FontAwesomeIcon icon={faMoneyBill1} style={{ marginRight: '10px', color: '#3572EF' }} />
                <Typography sx={{ color: '#05073C' }}>
                  Đến: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tourTemplate.maxPrice)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '10px', color: '#3572EF' }} />
                <Typography sx={{ color: '#05073C', display: 'flex' }}>
                  Trạng thái:
                </Typography>
                <Chip label={getTourTemplateStatusInfo(tourTemplate.status).text} size="medium" sx={{ fontSize: '1rem', ml: 1, color: `${getTourTemplateStatusInfo(tourTemplate.status).color}`, bgcolor: `${getTourTemplateStatusInfo(tourTemplate.status).backgroundColor}` }} />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={12}>
            <Box sx={{ mb: 5, maxWidth: '100%' }}>
              <Typography variant="h5" gutterBottom sx={{
                textAlign: 'left',
                fontWeight: '700',
                fontSize: '1.6rem',
                color: '#05073C',
                mb: 3
              }}>
                Danh sách tour
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* <TourTemplateCalendar 
                  tours={tours} 
                  selectedMonth={selectedMonth} 
                  handleMonthChange={handleMonthChange}
                /> */}
                <TourTable tours={tours} />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={12}>
            {tourTemplate.status === TourTemplateStatus.Approved && (
              <Box sx={{ mb: 5 }}>
                <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C' }}>
                  Đánh giá từ khách hàng
                </Typography>
                <ReviewListTour tourTemplateId={id} />
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
      <TourTemplateDeletePopup
        open={isDeletePopupOpen}
        onClose={handleCloseDeletePopup}
        template={tourTemplate}
        onDelete={handleDeleteConfirm}
      />
      {/* Approve Popup */}
      <Dialog open={isApprovePopupOpen} onClose={() => setIsApprovePopupOpen(false)}>
        <DialogTitle>Xác nhận duyệt</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn duyệt tour mẫu này?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsApprovePopupOpen(false)}>Hủy</Button>
          <Button onClick={handleApprove} variant="contained" color="primary">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
      {/* Reject Popup */}
      <Dialog open={isRejectPopupOpen} onClose={() => setIsRejectPopupOpen(false)}>
        <DialogTitle>Xác nhận từ chối</DialogTitle>
        <DialogContent sx={{ width: '30rem' }}>
          <DialogContentText>
            Vui lòng nhập lý do từ chối:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Lý do"
            fullWidth
            multiline
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsRejectPopupOpen(false)}>Hủy</Button>
          <Button
            onClick={handleReject}
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
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
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

export default ManagerTourTemplateDetails;