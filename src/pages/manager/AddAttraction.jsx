import React, { useState, useRef } from 'react';
import { Box, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Button, IconButton } from '@mui/material';
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
import { Link } from 'react-router-dom';

const AddAttraction = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, setSliderRef] = useState(null);
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);

  const [editableFields, setEditableFields] = useState({
    name: { value: '', isEditing: true },
    contactInfo: { value: '', isEditing: true },
    description: { value: '', isEditing: true },
    details: { value: '', isEditing: true }
  });

  const handleFieldChange = (field, value) => {
    setEditableFields(prev => ({
      ...prev,
      [field]: { ...prev[field], value }
    }));
  };

  const handleFieldSubmit = (field) => {
    if (!editableFields[field].value || editableFields[field].value.trim() === '' || editableFields[field].value.trim() === '<p><br></p>') {
      alert(`${field} cannot be blank or empty.`);
      return;
    }
    let cleanedValue = editableFields[field].value.replace(/<p><br><\/p>/g, '');
    setEditableFields(prev => ({
      ...prev,
      [field]: { ...prev[field], isEditing: false, value: cleanedValue }
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
    afterChange: (current) => setCurrentSlide(current)
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
    <Box className='main' sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Helmet>
        <title>Thêm điểm tham quan</title>
      </Helmet>
      <Box sx={{ m: '-60px', boxShadow: 2, pt: 4, pl: 4, pr: 4, pb: 1, mb: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Button
          component={Link}
          to="/quan-ly/diem-tham-quan"
          variant="contained"
          startIcon={<ArrowBackIosNewOutlinedIcon />}
          sx={{ 
            height: '55px', 
            backgroundColor: 'transparent', 
            boxShadow: 0, 
            color: 'gray', 
            mt: -1, ":hover" : { backgroundColor: 'transparent', boxShadow: 0, color: 'black', fontWeight: 700 }}}>
          Quay lại
        </Button>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'center', color: '#05073C', flexGrow: 1, ml: -15 }}>
          Tạo điểm tham quan
        </Typography>
      </Box>
      <Box sx={{ p: 3, flexGrow: 1, mt: 5 }}>
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
              >
                <CheckIcon />
              </Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C' }}>
              {editableFields.name.value}
            </Typography>
            <IconButton onClick={() => handleFieldEdit('name')} sx={{ ml: 2 }}>
              <EditIcon />
            </IconButton>
          </Box>
        )}
        <Grid container spacing={1}>
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ mb: 3, overflow: 'hidden' }}>
              <Box className="slick-slider" sx={{ height: '450px' }}>
                <Slider ref={sliderRef} {...settings}>
                  {images.length > 0 ? (
                    images.map((image, index) => (
                      <div key={index}>
                        <img
                          src={image.url}
                          alt={image.alt}
                          style={{ width: '100%', height: 'auto', maxHeight: '450px', objectFit: 'cover' }}
                        />
                      </div>
                    ))
                  ) : (
                    <div>
                      <img
                        src="https://doc.cerp.ideria.co/assets/images/image-a5238aed7050a0691758858b2569566d.jpg"
                        alt="Default"
                        style={{ width: '100%', height: 'auto', maxHeight: '450px', objectFit: 'cover' }}
                      />
                    </div>
                  )}
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
                    border: currentSlide === index ? '2px solid #3572EF' : 'none'
                  }}
                  onClick={() => handleThumbnailClick(index)}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </Box>
              ))}
              <Box
                sx={{
                  width: 110,
                  height: 110,
                  flexShrink: 0,
                  mr: 3,
                  borderRadius: 1,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: '2px dashed #3572EF'
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
            <Paper elevation={3} sx={{ p: 4, mb: 3, borderRadius: '10px', ml: 2 }}>
              <Typography variant="h4" sx={{ mb: 2, fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C', fontSize: '27px' }}>Thông tin liên hệ</Typography>
              {editableFields.contactInfo.isEditing ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', ml: -1, mr: -1 }}>
                  <ReactQuill
                    value={editableFields.contactInfo.value}
                    onChange={(value) => handleFieldChange('contactInfo', value)}
                    theme="snow"
                    modules={modules}
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
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div dangerouslySetInnerHTML={{ __html: editableFields.contactInfo.value }} />
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
      </Box>
    </Box >
  );
};

export default AddAttraction;
