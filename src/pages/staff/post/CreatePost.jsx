import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, TextField, Select, MenuItem, Snackbar, Alert, FormControl, InputLabel, FormHelperText } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import SidebarStaff from '@layouts/SidebarStaff';
import { fetchProvinces } from '@services/ProvinceService';
import { fetchPostCategory } from '@services/PostCategoryService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import dayjs from 'dayjs';
import { createPost, updatePostImages } from '@services/PostService';
import { Helmet } from 'react-helmet';
import '@styles/ReactQuill.css';
import { getErrorMessage } from '@hooks/Message';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { fetchPopularProvinces, fetchPopularPostCategories } from '@services/PopularService';

const commonStyles = {
  boxContainer: { display: 'flex', alignItems: 'center', gap: 2, mb: 2 },
  flexContainer: { display: 'flex', alignItems: 'center', flex: 1, width: '80%' },
  labelTypography: { color: '#05073C', fontWeight: 600, whiteSpace: 'nowrap', marginRight: '1rem' },
  inputField: {
    '& .MuiOutlinedInput-root': { height: '40px', },
    '& .MuiOutlinedInput-input': { padding: '8px 14px' }
  },
  imageContainer: {
    mb: 2, flexGrow: 1, position: 'relative',
    '&:hover .overlay': { opacity: 1 },
    '&:hover .change-image-btn': { opacity: 1 }
  },
  editorContainer: {
    '& .ql-container': { minHeight: '200px', fontSize: '1.1rem' },
    '& .ql-editor': { minHeight: '200px', fontSize: '1.1rem' }
  }
};

const CreatePost = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [postCategoryOptions, setPostCategoryOptions] = useState([]);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success', hide: 5000 });
  const [newPost, setNewPost] = useState({
    title: '', content: '', description: '', category: '', provinceId: '',
    provinceName: '', createDate: new Date().toISOString().split('T')[0], image: null
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [popularProvinces, setPopularProvinces] = useState([]);
  const [popularPostCategories, setPopularPostCategories] = useState([]);
  const [hotProvinces, setHotProvinces] = useState([]);
  const [hotCategories, setHotCategories] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoadingProvinces(true);
      try {
        const fetchedProvinces = await fetchProvinces({ pageSize: 63, pageIndex: 1 });
        const fetchedPostCategories = await fetchPostCategory();
        
        const popularProvincesData = await fetchPopularProvinces();
        const popularPostCategoriesData = await fetchPopularPostCategories();
        
        setPopularProvinces(popularProvincesData.map(p => p.provinceId));
        setPopularPostCategories(popularPostCategoriesData.map(c => c.postCategoryId));

        const formattedProvinces = fetchedProvinces.items.map(province => ({
          value: province.provinceId,
          label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {province.provinceName}
              {popularProvincesData.map(p => p.provinceId).includes(province.provinceId) && (
                <LocalFireDepartmentIcon 
                  sx={{ color: 'red' }}
                  titleAccess="Tỉnh thành đang được quan tâm nhiều nhất"
                />
              )}
              {hotProvinces.includes(province.provinceId) && (
                <LocalFireDepartmentIcon 
                  sx={{ color: '#ff8f00' }}
                  titleAccess="Tỉnh thành đang quan tâm đến loại bài viết này nhiều nhất"
                />
              )}
            </div>
          )
        }));

        const formattedPostCategories = fetchedPostCategories.map(postCategory => ({
          value: postCategory.postCategoryId,
          label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {postCategory.name}
              {popularPostCategoriesData.map(c => c.postCategoryId).includes(postCategory.postCategoryId) && (
                <LocalFireDepartmentIcon 
                  sx={{ color: 'red' }}
                  titleAccess="Loại bài viết đang được quan tâm nhiều nhất"
                />
              )}
              {hotCategories.includes(postCategory.postCategoryId) && (
                <LocalFireDepartmentIcon 
                  sx={{ color: '#ff8f00' }}
                  titleAccess="Loại bài viết đang được quan tâm nhiều nhất tại tỉnh thành này"
                />
              )}
            </div>
          )
        }));

        setProvinceOptions(formattedProvinces);
        setPostCategoryOptions(formattedPostCategories);
      } catch (error) {
        console.error('Error loading data:', error);
        setSnackbar({ 
          open: true, 
          message: 'Lỗi khi tải dữ liệu', 
          severity: 'error', 
          hide: 5000 
        });
      } finally {
        setIsLoadingProvinces(false);
      }
    };
    loadData();
  }, [hotProvinces, hotCategories]);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleFieldChange = (field, value) => {
    if (field === 'category') {
      handleCategoryChange(value);
    }
    setNewPost(prev => ({ ...prev, [field]: value }));
    setFieldErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleProvinceChange = async (event) => {
    const provinceId = event.target.value;
    setNewPost(prev => ({ ...prev, provinceId }));
    setFieldErrors(prev => ({ ...prev, provinceId: undefined }));

    try {
      const hotCategoriesData = await fetchPopularPostCategories(provinceId);
      setHotCategories(hotCategoriesData.map(c => c.postCategoryId));
    } catch (error) {
      console.error('Error fetching hot categories:', error);
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
      const errors = {};

      if (!isDraft) {
        if (!newPost.title?.trim()) errors.title = 'Vui lòng nhập tiêu đề bài viết';
        if (!newPost.description?.trim()) errors.description = 'Vui lòng nhập mô tả ngắn';
        if (!newPost.content?.trim()) errors.content = 'Vui lòng nhập nội dung bài viết';
        else if (newPost.content.length < 50) errors.content = 'Nội dung bài viết phải có ít nhất 50 ký tự';
        if (!newPost.category) errors.category = 'Vui lòng chọn danh mục';
        if (!newPost.provinceId) errors.provinceId = 'Vui lòng chọn tỉnh thành';
        if (!newPost.image) errors.image = 'Vui lòng chọn ảnh cho bài viết';
      } else {
        const hasAnyField =
          newPost.title || newPost.description || newPost.content ||
          newPost.category || newPost.provinceId ||
          (newPost.image && newPost.image.length > 0);
        if (!hasAnyField) {
          setSnackbar({
            open: true, severity: 'error', hide: 5000,
            message: 'Vui lòng nhập ít nhất một thông tin để lưu nháp',
          });
          return;
        }
      }
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        return;
      }
      const postData = {
        title: newPost.title || null,
        content: newPost.content || null,
        description: newPost.description || null,
        postCategoryId: newPost.category || null,
        provinceId: newPost.provinceId || null,
        isDraft: isDraft
      };
      const createdPost = await createPost(postData);
      if (createdPost.statusCode === 200) {
        if (newPost.image) {
          const response = await fetch(newPost.image);
          const blob = await response.blob();
          const imageFile = new File([blob], 'post-image.jpg', { type: 'image/jpeg' });
          const imagesResponse = await updatePostImages(createdPost.data, [imageFile]);
          if (imagesResponse.statusCode !== 200) {
            console.error('Error uploading images:', imagesResponse);
            setSnackbar({
              open: true, severity: 'error', hide: 5000,
              message: 'Đã xảy ra lỗi khi lưu ảnh. Vui lòng thử lại sau.',
            });
          } else {
            setSnackbar({
              open: true, severity: 'success', hide: 1500,
              message: isDraft ? 'Đã lưu bản nháp thành công.' : 'Đã tạo và gửi tour mẫu thành công.',
            });
            setTimeout(() => {
              navigate('/nhan-vien/bai-viet/chi-tiet/' + createdPost.data);
            }, 1500);
          }
        } else {
          setSnackbar({ open: true, message: isDraft ? 'Đã lưu bản nháp thành công.' : 'Đã tạo và gửi bài viết thành công.', severity: 'success', hide: 1500 });
          setTimeout(() => {
            navigate('/nhan-vien/bai-viet/chi-tiet/' + createdPost.data);
          }, 1500);
        }
      } else {
        console.error('Error creating tour template:', response);
        setSnackbar({
          open: true, severity: 'error',
          message: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
        });
      }
    } catch (error) {
      console.error('Error creating post:', error);
      setSnackbar({ open: true, message: getErrorMessage(error), severity: 'error', hide: 5000 });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleCategoryChange = async (categoryId) => {
    try {
      const hotProvinceData = await fetchPopularProvinces(categoryId, 2);
      setHotProvinces(hotProvinceData.map(p => p.provinceId));
    } catch (error) {
      console.error('Error fetching hot provinces:', error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '100vh', width: '98vw' }}>
      <Helmet><title>Tạo bài viết mới</title></Helmet>
      <Box sx={{ display: 'flex' }}>
        <SidebarStaff isOpen={isSidebarOpen} toggleSidebar={handleSidebarToggle} />
        <Box sx={{
          flexGrow: 1, p: 7, transition: 'margin-left 0.3s', marginLeft: isSidebarOpen ? '250px' : '30px',
          width: `calc(100% - ${isSidebarOpen ? '250px' : '30px'})`, maxWidth: '98vw'
        }}>
          <Box maxWidth="98vw">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ width: 'fit-content' }}>Quay lại</Button>
              <Typography variant="h4"
                sx={{
                  fontSize: '2.7rem', fontWeight: 600, color: 'primary.main',
                  alignSelf: 'center', marginBottom: '1rem'
                }}
              >Tạo bài viết mới</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <TextField
                label="Tiêu đề *" fullWidth margin="normal" value={newPost.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                error={!!fieldErrors.title} helperText={fieldErrors.title}
              />
              <Box sx={commonStyles.boxContainer}>
                <Box sx={commonStyles.flexContainer}>
                  <FormControl fullWidth margin="normal" error={!!fieldErrors.category}>
                    <InputLabel>Danh mục *</InputLabel>
                    <Select
                      value={newPost.category}
                      onChange={(e) => handleFieldChange('category', e.target.value)}
                      label="Danh mục *"
                    >
                      {postCategoryOptions.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {option.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.category && (
                      <FormHelperText>{fieldErrors.category}</FormHelperText>
                    )}
                  </FormControl>
                </Box>
                <Box sx={commonStyles.flexContainer}>
                  <FormControl fullWidth margin="normal" error={!!fieldErrors.provinceId}>
                    <InputLabel>Tỉnh/Thành phố *</InputLabel>
                    <Select
                      value={newPost.provinceId}
                      onChange={handleProvinceChange}
                      label="Tỉnh/Thành phố *"
                    >
                      {provinceOptions.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {option.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.provinceId && (
                      <FormHelperText>{fieldErrors.provinceId}</FormHelperText>
                    )}
                  </FormControl>
                </Box>
              </Box>
              <TextField
                label="Mô tả" value={newPost.description} required
                onChange={(e) => handleFieldChange('description', e.target.value)}
                variant="outlined" fullWidth multiline rows={3} sx={{ mb: 2 }}
                error={!!fieldErrors.description} helperText={fieldErrors.description}
              />
              <Box sx={commonStyles.imageContainer}>
                <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem', fontWeight: 600 }}>Ảnh *</Typography>
                {fieldErrors.image && (
                  <Typography color="error" variant="caption" sx={{ display: 'block', mt: 1 }}>
                    {fieldErrors.image}
                  </Typography>
                )}
                <Box sx={{
                  position: 'relative', width: '100%', height: '300px',
                  border: fieldErrors.image ? '2px dashed red' : '2px dashed #ccc', borderRadius: '8px', display: 'flex',
                  justifyContent: 'center', alignItems: 'center', overflow: 'hidden'
                }}>
                  {newPost.image ? (
                    <img src={newPost.image} alt="Preview"
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  ) : (
                    <img src="/add-image.png" alt="Add image"
                      style={{ width: '100px', height: '100px', opacity: 0.5 }}
                    />
                  )}
                  <Button
                    variant="outlined" component="label"
                    sx={{
                      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                      opacity: 0, transition: 'opacity 0.3s ease', '&:hover': { opacity: 1 },
                      backgroundColor: 'rgba(255, 255, 255, 0.8)', color: '#000', border: '1px solid #ccc',
                    }}
                  >
                    Chọn ảnh cho bài viết
                    <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                  </Button>
                </Box>
              </Box>
              <Box sx={commonStyles.editorContainer}>
                <Typography sx={{ ...commonStyles.labelTypography, mb: 1 }}>Nội dung *</Typography>
                <FormControl sx={{ width: '100%' }}>
                  <ReactQuill
                    value={newPost.content} theme="snow" className={fieldErrors.content ? "ql-error" : null}
                    onChange={(value) => handleFieldChange('content', value)}
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }], [{ 'font': [] }], [{ 'size': ['small', false, 'large', 'huge'] }],
                        ['bold', 'italic', 'underline', 'strike'], [{ 'color': [] }, { 'background': [] }],
                        [{ 'script': 'sub' }, { 'script': 'super' }], [{ 'align': [] }], [{ 'direction': 'rtl' }],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                        ['blockquote', 'code-block'], ['link', 'image', 'video', 'formula'], ['clean']
                      ],
                      clipboard: { matchVisual: false }
                    }}
                  />
                  {fieldErrors.content && (<FormHelperText error sx={{ mt: 0.5 }}>{fieldErrors.content}</FormHelperText>)}
                </FormControl>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                <Button
                  variant="contained" onClick={() => handleCreatePost(true)}
                  sx={{ mr: 1, backgroundColor: 'grey' }}
                >Lưu nháp</Button>
                <Button variant="contained" color="primary" onClick={() => handleCreatePost(false)}>Gửi duyệt</Button>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Box sx={{ mt: 1, width: '32rem' }}>
                <Typography sx={{ color: 'red' }}>- Nếu lưu nháp: Vui lòng nhập ít nhất 1 thông tin để lưu nháp.</Typography>
                <Typography sx={{ color: 'red' }}>- Nếu gửi duyệt: Vui lòng nhập các trường có dấu * và thêm hình ảnh.</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Snackbar
        open={snackbar.open} autoHideDuration={snackbar.hide} onClose={handleCloseSnackbar}
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