import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Button, TextField, Select, MenuItem, Snackbar, Alert } from '@mui/material';
import { ArrowBack, Create } from '@mui/icons-material';
import SidebarStaff from '@layouts/SidebarStaff';
import { fetchProvinces } from '@services/ProvinceService';
import { fetchPostCategory } from '@services/PostCategoryService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import dayjs from 'dayjs';
import { createPost, updatePostImages } from '@services/PostService';
import { Helmet } from 'react-helmet';

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
  const [postCategoryOptions, setPostCategoryOptions] = useState([]);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
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
        const fetchedProvinces = await fetchProvinces({ pageSize: 63, pageIndex: 1 });
        const formattedProvinces = fetchedProvinces.items.map(province => ({
          value: province.provinceId,
          label: province.provinceName
        }));
        const fetchedPostCategories = await fetchPostCategory();
        const formattedPostCategories = fetchedPostCategories.map(postCategory => ({
          value: postCategory.postCategoryId,
          label: postCategory.name
        }));
        setProvinceOptions(formattedProvinces);
        setPostCategoryOptions(formattedPostCategories);
      } catch (error) {
        console.error('Error loading provinces:', error);
        setSnackbar({
          open: true,
          message: 'Lỗi khi tải danh sách tỉnh thành',
          severity: 'error'
        });
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

  const handleCreatePost = async (isDraft = false) => {
    try {
      if (isDraft && (!newPost.category || !newPost.provinceId)) {
        setSnackbar({
          open: true,
          message: 'Vui lòng chọn danh mục và tỉnh thành',
          severity: 'error'
        });
        return;
      }
      // Additional validation for sending (not draft)
      if (!isDraft) {
        if (!newPost.title || !newPost.content || !newPost.description || !newPost.category || !newPost.provinceId || !newPost.image) {
          setSnackbar({
            open: true,
            message: 'Vui lòng điền đầy đủ thông tin bắt buộc',
            severity: 'error'
          });
          return;
        }
        if (newPost.content.length < 50) {
          setSnackbar({
            open: true,
            message: 'Nội dung bài viết phải có ít nhất 50 ký tự',
            severity: 'error'
          });
          return;
        }
      }
      const postData = {
        title: newPost.title.trim(),
        content: newPost.content,
        description: newPost.description.trim(),
        postCategoryId: newPost.category,
        provinceId: newPost.provinceId,
        createdAt: dayjs(newPost.createDate).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
        isDraft: isDraft
      };
      const createdPost = await createPost(postData);
      if (newPost.image) {
        // Convert base64 to blob
        const response = await fetch(newPost.image);
        const blob = await response.blob();
        const imageFile = new File([blob], 'post-image.jpg', { type: 'image/jpeg' });

        // Upload image
        await updatePostImages(createdPost.data, [imageFile]);
      }

      // Show success message
      setSnackbar({
        open: true,
        message: `Bài viết đã được ${isDraft ? 'lưu nháp' : 'gửi duyệt'} thành công`,
        severity: 'success'
      });

      // Navigate back after successful creation
      setTimeout(() => {
        navigate('/nhan-vien/bai-viet');
      }, 1500);

    } catch (error) {
      console.error('Error creating post:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Có lỗi xảy ra khi tạo bài viết',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '89vw', minHeight: '100vh' }}>
      <Helmet>
        <title>Tạo bài viết mới</title>
      </Helmet>
      <Box sx={{ display: 'flex' }}>
        <SidebarStaff isOpen={isSidebarOpen} toggleSidebar={handleSidebarToggle} />

        <Box sx={{
          flexGrow: 1,
          p: 3,
          transition: 'margin-left 0.3s',
          marginLeft: isSidebarOpen ? '260px' : '25px',
          width: '100%',
          maxWidth: '100vw'
        }}>
          <Box maxWidth="100vw">
            <Paper elevation={2} sx={{
              p: 3,
              mb: 3,
              height: '100%',
              width: isSidebarOpen ? 'calc(95vw - 260px)' : '92vw'
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
                      {postCategoryOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
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
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        [{ 'font': [] }],
                        [{ 'size': ['small', false, 'large', 'huge'] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'script': 'sub'}, { 'script': 'super' }],
                        [{ 'align': [] }],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                        [{ 'direction': 'rtl' }],
                        ['blockquote', 'code-block'],
                        ['link', 'image', 'video', 'formula'],
                        ['clean']
                      ],
                    }}
                    theme="snow"
                  />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                  <Button
                    variant="contained"
                    onClick={() => handleCreatePost(true)}
                    sx={{ mr: 1, backgroundColor: 'grey' }}
                  >
                    Lưu nháp
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleCreatePost(false)}
                  >
                    Gửi duyệt
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
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

export default CreatePost;
