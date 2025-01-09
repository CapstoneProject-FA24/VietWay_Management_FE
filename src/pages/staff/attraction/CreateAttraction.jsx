import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Snackbar, Alert, TextField, Button, IconButton, Select, MenuItem, FormControl, FormHelperText } from '@mui/material';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Helmet } from 'react-helmet';
import '@styles/AttractionDetails.css'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import { Link, useNavigate } from 'react-router-dom';
import { createAttraction, updateAttractionImages } from '@services/AttractionService';
import { fetchProvinces } from '@services/ProvinceService';
import { fetchAttractionType } from '@services/AttractionTypeService';
import SidebarStaff from '@layouts/SidebarStaff';
import TourMap from '@components/tour/TourMap';
import '@styles/ReactQuill.css';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { fetchPopularProvinces, fetchPopularAttractionCategories } from '@services/PopularService';

const AddAttraction = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, setSliderRef] = useState(null);
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);
  const [provinces, setProvinces] = useState([]);
  const [attractionTypes, setAttractionTypes] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [editableFields, setEditableFields] = useState({
    name: { value: '', isEditing: true }, contactInfo: { value: '', isEditing: true },
    description: { value: '', isEditing: true }, address: { value: '', isEditing: true },
    website: { value: '', isEditing: true }, type: { value: '', isEditing: true }, placeId: { value: '', isEditing: true }
  });
  const [snackbar, setSnackbar] = useState({
    open: false, message: '', severity: 'success', hide: 5000
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({});
  const [popularProvinces, setPopularProvinces] = useState([]);
  const [popularTypes, setPopularTypes] = useState([]);
  const [hotProvinces, setHotProvinces] = useState([]);
  const [hotCategories, setHotCategories] = useState([]);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchProvincesData = async () => {
      try {
        const fetchedProvinces = await fetchProvinces({ pageSize: 63, pageIndex: 1 });
        const fetchedAttractionType = await fetchAttractionType();
        setProvinces(fetchedProvinces.items);
        setAttractionTypes(fetchedAttractionType);
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };
    fetchProvincesData();
  }, []);

  useEffect(() => {
    const fetchPopularData = async () => {
      try {
        const popularProvData = await fetchPopularProvinces();
        setPopularProvinces(popularProvData);

        const popularTypesData = await fetchPopularAttractionCategories();
        setPopularTypes(popularTypesData);
      } catch (error) {
        console.error('Error fetching popular data:', error);
      }
    };
    fetchPopularData();
  }, []);

  const handleFieldChange = (field, value) => {
    setEditableFields(prev => ({ ...prev, [field]: { ...prev[field], value } }));
  };

  const settings = {
    dots: true, dotsClass: 'slick-dots custom-dots slider-dots',
    customPaging: i => (
      <div className="custom-dot"></div>
    ),
    infinite: true, speed: 500, slidesToShow: 1,
    slidesToScroll: 1, autoplay: true, className: 'attraction-slider',
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
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
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

  const handleProvinceChange = async (event) => {
    const newProvinceId = event.target.value;
    setSelectedProvince(newProvinceId);
    
    try {
      const hotCategoriesData = await fetchPopularAttractionCategories(newProvinceId);
      setHotCategories(hotCategoriesData);
    } catch (error) {
      console.error('Error fetching hot categories:', error);
    }
  };

  const handleSave = async (isDraft) => {
    try {
      const errors = {};

      if (isDraft) {
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
      } else {
        if (!editableFields.name.value) errors.name = 'Vui lòng nhập tên điểm tham quan';
        if (!editableFields.address.value) errors.address = 'Vui lòng nhập địa chỉ';
        if (!editableFields.description.value) errors.description = 'Vui lòng nhập mô tả';
        if (!selectedProvince) errors.provinceId = 'Vui lòng chọn Tỉnh/Thành phố';
        if (!editableFields.type.value) errors.attractionTypeId = 'Vui lòng chọn Loại điểm tham quan';
        if (images.length === 0) errors.images = 'Vui lòng thêm ít nhất một hình ảnh';
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
        name: editableFields.name.value || null,
        address: editableFields.address.value || null,
        description: editableFields.description.value || null,
        contactInfo: editableFields.contactInfo.value || null,
        website: editableFields.website.value || null,
        provinceId: selectedProvince || null,
        attractionTypeId: editableFields.type.value || null,
        isDraft: isDraft,
        googlePlaceId: editableFields.placeId.value || null
      };

      const response = await createAttraction(attractionData);
      if (response.statusCode === 200) {
        if (images.length > 0) {
          const imagesResponse = await updateAttractionImages(
            response.data,
            images.length > 0 ? images : null
          );
          if (imagesResponse.statusCode === 200) {
            setSnackbar({
              open: true,
              message: 'Tạo điểm tham quan thành công',
              severity: 'success',
              hide: 1500
            });
            setTimeout(() => {
              navigate('/nhan-vien/diem-tham-quan/chi-tiet/' + response.data);
            }, 1500);
          }
          else {
            console.error('Error uploading images:', imagesResponse);
            setSnackbar({
              open: true, severity: 'error',
              message: 'Đã xảy ra lỗi khi lưu ảnh. Vui lòng thử lại sau.',
            });
          }
        } else {
          setSnackbar({
            open: true,
            message: isDraft ? 'Lưu nháp điểm tham quan thành công' : 'Gửi duyệt điểm tham quan thành công',
            severity: 'success',
            hide: 1500
          });
          setTimeout(() => {
            navigate('/nhan-vien/diem-tham-quan/chi-tiet/' + response.data);
          }, 1500);
        }
      }
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

  const handleCategoryChange = async (categoryId, categoryType) => {
    try {
      const hotProvinceData = await fetchPopularProvinces(categoryId, categoryType);
      setHotProvinces(hotProvinceData);
    } catch (error) {
      console.error('Error fetching hot provinces:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <SidebarStaff isOpen={isSidebarOpen} toggleSidebar={handleSidebarToggle} />

      <Box sx={{
        flexGrow: 1, p: 3, transition: 'margin-left 0.3s',
        marginLeft: isSidebarOpen ? '260px' : '20px',
        width: `calc(100% - ${isSidebarOpen ? '260px' : '20px'})`,
        maxWidth: '100vw'
      }}>
        <Helmet>
          <title>Thêm điểm tham quan</title>
        </Helmet>

        <Box sx={{ p: 3, flexGrow: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            <Button
              startIcon={<ArrowBackIosNewOutlinedIcon />}
              onClick={() => navigate(-1)} sx={{ width: 'fit-content' }}
            >
              Quay lại
            </Button>

            <Typography
              variant="h4"
              sx={{
                fontSize: '2.7rem', fontWeight: 600, color: 'primary.main',
                alignSelf: 'center', alignItems: 'center', marginBottom: '1rem'
              }}
            >
              Tạo điểm tham quan
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
              <Typography gutterBottom sx={{ backgroundColor: 'white', pl: 1, pr: 1, ml: 2, mb: -1.5, zIndex: 1, width: 'fit-content' }}>
                Loại điểm tham quan *
              </Typography>
              <FormControl sx={{ width: '100%' }}>
                <Select
                  value={editableFields.type.value}
                  onChange={(e) => {
                    handleFieldChange('type', e.target.value);
                    handleCategoryChange(e.target.value, 0);
                  }}
                  variant="outlined" fullWidth sx={{ mr: 2 }}
                  error={!!fieldErrors.attractionTypeId}
                >
                  {attractionTypes.map((type) => (
                    <MenuItem key={type.attractionTypeId} value={type.attractionTypeId}>
                      {type.attractionTypeName}
                      {popularTypes.includes(type.attractionTypeId) && (
                        <LocalFireDepartmentIcon 
                          sx={{ 
                            ml: 1,
                            mb: -0.5,
                            color: '#FF0000'
                          }}
                          titleAccess="Loại điểm tham quan đang được quan tâm nhiều nhất"
                        />
                      )}
                      {hotCategories.includes(type.attractionTypeId) && (
                        <LocalFireDepartmentIcon 
                          sx={{ 
                            ml: 1,
                            mb: -0.5,
                            color: '#ff8f00'
                          }}
                          titleAccess="Loại điểm tham quan đang được quan tâm nhiều nhất tại tỉnh thành này"
                        />
                      )}
                    </MenuItem>
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
                  value={selectedProvince}
                  onChange={handleProvinceChange}
                  variant="outlined" fullWidth sx={{ mr: 2, mb: 2 }}
                  error={!!fieldErrors.provinceId}
                >
                  {provinces.map((province) => (
                    <MenuItem key={province.provinceId} value={province.provinceId}>
                      {province.provinceName}
                      {popularProvinces.includes(province.provinceId) && (
                        <LocalFireDepartmentIcon 
                          sx={{ 
                            ml: 1,
                            mb: -0.5,
                            color: '#FF0000'
                          }}
                          titleAccess="Tỉnh thành đang được quan tâm nhiều nhất"
                        />
                      )}
                      {hotProvinces.includes(province.provinceId) && (
                        <LocalFireDepartmentIcon 
                          sx={{ 
                            ml: 1,
                            mb: -0.5,
                            color: '#ff8f00'
                          }}
                          titleAccess="Tỉnh thành đang quan tâm đến loại điểm tham quan này nhiều nhất"
                        />
                      )}
                    </MenuItem>
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
                <Typography variant="h4" sx={{ mb: 2, fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C', fontSize: '27px' }}>Thông tin chi tiết *</Typography>
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

export default AddAttraction;