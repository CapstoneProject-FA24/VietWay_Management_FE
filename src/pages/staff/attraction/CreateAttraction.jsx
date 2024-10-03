import React, { useState, useRef } from 'react';
import { Box, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Button, IconButton, Select, MenuItem } from '@mui/material';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Helmet } from 'react-helmet';
import '@styles/AttractionDetails.css'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
import { mockAttractionTypes } from '@hooks/MockAttractions';

const AddAttraction = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, setSliderRef] = useState(null);
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const [editableFields, setEditableFields] = useState({
    name: { value: '', isEditing: true },
    contactInfo: { value: '', isEditing: true },
    description: { value: '', isEditing: true },
    details: { value: '', isEditing: true },
    address: { value: '', isEditing: true },
    website: { value: '', isEditing: true },
    type: { value: '', isEditing: true }
  });

  const handleFieldChange = (field, value) => {
    setEditableFields(prev => ({
      ...prev,
      [field]: { ...prev[field], value }
    }));
  };

  const handleFieldSubmit = (field) => {
    if (!editableFields[field].value) {
      alert(`${field} cannot be blank or empty.`);
      return;
    }
    setEditableFields(prev => ({
      ...prev,
      [field]: { ...prev[field], isEditing: false }
    }));
  };

  const handleFieldEdit = (field) => {
    setEditableFields(prev => ({
      ...prev,
      [field]: { ...prev[field], isEditing: true }
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
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          url: e.target.result,
          alt: file.name
        };
        setImages([...images, newImage]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    if (currentSlide >= newImages.length) {
      setCurrentSlide(newImages.length - 1);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'color': [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']  // remove formatting button
    ],
    clipboard: {
      matchVisual: false
    }
  };

  return (
    <Box className='main' sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', minWidth: '100vw' }}>
      <Helmet>
        <title>Thêm điểm tham quan</title>
      </Helmet>
      <Box sx={{ m: '-60px', boxShadow: 2, pt: 4, pl: 4, pr: 4, pb: 1, mb: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Button
          component={Link}
          to="/nhan-vien/diem-tham-quan"
          variant="contained"
          startIcon={<ArrowBackIosNewOutlinedIcon />}
          sx={{ height: '55px', backgroundColor: 'transparent', boxShadow: 0, color: 'gray', mt: -1, ":hover": { backgroundColor: 'transparent', boxShadow: 0, color: 'black', fontWeight: 700 } }}>
          Quay lại
        </Button>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'center', color: '#05073C', flexGrow: 1, ml: -15 }}>
          Tạo điểm tham quan
        </Typography>
      </Box>
      <Box sx={{ p: 3, flexGrow: 1, mt: 5 }}>
        {editableFields.type.isEditing ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', width: '35%' }}>
            <Typography gutterBottom sx={{ backgroundColor: 'white', pl: 1, pr: 1, color: 'grey', ml: 2, mb: -1.5, zIndex: 1, width: 'fit-content' }}>
              Loại điểm tham quan
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Select
                value={editableFields.type.value}
                onChange={(e) => handleFieldChange('type', e.target.value)}
                variant="outlined"
                fullWidth
                sx={{ mr: 2 }}
              >
                {mockAttractionTypes.map((type) => (
                  <MenuItem key={type.typeId} value={type.typeId}>{type.typeName}</MenuItem>
                ))}
              </Select>
              <Button
                variant="contained"
                onClick={() => handleFieldSubmit('type')}
                disabled={!editableFields.type.value}
                sx={{ minWidth: '40px', padding: '8px' }}
              >
                <CheckIcon />
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body1" gutterBottom sx={{ fontFamily: 'Inter, sans-serif', textAlign: 'left', color: 'gray', fontSize: '1.2rem' }}>
              {mockAttractionTypes.find(type => type.TypeId === editableFields.type.value)?.TypeName || ''}
            </Typography>
            <IconButton onClick={() => handleFieldEdit('type')} sx={{ ml: 2 }}>
              <EditIcon />
            </IconButton>
          </Box>
        )}
        {editableFields.name.isEditing ? (
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography gutterBottom sx={{ backgroundColor: 'white', pl: 1, pr: 1, color: 'grey', ml: 2, mb: -1.5, zIndex: 1, width: 'fit-content' }}>
              Tên điểm tham quan
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextField
                value={editableFields.name.value}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                variant="outlined"
                fullWidth
                sx={{ mr: 2 }}
              />
              <Button
                variant="contained"
                onClick={() => handleFieldSubmit('name')}
                disabled={!editableFields.name.value.trim()}
                sx={{ minWidth: '40px', padding: '8px' }}  // Reduce button width and padding
              ><CheckIcon /></Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C' }}>
              {editableFields.name.value}
            </Typography>
            <IconButton onClick={() => handleFieldEdit('name')} sx={{ ml: 2 }}><EditIcon /></IconButton>
          </Box>
        )}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} sx={{ width: '100%'}}>
            <Paper elevation={3} sx={{ mb: 3, overflow: 'hidden', position: 'relative', maxWidth: '1000px' }}>
              <Box className="slick-slider-container" sx={{ height: '450px' }}>
                <Slider ref={setSliderRef} {...settings}>
                  {images.length > 0 ? (
                    images.map((image, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <img
                          src={image.url}
                          alt={image.alt}
                          style={{ width: '100%', height: '450px', objectFit: 'cover' }}
                        />
                        <IconButton
                          onClick={() => handleRemoveImage(index)}
                          sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </div>
                    ))
                  ) : (
                    <div>
                      <img
                        src="https://doc.cerp.ideria.co/assets/images/image-a5238aed7050a0691758858b2569566d.jpg"
                        alt="Default"
                        style={{ width: '100%', height: '450px', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                </Slider>
              </Box>
            </Paper>
            <Box sx={{ display: 'flex', overflowX: 'auto', mb: 3, maxWidth: '100%' }}>
              {images.map((image, index) => (
                <Box
                  key={index}
                  sx={{ maxWidth: 110, height: 110, flexShrink: 0, mr: 3, borderRadius: 1, overflow: 'hidden', cursor: 'pointer', border: currentSlide === index ? '2px solid #3572EF' : 'none', position: 'relative' }}
                  onClick={() => handleThumbnailClick(index)}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(index);
                    }}
                    sx={{
                      position: 'absolute',
                      top: 5,
                      right: 5,
                      backgroundColor: 'rgba(255, 255, 255, 0.7)',
                      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
                      padding: '2px',
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 16 }} />
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
              />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C', fontSize: '27px' }}>Giới thiệu</Typography>
              {editableFields.description.isEditing ? (
                <Box >
                  <TextField
                    variant="outlined"
                    multiline
                    rows={5}
                    value={editableFields.description.value}
                    onChange={(e) => handleFieldChange('description', e.target.value)}
                    fullWidth
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                      }
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={() => handleFieldSubmit('description')}
                      disabled={!editableFields.description.value.trim() || editableFields.description.value.trim() === '<p><br></p>'}
                      sx={{ minWidth: '40px', padding: '8px' }}
                    >
                      <CheckIcon />
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <div dangerouslySetInnerHTML={{ __html: editableFields.description.value }} />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                    <IconButton onClick={() => handleFieldEdit('description')}>
                      <EditIcon />
                    </IconButton>
                  </Box>
                </Box>
              )}
            </Box>
            <Box>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C', fontSize: '27px' }}>Thông tin chi tiết</Typography>
              {editableFields.details.isEditing ? (
                <Box >
                  <ReactQuill
                    value={editableFields.details.value}
                    onChange={(value) => handleFieldChange('details', value)}
                    theme="snow"
                    modules={modules}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={() => handleFieldSubmit('details')}
                      disabled={!editableFields.details.value.trim() || editableFields.details.value.trim() === '<p><br></p>'}
                      sx={{ minWidth: '40px', padding: '8px' }}
                    >
                      <CheckIcon />
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', mt: -3 }}>
                  <div dangerouslySetInnerHTML={{ __html: editableFields.details.value }} />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                    <IconButton onClick={() => handleFieldEdit('details')}>
                      <EditIcon />
                    </IconButton>
                  </Box>
                </Box>
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 4, mb: 3, borderRadius: '10px' }}>
              <Typography sx={{ fontWeight: 700, minWidth: '4rem' }}>Địa chỉ: </Typography>
              {editableFields.address.isEditing ? (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 1 }}>
                    <TextField
                      value={editableFields.address.value}
                      onChange={(e) => handleFieldChange('address', e.target.value)}
                      variant="outlined"
                      fullWidth
                      sx={{ mr: 1 }}
                    />
                    <Button
                      variant="contained"
                      onClick={() => handleFieldSubmit('address')}
                      disabled={!editableFields.address.value.trim()}
                      sx={{ minWidth: '40px', padding: '8px', mr: -1.5 }}  // Reduce button width and padding
                    ><CheckIcon /></Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Typography>{editableFields.address.value}</Typography>
                  <IconButton onClick={() => handleFieldEdit('address')} sx={{ mr: -1, ml: -0.5 }}><EditIcon /></IconButton>
                </Box>
              )}

              <Typography sx={{ fontWeight: 700, minWidth: '4rem' }}>Website: </Typography>
              {editableFields.website.isEditing ? (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 1 }}>
                    <TextField
                      value={editableFields.website.value}
                      onChange={(e) => handleFieldChange('website', e.target.value)}
                      variant="outlined"
                      fullWidth
                      sx={{ mr: 1 }}
                    />
                    <Button
                      variant="contained"
                      onClick={() => handleFieldSubmit('website')}
                      disabled={!editableFields.website.value.trim()}
                      sx={{ minWidth: '40px', padding: '8px', mr: -1.5 }}  // Reduce button width and padding
                    ><CheckIcon /></Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <a href={editableFields.website.value} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }}>
                    {editableFields.website.value}
                  </a>
                  <IconButton onClick={() => handleFieldEdit('website')} sx={{ mr: -1, ml: -0.5 }}><EditIcon /></IconButton>
                </Box>
              )}

              <Typography variant="h4" sx={{ mt: 4, fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C', fontSize: '27px' }}>Thông tin liên hệ</Typography>
              {editableFields.contactInfo.isEditing ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', ml: -1, mr: -1, mt: 2 }}>
                  <ReactQuill
                    value={editableFields.contactInfo.value}
                    onChange={(value) => handleFieldChange('contactInfo', value)}
                    theme="snow"
                    modules={modules}
                    style={{ width: '100%' }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mt: 2 }}>
                    <Button
                      variant="contained"
                      onClick={() => handleFieldSubmit('contactInfo')}
                      disabled={!editableFields.contactInfo.value.trim() || editableFields.contactInfo.value.trim() === '<p><br></p>'}
                      sx={{ minWidth: '40px', padding: '8px' }}
                    >
                      <CheckIcon />
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                  <div style={{ width: '100%', wordBreak: 'break-all' }} dangerouslySetInnerHTML={{ __html: editableFields.contactInfo.value }} />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                    <IconButton onClick={() => handleFieldEdit('contactInfo')}>
                      <EditIcon />
                    </IconButton>
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5}}>
          <Button variant="contained" sx={{ backgroundColor: 'grey', p: 1.5, mr: 2 }}> Lưu bản nháp </Button>
          <Button variant="contained" sx={{ p: 1.5 }}> Tạo mới </Button>
        </Box>
      </Box>
    </Box >
  );
};

export default AddAttraction;
