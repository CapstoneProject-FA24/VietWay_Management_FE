import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Snackbar, Alert, TextField, Button, IconButton, Select, MenuItem } from '@mui/material';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import Map from '@components/staff/attraction/Map';

const AttractionUpdateForm = ({ attraction, provinces, attractionTypes, onSave, currentSlide, setCurrentSlide, sliderRef, setSliderRef }) => {
  const [images, setImages] = useState([]);
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const fileInputRef = useRef(null);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [editableFields, setEditableFields] = useState({
    name: { value: '' },
    contactInfo: { value: '' },
    description: { value: '' },
    address: { value: '' },
    website: { value: '' },
    type: { value: '' },
    placeId: { value: '' }
  });
  const [snackbar, setSnackbar] = useState({
    open: false, message: '', severity: 'success', hide: 5000
  });

  useEffect(() => {
    if (attraction) {
      setSelectedProvince(attraction.provinceId);
      setImages(attraction.images || []);
      setEditableFields({
        name: { value: attraction.name },
        contactInfo: { value: attraction.contactInfo },
        description: { value: attraction.description },
        address: { value: attraction.address },
        website: { value: attraction.website },
        type: { value: attraction.attractionTypeId },
        placeId: { value: attraction.googlePlaceId || '' }
      });
    }
  }, [attraction]);

  const handleFieldChange = (field, value) => {
    setEditableFields(prev => ({
      ...prev,
      [field]: { value }
    }));
  };

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

  const handleAddImage = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setImages(prevImages => [...prevImages, ...files]);
  };

  const handleRemoveImage = (index) => {
    setImages(prevImages => {
      const newImages = [...prevImages];
      const removedImage = newImages[index];
      if (removedImage.imageId) {
        setRemovedImageIds(prev => [...prev, removedImage.imageId]);
      }
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleProvinceChange = (event) => {
    setSelectedProvince(event.target.value);
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'color': [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false
    }
  };

  const handleSave = async (isDraft) => {
    const attractionData = {
      id: attraction.attractionId,
      name: editableFields.name.value,
      address: editableFields.address.value,
      description: editableFields.description.value,
      contactInfo: editableFields.contactInfo.value,
      website: editableFields.website.value,
      provinceId: selectedProvince,
      attractionTypeId: editableFields.type.value,
      isDraft: isDraft,
      googlePlaceId: editableFields.placeId.value || null
    };

    if (!isDraft) {
      const requiredFields = ['name', 'address', 'description', 'contactInfo', 'provinceId', 'attractionTypeId'];
      const missingFields = requiredFields.filter(field => !attractionData[field]);
      if (missingFields.length > 0) {
        setSnackbar({
          open: true,
          message: 'Vui lòng điền đầy đủ thông tin trước khi cập nhật.',
          severity: 'error',
        });
        return;
      }
      if (images.length === 0) {
        setSnackbar({
          open: true,
          message: 'Vui lòng thêm ít nhất một hình ảnh cho điểm tham quan.',
          severity: 'error',
        });
        return;
      }
    } else {
      const requiredFields = ['provinceId', 'attractionTypeId'];
      const missingFields = requiredFields.filter(field => !attractionData[field]);
      if (missingFields.length > 0) {
        setSnackbar({
          open: true,
          message: 'Vui lòng điền thông tin "Tỉnh/Thành phố" và "Loại điểm tham quan" để lưu nháp.',
          severity: 'error',
        });
        return;
      }
    }

    const newImages = images.filter(img => img instanceof File);
    onSave(attractionData, newImages, removedImageIds);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ p: 3, flexGrow: 1, mt: 5 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '35%' }}>
        <Typography gutterBottom sx={{ backgroundColor: 'white', pl: 1, pr: 1, color: 'grey', ml: 2, mb: -1.5, zIndex: 1, width: 'fit-content' }}>
          Loại điểm tham quan
        </Typography>
        <Select
          value={editableFields.type.value}
          onChange={(e) => handleFieldChange('type', e.target.value)}
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
        >
          {attractionTypes.map((type) => (
            <MenuItem key={type.attractionTypeId} value={type.attractionTypeId}>{type.attractionTypeName}</MenuItem>
          ))}
        </Select>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography gutterBottom sx={{ backgroundColor: 'white', pl: 1, pr: 1, color: 'grey', ml: 2, mb: -1.5, zIndex: 1, width: 'fit-content' }}>
          Tên điểm tham quan
        </Typography>
        <TextField
          value={editableFields.name.value}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
        />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ mb: 3, overflow: 'hidden', position: 'relative', maxWidth: '1000px' }}>
            <Box className="slick-slider-container" sx={{ height: '450px' }}>
              <Slider ref={setSliderRef} {...settings}>
                {images.map((image, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <img
                      src={image instanceof File ? URL.createObjectURL(image) : image.url}
                      alt={`Attraction ${index + 1}`}
                      style={{ width: '100%', height: '450px', objectFit: 'cover' }}
                    />
                  </div>
                ))}
              </Slider>
            </Box>
          </Paper>

          <Box sx={{ display: 'flex', overflowX: 'auto', mb: 3 }}>
            {images.map((image, index) => (
              <Box
                key={index}
                sx={{
                  width: 110,
                  height: 110,
                  flexShrink: 0,
                  mr: 3,
                  borderRadius: 1,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: currentSlide === index ? '2px solid #3572EF' : 'none',
                  position: 'relative'
                }}
              >
                <Box
                  onClick={() => handleThumbnailClick(index)}
                  sx={{ width: '100%', height: '100%' }}
                >
                  <img
                    src={image instanceof File ? URL.createObjectURL(image) : image.url}
                    alt={`Thumbnail ${index + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
                <IconButton
                  onClick={() => handleRemoveImage(index)}
                  sx={{
                    position: 'absolute',
                    top: 2,
                    right: 2,
                    padding: '4px',
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' },
                    color: 'white'
                  }}
                >
                  <CloseIcon sx={{ fontSize: '1rem' }} />
                </IconButton>
              </Box>
            ))}
            <Box
              sx={{
                width: 110, height: 110, flexShrink: 0, mr: 3, borderRadius: 1, overflow: 'hidden',
                cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px dashed #3572EF'
              }}
              onClick={handleAddImage}
            >
              <AddPhotoAlternateIcon sx={{ fontSize: 40, color: '#3572EF' }} />
            </Box>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileChange}
              accept="image/*"
              multiple
            />
          </Box>

          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C', fontSize: '27px' }}>
              Giới thiệu
            </Typography>
            <ReactQuill
              value={editableFields.description.value}
              onChange={(value) => handleFieldChange('description', value)}
              theme="snow"
              modules={modules}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 4, mb: 3, borderRadius: '10px' }}>
            <Typography sx={{ fontWeight: 700, minWidth: '4rem' }}>Tỉnh/Thành phố: </Typography>
            <Select
              value={selectedProvince}
              onChange={handleProvinceChange}
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
            >
              {provinces.map((province) => (
                <MenuItem key={province.provinceId} value={province.provinceId}>{province.provinceName}</MenuItem>
              ))}
            </Select>

            <Typography sx={{ fontWeight: 700, minWidth: '4rem' }}>Địa chỉ: </Typography>
            <TextField
              value={editableFields.address.value}
              onChange={(e) => handleFieldChange('address', e.target.value)}
              variant="outlined"
              fullWidth
              sx={{ mb: 2 }}
            />

            <Typography sx={{ fontWeight: 700, minWidth: '4rem' }}>Website: </Typography>
            <TextField
              value={editableFields.website.value}
              onChange={(e) => handleFieldChange('website', e.target.value)}
              variant="outlined"
              fullWidth
              sx={{ mb: 3 }}
            />

            <Typography variant="h4" sx={{ mt: 4, mb: 2, fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C', fontSize: '27px' }}>
              Thông tin liên hệ
            </Typography>
            <ReactQuill
              value={editableFields.contactInfo.value}
              onChange={(value) => handleFieldChange('contactInfo', value)}
              theme="snow"
              modules={modules}
              style={{ width: '100%' }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={12}>
          <Typography sx={{ fontWeight: 700, minWidth: '4rem', mt: 5 }}>Google Place ID: </Typography>
          <TextField
            value={editableFields.placeId.value}
            onChange={(e) => handleFieldChange('placeId', e.target.value)}
            variant="outlined"
            fullWidth
            sx={{ mb: 2, width: '35%', '& .MuiInputBase-root': { height: '40px' } }}
            placeholder="Nhập Place ID từ Google Places"
          />
          <Box sx={{
            height: '500px',
            width: '100%',
            position: 'relative',
            mb: 3,
            overflow: 'hidden',
            borderRadius: '10px',
            border: '1px solid #e0e0e0'
          }}>
            <Map />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
            <Button variant="contained" onClick={() => handleSave(true)} sx={{ backgroundColor: 'grey', p: 1.5, mr: 2 }}>
              Lưu bản nháp
            </Button>
            <Button variant="contained" onClick={() => handleSave(false)} sx={{ p: 1.5 }}>
              Cập nhật
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={snackbar.hide}
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

export default AttractionUpdateForm;