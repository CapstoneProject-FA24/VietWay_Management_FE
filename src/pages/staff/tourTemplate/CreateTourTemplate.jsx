import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Grid, Paper, TextField, Button, Collapse, IconButton, Select, MenuItem, Snackbar, Alert, FormControl, FormHelperText } from '@mui/material';
import { Helmet } from 'react-helmet';
import '@styles/AttractionDetails.css'
import { Link, useNavigate } from 'react-router-dom';
import ReactSelect from 'react-select';
import { ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { createTourTemplate, updateTemplateImages } from '@services/TourTemplateService';
import TemplateAddAttractionPopup from '@components/staff/tourTemplate/TemplateAddAttractionPopup';
import { fetchProvinces } from '@services/ProvinceService';
import { fetchTourDuration } from '@services/DurationService';
import { fetchTourCategory } from '@services/TourCategoryService';
import SidebarStaff from '@layouts/SidebarStaff';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '@styles/ReactQuill.css';
import CloseIcon from '@mui/icons-material/Close';

const quillModules = {
  toolbar: [
    [{ 'font': [] }], [{ 'size': ['small', false, 'large', 'huge'] }], ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }], [{ 'script': 'sub' }, { 'script': 'super' }], [{ 'align': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }], [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'direction': 'rtl' }], ['blockquote', 'code-block'], ['link', 'image', 'video', 'formula'], ['clean']
  ]
};

const CreateTourTemplate = () => {
  const [provinces, setProvinces] = useState([]);
  const navigate = useNavigate();
  const [tourTemplate, setTourTemplate] = useState({
    tourName: '', provinces: [], duration: '', departurePoint: '', tourCategory: '',
    description: '', note: '', imageUrls: Array(4).fill(null),
    schedule: [{ dayNumber: 1, title: '', description: '', attractions: [], isEditing: true }], code: '',
    minPrice: '', maxPrice: '', startingProvinceId: '', transportation: ''
  });
  const [tourCategories, setTourCategories] = useState([]);
  const [tourDurations, setTourDurations] = useState([]);
  const [expandedDay, setExpandedDay] = useState(1);
  const [isAttractionPopupOpen, setIsAttractionPopupOpen] = useState(false);
  const [currentEditingDay, setCurrentEditingDay] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [priceErrors, setPriceErrors] = useState({ minPrice: '', maxPrice: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const handleSidebarToggle = () => { setIsSidebarOpen(!isSidebarOpen); };
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success', hide: 5000 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedProvinces = await fetchProvinces({ pageSize: 63, pageIndex: 1 });
        const duration = await fetchTourDuration();
        const categories = await fetchTourCategory();
        setProvinces(fetchedProvinces.items);
        setTourDurations(duration);
        setTourCategories(categories);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const roundToThousand = (price) => {
    if (!price || isNaN(price)) return '';
    return Math.ceil(parseFloat(price) / 1000) * 1000;
  };

  useEffect(() => {
    if (tourTemplate.duration) {
      const selectedDuration = tourDurations.find(d => d.durationId === tourTemplate.duration);
      if (selectedDuration) {
        const numberOfDays = selectedDuration.dayNumber;
        const newSchedule = Array.from({ length: numberOfDays }, (_, index) => {
          const existingDay = tourTemplate.schedule.find(s => s.dayNumber === (index + 1));
          if (existingDay) { return existingDay; }
          return { dayNumber: index + 1, title: '', description: '', attractions: [], isEditing: true };
        });
        setTourTemplate(prev => ({ ...prev, schedule: newSchedule }));
      }
    }
  }, [tourTemplate.duration, tourDurations]);

  const handleFieldChange = (field, value) => {
    setTourTemplate(prev => ({ ...prev, [field]: value }));

    setFieldErrors(prev => ({ ...prev, [field]: undefined }));

    if (field === 'duration') {
      const selectedDuration = tourDurations.find(d => d.durationId === value);
      if (selectedDuration) {
        const numberOfDays = selectedDuration.dayNumber;
        const newSchedule = Array.from({ length: numberOfDays }, (_, index) => {
          const existingDay = tourTemplate.schedule.find(s => s.dayNumber === (index + 1));
          if (existingDay) { return existingDay; }
          return { dayNumber: index + 1, title: '', description: '', attractions: [], isEditing: true };
        });
        setTourTemplate(prev => ({ ...prev, schedule: newSchedule }));
      }
    }
  };

  const handlePriceBlur = (field) => {
    const value = tourTemplate[field];
    if (!isNaN(value) && value !== '') {
      const roundedValue = roundToThousand(value).toString();
      handleFieldChange(field, roundedValue);
    }
  };

  const handleImageUpload = (index, event) => {
    const file = event.target.files[0];
    if (file) { setTourTemplate(prev => ({ ...prev, imageUrls: prev.imageUrls.map((img, i) => i === index ? file : img) })); }
  };

  const handleImageRemove = (index) => {
    setTourTemplate(prev => ({ ...prev, imageUrls: prev.imageUrls.map((img, i) => i === index ? null : img) }));
  };

  const handleDayClick = (day) => { setExpandedDay(expandedDay === day ? null : day); };

  const handleScheduleChange = (day, field, value) => {
    setTourTemplate(prev => ({
      ...prev, schedule: prev.schedule.map(item => item.dayNumber === day ? { ...item, [field]: value } : item)
    }));
  };

  const handleAttractionChange = (day) => {
    setCurrentEditingDay(day);
    setIsAttractionPopupOpen(true);
  };

  const handleAttractionSelect = (selectedAttraction) => {
    setTourTemplate(prev => ({
      ...prev, schedule: prev.schedule.map(item => item.dayNumber === currentEditingDay ? {
        ...item, attractions: [...item.attractions, selectedAttraction]
      } : item)
    }));
    console.log(tourTemplate);
    setIsAttractionPopupOpen(false);
  };

  const validatePrice = (minPrice, maxPrice) => {
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    let isValid = true;
    const newErrors = { minPrice: '', maxPrice: '' };

    if (min < 0) {
      newErrors.minPrice = 'Giá thấp nhất phải lớn hơn 0';
      isValid = false;
    }
    if (max < 0) {
      newErrors.maxPrice = 'Giá cao nhất phải lớn hơn 0';
      isValid = false;
    }
    if (max && min && max <= min) {
      newErrors.maxPrice = 'Giá cao nhất phải lớn hơn giá thấp nhất';
      isValid = false;
    }
    setPriceErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (isDraft) => {
    try {
      if (!validatePrice(tourTemplate.minPrice || null, tourTemplate.maxPrice || null)) {
        return;
      }
      const tourTemplateData = {
        code: tourTemplate.code || null,
        tourName: tourTemplate.tourName || null,
        description: tourTemplate.description || '',
        durationId: tourTemplate.duration || null,
        tourCategoryId: tourTemplate.tourCategory || null,
        transportation: tourTemplate.transportation || null,
        note: tourTemplate.note || null,
        provinceIds: tourTemplate.provinces?.map(province => province.value) || [],
        startingProvinceId: tourTemplate.startingProvinceId || null,
        schedules: tourTemplate.schedule?.map(s => ({
          dayNumber: s.dayNumber,
          title: s.title || '',
          description: s.description || '',
          attractionIds: s.attractions?.map(attr => attr.attractionId) || []
        })) || [],
        isDraft: isDraft,
        minPrice: roundToThousand(parseFloat(tourTemplate.minPrice || '0')) || null,
        maxPrice: roundToThousand(parseFloat(tourTemplate.maxPrice || '0')) || null,
        imageUrls: tourTemplate.imageUrls.filter(img => img instanceof File) || []
      };
      console.log(tourTemplateData);
      if (!isDraft) {
        const errors = {};
        if (!tourTemplateData.provinceIds || tourTemplateData.provinceIds.length === 0) {
          errors.provinces = 'Vui lòng chọn ít nhất một tỉnh thành';
        }
        if (!tourTemplateData.schedules || tourTemplateData.schedules.length === 0) {
          errors.schedules = 'Vui lòng thêm ít nhất một lịch trình';
        }
        const invalidSchedules = tourTemplateData.schedules.filter(s =>
          !s.title || !s.description || !s.attractionIds || s.attractionIds.length === 0
        );
        if (invalidSchedules.length > 0) {
          errors.scheduleDetails = 'Vui lòng điền đầy đủ thông tin cho tất cả các ngày trong lịch trình (tiêu đề, mô tả và điểm tham quan)';
        }
        if (!tourTemplateData.imageUrls || tourTemplateData.imageUrls.length < 4) {
          errors.imageUrls = 'Vui lòng thêm đủ 4 ảnh';
        }
        if (!tourTemplateData.durationId) {
          errors.duration = 'Vui lòng chọn thời lượng';
        }
        if (!tourTemplateData.tourCategoryId) {
          errors.tourCategory = 'Vui lòng chọn loại tour';
        }
        const requiredFields = {
          tourName: 'tên tour', code: 'mã tour', description: 'mô tả', transportation: 'phương tiện',
          startingProvinceId: 'điểm khởi hành', minPrice: 'giá thấp nhất', maxPrice: 'giá cao nhất'
        };
        Object.entries(requiredFields).forEach(([key, label]) => {
          if (!tourTemplateData[key]) {
            errors[key] = `Vui lòng nhập ${label}`;
          }
        });
        if (Object.keys(errors).length > 0) {
          setFieldErrors(errors);
          return;
        }
      } else {
        const hasAnyField =
          tourTemplate.code ||
          tourTemplate.tourName ||
          tourTemplate.description ||
          tourTemplate.duration ||
          tourTemplate.tourCategory ||
          tourTemplate.transportation ||
          tourTemplate.note ||
          (tourTemplate.provinces && tourTemplate.provinces.length > 0) ||
          tourTemplate.startingProvinceId ||
          tourTemplate.minPrice ||
          tourTemplate.maxPrice ||
          (tourTemplate.imageUrls && tourTemplate.imageUrls.length > 0);
        const invalidSchedules = tourTemplateData.schedules.filter(s =>
          !s.title && !s.description && !s.attractionIds && s.attractionIds.length === 0
        );
        console.log(invalidSchedules);
        if (!hasAnyField || invalidSchedules.length > 0) {
          setSnackbar({
            open: true, severity: 'error', hide: 5000,
            message: 'Vui lòng nhập ít nhất một thông tin để lưu nháp',
          });
          return;
        }
      }

      const response = await createTourTemplate(tourTemplateData);

      if (response.statusCode === 200) {
        const tourTemplateId = response.data;
        const imagesToUpload = tourTemplate.imageUrls.filter(img => img instanceof File);
        if (imagesToUpload.length > 0) {
          const imagesResponse = await updateTemplateImages(tourTemplateId, imagesToUpload);
          if (imagesResponse.statusCode !== 200) {
            console.error('Error uploading images:', imagesResponse);
          }
        }
        setSnackbar({
          open: true, severity: 'success', hide: 1000,
          message: isDraft ? 'Đã lưu bản nháp thành công.' : 'Đã tạo và gửi tour mẫu thành công.',
        });
        setTimeout(() => {
          navigate('/nhan-vien/tour-mau');
        }, 1000);
      } else {
        console.error('Error creating tour template:', response);
        setSnackbar({
          open: true, severity: 'error',
          message: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
        });
      }
    } catch (error) {
      console.error('Error creating tour template:', error);
      setSnackbar({
        open: true, severity: 'error',
        message: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
      });
    }
  };

  const handleRemoveAttraction = (dayNumber, attractionId) => {
    setTourTemplate(prev => ({
      ...prev,
      schedule: prev.schedule.map(item =>
        item.dayNumber === dayNumber
          ? { ...item, attractions: item.attractions.filter(a => a.attractionId !== attractionId) }
          : item
      )
    }));
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '100vh' }}>
      <Helmet><title>Tạo tour mẫu mới</title></Helmet>
      <Box sx={{ display: 'flex' }}>
        <SidebarStaff isOpen={isSidebarOpen} toggleSidebar={handleSidebarToggle} />
        <Box sx={{
          flexGrow: 1, p: 5, transition: 'margin-left 0.3s', marginLeft: isSidebarOpen ? '260px' : '30px',
          width: `calc(100% - ${isSidebarOpen ? '260px' : '30px'})`, maxWidth: '95vw'
        }}>
          <Box maxWidth="95vw">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ width: 'fit-content' }}>Quay lại</Button>
              <Typography variant="h4" sx={{ fontSize: '2.7rem', fontWeight: 600, color: 'primary.main', alignSelf: 'center', marginBottom: '1rem' }} >
                Tạo tour mẫu mới
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
                <Typography gutterBottom>Tour đi qua tỉnh/thành phố *</Typography>
                <ReactSelect
                  isMulti name="provinces" onChange={(selectedOptions) => handleFieldChange('provinces', selectedOptions)}
                  options={provinces.map(province => ({ value: province.provinceId, label: province.provinceName }))}
                  className="basic-multi-select" classNamePrefix="select" value={tourTemplate.provinces} placeholder=''
                  styles={{
                    control: (base) => ({ ...base, borderColor: fieldErrors.provinces ? 'red' : base.borderColor, height: '55px' })
                  }}
                />
                {fieldErrors.provinces && (
                  <Typography color="error" variant="caption"> {fieldErrors.provinces} </Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
                <Typography gutterBottom>Tour bắt đầu từ *</Typography>
                <Select
                  value={tourTemplate.startingProvinceId} onChange={(e) => handleFieldChange('startingProvinceId', e.target.value)}
                  error={!!fieldErrors.startingProvinceId} variant="outlined" fullWidth
                >
                  {provinces.map((province) => (
                    <MenuItem key={province.provinceId} value={province.provinceId}>{province.provinceName}</MenuItem>
                  ))}
                </Select>
                {fieldErrors.startingProvinceId && (
                  <Typography color="error" variant="caption">{fieldErrors.startingProvinceId}</Typography>
                )}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2, mb: 3 }}>
              <Typography gutterBottom> Tên tour *</Typography>
              <TextField
                value={tourTemplate.tourName}
                onChange={(e) => handleFieldChange('tourName', e.target.value)}
                variant="outlined" fullWidth error={!!fieldErrors.tourName} helperText={fieldErrors.tourName}
              />
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} sx={{ minWidth: '100%' }}>
                <Box sx={{ display: 'flex', minWidth: '100%', height: '450px', mb: 3 }}>
                  <Box sx={{ flex: '0 0 59.5%', mr: '1%', position: 'relative' }}>
                    {tourTemplate.imageUrls[0] ? (
                      <>
                        <img src={tourTemplate.imageUrls[0] instanceof File ? URL.createObjectURL(tourTemplate.imageUrls[0]) : tourTemplate.imageUrls[0]} alt="Tour image 1" style={{ width: '100%', height: '450px', objectFit: 'cover' }} />
                        <IconButton onClick={() => handleImageRemove(0)}
                          sx={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(255, 255, 255, 0.7)', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' } }}>
                          <CloseIcon />
                        </IconButton>
                      </>
                    ) : (
                      <Button
                        component="label" variant="outlined"
                        sx={{
                          width: '100%', height: '100%', color: fieldErrors.imageUrls ? 'red' : '#3572EF',
                          border: fieldErrors.imageUrls ? '2px dashed red' : '2px dashed #3572EF'
                        }}>
                        Thêm ảnh
                        <input type="file" hidden onChange={(e) => handleImageUpload(0, e)} />
                      </Button>
                    )}
                  </Box>
                  <Box sx={{ flex: '0 0 39.5%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ flex: '0 0 50%', mb: 1.2, position: 'relative' }}>
                      {tourTemplate.imageUrls[1] ? (
                        <>
                          <img src={tourTemplate.imageUrls[1] instanceof File ? URL.createObjectURL(tourTemplate.imageUrls[1]) : tourTemplate.imageUrls[1]} alt="Tour image 2" style={{ width: '100%', height: '215px', objectFit: 'cover' }} />
                          <IconButton onClick={() => handleImageRemove(1)}
                            sx={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(255, 255, 255, 0.7)', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' } }}>
                            <CloseIcon />
                          </IconButton>
                        </>
                      ) : (
                        <Button
                          component="label" variant="outlined"
                          sx={{
                            width: '100%', height: '100%', color: fieldErrors.imageUrls ? 'red' : '#3572EF',
                            border: fieldErrors.imageUrls ? '2px dashed red' : '2px dashed #3572EF'
                          }}>
                          Thêm ảnh
                          <input type="file" hidden onChange={(e) => handleImageUpload(1, e)} />
                        </Button>
                      )}
                    </Box>
                    <Box sx={{ flex: '0 0 50%', display: 'flex' }}>
                      <Box sx={{ flex: '0 0 48.5%', mr: '3%', position: 'relative' }}>
                        {tourTemplate.imageUrls[2] ? (
                          <>
                            <img src={tourTemplate.imageUrls[2] instanceof File ? URL.createObjectURL(tourTemplate.imageUrls[2]) : tourTemplate.imageUrls[2]} alt="Tour image 3" style={{ width: '100%', height: '215px', objectFit: 'cover' }} />
                            <IconButton onClick={() => handleImageRemove(2)}
                              sx={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(255, 255, 255, 0.7)', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' } }}>
                              <CloseIcon />
                            </IconButton>
                          </>
                        ) : (
                          <Button
                            component="label" variant="outlined"
                            sx={{
                              width: '100%', height: '96%', color: fieldErrors.imageUrls ? 'red' : '#3572EF',
                              border: fieldErrors.imageUrls ? '2px dashed red' : '2px dashed #3572EF'
                            }}>
                            Thêm ảnh
                            <input type="file" hidden onChange={(e) => handleImageUpload(2, e)} />
                          </Button>
                        )}
                      </Box>
                      <Box sx={{ flex: '0 0 48.5%', position: 'relative' }}>
                        {tourTemplate.imageUrls[3] ? (
                          <>
                            <img src={tourTemplate.imageUrls[3] instanceof File ? URL.createObjectURL(tourTemplate.imageUrls[3]) : tourTemplate.imageUrls[3]} alt="Tour image 4" style={{ width: '100%', height: '215px', objectFit: 'cover' }} />
                            <IconButton onClick={() => handleImageRemove(3)}
                              sx={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(255, 255, 255, 0.7)', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' } }}>
                              <CloseIcon />
                            </IconButton>
                          </>
                        ) : (
                          <Button
                            component="label" variant="outlined"
                            sx={{
                              width: '100%', height: '96%', color: fieldErrors.imageUrls ? 'red' : '#3572EF',
                              border: fieldErrors.imageUrls ? '2px dashed red' : '2px dashed #3572EF'
                            }}>
                            Thêm ảnh
                            <input type="file" hidden onChange={(e) => handleImageUpload(3, e)} />
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 4, width: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '30%' }}>
                    <FormControl sx={{ width: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography sx={{ color: '#05073C', fontWeight: 600, minWidth: 'fit-content', mr: 1 }}>Thời lượng *</Typography>
                        <Select
                          labelId="duration-select-label"
                          id="duration-select" sx={{ width: '100%' }}
                          value={tourTemplate.duration}
                          onChange={(e) => handleFieldChange('duration', e.target.value)}
                          error={!!fieldErrors.duration}
                        >
                          {tourDurations.map((tourDuration) => (
                            <MenuItem key={tourDuration.durationId} value={tourDuration.durationId}>
                              {tourDuration.durationName}
                            </MenuItem>
                          ))}
                        </Select>
                      </Box>
                      {fieldErrors.duration && (
                        <FormHelperText error sx={{ textAlign: 'right' }}>{fieldErrors.duration}</FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '35%' }}>
                    <FormControl sx={{ width: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography sx={{ color: '#05073C', fontWeight: 600, minWidth: 'fit-content', mr: 1 }}>Loại tour *</Typography>
                        <Select
                          labelId="tourCategory-select-label"
                          id="tourCategory-select" sx={{ width: '100%' }}
                          value={tourTemplate.tourCategory}
                          onChange={(e) => handleFieldChange('tourCategory', e.target.value)}
                          error={!!fieldErrors.tourCategory}
                        >
                          {tourCategories.map((tourCategory) => (
                            <MenuItem key={tourCategory.tourCategoryId} value={tourCategory.tourCategoryId}>
                              {tourCategory.tourCategoryName}
                            </MenuItem>
                          ))}
                        </Select>
                      </Box>
                      {fieldErrors.tourCategory && (
                        <FormHelperText error sx={{ textAlign: 'right' }}>{fieldErrors.tourCategory}</FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '30%' }}>
                    <FormControl sx={{ width: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Typography sx={{ color: '#05073C', fontWeight: 600, minWidth: 'fit-content', mr: 1 }}>Phương tiện *</Typography>
                        <Select
                          labelId="transportation-select-label"
                          id="transportation-select"
                          value={tourTemplate.transportation}
                          onChange={(e) => handleFieldChange('transportation', e.target.value)}
                          error={!!fieldErrors.transportation} sx={{ width: '100%' }}
                        >
                          <MenuItem value="Xe du lịch">Xe du lịch</MenuItem>
                          <MenuItem value="Máy bay">Máy bay</MenuItem>
                          <MenuItem value="Tàu hỏa">Tàu hỏa</MenuItem>
                        </Select>
                      </Box>
                      {fieldErrors.transportation && (
                        <FormHelperText error sx={{ textAlign: 'right' }}>{fieldErrors.transportation}</FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                </Box>
                <Box sx={{ mb: 5 }}>
                  <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C' }}>Tổng quan</Typography>
                  <FormControl sx={{ width: '100%' }}>
                    <ReactQuill
                      value={tourTemplate.description} onChange={(value) => handleFieldChange('description', value)}
                      theme="snow" className={fieldErrors.description ? "ql-error" : null}
                      style={{ height: '200px', marginBottom: '100px' }} modules={quillModules}
                    />
                    {fieldErrors.description && (
                      <FormHelperText error sx={{ mt: -3 }}>{fieldErrors.description}</FormHelperText>
                    )}
                  </FormControl>
                </Box>
                <Box sx={{ mb: 5 }}>
                  <Typography variant="h5" gutterBottom
                    sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C' }}>
                    Lịch trình
                  </Typography>
                  {fieldErrors.scheduleDetails && (
                    <Typography color="error" variant="caption" sx={{ ml: 1 }}>
                      {fieldErrors.scheduleDetails}
                    </Typography>
                  )}
                  {tourTemplate.schedule.map((s, index) => (
                    <Box key={s.dayNumber} sx={{ pl: 6, position: 'relative', mb: 3, mt: 3 }}>
                      {(index === 0 || index === tourTemplate.schedule.length - 1) && (
                        <Box sx={{
                          position: 'absolute', left: 0, top: '18px', width: '24px', height: '24px',
                          borderRadius: '50%', border: fieldErrors.scheduleDetails ? '2px solid red' : '2px solid #3572EF', backgroundColor: 'white',
                          transform: 'translateY(-50%)', zIndex: 1
                        }} />
                      )}
                      {(index !== 0 && index !== tourTemplate.schedule.length - 1) && (
                        <Box sx={{
                          position: 'absolute', left: '4px', top: '17px', width: '15px', height: '15px',
                          borderRadius: '50%', backgroundColor: fieldErrors.scheduleDetails ? 'red' : '#3572EF', transform: 'translateY(-50%)', zIndex: 1
                        }} />
                      )}
                      {index !== tourTemplate.schedule.length - 1 && (
                        <Box sx={{
                          position: 'absolute', left: 10.5, top: '24px', bottom: -35,
                          width: '2px', backgroundColor: fieldErrors.scheduleDetails ? 'red' : '#3572EF', zIndex: 0
                        }} />
                      )}
                      <>
                        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'relative', ml: 1 }}
                          onClick={() => handleDayClick(s.dayNumber)}>
                          <Typography variant="h6" sx={{ fontWeight: '500', mr: 1 }}>
                            {`Ngày ${s.dayNumber}`}
                          </Typography>
                          <IconButton size="small">
                            {expandedDay === s.dayNumber ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </Box>
                        <Collapse in={expandedDay === s.dayNumber} sx={{ mt: 1, ml: 1 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: '500', mb: 1 }}>Tiêu đề:</Typography>
                            <TextField value={s.title} onChange={(e) => handleScheduleChange(s.dayNumber, 'title', e.target.value)} variant="outlined" fullWidth />
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: '500', mb: 1 }}>Mô tả:</Typography>
                            <ReactQuill
                              value={s.description} onChange={(value) => handleScheduleChange(s.dayNumber, 'description', value)}
                              modules={quillModules} theme="snow" style={{ height: '200px', marginBottom: '100px' }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: '500' }}>Điểm đến:</Typography>
                            <Button variant="outlined" onClick={() => handleAttractionChange(s.dayNumber)}>Chọn điểm đến</Button>
                            {s.attractions.length > 0 && (
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="subtitle2">Đã chọn:</Typography>
                                <ul style={{ listStyleType: 'none', padding: 0 }}>
                                  {s.attractions.map((attraction) => (
                                    <li key={attraction.attractionId} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                      <Typography>{attraction.name}</Typography>
                                      <IconButton size="small" sx={{ ml: 1 }} onClick={() => handleRemoveAttraction(s.dayNumber, attraction.attractionId)}>
                                        <CloseIcon fontSize="small" />
                                      </IconButton>
                                    </li>
                                  ))}
                                </ul>
                              </Box>
                            )}
                          </Box>
                        </Collapse>
                      </>
                    </Box>
                  ))}
                </Box>
                <Box sx={{ mb: 5, mt: 10 }}>
                  <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C' }}>Lưu ý</Typography>
                  <FormControl sx={{ width: '100%' }}>
                    <ReactQuill
                      value={tourTemplate.note}
                      onChange={(value) => handleFieldChange('note', value)}
                      modules={quillModules}
                      theme="snow" className={fieldErrors.note ? "ql-error" : null}
                      style={{ height: '200px', marginBottom: '100px' }}
                    />
                    {fieldErrors.note && (<FormHelperText error sx={{ mt: -3 }}>{fieldErrors.note}</FormHelperText>)}
                  </FormControl>
                </Box>
              </Grid>
              <Grid item xs={12} md={4} >
                <Paper elevation={3} sx={{ p: 4, mb: 3, borderRadius: '10px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography sx={{ color: '#05073C', display: 'flex', width: '6rem' }}> Mã mẫu: </Typography>
                    <TextField
                      value={tourTemplate.code} onChange={(e) => handleFieldChange('code', e.target.value)}
                      variant="outlined" fullWidth error={!!fieldErrors.code} helperText={fieldErrors.code}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography sx={{ color: '#05073C', width: '6rem' }}> Giá từ: </Typography>
                    <TextField
                      value={tourTemplate.minPrice} onBlur={() => handlePriceBlur('minPrice')}
                      onChange={(e) => handleFieldChange('minPrice', e.target.value)}
                      error={!!priceErrors.minPrice || !!fieldErrors.minPrice}
                      helperText={priceErrors.minPrice || fieldErrors.minPrice}
                      variant="outlined" fullWidth inputProps={{ min: 0 }} type="number"
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography sx={{ color: '#05073C', width: '6rem' }}> Giá đến: </Typography>
                    <TextField
                      value={tourTemplate.maxPrice} onBlur={() => handlePriceBlur('maxPrice')}
                      onChange={(e) => handleFieldChange('maxPrice', e.target.value)}
                      error={!!priceErrors.maxPrice || !!fieldErrors.maxPrice}
                      helperText={priceErrors.maxPrice || fieldErrors.maxPrice}
                      variant="outlined" fullWidth inputProps={{ min: 0 }} type="number"
                    />
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
            <Button
              variant="contained" fullWidth onClick={() => handleSubmit(true)}
              sx={{ backgroundColor: 'gray', height: '50px', '&:hover': { backgroundColor: '#4F4F4F' }, width: 'fit-content' }}
            >Lưu bản nháp</Button>
            <Button variant="contained" fullWidth sx={{ height: '50px', width: 'fit-content' }} onClick={() => handleSubmit(false)} >Gửi duyệt</Button>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Box sx={{ mt: 1, width: '32rem' }}>
              <Typography sx={{ color: 'red' }}>- Nếu lưu nháp: Vui lòng nhập ít nhất 1 thông tin để lưu nháp.</Typography>
              <Typography sx={{ color: 'red' }}>- Nếu gửi duyệt: Vui lòng nhập các trường có dấu * và thêm hình ảnh.</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <TemplateAddAttractionPopup
        open={isAttractionPopupOpen} onClose={() => setIsAttractionPopupOpen(false)}
        onSelectAttraction={handleAttractionSelect} provinces={provinces}
        selectedAttractions={tourTemplate.schedule.find(s => s.dayNumber === currentEditingDay)?.attractions || []}
      />
      <Snackbar
        open={snackbar.open} autoHideDuration={snackbar.hide} onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateTourTemplate;