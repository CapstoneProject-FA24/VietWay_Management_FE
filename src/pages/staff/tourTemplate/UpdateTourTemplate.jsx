import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Grid, Paper, TextField, Button, Container, Collapse, IconButton, Select, MenuItem } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faUser, faClock, faMoneyBill1, faCalendarAlt, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import '@styles/AttractionDetails.css'
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ReactSelect from 'react-select';
import { Check as CheckIcon, Edit as EditIcon, Close as CloseIcon, Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import TemplateAddAttractionPopup from '@components/staff/TemplateAddAttractionPopup';
import { fetchTourTemplateById, updateTourTemplate, updateTemplateImages } from '@services/TourTemplateService';
import { fetchProvinces } from '@services/ProvinceService';
import { fetchTourDuration } from '@services/DurationService';
import { fetchTourCategory } from '@services/TourCategoryService';
import { getCookie } from '@services/AuthenService';

const UpdateTourTemplate = () => {
  const { id } = useParams();
  const [provinces, setProvinces] = useState([]);
  const [tourTemplate, setTourTemplate] = useState({
    tourName: '', provinces: [], duration: '', departurePoint: '',
    tourCategory: '', description: '', policy: '', note: '',
    imageUrls: [null, null, null, null], schedule: [], code: ''
  });
  const [tourCategories, setTourCategories] = useState([]);
  const [tourDurations, setTourDurations] = useState([]);

  const [editableFields, setEditableFields] = useState({
    tourName: { value: '', isEditing: false },
    description: { value: '', isEditing: false },
    policy: { value: '', isEditing: false },
    note: { value: '', isEditing: false },
    provinces: { value: [], isEditing: false },
    duration: { value: '', isEditing: false },
    departurePoint: { value: '', isEditing: false },
    tourCategory: { value: '', isEditing: false },
    code: { value: '', isEditing: false },
  });
  const [expandedDay, setExpandedDay] = useState(null);
  const [isAttractionPopupOpen, setIsAttractionPopupOpen] = useState(false);
  const [currentEditingDay, setCurrentEditingDay] = useState(null);
  const pageTopRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const role = getCookie('role');
    const token = getCookie('token');
    if (!role || !token || role !== 'nhan-vien') { navigate(`/dang-nhap`); }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedTourTemplate = await fetchTourTemplateById(id);
        setTourTemplate(fetchedTourTemplate);

        const fetchedProvinces = await fetchProvinces();
        const duration = await fetchTourDuration();
        const categories = await fetchTourCategory();
        setProvinces(fetchedProvinces);
        setTourDurations(duration);
        setTourCategories(categories);

        setEditableFields({
          tourName: { value: fetchedTourTemplate.tourName, isEditing: false },
          description: { value: fetchedTourTemplate.description, isEditing: false },
          policy: { value: fetchedTourTemplate.policy, isEditing: false },
          note: { value: fetchedTourTemplate.note, isEditing: false },
          provinces: { value: fetchedTourTemplate.provinces.map(p => ({ value: p.provinceId, label: p.provinceName })), isEditing: false },
          duration: { value: fetchedTourTemplate.duration.durationId, isEditing: false },
          departurePoint: { value: fetchedTourTemplate.departurePoint, isEditing: false },
          tourCategory: { value: fetchedTourTemplate.tourCategoryId, isEditing: false },
          code: { value: fetchedTourTemplate.code, isEditing: false },
        });
      } catch (error) {
        console.error('Error fetching tour template:', error);
      }
    };
    fetchData();
  }, [id]);

  const handleFieldChange = (field, value) => {
    setEditableFields(prev => ({ ...prev, [field]: { ...prev[field], value } }));
  };

  const handleFieldSubmit = (field) => {
    setEditableFields(prev => ({ ...prev, [field]: { ...prev[field], isEditing: false } }));
    setTourTemplate(prev => ({ ...prev, [field]: editableFields[field].value }));
  };

  const handleFieldEdit = (field) => {
    setEditableFields(prev => ({ ...prev, [field]: { ...prev[field], isEditing: true } }));
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

  const handleAddDay = () => {
    const newDay = tourTemplate.schedule.length + 1;
    setTourTemplate(prev => ({ ...prev, schedule: [...prev.schedule, { dayNumber: newDay, title: '', description: '', attractions: [], isEditing: true }] }));
    setExpandedDay(newDay);
  };

  const handleRemoveDay = (day) => {
    if (tourTemplate.schedule.length > 1) {
      setTourTemplate(prev => ({ ...prev, schedule: prev.schedule.filter(s => s.dayNumber !== day).map((s, index) => ({ ...s, Day: index + 1 })) }));
      setExpandedDay(null);
    }
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

  const handleScheduleSubmit = (day) => {
    const schedule = tourTemplate.schedule.find(item => item.dayNumber === day);
    const isValid = schedule.title.trim() !== '' && schedule.description.trim() !== '' && schedule.attractions.length > 0;

    if (isValid) {
      setTourTemplate(prev => ({
        ...prev, schedule: prev.schedule.map(item =>
          item.dayNumber === day ? { ...item, isEditing: false } : item)
      }));
    } else { alert('Please ensure all fields are filled before submitting.'); }
  };

  const handleScheduleEdit = (day) => {
    setTourTemplate(prev => ({
      ...prev, schedule: prev.schedule.map(item =>
        item.dayNumber === day ? { ...item, isEditing: true } : item)
    }));
    setExpandedDay(day);
  };

  const handleRemoveAttraction = (dayNumber, attractions) => {
    setTourTemplate(prev => ({
      ...prev,
      schedule: prev.schedule.map(item =>
        item.dayNumber === dayNumber
          ? { ...item, attractions: item.attractions.filter(attr => attr.attractionId !== attractions) }
          : item
      )
    }));
  };

  const handleSubmit = async (isDraft) => {
    try {
      const tourTemplateData = {
        tourTemplateId: id,
        code: editableFields.code.value,
        tourName: editableFields.tourName.value,
        description: editableFields.description.value,
        durationId: editableFields.duration.value,
        tourCategoryId: editableFields.tourCategory.value,
        policy: editableFields.policy.value,
        note: editableFields.note.value,
        provinceIds: editableFields.provinces.value.map(province => province.value),
        schedules: tourTemplate.schedule.map(s => ({
          dayNumber: s.dayNumber,
          title: s.title,
          description: s.description,
          attractionIds: s.attractions.map(attr => attr.attractionId)
        })),
        isDraft: isDraft
      };

      if (!isDraft) {
        const requiredFields = ['tourName', 'description', 'durationId', 'tourCategoryId', 'policy', 'note', 'provinceIds', 'schedules'];
        const missingFields = requiredFields.filter(field => {
          if (Array.isArray(tourTemplateData[field])) {
            return tourTemplateData[field].length === 0;
          }
          return !tourTemplateData[field];
        });

        if (missingFields.length > 0) {
          alert('Vui lòng điền đầy đủ thông tin trước khi gửi.');
          return;
        }
      } else {
        if (!tourTemplateData.durationId || !tourTemplateData.tourCategoryId) {
          alert('Vui lòng chọn thời lượng và loại tour trước khi lưu bản nháp.');
          return;
        }
      }

      const response = await updateTourTemplate(id, tourTemplateData);

      if (response.statusCode === 200) {
        const newImages = tourTemplate.imageUrls.filter(img => img instanceof File);
        const deletedImageIds = []; 

        if (newImages.length > 0 || deletedImageIds.length > 0) {
          await updateTemplateImages(id, newImages, deletedImageIds);
        }

        alert(isDraft ? 'Đã lưu bản nháp thành công.' : 'Đã cập nhật và gửi tour mẫu thành công.');
        navigate('/nhan-vien/tour-mau');
      } else {
        alert('Có lỗi xảy ra khi cập nhật tour mẫu.');
      }
    } catch (error) {
      console.error('Error updating tour template:', error);
      alert('Đã xảy ra lỗi khi cập nhật tour mẫu.');
    }
  };

  return (
    <Box className='main' sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }} ref={pageTopRef}>
      <Helmet>
        <title>Cập nhật tour mẫu</title>
      </Helmet>
      <Box sx={{ m: '-60px', boxShadow: 2, pt: 4, pl: 4, pr: 4, pb: 1, mb: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Button
          component={Link}
          to="/nhan-vien/tour-mau"
          variant="contained"
          startIcon={<ArrowBackIosNewOutlinedIcon />}
          sx={{ height: '55px', backgroundColor: 'transparent', boxShadow: 0, color: 'gray', mt: -1, ":hover": { backgroundColor: 'transparent', boxShadow: 0, color: 'black', fontWeight: 700 } }}>
          Quay lại
        </Button>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'center', color: '#05073C', flexGrow: 1, ml: -15 }}>
          Cập nhật tour mẫu
        </Typography>
      </Box>
      <Box sx={{ p: 3, flexGrow: 1, mt: 5 }}>
        {editableFields.provinces.isEditing ? (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ReactSelect isMulti name="provinces" options={provinces.map(province => ({ value: province.provinceId, label: province.provinceName }))}
              className="basic-multi-select" classNamePrefix="select" placeholder="Chọn tỉnh/thành phố" value={editableFields.provinces.value}
              onChange={(selectedOptions) => handleFieldChange('provinces', selectedOptions)} />
            <Button variant="contained" onClick={() => handleFieldSubmit('provinces')} disabled={!editableFields.provinces.value.length} sx={{ minWidth: '40px', p: 1, ml: 2 }}>
              <CheckIcon />
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography gutterBottom sx={{ fontFamily: 'Inter, sans-serif', textAlign: 'left', color: 'grey', fontSize: '1.15rem' }}>
              {editableFields.provinces.value.map(province => province.label).join(' - ')}
            </Typography>
            <IconButton onClick={() => handleFieldEdit('provinces')} sx={{ ml: 2 }}><EditIcon /></IconButton>
          </Box>
        )}
        {editableFields.tourName.isEditing ? (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography gutterBottom>
              Tên tour
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextField
                value={editableFields.tourName.value} onChange={(e) => handleFieldChange('tourName', e.target.value)}
                variant="outlined" fullWidth sx={{ mr: 2 }}
              />
              <Button
                variant="contained" onClick={() => handleFieldSubmit('tourName')}
                disabled={!editableFields.tourName.value.trim()} sx={{ minWidth: '40px', padding: '8px' }}
              ><CheckIcon /></Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C' }}>
              {editableFields.tourName.value}
            </Typography>
            <IconButton onClick={() => handleFieldEdit('tourName')} sx={{ ml: 2 }}><EditIcon /></IconButton>
          </Box>
        )}
        <Grid container spacing={3}>
          <Grid item xs={12} sx={{ minWidth: '100%' }}>
            <Box sx={{ display: 'flex', minWidth: '100%', height: '450px', mb: 3 }}>
              <Box sx={{ flex: '0 0 59.5%', mr: '1%', position: 'relative' }}>
                {tourTemplate.imageUrls[0] ? (
                  <>
                    <img src={tourTemplate.imageUrls[0] instanceof File ? URL.createObjectURL(tourTemplate.imageUrls[0]) : tourTemplate.imageUrls[0]?.url} alt="Tour image 1" style={{ width: '100%', height: '450px', objectFit: 'cover' }} />
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
                      <img src={tourTemplate.imageUrls[1] instanceof File ? URL.createObjectURL(tourTemplate.imageUrls[1]) : tourTemplate.imageUrls[1]?.url} alt="Tour image 2" style={{ width: '100%', height: '215px', objectFit: 'cover' }} />
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
                        <img src={tourTemplate.imageUrls[2] instanceof File ? URL.createObjectURL(tourTemplate.imageUrls[2]) : tourTemplate.imageUrls[2]?.url} alt="Tour image 3" style={{ width: '100%', height: '215px', objectFit: 'cover' }} />
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
                        <img src={tourTemplate.imageUrls[3] instanceof File ? URL.createObjectURL(tourTemplate.imageUrls[3]) : tourTemplate.imageUrls[3]?.url} alt="Tour image 4" style={{ width: '100%', height: '215px', objectFit: 'cover' }} />
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
              <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
                <FontAwesomeIcon icon={faClock} style={{ marginRight: '10px', fontSize: '1.6rem', color: '#3572EF' }} />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ color: '#05073C', fontWeight: 600, minWidth: '6.5rem' }}>Thời lượng:</Typography>
                  {editableFields.duration.isEditing ? (
                    <>
                      <Select sx={{ width: '100%', mr: 1 }}
                        value={editableFields.duration.value}
                        onChange={(e) => handleFieldChange('duration', e.target.value)}>
                        {tourDurations.map((tourDuration) => (
                          <MenuItem key={tourDuration.durationId} value={tourDuration.durationId}>{tourDuration.durationName}</MenuItem>
                        ))}
                      </Select>
                      <Button
                        variant="contained" onClick={() => handleFieldSubmit('duration')}
                        disabled={!editableFields.duration.value.trim()}
                        sx={{ minWidth: '40px', padding: '8px' }}><CheckIcon /></Button>
                    </>
                  ) : (
                    <>
                      <Typography sx={{ color: '#05073C' }}>
                        {tourDurations.find(duration => duration.durationId === editableFields.duration.value)?.durationName || ''}
                      </Typography>
                      <IconButton onClick={() => handleFieldEdit('duration')} sx={{ ml: 2 }}><EditIcon /></IconButton>
                    </>
                  )}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
                <FontAwesomeIcon icon={faMoneyBill1} style={{ marginRight: '10px', fontSize: '1.6rem', color: '#3572EF' }} />
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Typography sx={{ color: '#05073C', fontWeight: 600, minWidth: '5.3rem' }}>Loại tour:</Typography>
                  {editableFields.tourCategory.isEditing ? (
                    <>
                      <Select sx={{ width: '100%', mr: 1 }}
                        value={editableFields.tourCategory.value}
                        onChange={(e) => handleFieldChange('tourCategory', e.target.value)}>
                        {tourCategories.map((tourCategory) => (
                          <MenuItem key={tourCategory.tourCategoryId} value={tourCategory.tourCategoryId}>{tourCategory.tourCategoryName}</MenuItem>
                        ))}
                      </Select>
                      <Button
                        variant="contained" onClick={() => handleFieldSubmit('tourCategory')}
                        disabled={!editableFields.tourCategory.value} sx={{ minWidth: '40px', padding: '8px' }}
                      ><CheckIcon /></Button>
                    </>
                  ) : (
                    <>
                      <Typography sx={{ color: '#05073C' }}>
                        {tourCategories.find(category => category.tourCategoryId === editableFields.tourCategory.value)?.tourCategoryName || ''}
                      </Typography>
                      <IconButton onClick={() => handleFieldEdit('tourCategory')} sx={{ ml: 2 }}><EditIcon /></IconButton>
                    </>
                  )}
                </Box>
              </Box>
            </Box>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C' }}>Tổng quan</Typography>
              {editableFields.description.isEditing ? (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TextField value={editableFields.description.value}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    variant="outlined" fullWidth multiline rows={4} sx={{ mr: 2 }} />
                  <Button variant="contained" onClick={() => handleFieldSubmit('description')}
                    disabled={!editableFields.description.value.trim()}
                    sx={{ minWidth: '40px', padding: '8px' }} >
                    <CheckIcon />
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography paragraph sx={{ textAlign: 'justify', color: '#05073C' }}>{editableFields.description.value}</Typography>
                  <IconButton onClick={() => handleFieldEdit('description')} sx={{ ml: 2 }}><EditIcon /></IconButton>
                </Box>
              )}
            </Box>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C', mb: 3 }}>
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
                  {s.isEditing ? (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'relative', ml: 1 }} onClick={() => handleDayClick(s.dayNumber)}>
                        <Typography variant="h6" sx={{ fontWeight: '500', mr: 1 }}>
                          {`Ngày ${s.dayNumber}`}
                        </Typography>
                        <IconButton size="small">
                          {expandedDay === s.dayNumber ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </Box>
                      <Collapse in={expandedDay === s.dayNumber} sx={{ mt: 1, ml: 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: '500' }}>Tiêu đề:</Typography>
                          <TextField value={s.title} onChange={(e) => handleScheduleChange(s.dayNumber, 'title', e.target.value)} variant="outlined" fullWidth />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: '500' }}>Mô tả:</Typography>
                          <TextField value={s.description} onChange={(e) => handleScheduleChange(s.dayNumber, 'description', e.target.value)} variant="outlined" fullWidth multiline rows={3} />
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
                                  <li key={attraction.AttractionId} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
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
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                          <Button variant="contained" onClick={() => handleScheduleSubmit(s.dayNumber)} sx={{ minWidth: '40px', padding: '8px' }}
                            disabled={!s.title.trim() || !s.description.trim() || s.attractions.length === 0}>
                            <CheckIcon />
                          </Button>
                        </Box>
                      </Collapse>
                    </>
                  ) : (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'relative', ml: 1 }} onClick={() => handleDayClick(s.dayNumber)}>
                        <Typography variant="h6" sx={{ fontWeight: '500', mr: 1 }}>
                          {`Ngày ${s.dayNumber}: ${s.title}`}
                        </Typography>
                        <IconButton size="small">
                          {expandedDay === s.dayNumber ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </Box>
                      <Collapse in={expandedDay === s.dayNumber} sx={{ ml: 1 }}>
                        <Typography paragraph sx={{ mb: 2 }}>{s.description}</Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: '500', mb: 1 }}>Điểm đến:</Typography>
                        <ul>
                          {s.attractions.map((attraction) => (
                            <li key={attraction.attractionId}>{attraction.name}</li>
                          ))}
                        </ul>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                          <IconButton onClick={() => handleScheduleEdit(s.dayNumber)}><EditIcon /></IconButton>
                        </Box>
                      </Collapse>
                    </>
                  )}
                  {tourTemplate.schedule.length > 1 && (
                    <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={() => handleRemoveDay(s.dayNumber)} sx={{ mt: 2 }}>
                      Xóa ngày
                    </Button>
                  )}
                </Box>
              ))}
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddDay} sx={{ mt: 2 }}>
                Thêm ngày
              </Button>
            </Box>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C' }}>Chính sách</Typography>
              {editableFields.policy.isEditing ? (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TextField value={editableFields.policy.value} onChange={(e) => handleFieldChange('policy', e.target.value)} variant="outlined" fullWidth multiline rows={4} sx={{ mr: 2 }} />
                  <Button variant="contained" onClick={() => handleFieldSubmit('policy')} disabled={!editableFields.policy.value.trim()} sx={{ minWidth: '40px', padding: '8px' }}><CheckIcon /></Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography paragraph sx={{ textAlign: 'justify', color: '#05073C' }}>{editableFields.policy.value}</Typography>
                  <IconButton onClick={() => handleFieldEdit('policy')} sx={{ ml: 2 }}><EditIcon /></IconButton>
                </Box>
              )}
            </Box>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C' }}>Lưu ý</Typography>
              {editableFields.note.isEditing ? (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TextField value={editableFields.note.value} onChange={(e) => handleFieldChange('note', e.target.value)} variant="outlined" fullWidth multiline rows={4} sx={{ mr: 2 }} />
                  <Button variant="contained" onClick={() => handleFieldSubmit('note')} disabled={!editableFields.note.value.trim()} sx={{ minWidth: '40px', padding: '8px' }}><CheckIcon /></Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography paragraph sx={{ textAlign: 'justify', color: '#05073C' }}>{editableFields.note.value}</Typography>
                  <IconButton onClick={() => handleFieldEdit('note')} sx={{ ml: 2 }}><EditIcon /></IconButton>
                </Box>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={4} >
            <Paper elevation={3} sx={{ p: 4, mb: 3, borderRadius: '10px' }}>
              <Typography variant="h6" sx={{ fontWeight: '600', mb: 1, color: '#05073C' }}>Thông tin tour mẫu</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FontAwesomeIcon icon={faQrcode} style={{ marginRight: '10px', color: '#3572EF' }} />
                <Typography sx={{ color: '#05073C', display: 'flex', minWidth: '4.2rem' }}> Mã mẫu: </Typography>
                {editableFields.code.isEditing ? (
                  <>
                    <TextField value={editableFields.code.value} onChange={(e) => handleFieldChange('code', e.target.value)} variant="outlined" fullWidth sx={{ mr: 2 }} placeholder="Nhập mã tour" />
                    <Button variant="contained" onClick={() => handleFieldSubmit('code')} disabled={!editableFields.code.value.trim()} sx={{ minWidth: '40px', padding: '8px' }}><CheckIcon /></Button>
                  </>
                ) : (
                  <>
                    <Typography sx={{ ml: 1, color: 'primary.main', fontWeight: 700 }}>{tourTemplate.code}</Typography>
                    <IconButton onClick={() => handleFieldEdit('code')}><EditIcon /></IconButton>
                  </>
                )}
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '10px', color: '#3572EF' }} />
                <Typography sx={{ color: '#05073C' }}>Ngày tạo: {new Date(tourTemplate.createdDate).toLocaleDateString('vi-VN')}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FontAwesomeIcon icon={faUser} style={{ marginRight: '10px', color: '#3572EF' }} />
                <Typography sx={{ color: '#05073C' }}>Người tạo: {tourTemplate.creatorName}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '10px', color: '#3572EF' }} />
                <Typography sx={{ color: '#05073C', display: 'flex' }}>
                  Trạng thái:
                  <Typography sx={{ ml: 1, color: tourTemplate.statusName === 'Bản nháp' ? 'gray' : tourTemplate.statusName === 'Chờ duyệt' ? 'primary.main' : tourTemplate.statusName === 'Đã duyệt' ? 'green' : 'red', }}>{tourTemplate.statusName}</Typography>
                </Typography>
              </Box>
              <Button 
                variant="contained" 
                fullWidth 
                sx={{ backgroundColor: 'gray', mb: 2, height: '50px', '&:hover': { backgroundColor: '#4F4F4F' } }}
                onClick={() => handleSubmit(true)}
              >
                Lưu bản nháp
              </Button>
              <Button 
                variant="contained" 
                fullWidth 
                sx={{ height: '50px' }}
                onClick={() => handleSubmit(false)}
              >
                Gửi
              </Button>
            </Paper>
          </Grid>
        </Grid>
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

export default UpdateTourTemplate;