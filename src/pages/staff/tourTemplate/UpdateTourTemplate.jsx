import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Grid, Paper, TextField, Button, Container, Collapse, IconButton, Select, MenuItem } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faUser, faClock, faMoneyBill1, faLocationDot, faCalendarAlt, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import '@styles/AttractionDetails.css'
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { Link, useParams } from 'react-router-dom';
import ReactSelect from 'react-select';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchTourTemplateById } from '@services/TourTemplateService';
import { fetchProvinces } from '@services/ProvinceService';

const UpdateTourTemplate = () => {
  const { id } = useParams();
  const [tourTemplate, setTourTemplate] = useState({
    tourName: '',
    provinces: [],
    duration: '',
    departurePoint: '',
    tourCategory: '',
    description: '',
    policy: '',
    note: '',
    imageUrls: [null, null, null, null],
    schedule: []
  });

  const [loading, setLoading] = useState(true);
  const [provinces, setProvinces] = useState([]);
  
  const [editableFields, setEditableFields] = useState({
    tourName: { value: '', isEditing: false },
    description: { value: '', isEditing: false },
    policy: { value: '', isEditing: false },
    note: { value: '', isEditing: false },
    provinces: { value: [], isEditing: false },
    duration: { value: '', isEditing: false },
    departurePoint: { value: '', isEditing: false },
    tourCategory: { value: '', isEditing: false },
  });
  const [expandedDay, setExpandedDay] = useState(null);
  const pageTopRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedTourTemplate = await fetchTourTemplateById(id);
        setTourTemplate(fetchedTourTemplate);
        const fetchedProvinces = await fetchProvinces();
        setProvinces(fetchedProvinces);
        setEditableFields({
          tourName: { value: fetchedTourTemplate.tourName, isEditing: false },
          description: { value: fetchedTourTemplate.description, isEditing: false },
          policy: { value: fetchedTourTemplate.policy, isEditing: false },
          note: { value: fetchedTourTemplate.note, isEditing: false },
          provinces: { value: fetchedTourTemplate.provinces.map(p => ({ value: p.provinceId, label: p.provinceName })), isEditing: false },
          duration: { value: fetchedTourTemplate.duration.durationName, isEditing: false },
          departurePoint: { value: fetchedTourTemplate.departurePoint, isEditing: false },
          tourCategory: { value: fetchedTourTemplate.tourCategoryName, isEditing: false },
        });
      } catch (error) {
        console.error('Error fetching tour template:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleFieldChange = (field, value) => {
    setEditableFields(prev => ({
      ...prev,
      [field]: { ...prev[field], value }
    }));
  };

  const handleFieldSubmit = (field) => {
    setEditableFields(prev => ({
      ...prev,
      [field]: { ...prev[field], isEditing: false }
    }));
    setTourTemplate(prev => ({
      ...prev,
      [field]: editableFields[field].value
    }));
  };

  const handleFieldEdit = (field) => {
    setEditableFields(prev => ({
      ...prev,
      [field]: { ...prev[field], isEditing: true }
    }));
  };

  const handleImageUpload = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTourTemplate(prev => ({
          ...prev,
          imageUrls: prev.imageUrls.map((url, i) => i === index ? reader.result : url)
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = (index) => {
    setTourTemplate(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.map((url, i) => i === index ? null : url)
    }));
  };

  const handleDayClick = (day) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  const handleAddDay = () => {
    const newDay = tourTemplate.schedule.length + 1;
    setTourTemplate(prev => ({
      ...prev,
      schedule: [...prev.schedule, { dayNumber: newDay, title: '', description: '', attractions: [], isEditing: true }]
    }));
    setExpandedDay(newDay);
  };

  const handleRemoveDay = (day) => {
    if (tourTemplate.schedule.length > 1) {
      setTourTemplate(prev => ({
        ...prev,
        schedule: prev.schedule.filter(s => s.dayNumber !== day)
          .map((schedule, index) => ({ ...schedule, Day: index + 1 }))
      }));
      setExpandedDay(null);
    }
  };

  const handleScheduleChange = (day, field, value) => {
    setTourTemplate(prev => ({
      ...prev,
      schedule: prev.schedule.map(item =>
        item.dayNumber === day ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleAttractionChange = (day, selectedOptions) => {
    setTourTemplate(prev => ({
      ...prev,
      schedule: prev.schedule.map(item =>
        item.Day === day
          ? {
            ...item,
            attractions: selectedOptions.map(option => ({
              attractionId: option.value,
              name: option.label
            }))
          }
          : item
      )
    }));
  };

  const handleScheduleSubmit = (day) => {
    const schedule = tourTemplate.schedule.find(item => item.dayNumber === day);
    const isValid = schedule.title.trim() !== '' && schedule.description.trim() !== '' && schedule.attractions.length > 0;

    if (isValid) {
      setTourTemplate(prev => ({
        ...prev,
        schedule: prev.schedule.map(item =>
          item.dayNumber === day ? { ...item, isEditing: false } : item
        )
      }));
    } else {
      alert('Please ensure all fields are filled before submitting.');
    }
  };

  const handleScheduleEdit = (day) => {
    setTourTemplate(prev => ({
      ...prev,
      schedule: prev.schedule.map(item =>
        item.dayNumber === day ? { ...item, isEditing: true } : item
      )
    }));
    setExpandedDay(day);
  };

  if (loading) {
    return <Typography sx={{ width: '100vw', textAlign: 'center' }}>Loading...</Typography>;
  }

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
            <ReactSelect
              isMulti
              name="provinces"
              options={provinces.map(province => ({ value: province.provinceId, label: province.provinceName }))}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="Chọn tỉnh/thành phố"
              value={editableFields.provinces.value}
              onChange={(selectedOptions) => handleFieldChange('provinces', selectedOptions)}
            />
            <Button
              variant="contained"
              onClick={() => handleFieldSubmit('provinces')}
              disabled={editableFields.provinces.value.length === 0}
              sx={{ minWidth: '40px', padding: '8px', ml: 2 }}
            ><CheckIcon /></Button>
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
            <Typography gutterBottom sx={{ backgroundColor: 'white', pl: 1, pr: 1, color: 'grey', ml: 2, mb: -1.5, zIndex: 1, width: 'fit-content' }}>
              Tên tour
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextField
                value={editableFields.tourName.value}
                onChange={(e) => handleFieldChange('tourName', e.target.value)}
                variant="outlined"
                fullWidth
                sx={{ mr: 2 }}
              />
              <Button
                variant="contained"
                onClick={() => handleFieldSubmit('tourName')}
                disabled={!editableFields.tourName.value.trim()}
                sx={{ minWidth: '40px', padding: '8px' }}
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
          <Grid item xs={12}>
            <Container maxWidth="lg">
              <Box sx={{ display: 'flex', width: '100%', height: '450px', mb: 3, ml: -2.5 }}>
                <Box sx={{ flex: '0 0 60%', mr: 2, position: 'relative' }}>
                  {tourTemplate.imageUrls[0].url?(
                    <>
                      <img src={tourTemplate.imageUrls[0].url} alt="Tour image 1" style={{ width: '100%', height: '450px', objectFit: 'cover' }} />
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
                <Box sx={{ flex: '0 0 43%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ flex: '0 0 50%', mb: 1.2, position: 'relative' }}>
                    {tourTemplate.imageUrls[1].url?(
                      <>
                        <img src={tourTemplate.imageUrls[1].url} alt="Tour image 2" style={{ width: '100%', height: '215px', objectFit: 'cover' }} />
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
                    <Box sx={{ flex: '0 0 48.2%', mr: 2, position: 'relative' }}>
                      {tourTemplate.imageUrls[2].url?(
                        <>
                          <img src={tourTemplate.imageUrls[2].url} alt="Tour image 3" style={{ width: '100%', height: '215px', objectFit: 'cover' }} />
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
                    <Box sx={{ flex: '0 0 48.2%', position: 'relative' }}>
                      {tourTemplate.imageUrls[3].url?(
                        <>
                          <img src={tourTemplate.imageUrls[3].url} alt="Tour image 4" style={{ width: '100%', height: '215px', objectFit: 'cover' }} />
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
            </Container>
          </Grid>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 4, width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
                <FontAwesomeIcon icon={faClock} style={{ marginRight: '10px', fontSize: '1.6rem', color: '#3572EF' }} />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ color: '#05073C', fontWeight: 600, minWidth: '6.5rem' }}>Thời lượng:</Typography>
                  {editableFields.duration.isEditing ? (
                    <>
                      <TextField
                        value={editableFields.duration.value}
                        onChange={(e) => handleFieldChange('duration', e.target.value)}
                        variant="outlined"
                        sx={{ mr: 1 }}
                      />
                      <Button
                        variant="contained"
                        onClick={() => handleFieldSubmit('duration')}
                        disabled={!editableFields.duration.value.trim()}
                        sx={{ minWidth: '40px', padding: '8px' }}
                      ><CheckIcon /></Button>
                    </>
                  ) : (
                    <>
                      <Typography sx={{ color: '#05073C' }}>{editableFields.duration.value}</Typography>
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
                      <Select
                        sx={{ width: '100%', mr: 1 }}
                        value={editableFields.tourCategory.value}
                        onChange={(e) => handleFieldChange('tourCategory', e.target.value)}
                      >
                        {tourTemplate.tourCategories.map((tourCategory) => (
                          <MenuItem key={tourCategory.tourCategoryId} value={tourCategory.categoryName}>{tourCategory.categoryName}</MenuItem>
                        ))}
                      </Select>
                      <Button
                        variant="contained"
                        onClick={() => handleFieldSubmit('tourCategory')}
                        disabled={!editableFields.tourCategory.value}
                        sx={{ minWidth: '40px', padding: '8px' }}
                      ><CheckIcon /></Button>
                    </>
                  ) : (
                    <>
                      <Typography sx={{ color: '#05073C' }}>{editableFields.tourCategory.value}</Typography>
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
                  <TextField
                    value={editableFields.description.value}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    sx={{ mr: 2 }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleFieldSubmit('description')}
                    disabled={!editableFields.description.value.trim()}
                    sx={{ minWidth: '40px', padding: '8px' }}
                  ><CheckIcon /></Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography paragraph sx={{ textAlign: 'justify', color: '#05073C' }}>{editableFields.description.value}</Typography>
                  <IconButton onClick={() => handleFieldEdit('description')} sx={{ ml: 2 }}><EditIcon /></IconButton>
                </Box>
              )}
            </Box>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C', mb: 3 }}>Lịch trình</Typography>
              {tourTemplate.schedule.map((s, index) => (
                <Box key={s.dayNumber} sx={{ pl: 6, position: 'relative', mb: 3 }}>
                  {(index === 0 || index === tourTemplate.schedule.length - 1) && (
                    <Box
                      sx={{
                        position: 'absolute', left: 0, top: '18px', width: '24px', height: '24px', borderRadius: '50%',
                        border: '2px solid #3572EF', backgroundColor: 'white', transform: 'translateY(-50%)', zIndex: 1,
                      }}
                    />
                  )}
                  {(index !== 0 && index !== tourTemplate.schedule.length - 1) && (
                    <Box
                      sx={{
                        position: 'absolute', left: '4px', top: '17px', width: '15px', height: '15px', borderRadius: '50%',
                        backgroundColor: '#3572EF', transform: 'translateY(-50%)', zIndex: 1,
                      }}
                    />
                  )}
                  {index !== tourTemplate.schedule.length - 1 && (
                    <Box
                      sx={{
                        position: 'absolute', left: 10.5, top: '24px', bottom: -35,
                        width: '2px', backgroundColor: '#3572EF', zIndex: 0,
                      }}
                    />
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
                          <TextField
                            value={s.title}
                            onChange={(e) => handleScheduleChange(s.dayNumber, 'title', e.target.value)}
                            variant="outlined"
                            fullWidth
                          />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: '500' }}>Mô tả:</Typography>
                          <TextField
                            value={s.description}
                            onChange={(e) => handleScheduleChange(s.dayNumber, 'description', e.target.value)}
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={3}
                          />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: '500' }}>Điểm đến:</Typography>
                          <ReactSelect
                            isMulti
                            options={s.attractions.map(attraction => ({ value: attraction.attractionId, label: attraction.Name }))}
                            value={s.attractions.map(attr => ({ value: attr.attractionId, label: attr.name }))}
                            onChange={(selectedOptions) => handleAttractionChange(s.dayNumber, selectedOptions)}
                            placeholder="Chọn điểm đến"
                          />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                          <Button
                            variant="contained"
                            onClick={() => handleScheduleSubmit(s.dayNumber)}
                            sx={{ minWidth: '40px', padding: '8px' }}
                            disabled={!s.title.trim() || !s.description.trim() || s.attractions.length === 0}
                          >
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
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleRemoveDay(s.dayNumber)}
                      sx={{ mt: 2 }}
                    >
                      Xóa ngày
                    </Button>
                  )}
                </Box>
              ))}
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddDay}
                sx={{ mt: 2 }}
              >
                Thêm ngày
              </Button>
            </Box>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C' }}>Chính sách</Typography>
              {editableFields.policy.isEditing ? (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TextField
                    value={editableFields.policy.value}
                    onChange={(e) => handleFieldChange('policy', e.target.value)}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    sx={{ mr: 2 }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleFieldSubmit('policy')}
                    disabled={!editableFields.policy.value.trim()}
                    sx={{ minWidth: '40px', padding: '8px' }}
                  ><CheckIcon /></Button>
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
                  <TextField
                    value={editableFields.note.value}
                    onChange={(e) => handleFieldChange('note', e.target.value)}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    sx={{ mr: 2 }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleFieldSubmit('note')}
                    disabled={!editableFields.note.value.trim()}
                    sx={{ minWidth: '40px', padding: '8px' }}
                  ><CheckIcon /></Button>
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
                <Typography sx={{ color: '#05073C', display: 'flex' }}>
                  Mã tour mẫu:
                  <Typography sx={{ ml: 1, color: 'primary.main', fontWeight: 700 }}>{tourTemplate.code}</Typography>
                </Typography>
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
              <Button variant="contained" fullWidth sx={{ backgroundColor: 'gray', mb: 2, height: '50px', '&:hover': { backgroundColor: '#4F4F4F' } }}>Lưu bản nháp</Button>
              <Button variant="contained" fullWidth sx={{ height: '50px' }}>Gửi</Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default UpdateTourTemplate;