import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Grid, Paper, TextField, Button, Collapse, IconButton, Select, MenuItem } from '@mui/material';
import { Helmet } from 'react-helmet';
import '@styles/AttractionDetails.css'
import { Link, useNavigate } from 'react-router-dom';
import ReactSelect from 'react-select';
import { Check as CheckIcon, Edit as EditIcon, Close as CloseIcon, Add as AddIcon, Delete as DeleteIcon, ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { createTourTemplate, updateTemplateImages } from '@services/TourTemplateService';
import TemplateAddAttractionPopup from '@components/staff/tourTemplate/TemplateAddAttractionPopup';
import { fetchProvinces } from '@services/ProvinceService';
import { fetchTourDuration } from '@services/DurationService';
import { fetchTourCategory } from '@services/TourCategoryService';
import SidebarStaff from '@layouts/SidebarStaff';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faMoneyBill1, faQrcode, faBus } from '@fortawesome/free-solid-svg-icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'font': [] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'script': 'sub' }, { 'script': 'super' }],
    [{ 'align': [] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    ['blockquote', 'code-block'],
    ['link', 'image', 'video', 'formula'],
    ['clean']
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
  const [editableFields, setEditableFields] = useState({
    tourName: { value: '' }, description: { value: '' }, note: { value: '' },
    provinces: { value: [] }, duration: { value: '' }, tourCategory: { value: '' },
    code: { value: '' }, minPrice: { value: '' }, maxPrice: { value: '' },
    startingProvinceId: { value: '' }, transportation: { value: '' }
  });
  const [expandedDay, setExpandedDay] = useState(1);
  const [isAttractionPopupOpen, setIsAttractionPopupOpen] = useState(false);
  const [currentEditingDay, setCurrentEditingDay] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [priceErrors, setPriceErrors] = useState({ minPrice: '', maxPrice: '' });
  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
    if (editableFields.duration.value) {
      const selectedDuration = tourDurations.find(d => d.durationId === editableFields.duration.value);
      if (selectedDuration) {
        const numberOfDays = selectedDuration.dayNumber;
        const newSchedule = Array.from({ length: numberOfDays }, (_, index) => {
          const existingDay = tourTemplate.schedule.find(s => s.dayNumber === (index + 1));
          if (existingDay) {
            return existingDay;
          }
          return {
            dayNumber: index + 1,
            title: '',
            description: '',
            attractions: [],
            isEditing: true
          };
        });
        setTourTemplate(prev => ({ ...prev, schedule: newSchedule }));
      }
    }
  }, [editableFields.duration.value, tourDurations]);

  const handleFieldChange = (field, value) => {
    setEditableFields(prev => ({
      ...prev,
      [field]: { value }
    }));

    if (field === 'duration') {
      const selectedDuration = tourDurations.find(d => d.durationId === value);
      if (selectedDuration) {
        const numberOfDays = selectedDuration.dayNumber;
        const newSchedule = Array.from({ length: numberOfDays }, (_, index) => {
          const existingDay = tourTemplate.schedule.find(s => s.dayNumber === (index + 1));
          if (existingDay) {
            return existingDay;
          }
          return {
            dayNumber: index + 1,
            title: '',
            description: '',
            attractions: [],
            isEditing: true
          };
        });
        setTourTemplate(prev => ({ ...prev, schedule: newSchedule }));
      }
    }
  };

  const handlePriceBlur = (field) => {
    const value = editableFields[field].value;
    if (!isNaN(value) && value !== '') {
      const roundedValue = roundToThousand(value).toString();
      handleFieldChange(field, roundedValue);
    }
  };

  const handleImageUpload = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      setTourTemplate(prev => ({ ...prev, imageUrls: prev.imageUrls.map((img, i) => i === index ? file : img) }));
    }
  };

  const handleImageRemove = (index) => {
    setTourTemplate(prev => ({ ...prev, imageUrls: prev.imageUrls.map((img, i) => i === index ? null : img) }));
  };

  const handleDayClick = (day) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

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
    const newErrors = {
      minPrice: '',
      maxPrice: ''
    };

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
      if (!validatePrice(editableFields.minPrice?.value || '', editableFields.maxPrice?.value || '')) {
        return;
      }

      const tourTemplateData = {
        code: editableFields.code?.value || '',
        tourName: editableFields.tourName?.value || '',
        description: editableFields.description?.value || '',
        durationId: editableFields.duration?.value || null,
        tourCategoryId: editableFields.tourCategory?.value || null,
        transportation: editableFields.transportation?.value || '',
        note: editableFields.note?.value || '',
        provinceIds: editableFields.provinces?.value?.map(province => province.value) || [],
        startingProvinceId: editableFields.startingProvinceId?.value || null,
        schedules: tourTemplate.schedule?.map(s => ({
          dayNumber: s.dayNumber,
          title: s.title || '',
          description: s.description || '',
          attractionIds: s.attractions?.map(attr => attr.attractionId) || []
        })) || [],
        isDraft: isDraft,
        minPrice: roundToThousand(parseFloat(editableFields.minPrice?.value || '0')) || null,
        maxPrice: roundToThousand(parseFloat(editableFields.maxPrice?.value || '0')) || null
      };

      if (!isDraft) {
        // Required fields validation
        const requiredFields = {
          'Tên tour': tourTemplateData.tourName,
          'Mô tả': tourTemplateData.description,
          'Thời lượng': tourTemplateData.durationId,
          'Loại tour': tourTemplateData.tourCategoryId,
          'Phương tiện': tourTemplateData.transportation,
          'Ghi chú': tourTemplateData.note,
          'Điểm khởi hành': tourTemplateData.startingProvinceId,
          'Giá thấp nhất': tourTemplateData.minPrice,
          'Giá cao nhất': tourTemplateData.maxPrice
        };

        // Check provinces
        if (!tourTemplateData.provinceIds || tourTemplateData.provinceIds.length === 0) {
          alert('Vui lòng chọn ít nhất một tỉnh thành.');
          return;
        }

        // Check schedules
        if (!tourTemplateData.schedules || tourTemplateData.schedules.length === 0) {
          alert('Vui lòng thêm ít nhất một lịch trình.');
          return;
        }

        // Check if each schedule has required fields
        const invalidSchedules = tourTemplateData.schedules.filter(s =>
          !s.title || !s.description || !s.attractionIds || s.attractionIds.length === 0
        );
        if (invalidSchedules.length > 0) {
          alert('Vui lòng điền đầy đủ thông tin cho tất cả các ngày trong lịch trình (tiêu đề, mô tả và điểm tham quan).');
          return;
        }

        // Check all required fields
        const missingFields = Object.entries(requiredFields)
          .filter(([_, value]) => !value)
          .map(([key]) => key);

        if (missingFields.length > 0) {
          alert(`Vui lòng điền đầy đủ các trường sau:\n${missingFields.join('\n')}`);
          return;
        }
      } else {
        // Validation for draft
        if (!tourTemplateData.durationId || !tourTemplateData.tourCategoryId) {
          alert('Vui lòng chọn thời lượng và loại tour trước khi lưu bản nháp.');
          return;
        }
      }

      // If all validations pass, proceed with creation
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

        alert(isDraft ? 'Đã lưu bản nháp thành công.' : 'Đã tạo và gửi tour mẫu thành công.');
        navigate('/nhan-vien/tour-mau');
      } else {
        console.error('Error creating tour template:', response);
        alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
      }
    } catch (error) {
      console.error('Error creating tour template:', error);
      alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
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

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '100vh' }}>
      <Helmet>
        <title>Tạo tour mẫu mới</title>
      </Helmet>
      <Box sx={{ display: 'flex' }}>
        <SidebarStaff isOpen={isSidebarOpen} toggleSidebar={handleSidebarToggle} />
        <Box sx={{
          flexGrow: 1,
          p: 5,
          transition: 'margin-left 0.3s',
          marginLeft: isSidebarOpen ? '260px' : '30px',
          width: `calc(100% - ${isSidebarOpen ? '260px' : '30px'})`,
          maxWidth: '95vw'
        }}>
          <Box maxWidth="95vw">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                sx={{ width: 'fit-content' }}
              >
                Quay lại
              </Button>

              <Typography
                variant="h4"
                sx={{
                  fontSize: '2.7rem', fontWeight: 600, color: 'primary.main',
                  alignSelf: 'center', marginBottom: '1rem'
                }}
              >
                Tạo tour mẫu mới
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
                <Typography gutterBottom>Tour đi qua tỉnh/thành phố</Typography>
                <ReactSelect
                  isMulti name="provinces"
                  options={provinces.map(province => ({ value: province.provinceId, label: province.provinceName }))}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Chọn tỉnh/thành phố"
                  value={editableFields.provinces.value}
                  onChange={(selectedOptions) => handleFieldChange('provinces', selectedOptions)}
                />
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
                <Typography gutterBottom>Tour bắt đầu từ:</Typography>
                <Select
                  value={editableFields.startingProvinceId.value}
                  onChange={(e) => handleFieldChange('startingProvinceId', e.target.value)}
                  variant="outlined" fullWidth sx={{ height: '40px' }}
                >
                  {provinces.map((province) => (
                    <MenuItem key={province.provinceId} value={province.provinceId}>{province.provinceName}</MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2, mb: 3 }}>
              <Typography gutterBottom> Tên tour </Typography>
              <TextField
                value={editableFields.tourName.value}
                onChange={(e) => handleFieldChange('tourName', e.target.value)}
                variant="outlined" fullWidth
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
                      <Button component="label" variant="outlined" sx={{ width: '100%', height: '100%', border: '2px dashed #3572EF' }}>
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
                        <Button component="label" variant="outlined" sx={{ width: '100%', height: '100%', border: '2px dashed #3572EF' }}>
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
                          <Button component="label" variant="outlined" sx={{ width: '100%', height: '96%', border: '2px dashed #3572EF' }}>
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
                          <Button component="label" variant="outlined" sx={{ width: '100%', height: '96%', border: '2px dashed #3572EF' }}>
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
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '33%' }}>
                    {/* <FontAwesomeIcon icon={faClock} style={{ marginRight: '10px', fontSize: '1.6rem', color: '#3572EF' }} /> */}
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Typography sx={{ color: '#05073C', fontWeight: 600, minWidth: '6.5rem' }}>Thời lượng:</Typography>
                      <Select
                        sx={{ width: '100%' }}
                        value={editableFields.duration.value}
                        onChange={(e) => handleFieldChange('duration', e.target.value)}
                      >
                        {tourDurations.map((tourDuration) => (
                          <MenuItem key={tourDuration.durationId} value={tourDuration.durationId}>
                            {tourDuration.durationName}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', width: '33%' }}>
                    {/* <FontAwesomeIcon icon={faMoneyBill1} style={{ marginRight: '10px', fontSize: '1.6rem', color: '#3572EF' }} /> */}
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Typography sx={{ color: '#05073C', fontWeight: 600, minWidth: '5.3rem' }}>Loại tour:</Typography>
                      <Select
                        sx={{ width: '100%' }}
                        value={editableFields.tourCategory.value}
                        onChange={(e) => handleFieldChange('tourCategory', e.target.value)}
                      >
                        {tourCategories.map((tourCategory) => (
                          <MenuItem key={tourCategory.tourCategoryId} value={tourCategory.tourCategoryId}>
                            {tourCategory.tourCategoryName}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', width: '33%' }}>
                    {/* <FontAwesomeIcon icon={faBus} style={{ marginRight: '10px', fontSize: '1.6rem', color: '#3572EF' }} /> */}
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      <Typography sx={{ color: '#05073C', fontWeight: 600, minWidth: '7rem' }}>Phương tiện:</Typography>
                      <Select
                        sx={{ width: '100%' }} value={editableFields.transportation.value}
                        onChange={(e) => handleFieldChange('transportation', e.target.value)}
                      >
                        <MenuItem value="Xe du lịch">Xe du lịch</MenuItem>
                        <MenuItem value="Máy bay">Máy bay</MenuItem>
                        <MenuItem value="Tàu hỏa">Tàu hỏa</MenuItem>
                      </Select>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ mb: 5 }}>
                  <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C' }}>Tổng quan</Typography>
                  <ReactQuill
                    value={editableFields.description.value} onChange={(value) => handleFieldChange('description', value)}
                    modules={quillModules} theme="snow" style={{ height: '200px', marginBottom: '100px' }} />
                </Box>
                <Box sx={{ mb: 5 }}>
                  <Typography variant="h5" gutterBottom
                    sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C', mb: 3 }}>
                    Lịch trình
                  </Typography>
                  {tourTemplate.schedule.map((s, index) => (
                    <Box key={s.dayNumber} sx={{ pl: 6, position: 'relative', mb: 3 }}>
                      {(index === 0 || index === tourTemplate.schedule.length - 1) && (
                        <Box sx={{
                          position: 'absolute', left: 0, top: '18px', width: '24px', height: '24px',
                          borderRadius: '50%', border: '2px solid #3572EF', backgroundColor: 'white',
                          transform: 'translateY(-50%)', zIndex: 1
                        }} />
                      )}
                      {(index !== 0 && index !== tourTemplate.schedule.length - 1) && (
                        <Box sx={{
                          position: 'absolute', left: '4px', top: '17px', width: '15px', height: '15px',
                          borderRadius: '50%', backgroundColor: '#3572EF', transform: 'translateY(-50%)', zIndex: 1
                        }} />
                      )}
                      {index !== tourTemplate.schedule.length - 1 && (
                        <Box sx={{
                          position: 'absolute', left: 10.5, top: '24px', bottom: -35,
                          width: '2px', backgroundColor: '#3572EF', zIndex: 0
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
                            <Button variant="outlined" onClick={() => handleAttractionChange(s.dayNumber)}>
                              Chọn điểm đến
                            </Button>
                            {s.attractions.length > 0 && (
                              <Box sx={{ mt: 1 }}>
                                <Typography variant="subtitle2">Đã chọn:</Typography>
                                <ul style={{ listStyleType: 'none', padding: 0 }}>
                                  {s.attractions.map((attraction) => (
                                    <li key={attraction.attractionId} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                      <Typography>{attraction.name}</Typography>
                                      <IconButton size="small" sx={{ ml: 1 }}
                                        onClick={() => handleRemoveAttraction(s.dayNumber, attraction.attractionId)}>
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
                  <ReactQuill
                    value={editableFields.note.value} onChange={(value) => handleFieldChange('note', value)}
                    modules={quillModules} theme="snow" style={{ height: '200px', marginBottom: '100px' }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={4} >
                <Paper elevation={3} sx={{ p: 4, mb: 3, borderRadius: '10px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <FontAwesomeIcon icon={faQrcode} style={{ marginRight: '10px', color: '#3572EF' }} />
                    <Typography sx={{ color: '#05073C', display: 'flex', minWidth: '4.2rem' }}> Mã mẫu: </Typography>
                    <TextField
                      value={editableFields.code.value}
                      onChange={(e) => handleFieldChange('code', e.target.value)}
                      variant="outlined" fullWidth placeholder="Nhập mã mẫu" sx={{ ml: 1 }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <FontAwesomeIcon icon={faMoneyBill1} style={{ marginRight: '10px', color: '#3572EF' }} />
                    <Typography sx={{ color: '#05073C', minWidth: '4.2rem' }}> Giá từ: </Typography>
                    <TextField
                      label="Giá thấp nhất" value={editableFields.minPrice.value}
                      onChange={(e) => handleFieldChange('minPrice', e.target.value)}
                      onBlur={() => handlePriceBlur('minPrice')}
                      error={!!priceErrors.minPrice} helperText={priceErrors.minPrice} variant="outlined"
                      fullWidth placeholder="Giá thấp nhất" inputProps={{ min: 0 }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <FontAwesomeIcon icon={faMoneyBill1} style={{ marginRight: '10px', color: '#3572EF' }} />
                    <Typography sx={{ color: '#05073C', minWidth: '4.2rem' }}> Đến: </Typography>
                    <TextField
                      label="Giá cao nhất" value={editableFields.maxPrice.value}
                      onChange={(e) => handleFieldChange('maxPrice', e.target.value)}
                      onBlur={() => handlePriceBlur('maxPrice')}
                      error={!!priceErrors.maxPrice} helperText={priceErrors.maxPrice} variant="outlined"
                      fullWidth placeholder="Giá cao nhất" inputProps={{ min: 0 }}
                    />
                  </Box>
                  <Button
                    variant="contained" fullWidth onClick={() => handleSubmit(true)}
                    sx={{ backgroundColor: 'gray', mb: 2, height: '50px', '&:hover': { backgroundColor: '#4F4F4F' } }}
                  >
                    Lưu bản nháp
                  </Button>
                  <Button variant="contained" fullWidth sx={{ height: '50px' }} onClick={() => handleSubmit(false)} >
                    Gửi
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
      <TemplateAddAttractionPopup
        open={isAttractionPopupOpen}
        onClose={() => setIsAttractionPopupOpen(false)}
        onSelectAttraction={handleAttractionSelect}
        provinces={provinces}
        selectedAttractions={tourTemplate.schedule.find(s => s.dayNumber === currentEditingDay)?.attractions || []}
      />
    </Box>
  );
};

export default CreateTourTemplate;