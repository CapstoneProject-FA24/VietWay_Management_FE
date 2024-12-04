import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Chip, Button, TextField, Select, MenuItem, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import { ArrowBack, Edit, Delete, Save, Send, Cancel as CancelIcon } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faTag, faMapLocation } from '@fortawesome/free-solid-svg-icons';
import SidebarStaff from '@layouts/SidebarStaff';
import { fetchProvinces } from '@services/ProvinceService';
import { getPostStatusInfo } from '@services/StatusService';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import IconButton from '@mui/material/IconButton';
import { PostStatus } from '@hooks/Statuses';
import { fetchPostCategory } from '@services/PostCategoryService';
import PostDeleteConfirm from '@components/post/PostDeleteConfirm';
import { fetchPostById, updatePost, deletePost, updatePostImages } from '@services/PostService';
import { Helmet } from 'react-helmet';
import HistoryIcon from '@mui/icons-material/History';
import VersionHistory from '@components/common/VersionHistory';

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

  imageContainer: { mb: 2, flexGrow: 1, position: 'relative', '&:hover .overlay': { opacity: 1 }, '&:hover .change-image-btn': { opacity: 1 } },

  editorContainer: {
    '& .ql-container': {
      minHeight: '200px',
      fontSize: '1.1rem'
    },
    '& .ql-editor': {
      minHeight: '200px',
      fontSize: '1.1rem'
    },
    contentDisplay: { display: 'flex', flexDirection: 'column', maxWidth: '80vw', overflow: 'auto' }
  }
};

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editablePost, setEditablePost] = useState(null);
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(true);
  const [editableFields, setEditableFields] = useState({
    title: { value: '', isEditing: false },
    content: { value: '', isEditing: false },
    description: { value: '', isEditing: false },
    category: { value: '', isEditing: false },
    provinceId: { value: '', isEditing: false },
    provinceName: { value: '', isEditing: false },
    createDate: { value: '', isEditing: false },
    image: { value: '', isEditing: false },
    status: { value: '', isEditing: false }
  });
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' | 'error' | 'warning' | 'info'
  });
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isCancelPopupOpen, setIsCancelPopupOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await fetchPostById(id);
        setPost(data);
        setEditablePost({
          ...data,
          category: data.postCategoryName,
          postCategoryId: data.postCategoryId,
          provinceId: data.provinceId,
          provinceName: data.provinceName,
          image: data.imageUrl,
          content: data.content
        });
      } catch (error) {
        console.error('Error loading post:', error);
        setSnackbar({
          open: true,
          message: 'Không thể tải bài viết',
          severity: 'error'
        });
      }
    };
    loadPost();
  }, [id]);

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const categories = await fetchPostCategory();
        setCategoryOptions(categories.map(cat => ({
          postCategoryId: cat.postCategoryId,
          name: cat.name
        })));
      } catch (error) {
        console.error('Error loading categories:', error);
        setSnackbar({
          open: true,
          message: 'Không thể tải danh mục',
          severity: 'error'
        });
      } finally {
        setIsLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadProvinces = async () => {
      setIsLoadingProvinces(true);
      try {
        const provinces = await fetchProvinces({ pageSize: 63, pageIndex: 1 });
        setProvinceOptions(provinces.items.map(province => ({
          value: province.provinceId,
          label: province.provinceName
        })));
      } catch (error) {
        console.error('Error loading provinces:', error);
        setSnackbar({
          open: true,
          message: 'Không thể tải danh sách tỉnh thành',
          severity: 'error'
        });
      } finally {
        setIsLoadingProvinces(false);
      }
    };
    loadProvinces();
  }, []);

  useEffect(() => {
    if (post) {
      setEditableFields({
        title: { value: post.title || '', isEditing: false },
        content: { value: post.content || '', isEditing: false },
        description: { value: post.description || '', isEditing: false },
        category: { value: post.category || '', isEditing: false },
        provinceId: { value: post.provinceId || '', isEditing: false },
        provinceName: { value: post.provinceName || '', isEditing: false },
        createDate: { value: post.createDate || '', isEditing: false },
        image: { value: post.image || '', isEditing: false },
        status: { value: post.status || '0', isEditing: false }
      });
    }
  }, [post]);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleEditPost = () => {
    setIsEditMode(true);
    setEditablePost(prev => ({
      ...prev,
      title: post.title,
      content: post.content,
      description: post.description,
      postCategoryId: post.postCategoryId,
      postCategoryName: post.postCategoryName,
      provinceId: post.provinceId,
      provinceName: post.provinceName,
      image: post.imageUrl
    }));
  };

  const handleSaveChanges = async () => {
    setIsSubmitting(true);
    try {
      const updatedPost = {
        title: editablePost.title,
        content: editablePost.content,
        postCategoryId: editablePost.postCategoryId,
        provinceId: editablePost.provinceId,
        description: editablePost.description,
        isDraft: true
      };

      await updatePost(id, updatedPost);

      if (editablePost.imageFile) {
        await updatePostImages(id, [editablePost.imageFile]);
      }

      setPost(prevPost => ({
        ...prevPost,
        ...updatedPost,
        postCategoryName: categoryOptions.find(c => c.postCategoryId === updatedPost.postCategoryId)?.name,
        provinceName: provinceOptions.find(p => p.value === updatedPost.provinceId)?.label
      }));

      setIsEditMode(false);
      setSnackbar({
        open: true,
        message: 'Lưu nháp thành công',
        severity: 'success'
      });
      window.location.reload();
    } catch (error) {
      console.error('Error saving post:', error);
      setSnackbar({
        open: true,
        message: 'Lỗi khi lưu nháp: ' + (error.response?.data?.message || error.message),
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendForApproval = async () => {
    setIsSubmitting(true);
    try {
      // Check required fields
      if (!editablePost.title?.trim() || 
          !editablePost.content?.trim() ||
          !editablePost.postCategoryId ||
          !editablePost.provinceId ||
          !editablePost.description?.trim()) {
        setSnackbar({
          open: true,
          message: 'Vui lòng điền đầy đủ thông tin trước khi gửi',
          severity: 'error'
        });
        return;
      }

      const updatedPost = {
        title: editablePost.title,
        content: editablePost.content,
        postCategoryId: editablePost.postCategoryId,
        provinceId: editablePost.provinceId,
        description: editablePost.description,
        isDraft: false
      };

      await updatePost(id, updatedPost);

      if (editablePost.imageFile) {
        await updatePostImages(id, [editablePost.imageFile]);
      }

      setPost(prevPost => ({
        ...prevPost,
        ...updatedPost,
        postCategoryName: categoryOptions.find(c => c.postCategoryId === updatedPost.postCategoryId)?.name,
        provinceName: provinceOptions.find(p => p.value === updatedPost.provinceId)?.label
      }));

      setIsEditMode(false);
      setSnackbar({
        open: true,
        message: 'Đã gửi bài viết để duyệt',
        severity: 'success'
      });
      window.location.reload();
    } catch (error) {
      console.error('Error sending for approval:', error);
      setSnackbar({
        open: true,
        message: 'Lỗi khi gửi bài viết: ' + (error.response?.data?.message || error.message),
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setEditablePost(prev => ({
      ...prev,
      [field]: value
    }));

    if (editableFields[field]?.isEditing) {
      setEditableFields(prev => ({
        ...prev,
        [field]: { ...prev[field], value }
      }));
    }
  };

  const renderActionButtons = () => {
    return (
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <IconButton
          onClick={handleHistoryClick}
          sx={{ backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', '&:hover': { backgroundColor: '#f5f5f5' } }}
        >
          <HistoryIcon color="primary" />
        </IconButton>

        {post.status === PostStatus.Draft || post.status === PostStatus.Rejected ? (
          <>
            {isEditMode ? (
              <Button
                variant="contained"
                startIcon={<CancelIcon />}
                onClick={handleCancelClick}
                sx={{ backgroundColor: '#767676', '&:hover': { backgroundColor: '#575757' }}}
              >
                Hủy sửa
              </Button>
            ) : (
              <>
                <Button variant="contained" color="primary" startIcon={<Send />} onClick={handleSendForApproval}>
                  Gửi duyệt
                </Button>
                <Button variant="contained" sx={{ backgroundColor: '#767676', '&:hover': { backgroundColor: '#575757' }}} startIcon={<Edit />} onClick={handleEditPost}>
                  Chỉnh sửa
                </Button>
              </>
            )}
            <Button variant="contained" color="error" startIcon={<Delete />} onClick={handleDeletePost}>
              Xóa
            </Button>
          </>
        ) : post.status === PostStatus.Pending ? (
          <Button variant="contained" color="error" startIcon={<Delete />} onClick={handleDeletePost}>
            Xóa
          </Button>
        ) : null}
      </Box>
    );
  };

  const handleDeletePost = async () => {
    setIsDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async (postId) => {
    try {
      await deletePost(postId);
      setSnackbar({
        open: true,
        message: 'Bài viết đã được xóa',
        severity: 'success'
      });
      navigate(`/nhan-vien/bai-viet`);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Lỗi khi xóa bài viết: ' + (error.response?.data?.message || error.message),
        severity: 'error'
      });
    }
  };

  const handleFieldEdit = (field) => {
    setEditableFields(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        isEditing: true,
        value: editablePost[field] // Pre-fill with current content
      }
    }));
  };

  const handleFieldSubmit = (field) => {
    handleFieldChange(field, editableFields[field].value);
    setEditableFields(prev => ({
      ...prev,
      [field]: { ...prev[field], isEditing: false }
    }));
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Store the file for later upload
      setEditablePost(prev => ({
        ...prev,
        imageFile: file,  // Store the actual file
        image: URL.createObjectURL(file)  // Create local preview URL
      }));
    }
  };

  const handleCancelClick = () => {
    setIsCancelPopupOpen(true);
  };

  const handleCloseCancelPopup = () => {
    setIsCancelPopupOpen(false);
  };

  const handleCancelConfirm = () => {
    setIsEditMode(false);
    setIsCancelPopupOpen(false);
  };

  const handleHistoryClick = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };

  const CancelConfirmationDialog = () => (
    <Dialog open={isCancelPopupOpen} onClose={handleCloseCancelPopup}>
      <DialogTitle sx={{ fontWeight: 600 }}>
        Xác nhận hủy
      </DialogTitle>
      <DialogContent>
        <Typography>
          Bạn có chắc chắn muốn hủy cập nhật? Các thay đổi sẽ không được lưu.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button
          onClick={handleCloseCancelPopup}
          sx={{ color: '#666666' }}
        >
          Không
        </Button>
        <Button
          onClick={handleCancelConfirm}
          variant="contained"
          sx={{ backgroundColor: '#DC2626', '&:hover': { backgroundColor: '#B91C1C' } }}
        >
          Có
        </Button>
      </DialogActions>
    </Dialog>
  );

  if (!post) return null;

  const statusInfo = getPostStatusInfo(post.status);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '100vh' }}>
      <Helmet>
        <title>Chi tiết bài viết</title>
      </Helmet>
      <Box sx={{ display: 'flex' }}>
        <SidebarStaff isOpen={isSidebarOpen} toggleSidebar={handleSidebarToggle} />

        <Box sx={{ flexGrow: 1, p: 3, transition: 'margin-left 0.3s', marginLeft: isSidebarOpen ? '260px' : '20px', mt: 5 }}>
          <Box maxWidth="89vw">
            <Box sx={{ position: 'relative' }}>
              <Box
                sx={{
                  position: 'fixed',
                  top: '120px',
                  right: isSidebarOpen ? '280px' : '40px',
                  width: '400px',
                  backgroundColor: 'white',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  borderRadius: '4px',
                  display: isHistoryOpen ? 'block' : 'none',
                  zIndex: 1000
                }}
              >
                <VersionHistory />
              </Box>

              <Box elevation={2} sx={{ p: 1, mb: 10, marginTop: -6, height: '100%', width: isSidebarOpen ? 'calc(95vw - 260px)' : 'calc(95vw - 20px)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate(-1)}
                    sx={{ mb: 2 }}
                  >
                    Quay lại
                  </Button>
                  {renderActionButtons()}
                </Box>

                {isEditMode ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <TextField label="Tiêu đề" value={editablePost.title} onChange={(e) => handleFieldChange('title', e.target.value)} variant="outlined" fullWidth sx={{ mb: 2 }} />

                    <Box sx={commonStyles.boxContainer}>
                      <Box sx={commonStyles.flexContainer}>
                        <Typography sx={commonStyles.labelTypography}>
                          Danh mục:
                        </Typography>
                        <Select
                          value={editablePost?.postCategoryId || ''}
                          onChange={(e) => {
                            const selectedCategory = categoryOptions.find(cat => cat.postCategoryId === e.target.value);
                            if (selectedCategory) {
                              handleFieldChange('postCategoryId', selectedCategory.postCategoryId);
                              handleFieldChange('postCategoryName', selectedCategory.name);
                            }
                          }}
                          variant="outlined"
                          fullWidth
                          sx={commonStyles.inputField}
                          disabled={isLoadingCategories}
                        >
                          {categoryOptions.map(category => (
                            <MenuItem key={category.postCategoryId} value={category.postCategoryId}>
                              {category.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </Box>

                      <Box sx={commonStyles.flexContainer}>
                        <Typography sx={commonStyles.labelTypography}>
                          Tỉnh/Thành phố:
                        </Typography>
                        <Select
                          value={editablePost?.provinceId || ''}
                          onChange={(e) => {
                            const selectedProvince = provinceOptions.find(p => p.value === e.target.value);
                            if (selectedProvince) {
                              handleFieldChange('provinceId', selectedProvince.value);
                              handleFieldChange('provinceName', selectedProvince.label);
                            }
                          }}
                          variant="outlined"
                          fullWidth
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

                    <TextField sx={{ mb: 2, fontWeight: 600 }} label="Mô tả" value={editablePost.description}
                      onChange={(e) => handleFieldChange('description', e.target.value)} />

                    <Box sx={commonStyles.imageContainer}>
                      <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem', fontWeight: 600 }}>Ảnh</Typography>
                      <Box sx={{
                        position: 'relative', width: '100%', height: '300px', border: '2px dashed #ccc',
                        borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden'
                      }}>
                        {editablePost.image ? (
                          <img
                            src={editablePost.image}
                            alt={editablePost.title}
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
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
                          {editablePost.image ? 'Đổi ảnh khác' : 'Chọn ảnh cho bài viết'}
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </Button>
                      </Box>
                    </Box>
                    {editableFields.content.isEditing ? (
                      <Box sx={commonStyles.editorContainer}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography sx={commonStyles.labelTypography}>
                            Nội dung
                          </Typography>
                        </Box>

                        <ReactQuill
                          value={editableFields.content.value}
                          onChange={(value) => handleFieldChange('content', value)}
                          modules={{
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
                          }}
                          theme="snow"
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mt: 2 }}>
                          <Button variant="contained" onClick={() => handleFieldSubmit('content')}
                            disabled={!editableFields.content.value.trim()}
                            sx={{ minWidth: '40px', padding: '8px' }}>
                            <CheckIcon />
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={commonStyles.contentDisplay}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography sx={commonStyles.labelTypography}>
                            Nội dung
                          </Typography>
                          <IconButton onClick={() => handleFieldEdit('content')}>
                            <EditIcon />
                          </IconButton>
                        </Box>

                        <Box dangerouslySetInnerHTML={{ __html: editablePost.content }} sx={{
                          '& img': { width: '100%', height: 'auto', borderRadius: '4px', my: 2 },
                          '& p': { lineHeight: 1.7, mb: 2 }, flexGrow: 1, width: '90%', margin: '0 auto'
                        }} />
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: 'grey', mr: 1 }}
                        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
                        onClick={handleSaveChanges}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Đang lưu...' : 'Lưu nháp'}
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Send />}
                        onClick={handleSendForApproval}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Đang gửi...' : 'Gửi duyệt'}
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip label={statusInfo.text} size="small" sx={{ mb: 1, color: `${statusInfo.color}`, bgcolor: `${statusInfo.backgroundColor}`, fontWeight: 600 }} />
                    </Box>
                    <img src={post.imageUrl} alt={post.title}
                      style={{ width: '100%', height: '25rem', objectFit: 'cover' }} />
                    <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' }, fontWeight: 700, color: '#1A1A1A', mb: 3, lineHeight: 1.2, letterSpacing: '-0.02em', fontFamily: '"Tinos", serif', marginTop: 3 }}>
                      {post.title}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4, flexWrap: 'wrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FontAwesomeIcon icon={faTag} style={{ color: '#666' }} />
                        <Chip label={post.postCategoryName}
                          sx={{
                            bgcolor: '#f5f5f5', color: '#666', fontWeight: 500,
                            '&:hover': { bgcolor: '#eeeeee' }
                          }} />
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FontAwesomeIcon icon={faCalendarAlt} style={{ color: '#666' }} />
                        <Typography variant="body2" color="text.secondary">
                          {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FontAwesomeIcon icon={faMapLocation} style={{ color: '#666' }} />
                        <Typography variant="body2" color="text.secondary">
                          {post.provinceName}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      dangerouslySetInnerHTML={{ __html: post.content }}
                      sx={{
                        '& img': { width: '100%', height: 'auto', borderRadius: '4px', my: 2 },
                        '& p': { lineHeight: 1.7, mb: 2 }, flexGrow: 1, width: '90%', margin: '0 auto'
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <PostDeleteConfirm
        open={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        postId={post.postId}
        onDelete={handleConfirmDelete}
      />
      <CancelConfirmationDialog />
    </Box>
  );
};

export default PostDetail;
