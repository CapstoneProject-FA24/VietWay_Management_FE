import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, CircularProgress, Collapse, Snackbar, Alert, Paper } from '@mui/material';
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
import SendIcon from '@mui/icons-material/Send';
import AttractionDeletePopup from '@components/attraction/AttractionDeletePopup';
import { getErrorMessage } from '@hooks/Message';

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
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success', hide: 5000 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAttractionData = async () => {
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
      setError(getErrorMessage(error));
    }
  };

  useEffect(() => {
    fetchAttractionData();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSendForApproval = async () => {
    setIsSubmitting(true);
    try {
      const requiredFields = {
        name: 'Tên điểm tham quan', description: 'Mô tả', address: 'Địa chỉ',
        provinceId: 'Tỉnh/Thành phố', attractionTypeId: 'Loại điểm tham quan',
      };
      const missingFields = [];
      Object.entries(requiredFields).forEach(([field, label]) => {
        if (!attraction[field] || attraction[field].trim() === '') {
          missingFields.push(label);
        }
      });
      if (attraction.images.length === 0) {
        missingFields.push('Hình ảnh');
      }
      if (missingFields.length > 0) {
        setSnackbar({ open: true, message: `Vui lòng điền đầy đủ thông tin trước khi gửi`, severity: 'error', hide: 5000 });
        setIsSubmitting(false);
        return;
      }

      const updatedAttraction = {
        id: id, name: attraction.name, description: attraction.description,
        address: attraction.address, contactInfo: attraction.contactInfo || '', website: attraction.website || '',
        provinceId: attraction.provinceId, attractionTypeId: attraction.attractionTypeId,
        googlePlaceId: attraction.googlePlaceId || '', isDraft: false
      };

      const response = await updateAttraction(updatedAttraction);

      setAttraction(prevPost => ({
        ...prevPost,
        ...updatedAttraction,
        status: AttractionStatus.Pending
      }));

      setSnackbar({
        open: true, message: 'Đã gửi duyệt thành công', severity: 'success', hide: 5000
      });
      await fetchAttractionData();
    } catch (error) {
      console.error('Error sending for approval:', error);
      setSnackbar({
        open: true, severity: 'error', hide: 5000,
        message: getErrorMessage(error),
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
            setSnackbar({
              open: true, severity: 'error', hide: 5000,
              message: 'Có lỗi xảy ra khi cập nhật hình ảnh. Vui lòng thử lại.'
            });
            return;
          }
        }
        setIsEditing(false);
        const updatedAttraction = await fetchAttractionById(id);
        setAttraction(updatedAttraction);
        setSnackbar({
          open: true, severity: 'success',
          message: attractionData.isDraft ? 'Đã lưu nháp thành công' : 'Đã lưu và gửi duyệt thành công',
        });
      } else {
        setSnackbar({
          open: true, severity: 'error', hide: 5000,
          message: 'Có lỗi xảy ra khi cập nhật điểm tham quan. Vui lòng thử lại.'
        });
      }
    } catch (error) {
      console.error('Error updating attraction:', error);
      setSnackbar({
        open: true, severity: 'error', hide: 5000,
        message: getErrorMessage(error),
      });
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
        open: true, message: 'Xóa điểm tham quan thành công', severity: 'success', hide: 1500
      });
    } catch (error) {
      console.error('Error deleting attraction:', error);
      setSnackbar({
        open: true, message: getErrorMessage(error), severity: 'error', hide: 5000,
      });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
    if (snackbar.message === 'Xóa điểm tham quan thành công') {
      navigate('/nhan-vien/diem-tham-quan');
    }
  };

  const CancelConfirmationDialog = () => (
    <Dialog open={isCancelPopupOpen} onClose={handleCloseCancelPopup}>
      <DialogTitle sx={{ fontWeight: 600 }}>Xác nhận hủy</DialogTitle>
      <DialogContent>
        <Typography>Bạn có chắc chắn muốn hủy cập nhật? Các thay đổi sẽ không được lưu.</Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={handleCloseCancelPopup} sx={{ color: '#666666' }}>Không</Button>
        <Button
          onClick={handleCancelConfirm} variant="contained"
          sx={{ backgroundColor: '#DC2626', '&:hover': { backgroundColor: '#B91C1C' } }}
        >
          Có
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '100vh' }}>
        <Helmet> <title>Chi tiết điểm tham quan</title> </Helmet>
        <Box sx={{ display: 'flex' }}>
          <SidebarStaff isOpen={isSidebarOpen} toggleSidebar={handleSidebarToggle} />

          <Box sx={{
            flexGrow: 1, p: 3, transition: 'margin-left 0.3s',
            marginLeft: isSidebarOpen ? '260px' : '20px', mt: 5
          }}>
            <Box maxWidth="89vw">
              <Box elevation={2} sx={{
                p: 1, mb: 3, marginTop: -1.5, height: '100%',
                width: isSidebarOpen ? 'calc(93vw - 260px)' : 'calc(93vw - 20px)'
              }}>
                <Box sx={{ m: '-60px -60px 0px -60px', boxShadow: 2, pt: 3, pl: 4, pr: 4, pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Button
                    component={Link} to="/nhan-vien/diem-tham-quan" variant="contained"
                    startIcon={<ArrowBackIosNewOutlinedIcon />}
                    sx={{ height: '55px', backgroundColor: 'transparent', boxShadow: 0, color: 'gray', ":hover": { backgroundColor: 'transparent', boxShadow: 0, color: 'black', fontWeight: 700 } }}>
                    Quay lại
                  </Button>
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'center', color: '#05073C', flexGrow: 1 }}>
                    Quản lý điểm tham quan
                  </Typography>
                </Box>
                <Typography sx={{ textAlign: 'center', mt: 5 }} color="error">{error}</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  if (!attraction) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '100vh' }}>
      <Helmet> <title>Chi tiết điểm tham quan</title> </Helmet>
      <Box sx={{ display: 'flex' }}>
        <SidebarStaff isOpen={isSidebarOpen} toggleSidebar={handleSidebarToggle} />

        <Box sx={{
          flexGrow: 1, p: 3, transition: 'margin-left 0.3s',
          marginLeft: isSidebarOpen ? '260px' : '20px', mt: 5
        }}>
          <Box maxWidth="89vw">
            <Box elevation={2} sx={{
              p: 1, mb: 3, marginTop: -1.5, height: '100%',
              width: isSidebarOpen ? 'calc(93vw - 250px)' : 'calc(93vw - 10px)'
            }}>
              <Box sx={{ m: '-60px -60px 0px -60px', boxShadow: 2, pt: 3, pl: 4, pr: 4, pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Button
                  component={Link} to="/nhan-vien/diem-tham-quan" variant="contained"
                  startIcon={<ArrowBackIosNewOutlinedIcon />}
                  sx={{ height: '55px', backgroundColor: 'transparent', boxShadow: 0, color: 'gray', ":hover": { backgroundColor: 'transparent', boxShadow: 0, color: 'black', fontWeight: 700 } }}>
                  Quay lại
                </Button>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'center', color: '#05073C', flexGrow: 1 }}>
                  Quản lý điểm tham quan
                </Typography>
                <IconButton onClick={handleHistoryClick}
                  sx={{
                    backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    '&:hover': { backgroundColor: '#f5f5f5' }, height: '40px', mr: 2
                  }}
                > <HistoryIcon color="primary" /> </IconButton>
                <Collapse in={isHistoryOpen} timeout="auto" unmountOnExit
                  sx={{ position: 'absolute', top: 80, right: 30, width: '400px', zIndex: 1000 }}
                >
                  <Paper elevation={3} sx={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden' }} >
                    <VersionHistory entityId={id} entityType={0} />
                  </Paper>
                </Collapse>
                {(attraction.status !== AttractionStatus.Approved) && (
                  <Box sx={{ display: 'flex', gap: 2, position: 'relative' }}>
                    {isEditing ? (
                      <Button
                        variant="contained" startIcon={<CancelIcon />} onClick={handleCancelClick}
                        sx={{ backgroundColor: '#767676', '&:hover': { backgroundColor: '#575757' }, height: '45px' }}
                      >
                        Hủy sửa
                      </Button>
                    ) : (
                      <>
                        {attraction.status === AttractionStatus.Draft && (
                          <Button
                            variant="contained" color="primary"
                            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                            onClick={handleSendForApproval} disabled={isSubmitting}
                          >
                            {isSubmitting ? 'Đang gửi...' : 'Gửi duyệt'}
                          </Button>
                        )}
                        <Button
                          variant="contained" startIcon={<EditIcon />} onClick={handleEdit}
                          sx={{ backgroundColor: '#767676', '&:hover': { backgroundColor: '#575757' }, height: '45px' }}
                        >
                          Sửa
                        </Button>
                      </>
                    )}
                    <Button
                      variant="contained" startIcon={<DeleteIcon />} onClick={handleDelete}
                      sx={{ backgroundColor: '#DC2626', '&:hover': { backgroundColor: '#B91C1C' }, height: '45px' }}
                    >
                      Xóa
                    </Button>
                  </Box>
                )}
              </Box>

              {isEditing ? (
                <AttractionUpdateForm
                  attraction={attraction} provinces={provinces}
                  attractionTypes={attractionTypes} onSave={handleSave} currentSlide={currentSlide}
                  setCurrentSlide={setCurrentSlide} sliderRef={sliderRef} setSliderRef={setSliderRef}
                />
              ) : (
                <AttractionInfo
                  attraction={attraction} currentSlide={currentSlide}
                  setCurrentSlide={setCurrentSlide} sliderRef={sliderRef} setSliderRef={setSliderRef}
                />
              )}

              <AttractionDeletePopup
                open={openDeleteDialog} onClose={handleCloseDeleteDialog}
                attraction={attraction} onDelete={handleConfirmDelete}
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <CancelConfirmationDialog />

      <Snackbar
        open={snackbar.open} autoHideDuration={snackbar.hide} onClose={handleCloseSnackbar}
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