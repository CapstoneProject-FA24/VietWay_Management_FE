import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Snackbar, Alert } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Cancel as CancelIcon } from '@mui/icons-material';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { fetchTourTemplateById, updateTourTemplate, deleteTourTemplate, changeTourTemplateStatus, updateTemplateImages } from '@services/TourTemplateService';
import TourTemplateInfo from '@components/staff/tourTemplate/TourTemplateInfo';
import TourTemplateUpdateForm from '@components/staff/tourTemplate/TourTemplateUpdateForm';
import { TourTemplateStatus } from '@hooks/Statuses';
import TourTemplateDeletePopup from '@components/tourTemplate/TourTemplateDeletePopup';
import { Helmet } from 'react-helmet';
import SidebarStaff from '@layouts/SidebarStaff';
import { fetchToursByTemplateId } from '@services/TourService';
import HistoryIcon from '@mui/icons-material/History';
import VersionHistory from '@components/common/VersionHistory';
import SendIcon from '@mui/icons-material/Send';

const TourTemplateDetails = () => {
  const [state, setState] = useState({
    tourTemplate: null, loading: true,
    isEditing: false, expandedDay: null, isDeletePopupOpen: false
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const pageTopRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCancelPopupOpen, setIsCancelPopupOpen] = useState(false);
  const [tours, setTours] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success', hide: 5000 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedTourTemplate = await fetchTourTemplateById(id);
        setState(prev => ({
          ...prev,
          tourTemplate: fetchedTourTemplate,
          loading: false
        }));
        const fetchedTours = await fetchToursByTemplateId(id);
        setTours(fetchedTours);
      } catch (error) {
        console.error('Error fetching tour template:', error);
        setState(prev => ({ ...prev, loading: false }));
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    pageTopRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.tourTemplate]);

  const handleDayClick = (day) => {
    setState(prev => ({
      ...prev,
      expandedDay: prev.expandedDay === day ? null : day
    }));
  };

  const handleEdit = () => setState(prev => ({ ...prev, isEditing: true }));
  const handleCancelClick = () => {
    setIsCancelPopupOpen(true);
  };

  const handleCloseCancelPopup = () => {
    setIsCancelPopupOpen(false);
  };

  const handleCancelConfirm = () => {
    setState(prev => ({ ...prev, isEditing: false }));
    setIsCancelPopupOpen(false);
  };

  const handleSave = async (updatedData, newImages, removedImageIds) => {
    setIsSubmitting(true);
    try {
      const response = await updateTourTemplate(updatedData.tourTemplateId, updatedData);
      if (response.statusCode === 200) {
        if (newImages.length > 0 || removedImageIds.length > 0) {
          const imagesResponse = await updateTemplateImages(
            updatedData.tourTemplateId, newImages.length > 0 ? newImages : null,
            removedImageIds.length > 0 ? removedImageIds : null
          );
          if (imagesResponse.statusCode !== 200) {
            setSnackbar({
              open: true, severity: 'error', hide: 5000,
              message: 'Có lỗi xảy ra khi cập nhật hình ảnh. Vui lòng thử lại.',
            });
            return;
          }
        }

        const updatedTourTemplate = await fetchTourTemplateById(id);
        setState(prev => ({
          ...prev,
          tourTemplate: updatedTourTemplate,
          isEditing: false
        }));
        setSnackbar({
          open: true,
          message: updatedData.isDraft ? 'Đã lưu nháp thành công' : 'Đã lưu và gửi duyệt thành công',
          severity: 'success', hide: 5000
        });
      } else {
        setSnackbar({
          open: true, severity: 'error', hide: 5000,
          message: 'Có lỗi xảy ra khi cập nhật tour mẫu. Vui lòng thử lại.'
        });
      }
    } catch (error) {
      console.error('Error updating template:', error);
      setSnackbar({
        open: true, severity: 'error', hide: 5000,
        message: 'Có lỗi xảy ra khi cập nhật tour mẫu. Vui lòng thử lại.'
      });
    } finally {
      setIsSubmitting(false);
    }

  };

  const handleDelete = async () => {
    setState(prev => ({ ...prev, isDeletePopupOpen: true }));
  };

  const handleDeleteConfirm = async (templateId) => {
    try {
      const response = await deleteTourTemplate(templateId);
      if (response.statusCode === 200) {
        setSnackbar({ open: true, message: 'Xóa tour mẫu thành công', severity: 'success', hide: 1000 });
      } else {
        setSnackbar({ open: true, message: 'Có lỗi xảy ra khi xóa tour mẫu', severity: 'error', hide: 5000 });
      }
    } catch (error) {
      console.error('Error deleting tour template:', error);
      if (error.response?.status === 400) {
        setSnackbar({ open: true, message: 'Không thể xóa tour mẫu này vì đã có tour được tạo từ mẫu', severity: 'error', hide: 5000 });
      } else {
        setSnackbar({ open: true, message: 'Có lỗi xảy ra khi xóa tour mẫu', severity: 'error', hide: 5000 });
      }
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
    if (snackbar.message === 'Xóa tour mẫu thành công') {
      navigate(-1);
    }
  };

  const handleCloseDeletePopup = () => {
    setState(prev => ({ ...prev, isDeletePopupOpen: false }));
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleHistoryClick = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };

  const handleSend = async () => {
    try {
      const template = state.tourTemplate;
      const requiredFields = {
        'Mã tour': template.code,
        'Tên tour': template.tourName,
        'Mô tả': template.description,
        'Thời gian': template.duration,
        'Loại tour': template.tourCategoryId,
        'Giá thấp nhất': template.minPrice,
        'Giá cao nhất': template.maxPrice,
        'Điểm khởi hành': template.startingProvince,
        'Phương tiện di chuyển': template.transportation,
        'Các tỉnh thành': template.provinces,
        'Lịch trình': template.schedule,
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value || (Array.isArray(value) && value.length === 0))
        .map(([key]) => key);

      const invalidSchedules = template.schedules?.filter(s =>
        !s.dayNumber || !s.title || !s.description || !s.attractionIds?.length
      ) || [];

      if (missingFields.length > 0 || invalidSchedules.length > 0) {
        let errorMessage = '';
        if (missingFields.length > 0) {
          errorMessage += `Vui lòng điền đầy đủ thông tin trước khi gửi`;
        }
        if (invalidSchedules.length > 0) {
          errorMessage += 'Vui lòng điền đầy đủ thông tin lịch trình cho các ngày';
        }
        setSnackbar({ open: true, message: errorMessage, severity: 'error', hide: 5000 });
        return;
      }

      await changeTourTemplateStatus(id, TourTemplateStatus.Pending, null);
      const updatedTourTemplate = await fetchTourTemplateById(id);
      setState(prev => ({
        ...prev,
        tourTemplate: updatedTourTemplate
      }));
      setSnackbar({ open: true, message: 'Gửi duyệt tour mẫu thành công', severity: 'success', hide: 5000 });
    } catch (error) {
      console.error('Error sending tour template for approval:', error);
      setSnackbar({ open: true, message: 'Có lỗi xảy ra khi gửi duyệt tour mẫu', severity: 'error', hide: 5000 });
    }
  };

  const ActionButtons = ({ status }) => {
    const showEditDelete = status === TourTemplateStatus.Draft || status === TourTemplateStatus.Rejected;
    const showDeleteOnly = status === TourTemplateStatus.Pending;

    if (!showEditDelete && !showDeleteOnly) return null;

    return (
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

        <Box
          sx={{
            position: 'absolute', top: '100%', right: 0, width: '400px', backgroundColor: 'white',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '4px',
            display: isHistoryOpen ? 'block' : 'none', zIndex: 1000, marginTop: '8px'
          }}
        >
          <VersionHistory />
        </Box>

        {showEditDelete && (
          <>
            {state.isEditing ? (
              <Button
                variant="contained" startIcon={<CancelIcon />} onClick={handleCancelClick}
                sx={{ backgroundColor: '#767676', '&:hover': { backgroundColor: '#575757' }, height: '45px' }}
              >
                Hủy sửa
              </Button>
            ) : (
              <>
                <Button
                  variant="contained" startIcon={<SendIcon />} onClick={handleSend}
                  sx={{ backgroundColor: '#3572EF', '&:hover': { backgroundColor: '#1C4ED8' }, height: '45px' }}
                >
                  Gửi duyệt
                </Button>
                <Button
                  variant="contained" startIcon={<EditIcon />} onClick={handleEdit}
                  sx={{ backgroundColor: '#767676', '&:hover': { backgroundColor: '#575757' }, height: '45px' }}
                >
                  Sửa
                </Button>
              </>
            )}
          </>
        )}
        <Button
          variant="contained" startIcon={<DeleteIcon />} onClick={handleDelete}
          sx={{ backgroundColor: '#DC2626', '&:hover': { backgroundColor: '#B91C1C' }, height: '45px' }}
        >
          Xóa
        </Button>
      </Box>
    );
  };

  const CancelConfirmationDialog = () => (
    <Dialog open={isCancelPopupOpen} onClose={handleCloseCancelPopup}>
      <DialogTitle sx={{ fontWeight: 600 }}> Xác nhận hủy </DialogTitle>
      <DialogContent>
        <Typography>Bạn có chắc chắn muốn hủy cập nhật? Các thay đổi sẽ không được lưu.</Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={handleCloseCancelPopup} sx={{ color: '#666666' }} > Không </Button>
        <Button
          onClick={handleCancelConfirm} variant="contained"
          sx={{ backgroundColor: '#DC2626', '&:hover': { backgroundColor: '#B91C1C' } }}
        >
          Có
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (state.loading || !state.tourTemplate) {
    return <Typography sx={{ width: '100vw', textAlign: 'center' }}>Loading...</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Helmet> <title>Chi tiết tour mẫu</title> </Helmet>
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
                  component={Link} to="/nhan-vien/tour-mau" variant="contained"
                  startIcon={<ArrowBackIosNewOutlinedIcon />}
                  sx={{ height: '55px', backgroundColor: 'transparent', boxShadow: 0, color: 'gray', ":hover": { backgroundColor: 'transparent', boxShadow: 0, color: 'black', fontWeight: 700 } }}>
                  Quay lại
                </Button>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'center', color: '#05073C', flexGrow: 1 }}>
                  Chi tiết tour mẫu
                </Typography>
                <ActionButtons status={state.tourTemplate.status} />
              </Box>

              {state.isEditing ? (
                <TourTemplateUpdateForm tourTemplate={state.tourTemplate} onSave={handleSave} onCancel={handleCancelClick} />
              ) : (
                <TourTemplateInfo
                  tours={tours} tourTemplate={state.tourTemplate}
                  expandedDay={state.expandedDay} handleDayClick={handleDayClick}
                />
              )}

              <TourTemplateDeletePopup
                open={state.isDeletePopupOpen} onClose={handleCloseDeletePopup}
                template={state.tourTemplate} onDelete={handleDeleteConfirm}
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

export default TourTemplateDetails;