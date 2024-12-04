import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, CircularProgress, Collapse } from '@mui/material';
import { Helmet } from 'react-helmet';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { fetchAttractionById, updateAttraction, updateAttractionImages, deleteAttraction } from '@services/AttractionService';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AttractionInfo from '@components/staff/attraction/AttractionInfo';
import AttractionUpdateForm from '@components/staff/attraction/AttractionUpdateForm';
import { fetchProvinces } from '@services/ProvinceService';
import { fetchAttractionType } from '@services/AttractionTypeService';
import SidebarStaff from '@layouts/SidebarStaff';
import { AttractionStatus } from '@hooks/Statuses';
import CancelIcon from '@mui/icons-material/Cancel';
import HistoryIcon from '@mui/icons-material/History';
import VersionHistory from '@components/common/VersionHistory';
import { Snackbar, Alert } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const AttractionDetail = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, setSliderRef] = useState(null);
  const [attraction, setAttraction] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [attractionTypes, setAttractionTypes] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCancelPopupOpen, setIsCancelPopupOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedProvinces, fetchedAttractionType, fetchedAttraction] = await Promise.all([
          fetchProvinces({ pageSize: 63, pageIndex: 1 }),
          fetchAttractionType(),
          fetchAttractionById(id)
        ]);
        setProvinces(fetchedProvinces.items);
        setAttractionTypes(fetchedAttractionType);
        setAttraction(fetchedAttraction);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'An error occurred while fetching data');
      }
    };
    fetchData();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleSendForApproval = async () => {
    setIsSubmitting(true);
    try {
      console.log(attraction);
      const requiredFields = {
        name: 'Tên điểm tham quan',
        description: 'Mô tả',
        address: 'Địa chỉ',
        provinceId: 'Tỉnh/Thành phố',
        attractionTypeId: 'Loại điểm tham quan',
      };

      const missingFields = [];
      Object.entries(requiredFields).forEach(([field, label]) => {
        if (!attraction[field] || attraction[field].trim() === '') {
          missingFields.push(label);
        }
      });

      // Check for image
      if (!attraction.images) {
        missingFields.push('Hình ảnh');
      }

      if (missingFields.length > 0) {
        setSnackbar({
          open: true,
          message: `Vui lòng điền đầy đủ thông tin trước khi gửi`,
          severity: 'error'
        });
        setIsSubmitting(false);
        return;
      }

      const updatedAttraction = {
        id: id,
        name: attraction.name,
        description: attraction.description,
        address: attraction.address,
        contactInfo: attraction.contactInfo || '',
        website: attraction.website || '',
        provinceId: attraction.provinceId,
        attractionTypeId: attraction.attractionTypeId,
        googlePlaceId: attraction.googlePlaceId || '',
        isDraft: false
      };

      const response = await updateAttraction(updatedAttraction);

      setAttraction(prevPost => ({
        ...prevPost,
        ...updatedAttraction,
        status: AttractionStatus.Pending
      }));

      setIsEditMode(false);
      setSnackbar({
        open: true,
        message: 'Đã gửi điểm tham quan để duyệt',
        severity: 'success'
      });
      window.location.reload();
    } catch (error) {
      console.error('Error sending for approval:', error);
      setSnackbar({
        open: true,
        message: 'Lỗi khi gửi duyệt: ' + (error.response?.data?.message || error.message),
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async (attractionData, newImages, removedImageIds) => {
    setIsSubmitting(true);
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
        setIsEditing(false);
        // Refresh attraction data
        const updatedAttraction = await fetchAttractionById(id);
        setAttraction(updatedAttraction);
      } else {
        alert('Có lỗi xảy ra khi cập nhật điểm tham quan. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error updating attraction:', error);
      alert('Có lỗi xảy ra khi cập nhật điểm tham quan. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    handleDeleteAttraction();
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCancelClick = () => {
    setIsCancelPopupOpen(true);
  };

  const handleCloseCancelPopup = () => {
    setIsCancelPopupOpen(false);
  };

  const handleCancelConfirm = () => {
    setIsEditing(false);
    setIsCancelPopupOpen(false);
  };

  const handleHistoryClick = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };

  const handleDeleteAttraction = () => {
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
        severity: 'success'
      });
      navigate(-1); // Navigate back after successful deletion
    } catch (error) {
      console.error('Error deleting attraction:', error);
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi xóa điểm tham quan',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
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
        <Button
          onClick={handleCloseCancelPopup}
          sx={{ color: '#666666' }}
        >
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

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  if (!attraction) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '100vh' }}>
      <Helmet>
        <title>Chi tiết điểm tham quan</title>
      </Helmet>
      <Box sx={{ display: 'flex' }}>
        <SidebarStaff isOpen={isSidebarOpen} toggleSidebar={handleSidebarToggle} />

        <Box sx={{
          flexGrow: 1,
          p: 3,
          transition: 'margin-left 0.3s',
          marginLeft: isSidebarOpen ? '260px' : '20px',
          mt: 5
        }}>
          <Box maxWidth="89vw">
            <Box elevation={2} sx={{
              p: 1,
              mb: 3,
              marginTop: -1.5,
              height: '100%',
              width: isSidebarOpen ? 'calc(93vw - 260px)' : 'calc(93vw - 20px)'
            }}>
              <Box sx={{ m: '-60px -60px 0px -60px', boxShadow: 2, pt: 3, pl: 4, pr: 4, pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Button
                  component={Link}
                  to="/nhan-vien/diem-tham-quan"
                  variant="contained"
                  startIcon={<ArrowBackIosNewOutlinedIcon />}
                  sx={{ height: '55px', backgroundColor: 'transparent', boxShadow: 0, color: 'gray', ":hover": { backgroundColor: 'transparent', boxShadow: 0, color: 'black', fontWeight: 700 } }}>
                  Quay lại
                </Button>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'center', color: '#05073C', flexGrow: 1 }}>
                  Quản lý điểm tham quan
                </Typography>
                {(attraction.status === AttractionStatus.Draft || attraction.status === AttractionStatus.Rejected) && (
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

                    {/* Version History Dropdown */}
                    <Collapse in={isHistoryOpen} timeout="auto" unmountOnExit>
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
                    </Collapse>

                    {isEditing ? (
                      <Button
                        variant="contained"
                        startIcon={<CancelIcon />}
                        onClick={handleCancelClick}
                        sx={{ backgroundColor: '#767676', '&:hover': { backgroundColor: '#575757' }, height: '45px' }}
                      >
                        Hủy sửa
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                          onClick={handleSendForApproval}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Đang gửi...' : 'Gửi duyệt'}
                        </Button>
                        <Button
                          variant="contained"
                          startIcon={<EditIcon />}
                          onClick={handleEdit}
                          sx={{ backgroundColor: '#767676', '&:hover': { backgroundColor: '#575757' }, height: '45px' }}
                        >
                          Sửa
                        </Button>
                      </>
                    )}
                    <Button
                      variant="contained"
                      startIcon={<DeleteIcon />}
                      onClick={handleDelete}
                      sx={{ backgroundColor: '#DC2626', '&:hover': { backgroundColor: '#B91C1C' }, height: '45px' }}
                    >
                      Xóa
                    </Button>
                  </Box>
                )}
                {attraction.status === AttractionStatus.Pending && (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<DeleteIcon />}
                      onClick={handleDelete}
                      sx={{ backgroundColor: '#DC2626', '&:hover': { backgroundColor: '#B91C1C' }, height: '45px' }}
                    >
                      Xóa
                    </Button>
                  </Box>
                )}
              </Box>

              {isEditing ? (
                <AttractionUpdateForm
                  attraction={attraction}
                  provinces={provinces}
                  attractionTypes={attractionTypes}
                  onSave={handleSave}
                  currentSlide={currentSlide}
                  setCurrentSlide={setCurrentSlide}
                  sliderRef={sliderRef}
                  setSliderRef={setSliderRef}
                />
              ) : (
                <AttractionInfo
                  attraction={attraction}
                  currentSlide={currentSlide}
                  setCurrentSlide={setCurrentSlide}
                  sliderRef={sliderRef}
                  setSliderRef={setSliderRef}
                />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
      <CancelConfirmationDialog />

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Xác nhận xóa điểm tham quan</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa điểm tham quan này? Hành động này không thể hoàn tác.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Không
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary" variant="contained">
            Xác nhận xóa
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AttractionDetail;
