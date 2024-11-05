import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Grid, Paper, TextField, Button, IconButton, Select, MenuItem } from '@mui/material';
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
import { Link, useParams, useNavigate } from 'react-router-dom';
import { fetchAttractionById, updateAttraction, updateAttractionImages } from '@services/AttractionService';
import { fetchProvinces } from '@services/ProvinceService';
import { fetchAttractionType } from '@services/AttractionTypeService';

const UpdateAttraction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, setSliderRef] = useState(null);
  const [images, setImages] = useState([]);
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const fileInputRef = useRef(null);
  const [provinces, setProvinces] = useState([]);
  const [attractionTypes, setAttractionTypes] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState('');
  const [editableFields, setEditableFields] = useState({
    name: { value: '', isEditing: false },
    contactInfo: { value: '', isEditing: false },
    description: { value: '', isEditing: false },
    address: { value: '', isEditing: false },
    website: { value: '', isEditing: false },
    type: { value: '', isEditing: false }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedProvinces, fetchedAttractionType, attractionData] = await Promise.all([
          fetchProvinces(),
          fetchAttractionType(),
          fetchAttractionById(id)
        ]);
        setProvinces(fetchedProvinces);
        setAttractionTypes(fetchedAttractionType);
        setSelectedProvince(attractionData.provinceId);
        setImages(attractionData.images || []);
        setEditableFields({
          name: { value: attractionData.name, isEditing: false },
          contactInfo: { value: attractionData.contactInfo, isEditing: false },
          description: { value: attractionData.description, isEditing: false },
          address: { value: attractionData.address, isEditing: false },
          website: { value: attractionData.website, isEditing: false },
          type: { value: attractionData.attractionTypeId, isEditing: false }
        });
      } catch (error) {
        console.error('Error fetching data:', error);
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

  const handleProvinceChange = (event) => {
    setSelectedProvince(event.target.value);
  };

  const handleSave = async (isDraft) => {
    try {
      const attractionData = {
        id: id,
        name: editableFields.name.value,
        address: editableFields.address.value,
        description: editableFields.description.value,
        contactInfo: editableFields.contactInfo.value,
        website: editableFields.website.value,
        provinceId: selectedProvince,
        attractionTypeId: editableFields.type.value,
        isDraft: isDraft,
      };

      if (!isDraft) {
        const requiredFields = ['name', 'address', 'description', 'contactInfo', 'provinceId', 'attractionTypeId'];
        const missingFields = requiredFields.filter(field => !attractionData[field]);
        if (missingFields.length > 0) {
          alert(`Vui lòng điền đầy đủ thông tin trước khi cập nhật.`);
          return;
        }
        if (images.length === 0) {
          alert('Vui lòng thêm ít nhất một hình ảnh cho điểm tham quan.');
          return;
        }
      } else {
        const requiredFields = ['provinceId', 'attractionTypeId'];
        const missingFields = requiredFields.filter(field => !attractionData[field]);
        if (missingFields.length > 0) {
          alert(`Vui lòng điền thông tin "Tỉnh/Thành phố" và "Loại điểm tham quan" để lưu nháp.`);
          return;
        }
      }

      // Update attraction details
      const response = await updateAttraction(attractionData);
      if (response.status === 200) {
        const newImages = images.filter(img => img instanceof File);
        if (newImages.length > 0 || removedImageIds.length > 0) {
          const imagesResponse = await updateAttractionImages(
            id,
            newImages.length > 0 ? newImages : null,
            removedImageIds.length > 0 ? removedImageIds : null
          );
          if (imagesResponse.statusCode !== 200) {
            alert('Có lỗi xảy ra khi cập nhật hình ảnh. Vui lòng thử lại.');
            return;
          }
        }
        navigate('/nhan-vien/diem-tham-quan');
      } else {
        alert('Có lỗi xảy ra khi cập nhật điểm tham quan. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Error updating attraction:', error);
      alert('Có lỗi xảy ra khi cập nhật điểm tham quan. Vui lòng thử lại.');
    }
  };

  return (
    <Box className='main' sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '98vw' }}>
      <Helmet>
        <title>Sửa điểm tham quan</title>
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
          Sửa điểm tham quan
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
                {attractionTypes.map((type) => (
                  <MenuItem key={type.attractionTypeId} value={type.attractionTypeId}>{type.attractionTypeName}</MenuItem>
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
              {attractionTypes.find(type => type.attractionTypeId === editableFields.type.value)?.attractionTypeName}
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
                sx={{ minWidth: '40px', padding: '8px' }}
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
          <Grid item xs={12} md={8}>
            <Paper elevation={3} sx={{ mb: 3, overflow: 'hidden', position: 'relative', maxWidth: '1000px' }}>
              <Box className="slick-slider-container" sx={{ height: '450px' }}>
                <Slider ref={setSliderRef} {...settings}>
                  {images.length > 0 ? (
                    images.map((image, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <img
                          src={image instanceof File ? URL.createObjectURL(image) : image.url}
                          alt={`Attraction image ${index + 1}`}
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
            <Box sx={{ display: 'flex', overflowX: 'auto', mb: 3 }}>
              {images.map((image, index) => (
                <Box
                  key={index}
                  sx={{ width: 110, height: 110, flexShrink: 0, mr: 3, borderRadius: 1, overflow: 'hidden', cursor: 'pointer', border: currentSlide === index ? '2px solid #3572EF' : 'none', position: 'relative' }}
                  onClick={() => handleThumbnailClick(index)}
                >
                  <img
                    src={image instanceof File ? URL.createObjectURL(image) : image.url}
                    alt={`Thumbnail ${index + 1}`}
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
                multiple
              />
            </Box>
            <Box sx={{ mb: 5 }}>
              <Typography variant="h4" sx={{ fontWeight: '700', fontFamily: 'Inter, sans-serif', textAlign: 'left', color: '#05073C', fontSize: '27px' }}>Giới thiệu</Typography>
              {editableFields.description.isEditing ? (
                <Box >
                  <ReactQuill
                    value={editableFields.description.value}
                    onChange={(value) => handleFieldChange('description', value)}
                    theme="snow"
                    modules={modules}
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
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mt: -4 }}>
                    <IconButton onClick={() => handleFieldEdit('description')}><EditIcon /></IconButton>
                  </Box>
                  <Box
                    dangerouslySetInnerHTML={{ __html: editableFields.description.value }}
                    sx={{
                      '& img': { width: '100%', height: 'auto', borderRadius: '4px', my: 2 },
                      '& p': { lineHeight: 1.7, mb: 2 }, flexGrow: 1, width: '100%', margin: '0 auto'
                    }} />
                </Box>
              )}
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
                sx={{ mr: 2, mb: 2 }}
              >
                {provinces.map((province) => (
                  <MenuItem key={province.provinceId} value={province.provinceId}>{province.provinceName}</MenuItem>
                ))}
              </Select>
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
                      sx={{ minWidth: '40px', padding: '8px', mr: -1.5 }}
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
                      disabled={!editableFields.website?.value?.trim()}
                      sx={{ minWidth: '40px', padding: '8px', mr: -1.5 }}
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
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 5 }}>
          <Button variant="contained" onClick={() => handleSave(true)} sx={{ backgroundColor: 'grey', p: 1.5, mr: 2 }}> Lưu bản nháp </Button>
          <Button variant="contained" onClick={() => handleSave(false)} sx={{ p: 1.5 }}> Cập nhật </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default UpdateAttraction;
