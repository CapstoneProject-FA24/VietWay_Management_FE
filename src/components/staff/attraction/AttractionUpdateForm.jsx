import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Snackbar, Alert, TextField, Button, IconButton, Select, MenuItem, FormControl, FormHelperText } from '@mui/material';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import TourMap from '@components/tour/TourMap';

const AttractionUpdateForm = ({ attraction, provinces, attractionTypes, onSave, currentSlide, setCurrentSlide, sliderRef, setSliderRef }) => {
  const [images, setImages] = useState([]);
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const fileInputRef = useRef(null);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [editableFields, setEditableFields] = useState({
    name: { value: '' }, contactInfo: { value: '' }, description: { value: '' },
    address: { value: '' }, website: { value: '' }, type: { value: '' }, placeId: { value: '' }
  });
  const [snackbar, setSnackbar] = useState({
    open: false, message: '', severity: 'success', hide: 5000
  });
  const [fieldErrors, setFieldErrors] = useState({});

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
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }], [{ 'font': [] }],
      [{ 'color': [] }], ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }], ['link', 'image'], ['clean']
    ],
    clipboard: {
      matchVisual: false
    }
  };

  const handleSave = async (isDraft) => {
    try {
      const errors = {};
      if (!isDraft) {
        if (!editableFields.name.value) errors.name = 'Vui lòng nhập tên điểm tham quan';
        if (!editableFields.address.value) errors.address = 'Vui lòng nhập địa chỉ';
        if (!editableFields.description.value) errors.description = 'Vui lòng nhập mô tả';
        if (!selectedProvince) errors.provinceId = 'Vui lòng chọn Tỉnh/Thành phố';
        if (!editableFields.type.value) errors.attractionTypeId = 'Vui lòng chọn Loại điểm tham quan';
        if (images.length === 0) errors.images = 'Vui lòng thêm ít nhất một hình ảnh';
      } else {
        const hasAnyField =
          editableFields.name.value ||
          editableFields.address.value ||
          editableFields.description.value ||
          editableFields.contactInfo.value ||
          editableFields.website.value ||
          selectedProvince ||
          editableFields.type.value ||
          editableFields.placeId.value ||
          images.length > 0;
        if (!hasAnyField) {
          setSnackbar({
            open: true, severity: 'error', hide: 5000,
            message: 'Vui lòng nhập ít nhất một thông tin để lưu nháp',
          });
          return;
        }
      }

      setFieldErrors(errors);

      if (Object.keys(errors).length > 0) {
        setSnackbar({
          open: true,
          message: isDraft ? 'Vui lòng điền các trường bắt buộc để lưu nháp' : 'Vui lòng điền đầy đủ thông tin trước khi gửi duyệt',
          severity: 'error'
        });
        return;
      }

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

      const newImages = images.filter(img => img instanceof File);
      onSave(attractionData, newImages, removedImageIds);
    } catch (error) {
      if (error.response && error.response.data.message === 'Incomplete attraction information') {
        setSnackbar({
          open: true, severity: 'error', hide: 5000,
          message: 'Vui lòng điền đầy đủ thông tin trước khi tạo mới.',
        });
      } else {
        setSnackbar({
          open: true, severity: 'error', hide: 5000,
          message: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
        });
      }
      console.error('Error creating attraction:', error);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSelectLocation = (placeData) => {
    handleFieldChange('placeId', placeData.place_id);
  };

  return (
    <Box sx={{ p: 3, flexGrow: 1, mt: 5 }}>
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
          <Typography gutterBottom sx={{ backgroundColor: 'white', pl: 1, pr: 1, ml: 2, mb: -1.5, zIndex: 1, width: 'fit-content' }}>
            Loại điểm tham quan *
          </Typography>
          <FormControl sx={{ width: '100%' }}>
            <Select
              value={editableFields.type.value}
              onChange={(e) => handleFieldChange('type', e.target.value)}
              variant="outlined" fullWidth sx={{ mr: 2 }} error={!!fieldErrors.attractionTypeId}
            >
              {attractionTypes.map((type) => (
                <MenuItem key={type.attractionTypeId} value={type.attractionTypeId}>{type.attractionTypeName}</MenuItem>
              ))}
            </Select>
            {fieldErrors.attractionTypeId && (
              <FormHelperText error>{fieldErrors.attractionTypeId}</FormHelperText>
            )}
          </FormControl>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
          <Typography gutterBottom sx={{ backgroundColor: 'white', pl: 1, pr: 1, ml: 2, mb: -1.5, zIndex: 1, width: 'fit-content' }}>
            Tỉnh/Thành phố *
          </Typography>
          <FormControl sx={{ width: '100%' }}>
            <Select
              value={selectedProvince} onChange={handleProvinceChange}
              variant="outlined" fullWidth sx={{ mr: 2, mb: 2 }}
              error={!!fieldErrors.provinceId}
            >
              {provinces.map((province) => (
                <MenuItem key={province.provinceId} value={province.provinceId}>{province.provinceName}</MenuItem>
              ))}
            </Select>
            {fieldErrors.provinceId && (
              <FormHelperText error sx={{ mt: -2 }}>{fieldErrors.provinceId}</FormHelperText>
            )}
          </FormControl>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography gutterBottom sx={{ backgroundColor: 'white', pl: 1, pr: 1, ml: 2, mb: -1.5, zIndex: 1, width: 'fit-content' }}>
          Tên điểm tham quan *
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TextField
            value={editableFields.name.value}
            onChange={(e) => handleFieldChange('name', e.target.value)}
            variant="outlined" fullWidth sx={{ mr: 2 }}
            error={!!fieldErrors.name} helperText={fieldErrors.name}
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8} sx={{ width: '100%' }}>
          <Paper elevation={3} sx={{ mb: 3, overflow: 'hidden', position: 'relative', maxWidth: '1000px' }}>
            <Box className="slick-slider-container" sx={{ height: '450px' }}>
              <Slider ref={setSliderRef} {...settings}>
                {images.length > 0 ? (
                  images.map((image, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                      <img
                        src={image instanceof File ? URL.createObjectURL(image) : image}
                        alt={`Attraction image ${index + 1}`}
                        style={{ width: '100%', height: '450px', objectFit: 'cover' }}
                      />
                    </div>
                  ))
                ) : (
                  <div>
                    <img
                      src="https://doc.cerp.ideria.co/assets/images/image-a5238aed7050a0691758858b2569566d.jpg"
                      alt="Default" style={{ width: '100%', height: '450px', objectFit: 'cover' }}
                    />
                  </div>
                )}
              </Slider>
            </Box>
          </Paper>
          <Box sx={{ display: 'flex', overflowX: 'auto', mb: 3, maxWidth: '100%' }}>
            {images.map((image, index) => (
              <Box
                key={index} onClick={() => handleThumbnailClick(index)}
                sx={{ maxWidth: 110, height: 110, flexShrink: 0, mr: 3, borderRadius: 1, overflow: 'hidden', cursor: 'pointer', border: currentSlide === index ? '2px solid #3572EF' : 'none', position: 'relative' }}
              >
                <img
                  src={image instanceof File ? URL.createObjectURL(image) : image}
                  alt={`Thumbnail ${index + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <IconButton
                  onClick={(e) => { e.stopPropagation(); handleRemoveImage(index); }}
                  sx={{
                    position: 'absolute', top: 2,
                    right: 2, padding: '4px', backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' }, color: 'white'
                  }}
                >
                  <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            ))}
            <Box
              sx={{
                width: 110, height: 110, flexShrink: 0, mr: 3, borderRadius: 1, overflow: 'hidden',
                cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', border: fieldErrors.images ? '2px dashed red' : '2px dashed #3572EF'
              }}
              onClick={handleAddImage}
            >
              <AddPhotoAlternateIcon sx={{ fontSize: 40, color: fieldErrors.images ? 'red' : '#3572EF' }} />
            </Box>
            <input
              type="file" ref={fileInputRef} style={{ display: 'none' }}
              onChange={handleFileChange} accept="image/*" multiple
            />
          </Box>
          {fieldErrors.images && (
            <Typography color="error" sx={{ marginTop: -2, fontSize: '0.8rem', mb: 3 }}>
              {fieldErrors.images}
            </Typography>
          )}
          <Box>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C', fontSize: '27px' }}>Giới thiệu *</Typography>
            <FormControl sx={{ width: '100%' }}>
              <ReactQuill
                value={editableFields.description.value} style={{ height: '250px' }}
                onChange={(value) => handleFieldChange('description', value)}
                theme="snow" modules={modules} className={fieldErrors.description ? "ql-error" : null}
              />
              {fieldErrors.description && (
                <FormHelperText error sx={{ mt: 6 }}>{fieldErrors.description}</FormHelperText>
              )}
            </FormControl>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 4, mb: 3, borderRadius: '10px' }}>
            <Typography variant="h4" sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'center', color: '#05073C', fontSize: '27px' }}>Thông tin liên hệ</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 700, minWidth: '4rem' }}>Địa chỉ * </Typography>
              <TextField
                value={editableFields.address.value}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                variant="outlined" fullWidth sx={{ mb: 2 }}
                error={!!fieldErrors.address} helperText={fieldErrors.address}
              />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 700, minWidth: '4rem' }}>Website </Typography>
              <TextField
                value={editableFields.website.value}
                onChange={(e) => handleFieldChange('website', e.target.value)}
                variant="outlined" fullWidth sx={{ mb: 2 }}
              />
            </Box>
            <Typography sx={{ fontWeight: 700, minWidth: '4rem' }}>Các thông tin liên hệ khác </Typography>
            <ReactQuill
              value={editableFields.contactInfo.value}
              onChange={(value) => handleFieldChange('contactInfo', value)}
              theme="snow" modules={modules} style={{ width: '100%' }}
            />
          </Paper>
        </Grid>
      </Grid>
      <Typography sx={{ fontWeight: 700, minWidth: '4rem', mt: 10 }}>Google ID (Tìm địa điểm từ bản đồ) </Typography>
      <TextField
        value={editableFields.placeId?.value || ''}
        onChange={(e) => handleFieldChange('placeId', e.target.value)}
        variant="outlined" fullWidth disabled
        sx={{ mb: 2, width: '35%', '& .MuiInputBase-root': { height: '40px' } }}
      />
      <Box sx={{
        height: '500px', width: '100%', position: 'relative', mb: 3,
        overflow: 'hidden', borderRadius: '10px', border: '1px solid #e0e0e0'
      }}>
        <TourMap
          onPlaceSelect={handleSelectLocation}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
        <Button variant="contained" onClick={() => handleSave(true)} sx={{ backgroundColor: 'grey', p: 1.5, mr: 2 }}> Lưu bản nháp </Button>
        <Button variant="contained" onClick={() => handleSave(false)} sx={{ p: 1.5 }}> Gửi duyệt </Button>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Box sx={{ mt: 1, width: '32rem' }}>
          <Typography sx={{ color: 'red' }}>- Nếu lưu nháp: Vui lòng nhập ít nhất 1 thông tin để lưu nháp.</Typography>
          <Typography sx={{ color: 'red' }}>- Nếu gửi duyệt: Vui lòng nhập các trường có dấu * và thêm hình ảnh.</Typography>
        </Box>
      </Box>
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