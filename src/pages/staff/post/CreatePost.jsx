import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, TextField, Select, MenuItem } from '@mui/material';
import { ArrowBack, Create } from '@mui/icons-material';
//import { toast } from 'react-toastify';
import SidebarStaff from '@layouts/SidebarStaff';
import { fetchProvinces } from '@services/ProvinceService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const commonStyles = {
  boxContainer: { display: 'flex', alignItems: 'center', gap: 2, mb: 2 },
  
  flexContainer: { display: 'flex', alignItems: 'center', flex: 1, width: '80%' },
  
  labelTypography: {
    color: '#05073C',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    marginRight: '1rem'
  },
  
  inputField: {
    '& .MuiOutlinedInput-root': {
      height: '40px',
    },
    '& .MuiOutlinedInput-input': {
      padding: '8px 14px'
    }
  },
  
  imageContainer: { 
    mb: 2, 
    flexGrow: 1, 
    position: 'relative', 
    '&:hover .overlay': { opacity: 1 }, 
    '&:hover .change-image-btn': { opacity: 1 } 
  },
  
  editorContainer: {
    '& .ql-container': {
      minHeight: '200px',
      fontSize: '1.1rem'
    },
    '& .ql-editor': {
      minHeight: '200px',
      fontSize: '1.1rem'
    }
  }
};

const CreatePost = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(true);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    description: '',
    category: '',
    provinceId: '',
    provinceName: '',
    createDate: new Date().toISOString().split('T')[0],
    image: null,
    status: '0' // Mặc định là bản nháp
  });

  useEffect(() => {
    const loadProvinces = async () => {
      setIsLoadingProvinces(true);
      try {
        const fetchedProvinces = await fetchProvinces();
        const formattedProvinces = fetchedProvinces.map(province => ({
          value: province.provinceId,
          label: province.provinceName
        }));
        setProvinceOptions(formattedProvinces);
      } catch (error) {
        console.error('Error loading provinces:', error);
        //toast.error('Lỗi khi tải danh sách tỉnh thành');
      } finally {
        setIsLoadingProvinces(false);
      }
    };
    loadProvinces();
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleFieldChange = (field, value) => {
    setNewPost(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProvinceChange = (event) => {
    const selectedProvince = provinceOptions.find(
      option => option.value === event.target.value
    );
    if (selectedProvince) {
      handleFieldChange('provinceId', selectedProvince.value);
      handleFieldChange('provinceName', selectedProvince.label);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleFieldChange('image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = async () => {
    try {
      // Validate required fields
      if (!newPost.title || !newPost.content || !newPost.category || !newPost.provinceId) {
        //toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
        return;
      }

      // Call API to create new post
      // const response = await createPost(newPost);
      console.log('Creating new post:', newPost);
      
      //toast.success('Tạo bài viết mới thành công');
      navigate('/nhan-vien/bai-viet');
    } catch (error) {
      console.error('Error creating post:', error);
      //toast.error('Lỗi khi tạo bài viết mới');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Box sx={{ display: 'flex' }}>
        <SidebarStaff isOpen={isSidebarOpen} toggleSidebar={handleSidebarToggle} />
        
        <Box sx={{ 
          flexGrow: 1, 
          p: 3, 
          transition: 'margin-left 0.3s', 
          marginLeft: isSidebarOpen ? '260px' : '20px',
          width: `calc(100% - ${isSidebarOpen ? '260px' : '20px'})`,
          maxWidth: '100vw'
        }}>
          <Box maxWidth="100vw">
            <Paper elevation={2} sx={{ 
              p: 3, 
              mb: 3, 
              height: '100%', 
              width: isSidebarOpen ? 'calc(95vw - 250px)' : '95vw'
            }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                <Button
                  startIcon={<ArrowBack />}
                  onClick={() => navigate(-1)}
                  sx={{ width: 'fit-content' }}
                >
                  Quay lại
                </Button>
                
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontSize: '2.7rem', 
                    fontWeight: 600, 
                    color: 'primary.main',
                    alignSelf: 'center',
                    marginBottom: '1rem'
                  }}
                >
                  Tạo bài viết mới
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <TextField 
                  label="Tiêu đề" 
                  value={newPost.title} 
                  onChange={(e) => handleFieldChange('title', e.target.value)} 
                  variant="outlined" 
                  fullWidth 
                  required
                  sx={{ mb: 2 }} 
                />

                <Box sx={commonStyles.boxContainer}>
                  <Box sx={commonStyles.flexContainer}>
                    <Typography sx={commonStyles.labelTypography}>
                      Danh mục:
                    </Typography>
                    <Select 
                      value={newPost.category} 
                      onChange={(e) => handleFieldChange('category', e.target.value)} 
                      variant="outlined" 
                      fullWidth 
                      required
                      sx={commonStyles.inputField}
                    >
                      <MenuItem value="Văn hóa">Văn hóa</MenuItem>
                      <MenuItem value="Ẩm thực">Ẩm thực</MenuItem>
                      <MenuItem value="Kinh nghiệm du lịch">Kinh nghiệm du lịch</MenuItem>
                      <MenuItem value="Nơi lưu trú">Nơi lưu trú</MenuItem>
                      <MenuItem value="Mua sắm và giải trí">Mua sắm và giải trí</MenuItem>
                      <MenuItem value="Tin tức du lịch">Tin tức du lịch</MenuItem>
                    </Select>
                  </Box>

                  <Box sx={commonStyles.flexContainer}>
                    <Typography sx={commonStyles.labelTypography}>
                      Tỉnh/Thành phố:
                    </Typography>
                    <Select 
                      value={newPost.provinceId} 
                      onChange={handleProvinceChange} 
                      variant="outlined" 
                      fullWidth 
                      required
                      sx={commonStyles.inputField} 
                      disabled={isLoadingProvinces}
                    >
                      {provinceOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>

                  <Box sx={commonStyles.flexContainer}>
                    <Typography sx={commonStyles.labelTypography}>
                      Ngày tạo:
                    </Typography>
                    <TextField 
                      type="date" 
                      value={newPost.createDate} 
                      onChange={(e) => handleFieldChange('createDate', e.target.value)} 
                      variant="outlined" 
                      fullWidth 
                      sx={commonStyles.inputField} 
                    />
                  </Box>
                </Box>

                <TextField 
                  label="Mô tả" 
                  value={newPost.description} 
                  onChange={(e) => handleFieldChange('description', e.target.value)} 
                  variant="outlined" 
                  fullWidth 
                  multiline
                  rows={3}
                  sx={{ mb: 2 }} 
                />

                <Box sx={commonStyles.imageContainer}>
                  <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem', fontWeight: 600 }}>
                    Ảnh
                  </Typography>
                  <Box sx={{ 
                    position: 'relative', 
                    width: '100%', 
                    height: '300px', 
                    border: '2px dashed #ccc',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden'
                  }}>
                    {newPost.image ? (
                      <img 
                        src={newPost.image} 
                        alt="Preview" 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'contain' 
                        }} 
                      />
                    ) : (
                      <img 
                        src="/add-image.png"
                        alt="Add image"
                        style={{
                          width: '100px',
                          height: '100px',
                          opacity: 0.5
                        }}
                      />
                    )}
                    <Button
                      variant="outlined"
                      component="label"
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        '&:hover': { opacity: 1 },
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        color: '#000',
                        border: '1px solid #ccc',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #999'
                        }
                      }}
                    >
                      Chọn ảnh cho bài viết
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </Button>
                  </Box>
                </Box>

                <Box sx={commonStyles.editorContainer}>
                  <Typography sx={{ ...commonStyles.labelTypography, mb: 1 }}>
                    Nội dung
                  </Typography>
                  <ReactQuill
                    value={newPost.content}
                    onChange={(value) => handleFieldChange('content', value)}
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['link', 'image'],
                        ['clean']
                      ],
                    }}
                    theme="snow"
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<Create />} 
                    onClick={handleCreatePost}
                  >
                    Tạo bài viết
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CreatePost;
