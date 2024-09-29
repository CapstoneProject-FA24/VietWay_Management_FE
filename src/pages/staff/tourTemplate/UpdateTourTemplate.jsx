import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Grid, Paper, TextField, Button, Container, Collapse, IconButton, Select, MenuItem } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faUser, faClock, faMoneyBill1, faLocationDot, faCalendarAlt, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { Helmet } from 'react-helmet';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import QrCodeOutlinedIcon from '@mui/icons-material/QrCodeOutlined';
import '@styles/AttractionDetails.css'
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import { Link, useParams } from 'react-router-dom';
import ReactSelect from 'react-select';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { mockProvinces, mockTourTemplateCategories, getTourTemplateById } from '@hooks/MockTourTemplate';
import { mockAttractions } from '@hooks/MockAttractions';

const UpdateTourTemplate = () => {
  const { id } = useParams();
  const [tourTemplate, setTourTemplate] = useState({
    TourName: '',
    TourTemplateProvinces: [],
    Duration: '',
    DeparturePoint: '',
    TourCategory: '',
    Description: '',
    Policy: '',
    Note: '',
    TourTemplateImages: [null, null, null, null],
    TourTemplateSchedule: []
  });
  const [editableFields, setEditableFields] = useState({
    TourName: { value: '', isEditing: false },
    Description: { value: '', isEditing: false },
    Policy: { value: '', isEditing: false },
    Note: { value: '', isEditing: false },
    TourTemplateProvinces: { value: [], isEditing: false },
    Duration: { value: '', isEditing: false },
    DeparturePoint: { value: '', isEditing: false },
    TourCategory: { value: '', isEditing: false },
  });
  const [expandedDay, setExpandedDay] = useState(null);
  const pageTopRef = useRef(null);

  useEffect(() => {
    const fetchTourTemplateData = async () => {
      try {
        const mockData = getTourTemplateById(id);
        setTourTemplate(mockData);
        setEditableFields({
          TourName: { value: mockData.TourName, isEditing: false },
          Description: { value: mockData.Description, isEditing: false },
          Policy: { value: mockData.Policy, isEditing: false },
          Note: { value: mockData.Note, isEditing: false },
          TourTemplateProvinces: { value: mockData.TourTemplateProvinces.map(province => ({ value: province.ProvinceId, label: province.ProvinceName })), isEditing: false },
          Duration: { value: mockData.Duration, isEditing: false },
          DeparturePoint: { value: mockData.DeparturePoint, isEditing: false },
          TourCategory: { value: mockData.TourCategory, isEditing: false },
        });
      } catch (error) {
        console.error("Error fetching tour template data:", error);
      }
    };

    fetchTourTemplateData();
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
          TourTemplateImages: prev.TourTemplateImages.map((img, i) => i === index ? { ...img, Path: reader.result } : img)
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = (index) => {
    setTourTemplate(prev => ({
      ...prev,
      TourTemplateImages: prev.TourTemplateImages.map((img, i) => i === index ? { ...img, Path: null } : img)
    }));
  };

  const handleDayClick = (day) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  const handleAddDay = () => {
    const newDay = tourTemplate.TourTemplateSchedule.length + 1;
    setTourTemplate(prev => ({
      ...prev,
      TourTemplateSchedule: [...prev.TourTemplateSchedule, { Day: newDay, Title: '', Description: '', AttractionSchedules: [], isEditing: true }]
    }));
    setExpandedDay(newDay);
  };

  const handleRemoveDay = (day) => {
    if (tourTemplate.TourTemplateSchedule.length > 1) {
      setTourTemplate(prev => ({
        ...prev,
        TourTemplateSchedule: prev.TourTemplateSchedule.filter(schedule => schedule.Day !== day)
          .map((schedule, index) => ({ ...schedule, Day: index + 1 }))
      }));
      setExpandedDay(null);
    }
  };

  const handleScheduleChange = (day, field, value) => {
    setTourTemplate(prev => ({
      ...prev,
      TourTemplateSchedule: prev.TourTemplateSchedule.map(item =>
        item.Day === day ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleAttractionChange = (day, selectedOptions) => {
    setTourTemplate(prev => ({
      ...prev,
      TourTemplateSchedule: prev.TourTemplateSchedule.map(item =>
        item.Day === day
          ? {
            ...item,
            AttractionSchedules: selectedOptions.map(option => ({
              AttractionId: option.value,
              AttractionName: option.label
            }))
          }
          : item
      )
    }));
  };

  const handleScheduleSubmit = (day) => {
    const schedule = tourTemplate.TourTemplateSchedule.find(item => item.Day === day);
    const isValid = schedule.Title.trim() !== '' && schedule.Description.trim() !== '' && schedule.AttractionSchedules.length > 0;

    if (isValid) {
      setTourTemplate(prev => ({
        ...prev,
        TourTemplateSchedule: prev.TourTemplateSchedule.map(item =>
          item.Day === day ? { ...item, isEditing: false } : item
        )
      }));
    } else {
      alert('Please ensure all fields are filled before submitting.');
    }
  };

  const handleScheduleEdit = (day) => {
    setTourTemplate(prev => ({
      ...prev,
      TourTemplateSchedule: prev.TourTemplateSchedule.map(item =>
        item.Day === day ? { ...item, isEditing: true } : item
      )
    }));
    setExpandedDay(day);
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
        {editableFields.TourTemplateProvinces.isEditing ? (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ReactSelect
              isMulti
              name="provinces"
              options={mockProvinces.map(province => ({ value: province.ProvinceId, label: province.ProvinceName }))}
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="Chọn tỉnh/thành phố"
              value={editableFields.TourTemplateProvinces.value}
              onChange={(selectedOptions) => handleFieldChange('TourTemplateProvinces', selectedOptions)}
            />
            <Button
              variant="contained"
              onClick={() => handleFieldSubmit('TourTemplateProvinces')}
              disabled={editableFields.TourTemplateProvinces.value.length === 0}
              sx={{ minWidth: '40px', padding: '8px', ml: 2 }}
            ><CheckIcon /></Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography gutterBottom sx={{ fontFamily: 'Inter, sans-serif', textAlign: 'left', color: 'grey', fontSize: '1.15rem' }}>
              {editableFields.TourTemplateProvinces.value.map(province => province.label).join(' - ')}
            </Typography>
            <IconButton onClick={() => handleFieldEdit('TourTemplateProvinces')} sx={{ ml: 2 }}><EditIcon /></IconButton>
          </Box>
        )}
        {editableFields.TourName.isEditing ? (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography gutterBottom sx={{ backgroundColor: 'white', pl: 1, pr: 1, color: 'grey', ml: 2, mb: -1.5, zIndex: 1, width: 'fit-content' }}>
              Tên tour
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextField
                value={editableFields.TourName.value}
                onChange={(e) => handleFieldChange('TourName', e.target.value)}
                variant="outlined"
                fullWidth
                sx={{ mr: 2 }}
              />
              <Button
                variant="contained"
                onClick={() => handleFieldSubmit('TourName')}
                disabled={!editableFields.TourName.value.trim()}
                sx={{ minWidth: '40px', padding: '8px' }}
              ><CheckIcon /></Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C' }}>
              {editableFields.TourName.value}
            </Typography>
            <IconButton onClick={() => handleFieldEdit('TourName')} sx={{ ml: 2 }}><EditIcon /></IconButton>
          </Box>
        )}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Container maxWidth="lg">
              <Box sx={{ display: 'flex', width: '100%', height: '450px', mb: 3, ml: -2.5 }}>
                <Box sx={{ flex: '0 0 60%', mr: 2, position: 'relative' }}>
                  {tourTemplate.TourTemplateImages[0]?.Path ? (
                    <>
                      <img src={tourTemplate.TourTemplateImages[0].Path} alt="Tour image 1" style={{ width: '100%', height: '450px', objectFit: 'cover' }} />
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
                    {tourTemplate.TourTemplateImages[1]?.Path ? (
                      <>
                        <img src={tourTemplate.TourTemplateImages[1].Path} alt="Tour image 2" style={{ width: '100%', height: '215px', objectFit: 'cover' }} />
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
                      {tourTemplate.TourTemplateImages[2]?.Path ? (
                        <>
                          <img src={tourTemplate.TourTemplateImages[2].Path} alt="Tour image 3" style={{ width: '100%', height: '215px', objectFit: 'cover' }} />
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
                      {tourTemplate.TourTemplateImages[3]?.Path ? (
                        <>
                          <img src={tourTemplate.TourTemplateImages[3].Path} alt="Tour image 4" style={{ width: '100%', height: '215px', objectFit: 'cover' }} />
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 4, ml: 2, mr: 2, width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '33%' }}>
                <FontAwesomeIcon icon={faClock} style={{ marginRight: '10px', fontSize: '1.6rem', color: '#3572EF' }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography sx={{ color: '#05073C', fontWeight: 600 }}>Thời lượng:</Typography>
                  {editableFields.Duration.isEditing ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <TextField
                        value={editableFields.Duration.value}
                        onChange={(e) => handleFieldChange('Duration', e.target.value)}
                        variant="outlined"
                        sx={{ mr: 1 }}
                      />
                      <Button
                        variant="contained"
                        onClick={() => handleFieldSubmit('Duration')}
                        disabled={!editableFields.Duration.value.trim()}
                        sx={{ minWidth: '40px', padding: '8px' }}
                      ><CheckIcon /></Button>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ color: '#05073C' }}>{editableFields.Duration.value}</Typography>
                      <IconButton onClick={() => handleFieldEdit('Duration')} sx={{ ml: 2 }}><EditIcon /></IconButton>
                    </Box>
                  )}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '33%' }}>
                <FontAwesomeIcon icon={faLocationDot} style={{ marginRight: '10px', fontSize: '1.6rem', color: '#3572EF' }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                  <Typography sx={{ color: '#05073C', fontWeight: 600 }}>Khởi hành từ:</Typography>
                  {editableFields.DeparturePoint.isEditing ? (
                    <Box sx={{ display: 'flex', mb: 2, width: '100%', alignItems: 'center', }}>
                      <Select
                        fullWidth
                        sx={{ flexGrow: 1, mr: 1 }}
                        value={editableFields.DeparturePoint.value}
                        onChange={(e) => handleFieldChange('DeparturePoint', e.target.value)}
                      >
                        {mockProvinces.map((DeparturePoint) => (
                          <MenuItem key={DeparturePoint.ProvinceId} value={DeparturePoint.ProvinceName}>{DeparturePoint.ProvinceName}</MenuItem>
                        ))}
                      </Select>
                      <Button
                        variant="contained"
                        onClick={() => handleFieldSubmit('DeparturePoint')}
                        disabled={!editableFields.DeparturePoint.value}
                        sx={{ minWidth: '40px', padding: '8px' }}
                      ><CheckIcon /></Button>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ color: '#05073C' }}>{editableFields.DeparturePoint.value}</Typography>
                      <IconButton onClick={() => handleFieldEdit('DeparturePoint')} sx={{ ml: 2 }}><EditIcon /></IconButton>
                    </Box>
                  )}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '33%' }}>
                <FontAwesomeIcon icon={faMoneyBill1} style={{ marginRight: '10px', fontSize: '1.6rem', color: '#3572EF' }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                  <Typography sx={{ color: '#05073C', fontWeight: 600 }}>Loại tour:</Typography>
                  {editableFields.TourCategory.isEditing ? (
                    <Box sx={{ display: 'flex', mb: 2, width: '100%', alignItems: 'center', }}>
                      <Select
                        sx={{ width: '100%', mr: 1 }}
                        value={editableFields.TourCategory.value}
                        onChange={(e) => handleFieldChange('TourCategory', e.target.value)}
                      >
                        {mockTourTemplateCategories.map((TourCategory) => (
                          <MenuItem key={TourCategory.TourTemplateCategoryId} value={TourCategory.CategoryName}>{TourCategory.CategoryName}</MenuItem>
                        ))}
                      </Select>
                      <Button
                        variant="contained"
                        onClick={() => handleFieldSubmit('TourCategory')}
                        disabled={!editableFields.TourCategory.value}
                        sx={{ minWidth: '40px', padding: '8px' }}
                      ><CheckIcon /></Button>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ color: '#05073C' }}>{editableFields.TourCategory.value}</Typography>
                      <IconButton onClick={() => handleFieldEdit('TourCategory')} sx={{ ml: 2 }}><EditIcon /></IconButton>
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C' }}>Tổng quan</Typography>
              {editableFields.Description.isEditing ? (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TextField
                    value={editableFields.Description.value}
                    onChange={(e) => handleFieldChange('Description', e.target.value)}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    sx={{ mr: 2 }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleFieldSubmit('Description')}
                    disabled={!editableFields.Description.value.trim()}
                    sx={{ minWidth: '40px', padding: '8px' }}
                  ><CheckIcon /></Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography paragraph sx={{ textAlign: 'justify', color: '#05073C' }}>{editableFields.Description.value}</Typography>
                  <IconButton onClick={() => handleFieldEdit('Description')} sx={{ ml: 2 }}><EditIcon /></IconButton>
                </Box>
              )}
            </Box>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C', mb: 3 }}>Lịch trình</Typography>
              {tourTemplate.TourTemplateSchedule.map((schedule, index) => (
                <Box key={schedule.Day} sx={{ pl: 6, position: 'relative', mb: 3 }}>
                  {(index === 0 || index === tourTemplate.TourTemplateSchedule.length - 1) && (
                    <Box
                      sx={{
                        position: 'absolute', left: 0, top: '18px', width: '24px', height: '24px', borderRadius: '50%',
                        border: '2px solid #3572EF', backgroundColor: 'white', transform: 'translateY(-50%)', zIndex: 1,
                      }}
                    />
                  )}
                  {(index !== 0 && index !== tourTemplate.TourTemplateSchedule.length - 1) && (
                    <Box
                      sx={{
                        position: 'absolute', left: '4px', top: '17px', width: '15px', height: '15px', borderRadius: '50%', 
                        backgroundColor: '#3572EF', transform: 'translateY(-50%)', zIndex: 1,
                      }}
                    />
                  )}
                  {index !== tourTemplate.TourTemplateSchedule.length - 1 && (
                    <Box
                      sx={{
                        position: 'absolute', left: 10.5, top: '24px', bottom: -35,
                        width: '2px', backgroundColor: '#3572EF', zIndex: 0,
                      }}
                    />
                  )}
                  {schedule.isEditing ? (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'relative', ml: 1 }} onClick={() => handleDayClick(schedule.Day)}>
                        <Typography variant="h6" sx={{ fontWeight: '500', mr: 1 }}>
                          {`Ngày ${schedule.Day}`}
                        </Typography>
                        <IconButton size="small">
                          {expandedDay === schedule.Day ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </Box>
                      <Collapse in={expandedDay === schedule.Day} sx={{ mt: 1, ml: 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: '500' }}>Tiêu đề:</Typography>
                          <TextField
                            value={schedule.Title}
                            onChange={(e) => handleScheduleChange(schedule.Day, 'Title', e.target.value)}
                            variant="outlined"
                            fullWidth
                          />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: '500' }}>Mô tả:</Typography>
                          <TextField
                            value={schedule.Description}
                            onChange={(e) => handleScheduleChange(schedule.Day, 'Description', e.target.value)}
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
                            options={mockAttractions.map(attraction => ({ value: attraction.AttractionId, label: attraction.Name }))}
                            value={schedule.AttractionSchedules.map(attr => ({ value: attr.AttractionId, label: attr.AttractionName }))}
                            onChange={(selectedOptions) => handleAttractionChange(schedule.Day, selectedOptions)}
                            placeholder="Chọn điểm đến"
                          />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                          <Button
                            variant="contained"
                            onClick={() => handleScheduleSubmit(schedule.Day)}
                            sx={{ minWidth: '40px', padding: '8px' }}
                            disabled={!schedule.Title.trim() || !schedule.Description.trim() || schedule.AttractionSchedules.length === 0}
                          >
                            <CheckIcon />
                          </Button>
                        </Box>
                      </Collapse>
                    </>
                  ) : (
                    <>
                      <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', position: 'relative', ml: 1 }} onClick={() => handleDayClick(schedule.Day)}>
                        <Typography variant="h6" sx={{ fontWeight: '500', mr: 1 }}>
                          {`Ngày ${schedule.Day}: ${schedule.Title}`}
                        </Typography>
                        <IconButton size="small">
                          {expandedDay === schedule.Day ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </Box>
                      <Collapse in={expandedDay === schedule.Day} sx={{ ml: 1 }}>
                        <Typography paragraph sx={{ mb: 2 }}>{schedule.Description}</Typography>
                        <Typography variant="subtitle1" sx={{ fontWeight: '500', mb: 1 }}>Điểm đến:</Typography>
                        <ul>
                          {schedule.AttractionSchedules.map((attraction) => (
                            <li key={attraction.AttractionId}>{attraction.AttractionName}</li>
                          ))}
                        </ul>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                          <IconButton onClick={() => handleScheduleEdit(schedule.Day)}><EditIcon /></IconButton>
                        </Box>
                      </Collapse>
                    </>
                  )}
                  {tourTemplate.TourTemplateSchedule.length > 1 && (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleRemoveDay(schedule.Day)}
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
              {editableFields.Policy.isEditing ? (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TextField
                    value={editableFields.Policy.value}
                    onChange={(e) => handleFieldChange('Policy', e.target.value)}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    sx={{ mr: 2 }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleFieldSubmit('Policy')}
                    disabled={!editableFields.Policy.value.trim()}
                    sx={{ minWidth: '40px', padding: '8px' }}
                  ><CheckIcon /></Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography paragraph sx={{ textAlign: 'justify', color: '#05073C' }}>{editableFields.Policy.value}</Typography>
                  <IconButton onClick={() => handleFieldEdit('Policy')} sx={{ ml: 2 }}><EditIcon /></IconButton>
                </Box>
              )}
            </Box>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h5" gutterBottom sx={{ textAlign: 'left', fontWeight: '700', fontSize: '1.6rem', color: '#05073C' }}>Lưu ý</Typography>
              {editableFields.Note.isEditing ? (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TextField
                    value={editableFields.Note.value}
                    onChange={(e) => handleFieldChange('Note', e.target.value)}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    sx={{ mr: 2 }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleFieldSubmit('Note')}
                    disabled={!editableFields.Note.value.trim()}
                    sx={{ minWidth: '40px', padding: '8px' }}
                  ><CheckIcon /></Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography paragraph sx={{ textAlign: 'justify', color: '#05073C' }}>{editableFields.Note.value}</Typography>
                  <IconButton onClick={() => handleFieldEdit('Note')} sx={{ ml: 2 }}><EditIcon /></IconButton>
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
                  <Typography sx={{ color: '#05073C', ml: 1, color: 'primary.main', fontWeight: 700 }}>{tourTemplate.TourCode}</Typography>
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '10px', color: '#3572EF' }} />
                <Typography sx={{ color: '#05073C' }}>Ngày tạo: {new Date(tourTemplate.CreatedDate).toLocaleDateString('vi-VN')}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FontAwesomeIcon icon={faUser} style={{ marginRight: '10px', color: '#3572EF' }} />
                <Typography sx={{ color: '#05073C' }}>Người tạo: {tourTemplate.CreatedBy}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '10px', color: '#3572EF' }} />
                <Typography sx={{ color: '#05073C', display: 'flex' }}>
                  Trạng thái:
                  <Typography sx={{ color: '#05073C', ml: 1, color: tourTemplate.Status === 'Chờ duyệt' ? 'primary.main' : tourTemplate.Status === 'Đã duyệt' ? 'green' : 'red', }}>{tourTemplate.Status}</Typography>
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