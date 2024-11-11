import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Helmet } from 'react-helmet';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { fetchAttractionById, updateAttraction, updateAttractionImages } from '@services/AttractionService';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AttractionInfo from '@components/staff/attraction/AttractionInfo';
import AttractionUpdateForm from '@components/staff/attraction/AttractionUpdateForm';
import { fetchProvinces } from '@services/ProvinceService';
import { fetchAttractionType } from '@services/AttractionTypeService';
import SidebarStaff from '@layouts/SidebarStaff';
import { AttractionStatus } from '@hooks/Statuses';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedProvinces, fetchedAttractionType, fetchedAttraction] = await Promise.all([
          fetchProvinces(),
          fetchAttractionType(),
          fetchAttractionById(id)
        ]);
        setProvinces(fetchedProvinces);
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
    }
  };

  const handleDelete = async () => {
    /* if (window.confirm('Bạn có chắc chắn muốn xóa điểm tham quan này?')) {
      try {
        const response = await deleteAttraction(id);
        if (response.status === 200) {
          navigate('/nhan-vien/diem-tham-quan');
        } else {
          alert('Có lỗi xảy ra khi xóa điểm tham quan. Vui lòng thử lại.');
        }
      } catch (error) {
        console.error('Error deleting attraction:', error);
        alert('Có lỗi xảy ra khi xóa điểm tham quan. Vui lòng thử lại.');
      }
    } */
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  if (!attraction) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
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
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained" startIcon={<EditIcon />} onClick={handleEdit}
                    sx={{ backgroundColor: '#3572EF', '&:hover': { backgroundColor: '#1C4ED8' }, height: '45px' }}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="contained" startIcon={<DeleteIcon />} onClick={handleDelete}
                    sx={{ backgroundColor: '#DC2626', '&:hover': { backgroundColor: '#B91C1C' }, height: '45px' }}
                  >
                    Xóa
                  </Button>
                </Box>
                )}
                {attraction.status === AttractionStatus.Pending && (
                <Box sx={{ display: 'flex', gap: 2 }}>
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
    </Box>
  );
};

export default AttractionDetail;
