import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Chip, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Snackbar, Alert, IconButton } from '@mui/material';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Helmet } from 'react-helmet';
import '@styles/AttractionDetails.css'
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { fetchAttractionById, changeAttractionStatus } from '@services/AttractionService';
import { AttractionStatus } from '@hooks/Statuses';
import { getAttractionStatusInfo } from '@services/StatusService';
import SidebarManager from '@layouts/SidebarManager';
import Map from '@components/staff/attraction/Map';
import { fetchPlaceDetails } from '@services/GooglePlaceService';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ReviewList from '@components/review/ReviewList';
import HistoryIcon from '@mui/icons-material/History';
import VersionHistory from '@components/common/VersionHistory';

const ManagerAttractionDetail = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, setSliderRef] = useState(null);
  const [attraction, setAttraction] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openingHours, setOpeningHours] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isApprovePopupOpen, setIsApprovePopupOpen] = useState(false);
  const [isRejectPopupOpen, setIsRejectPopupOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    const fetchAttraction = async () => {
      try {
        const fetchedAttraction = await fetchAttractionById(id);
        setAttraction(fetchedAttraction);
      } catch (error) {
        console.error('Error fetching attraction:', error);
      }
    };

    fetchAttraction();
  }, [id, navigate]);

  useEffect(() => {
    const getPlaceDetails = async () => {
      if (attraction?.googlePlaceId) {
        setLoading(true);
        try {
          const hours = await fetchPlaceDetails(attraction.googlePlaceId);
          setOpeningHours(hours);
        } catch (error) {
          console.error('Error fetching opening hours:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    getPlaceDetails();
  }, [attraction?.googlePlaceId]);

  const settings = {
    dots: true,
    dotsClass: 'slick-dots custom-dots slider-dots',
    customPaging: i => (
      <div className="custom-dot"></div>
    ),
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    className: 'attraction-slider',
  };

  const handleThumbnailClick = (index) => {
    setCurrentSlide(index);
    if (sliderRef) {
      sliderRef.slickGoTo(index);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleApprove = async () => {
    try {
      await changeAttractionStatus(id, 2);
      setAttraction({ ...attraction, status: 2 });
      setSnackbar({
        open: true,
        message: 'Điểm tham quan đã được duyệt',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Lỗi khi duyệt điểm tham quan',
        severity: 'error'
      });
    } finally {
      setIsApprovePopupOpen(false);
    }
  };

  const handleReject = async () => {
    try {
      await changeAttractionStatus(id, 3, rejectReason);
      setAttraction({ ...attraction, status: 3 });
      setSnackbar({
        open: true,
        message: 'Điểm tham quan đã bị từ chối',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Lỗi khi từ chối điểm tham quan',
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

  const handleHistoryClick = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };

  if (!attraction) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box className='main' sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      width: isSidebarOpen ? 'calc(98.8vw - 230px)' : '98.8vw',
      ml: isSidebarOpen ? '230px' : 0,
      transition: 'margin-left 0.3s'
    }}>
      <SidebarManager isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Helmet>
        <title>Chi tiết điểm tham quan</title>
      </Helmet>
      <Box sx={{ m: '-60px -60px 0px -60px', boxShadow: 2, pt: 4, pl: 4, pr: 4, pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Button
          component={Link}
          to="/quan-ly/diem-tham-quan"
          variant="contained"
          startIcon={<ArrowBackIosNewOutlinedIcon />}
          sx={{ height: '55px', backgroundColor: 'transparent', boxShadow: 0, color: 'gray', ":hover": { backgroundColor: 'transparent', boxShadow: 0, color: 'black', fontWeight: 700 } }}>
          Quay lại
        </Button>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'center', color: '#05073C', flexGrow: 1 }}>
          Chi tiết điểm tham quan
        </Typography>
        {attraction?.status === AttractionStatus.Pending && (
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
        {attraction?.status === AttractionStatus.Approved && (
          <Box sx={{ display: 'flex', gap: 2, position: 'relative' }}>
            <IconButton
              onClick={handleHistoryClick}
              sx={{
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                height: '45px',
                '&:hover': {
                  backgroundColor: '#f5f5f5'
                }
              }}
            >
              <HistoryIcon color="primary" />
            </IconButton>

            <Box
              sx={{
                position: 'absolute',
                top: '100%',
                right: 0,
                width: '400px',
                backgroundColor: 'white',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                borderRadius: '4px',
                display: isHistoryOpen ? 'block' : 'none',
                zIndex: 1000,
                marginTop: '8px'
              }}
            >
              <VersionHistory />
            </Box>
            
            <Button 
              variant="contained" 
              sx={{ width: 'fit-content', p: 1.1, backgroundColor: 'red' }}
            >
              Xóa
            </Button>
          </Box>
        )}
      </Box>
      <Box sx={{ p: 3, flexGrow: 1, mt: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Chip label={getAttractionStatusInfo(attraction.status).text} size="small" sx={{ mb: 1, color: `${getAttractionStatusInfo(attraction.status).color}`, bgcolor: `${getAttractionStatusInfo(attraction.status).backgroundColor}` }} />
            <Typography variant="body1" gutterBottom sx={{ fontFamily: 'Inter, sans-serif', textAlign: 'left', color: 'gray', fontSize: '1.2rem' }}>
              {attraction.attractionTypeName}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C' }}>
            {attraction.name}
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ mb: 3, overflow: 'hidden', position: 'relative' }}>
              <Box className="slick-slider-container" sx={{ height: '450px' }}>
                <Slider ref={setSliderRef} {...settings}>
                  {attraction.images.map((image, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <img
                        src={image.url}
                        alt={`Attraction image ${index + 1}`}
                        style={{ width: '100%', height: '450px', objectFit: 'cover' }}
                      />
                    </div>
                  ))}
                </Slider>
              </Box>
            </Paper>
            <Box sx={{ display: 'flex', overflowX: 'auto', mb: 3 }}>
              {attraction.images.map((image, index) => (
                <Box
                  key={index}
                  sx={{ width: 110, height: 110, flexShrink: 0, mr: 3, borderRadius: 1, overflow: 'hidden', cursor: 'pointer', border: currentSlide === index ? '2px solid #3572EF' : 'none', position: 'relative' }}
                  onClick={() => handleThumbnailClick(index)}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              ))}
            </Box>
            <Box sx={{ mt: 3 }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C', fontSize: '27px' }}>Thông tin chi tiết</Typography>
              <div dangerouslySetInnerHTML={{ __html: attraction.description }} />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 4, mb: 3, borderRadius: '10px' }}>
              <Typography variant="h4" sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C', fontSize: '27px', mb: 2 }}>Thông tin liên hệ</Typography>
              <Typography sx={{ mb: 3 }}><strong>Địa chỉ: </strong> {attraction.address}</Typography>

              <Typography sx={{ fontWeight: 700, minWidth: '4rem' }}>Website: </Typography>
              <Box sx={{ mb: 3 }}>
                <a href={attraction.website} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }}>
                  {attraction.website}
                </a>
              </Box>

              <Typography variant="h4" sx={{ mt: 4, fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C', fontSize: '20px' }}>Các thông tin liên hệ khác</Typography>
              <div dangerouslySetInnerHTML={{ __html: attraction.contactInfo }} />

              {attraction.googlePlaceId && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h4" sx={{
                    fontWeight: '700',
                    fontFamily: 'Inter, sans-serif',
                    color: '#05073C',
                    fontSize: '27px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 2
                  }}>
                    <AccessTimeIcon /> Giờ mở cửa
                  </Typography>

                  {loading ? (
                    <Typography sx={{ mt: 2 }}>Đang tải...</Typography>
                  ) : openingHours ? (
                    <Box>
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 2,
                        color: openingHours.opening_hours?.open_now ? 'success.main' : 'error.main'
                      }}>
                        {openingHours.opening_hours ? (
                          <>
                            {openingHours.opening_hours?.open_now === true ? (
                              <><CheckCircleIcon /> <Typography>Đang mở cửa</Typography></>
                            ) : (
                              <><CancelIcon /> <Typography>Đã đóng cửa</Typography></>
                            )}</>
                        ) : (
                          <Typography>Không có thông tin giờ mở cửa</Typography>
                        )}
                      </Box>
                      <Box>
                        {openingHours.opening_hours?.periods?.map((period, index) => {
                          const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
                          const openTime = period.open.time.replace(/(\d{2})(\d{2})/, '$1:$2');
                          const closeTime = period.close.time.replace(/(\d{2})(\d{2})/, '$1:$2');

                          return (
                            <Typography key={index} sx={{
                              py: 1,
                              display: 'flex',
                              justifyContent: 'space-between',
                              borderBottom: '1px solid #eee',
                              '&:last-child': {
                                borderBottom: 'none'
                              }
                            }}>
                              <span style={{ fontWeight: period.open.day === new Date().getDay() ? 700 : 400 }}>
                                {days[period.open.day]}
                              </span>
                              <span>{openTime} - {closeTime}</span>
                            </Typography>
                          );
                        })}
                      </Box>
                    </Box>
                  ) : (
                    <Typography sx={{ mt: 2 }}>Không có thông tin giờ mở cửa</Typography>
                  )}
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Grid item xs={12} md={12}>
        <Typography sx={{ minWidth: '4rem', mt: 5, mb: 2 }}><strong>Google Place ID:</strong> {attraction.googlePlaceId}</Typography>
        <Box sx={{
          height: '500px',
          width: '100%',
          position: 'relative',
          mb: 3,
          overflow: 'hidden',
          borderRadius: '10px',
          border: '1px solid #e0e0e0'
        }}>
          <Map placeId={attraction.googlePlaceId} />
        </Box>
      </Grid>
      {attraction.status === AttractionStatus.Approved && (
        <Grid item xs={12} md={12}>
          <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C' }}>
            Đánh giá từ khách hàng
          </Typography>
          <ReviewList attractionId={id} />
        </Grid>
      )}
      <Dialog open={isApprovePopupOpen} onClose={() => setIsApprovePopupOpen(false)}>
        <DialogTitle>Xác nhận duyệt</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn duyệt điểm tham quan này?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsApprovePopupOpen(false)}>Hủy</Button>
          <Button onClick={handleApprove} variant="contained" color="primary">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
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
    </Box >
  );
};

export default ManagerAttractionDetail;