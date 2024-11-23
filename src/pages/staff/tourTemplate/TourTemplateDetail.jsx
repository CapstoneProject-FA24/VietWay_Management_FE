import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Cancel as CancelIcon } from '@mui/icons-material';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { fetchTourTemplateById, updateTourTemplate } from '@services/TourTemplateService';
import TourTemplateInfo from '@components/staff/tourTemplate/TourTemplateInfo';
import TourTemplateUpdateForm from '@components/staff/tourTemplate/TourTemplateUpdateForm';
import { TourTemplateStatus } from '@hooks/Statuses';
import TourTemplateDeletePopup from '@components/tourTemplate/TourTemplateDeletePopup';
import { Helmet } from 'react-helmet';
import SidebarStaff from '@layouts/SidebarStaff';

const TourTemplateDetails = () => {
  const [state, setState] = useState({
    tourTemplate: null,
    loading: true,
    isEditing: false,
    expandedDay: null,
    isDeletePopupOpen: false
  });

  const { id } = useParams();
  const navigate = useNavigate();
  const pageTopRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCancelPopupOpen, setIsCancelPopupOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedTourTemplate = await fetchTourTemplateById(id);
        setState(prev => ({
          ...prev,
          tourTemplate: fetchedTourTemplate,
          loading: false
        }));
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

  const handleSave = async (updatedData) => {
    try {
      await updateTourTemplate(updatedData);
      const updatedTourTemplate = await fetchTourTemplateById(id);
      setState(prev => ({
        ...prev,
        tourTemplate: updatedTourTemplate,
        isEditing: false
      }));
    } catch (error) {
      console.error('Error updating tour template:', error);
    }
  };

  const handleDelete = async () => {
    setState(prev => ({ ...prev, isDeletePopupOpen: true }));
  };

  const handleDeleteConfirm = async (templateId) => {
    /* try {
      await deleteTourTemplate(templateId);
      navigate('/nhan-vien/tour-mau');
    } catch (error) {
      console.error('Error deleting tour template:', error);
    } */
  };

  const handleCloseDeletePopup = () => {
    setState(prev => ({ ...prev, isDeletePopupOpen: false }));
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const ActionButtons = ({ status }) => {
    const showEditDelete = status === TourTemplateStatus.Draft || status === TourTemplateStatus.Rejected;
    const showDeleteOnly = status === TourTemplateStatus.Pending;

    if (!showEditDelete && !showDeleteOnly) return null;

    return (
      <Box sx={{ display: 'flex', gap: 2, height: '100%' , minHeight: '100vh' }}>
        <Helmet>
          <title>Chi tiết tour mẫu</title>
        </Helmet>
        {showEditDelete && (
          <>
            {state.isEditing ? (
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
                onClick={handleEdit}
                sx={{ backgroundColor: '#3572EF', '&:hover': { backgroundColor: '#1C4ED8' }, height: '45px' }}
              >
                Sửa
              </Button>
            )}
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
    );
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

  if (state.loading || !state.tourTemplate) {
    return <Typography sx={{ width: '100vw', textAlign: 'center' }}>Loading...</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Helmet>
        <title>Chi tiết tour mẫu</title>
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
                  to="/nhan-vien/tour-mau"
                  variant="contained"
                  startIcon={<ArrowBackIosNewOutlinedIcon />}
                  sx={{ height: '55px', backgroundColor: 'transparent', boxShadow: 0, color: 'gray', ":hover": { backgroundColor: 'transparent', boxShadow: 0, color: 'black', fontWeight: 700 } }}>
                  Quay lại
                </Button>
                <Typography variant="h4" gutterBottom sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'center', color: '#05073C', flexGrow: 1, ml: -15 }}>
                  Chi tiết tour mẫu
                </Typography>
                <ActionButtons status={state.tourTemplate.status} />
              </Box>

              {state.isEditing ? (
                <TourTemplateUpdateForm
                  tourTemplate={state.tourTemplate}
                  onSave={handleSave}
                  onCancel={handleCancelClick}
                />
              ) : (
                <TourTemplateInfo
                  tourTemplate={state.tourTemplate}
                  expandedDay={state.expandedDay}
                  handleDayClick={handleDayClick}
                />
              )}

              <TourTemplateDeletePopup
                open={state.isDeletePopupOpen}
                onClose={handleCloseDeletePopup}
                template={state.tourTemplate}
                onDelete={handleDeleteConfirm}
              />
            </Box>
          </Box>
        </Box>
      </Box>
      <CancelConfirmationDialog />
    </Box>
  );
};

export default TourTemplateDetails;