import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Chip, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, Snackbar, Alert, IconButton, Collapse } from '@mui/material';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Helmet } from 'react-helmet';
import '@styles/AttractionDetails.css'
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { fetchAttractionById, changeAttractionStatus, deleteAttraction, updateAttraction, updateAttractionImages } from '@services/AttractionService';
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
import AttractionUpdateForm from '@components/staff/attraction/AttractionUpdateForm';
import { fetchProvinces } from '@services/ProvinceService';
import { fetchAttractionType } from '@services/AttractionTypeService';
import EditIcon from '@mui/icons-material/Edit';
import AttractionDeletePopup from '@components/attraction/AttractionDeletePopup';

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
  const [snackbar, setSnackbar] = useState({  open: false, message: '', severity: 'success', hide: 5000 });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [attractionTypes, setAttractionTypes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedProvinces, fetchedAttractionTypes, fetchedAttraction] = await Promise.all([
          fetchProvinces({}),
          fetchAttractionType(),
          fetchAttractionById(id)
        ]);

        setProvinces(fetchedProvinces.items);
        setAttractionTypes(fetchedAttractionTypes);
        setAttraction(fetchedAttraction);
      } catch (error) {
        console.error('Error fetching data:', error);
        setSnackbar({
          open: true,
          message: 'Có lỗi xảy ra khi tải dữ liệu',
          severity: 'error'
        });
      }
    };

    fetchData();
  }, [id]);

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
        severity: 'success', hide: 5000
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Lỗi khi duyệt điểm tham quan',
        severity: 'error', hide: 5000
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
        severity: 'success', hide: 5000
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Lỗi khi từ chối điểm tham quan',
        severity: 'error', hide: 5000
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

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteAttraction(id);
      setOpenDeleteDialog(false);
      setSnackbar({
        open: true,
        message: 'Xóa điểm tham quan thành công',
        severity: 'success', hide: 1500
      });
      setTimeout(() => {
        navigate('/quan-ly/diem-tham-quan');
      }, 1500);
    } catch (error) {
      console.error('Error deleting attraction:', error);
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi xóa điểm tham quan',
        severity: 'error', hide: 5000
      });
    }
  };

  const handleSave = async (attractionData, newImages, removedImageIds) => {
    try {
      const response = await updateAttraction(attractionData);
      if (response.status === 200) {
        if (newImages.length > 0 || removedImageIds.length > 0) {
          const imagesResponse = await updateAttractionImages(
            id,
            newImages.length > 0 ? newImages : null,
            removedImageIds.length > 0 ? removedImageIds : null
          );
          if (imagesResponse.statusCode !== 200) {
            alert('Có lỗi xảy ra khi cập nhật hình ảnh. Vui lòng thử lại.');
            return;
          }
        }
        const updatedAttraction = await fetchAttractionById(id);
        setAttraction(updatedAttraction);
        setSnackbar({
          open: true,
          message: 'Cập nhật điểm tham quan thành công',
          severity: 'success'
        });
      } else {
        alert('Có lỗi xảy ra khi cập nhật điểm tham quan. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error updating attraction:', error);
      alert('Có lỗi xảy ra khi cập nhật điểm tham quan. Vui lòng thử lại.');
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
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
                backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', height: '45px',
                '&:hover': { backgroundColor: '#f5f5f5' }
              }}
            >
              <HistoryIcon color="primary" />
            </IconButton>
            <Collapse in={isHistoryOpen} timeout="auto" unmountOnExit>
              <Box
                sx={{
                  position: 'absolute', top: '100%',
                  right: 0, width: '400px', backgroundColor: 'white',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '4px',
                  display: isHistoryOpen ? 'block' : 'none', zIndex: 1000, marginTop: '8px'
                }}
              >
                <VersionHistory />
              </Box>
            </Collapse>
            {!isEditing ? (
              <Button
                variant="contained"
                onClick={handleEditClick}
                startIcon={<EditIcon />}
                sx={{
                  width: 'fit-content',
                  p: 1.1,
                  backgroundColor: '#3572EF',
                  '&:hover': { backgroundColor: '#1C4ED8' }
                }}
              >
                Sửa
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleCancelEdit}
                startIcon={<CancelIcon />}
                sx={{
                  width: 'fit-content',
                  p: 1.1,
                  backgroundColor: '#767676',
                  '&:hover': { backgroundColor: '#575757' }
                }}
              >
                Hủy sửa
              </Button>
            )}

            <Button
              variant="contained"
              onClick={handleDeleteClick}
              sx={{
                width: 'fit-content',
                p: 1.1,
                backgroundColor: '#DC2626',
                '&:hover': { backgroundColor: '#B91C1C' }
              }}
            >
              Xóa
            </Button>
          </Box>
        )}
      </Box>
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
      <AttractionDeletePopup
        open={openDeleteDialog} onClose={handleCloseDeleteDialog}
        attraction={attraction} onDelete={handleConfirmDelete}
      />
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
      {attraction?.status === AttractionStatus.Approved && isEditing ? (
        <AttractionUpdateForm
          attraction={attraction}
          provinces={provinces}
          attractionTypes={attractionTypes}
          onSave={(data, newImages, removedImageIds) => {
            handleSave(data, newImages, removedImageIds);
            setIsEditing(false);
          }}
          currentSlide={currentSlide}
          setCurrentSlide={setCurrentSlide}
          sliderRef={sliderRef}
          setSliderRef={setSliderRef}
        />
      ) : (
        <Box sx={{ p: 3, flexGrow: 1, mt: 5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" gutterBottom sx={{ fontFamily: 'Inter, sans-serif', textAlign: 'left', color: 'gray', fontSize: '1.2rem' }}>
              Thuộc tỉnh/thành phố: {attraction.provinceName}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" gutterBottom sx={{ fontFamily: 'Inter, sans-serif', textAlign: 'left', color: 'gray', fontSize: '1.2rem' }}>
              Loại điểm tham quan: {attraction.attractionTypeName}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C' }}>
              {attraction.name}
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper elevation={3} sx={{ mb: 3, overflow: 'hidden', position: 'relative', maxWidth: '1000px' }}>
                <Box className="slick-slider-container" sx={{ height: '450px' }}>
                  <Slider ref={setSliderRef} {...settings}>
                    {attraction.images.map((image, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <img
                          src={image.url}
                          alt={`Attraction ${index + 1}`}
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
                    sx={{ width: 110, height: 110, flexShrink: 0, mr: 3, borderRadius: 1, overflow: 'hidden', cursor: 'pointer', border: currentSlide === index ? '2px solid #3572EF' : 'none' }}
                    onClick={() => handleThumbnailClick(index)}
                  >
                    <img
                      src={image.url}
                      alt={`Thumbnail ${index + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </Box>
                ))}
              </Box>
              <Box sx={{ mt: 3 }}>
                <Typography variant="h4" sx={{ mb: 2, fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C', fontSize: '27px' }}>Thông tin chi tiết</Typography>
                <Box dangerouslySetInnerHTML={{ __html: attraction.description }} sx={{
                  '& img': { width: '100%', height: 'auto', borderRadius: '4px', my: 2 },
                  '& p': { lineHeight: 1.7, mb: 2 }, flexGrow: 1, width: '100%', margin: '0 auto'
                }} />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 4, mb: 3, borderRadius: '10px' }}>
                <Typography variant="h4" sx={{ mb: 2, fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'center', color: '#05073C', fontSize: '27px' }}>Thông tin liên hệ</Typography>
                <Typography sx={{ fontWeight: 700, minWidth: '4rem' }}>Địa chỉ: </Typography>
                <Typography sx={{ mb: 3 }}>{attraction.address}</Typography>
                <Typography sx={{ fontWeight: 700, minWidth: '4rem' }}>Website: </Typography>
                <Box sx={{ mb: 3 }}>
                  <a href={attraction.website} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }}>
                    {attraction.website}
                  </a>
                </Box>
                <Typography sx={{ fontWeight: 700, minWidth: '4rem' }}>Các thông tin liên hệ khác: </Typography>
                <div style={{ marginTop: -15, marginBottom: 15 }} dangerouslySetInnerHTML={{ __html: attraction.contactInfo }} />

                {attraction.googlePlaceId && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h4" sx={{
                      fontWeight: '700', fontFamily: 'Inter, sans-serif', color: '#05073C',
                      fontSize: '27px', display: 'flex', alignItems: 'center', gap: 1, mb: 2
                    }}>
                      <AccessTimeIcon /> Giờ mở cửa
                    </Typography>

                    {loading ? (
                      <Typography sx={{ mt: 2 }}>Đang tải...</Typography>
                    ) : openingHours ? (
                      <Box>
                        <Box sx={{
                          display: 'flex', alignItems: 'center', gap: 1, mb: 2,
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
                                py: 1, display: 'flex', justifyContent: 'space-between',
                                borderBottom: '1px solid #eee', '&:last-child': { borderBottom: 'none' }
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
              <Paper elevation={3} sx={{ p: 4, mb: 3, borderRadius: '10px' }}>
                <Typography variant="h4" sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C', fontSize: '20px', mb: 2 }}>
                  Thông tin tạo điểm tham quan
                </Typography>
                <Box sx={{ display: 'flex', width: '100%' }}>
                  <Typography sx={{ fontWeight: 700 }}>Mã: </Typography>
                  <Typography sx={{ mb: 1, ml: 1, color: 'primary.main' }}>{attraction.attractionId}</Typography>
                </Box>
                <Box sx={{ display: 'flex', width: '100%' }}>
                  <Typography sx={{ fontWeight: 700 }}>Ngày tạo: </Typography>
                  <Typography sx={{ mb: 1, ml: 1 }}>{new Date(attraction.createdDate).toLocaleDateString('en-GB')}</Typography>
                </Box>
                <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 700 }}>Trạng thái: </Typography>
                  <Chip label={getAttractionStatusInfo(attraction.status).text} size="medium" sx={{ fontSize: '1rem', ml: 1, color: `${getAttractionStatusInfo(attraction.status).color}`, bgcolor: `${getAttractionStatusInfo(attraction.status).backgroundColor}` }} />
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={12}>
              <Typography sx={{ minWidth: '4rem', mt: 5, mb: 2 }}>
                <strong>Google Place ID:</strong> {attraction.googlePlaceId}
              </Typography>
              <Box sx={{
                height: '500px', width: '100%', position: 'relative', mb: 3,
                overflow: 'hidden', borderRadius: '10px', border: '1px solid #e0e0e0'
              }}>
                <Map placeId={attraction.googlePlaceId} />
              </Box>
            </Grid>
            {attraction.status === AttractionStatus.Approved && (
              <Grid item xs={12} md={12}>
                <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C' }}>
                  Đánh giá từ khách hàng
                </Typography>
                <ReviewList attractionId={attraction.attractionId} />
              </Grid>
            )}
          </Grid>
        </Box>
      )}
    </Box >
  );
};

export default ManagerAttractionDetail;