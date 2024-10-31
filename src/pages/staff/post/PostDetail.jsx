import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Chip, Button, TextField, Select, MenuItem, CardMedia } from '@mui/material';
import { ArrowBack, Edit, Delete, Save, Send } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faTag, faMapLocation } from '@fortawesome/free-solid-svg-icons';
import SidebarStaff from '@layouts/SidebarStaff';
import { fetchPostById } from '@hooks/MockPost';
import { fetchProvinces } from '@services/ProvinceService';
import { getStatusColor } from '@services/StatusService';
import ReactSelect from 'react-select';
import makeAnimated from 'react-select/animated';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import IconButton from '@mui/material/IconButton';

const animatedComponents = makeAnimated();

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
    content: { value: '', isEditing: false },
    // ... other fields
  });

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await fetchPostById(id);
        setPost(data);
        setEditablePost(data);
      } catch (error) {
        console.error('Error loading post:', error);
      }
    };
    loadPost();
  }, [id]);

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
      } finally {
        setIsLoadingProvinces(false);
      }
    };
    loadProvinces();
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleEditPost = () => {
    setIsEditMode(true);
  };

  const handleSave = async () => {
    try {
      // Update the post with status 0 (draft)
      const updatedPost = {
        ...editablePost,
        status: '0'
      };
      await updatePost(updatedPost);
      setPost(updatedPost);
      setEditablePost(updatedPost);
      setIsEditMode(false);
      toast.success('Đã lưu bài viết dưới dạng nháp');
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Lỗi khi lưu bài viết');
    }
  };

  const handleSendForApproval = async () => {
    try {
      // Update the post with status 1 (pending approval)
      const updatedPost = {
        ...editablePost,
        status: '1'
      };
      await updatePost(updatedPost);
      setPost(updatedPost);
      setEditablePost(updatedPost);
      setIsEditMode(false);
      toast.success('Đã gửi bài viết để duyệt');
    } catch (error) {
      console.error('Error sending for approval:', error);
      toast.error('Lỗi khi gửi bài viết');
    }
  };

  const handleFieldChange = (field, value) => {
    setEditablePost(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProvinceChange = (selected) => {
    handleFieldChange('provinceId', selected?.value);
    handleFieldChange('provinceName', selected?.label);
  };

  const renderActionButtons = () => {
    switch(post.status) {
      case '0':
        return (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Edit />}
              onClick={handleEditPost}
            >
              Chỉnh sửa
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<Delete />}
              onClick={handleDeletePost}
            >
              Xóa
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<Send />}
              onClick={handleSendForApproval}
            >
              Gửi duyệt
            </Button>
          </Box>
        );
      case '1':
        return (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="error"
              startIcon={<Delete />}
              onClick={handleSaveAsDraft}
            >
              Xóa
            </Button>
          </Box>
        );
      default:
        return null; 
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      try {
        navigate('/nhan-vien/bai-viet');
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleSaveAsDraft = async () => {
    try {
      navigate('/nhan-vien/bai-viet');
    } catch (error) {
      console.error('Error saving post as draft:', error);
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

  if (!post) return null;

  const statusInfo = getStatusColor(post.status);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Box sx={{ display: 'flex' }}>
        <SidebarStaff isOpen={isSidebarOpen} toggleSidebar={handleSidebarToggle} />
        
        <Box sx={{ 
          flexGrow: 1, 
          p: 3, 
          transition: 'margin-left 0.3s',
          marginLeft: isSidebarOpen ? '260px' : '20px'
        }}>
          <Box maxWidth="100vw">
            <Paper elevation={2} sx={{ p: 3, mb: 3, height: '100%', width: 'calc(95vw - 250px)' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
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
                  <TextField
                    label="Tiêu đề"
                    value={editablePost.title}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                  <Box 
                    sx={{ 
                      mb: 2, 
                      flexGrow: 1,
                      position: 'relative',
                      '&:hover .overlay': {
                        opacity: 1
                      },
                      '&:hover .change-image-btn': {
                        opacity: 1
                      }
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ marginBottom: '0.5rem', fontWeight: 600 }}>Ảnh</Typography>
                    <Box
                      sx={{
                        position: 'relative',
                        width: '100%',
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}
                    >
                      <img
                        src={editablePost.image}
                        alt={editablePost.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          borderRadius: '8px',
                        }}
                      />
                      <Box
                        className="overlay"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          opacity: 0,
                          transition: 'opacity 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Button
                          variant="outlined"
                          component="label"
                          className="change-image-btn"
                          sx={{
                            color: 'white',
                            borderColor: 'white',
                            '&:hover': {
                              borderColor: 'white',
                              backgroundColor: 'rgba(255, 255, 255, 0.1)'
                            },
                            opacity: 0,
                            transition: 'opacity 0.3s ease'
                          }}
                        >
                          Đổi ảnh khác
                          <input
                            type="file"
                            hidden
                            onChange={(e) =>
                              handleFieldChange('image', e.target.files[0])
                            }
                          />
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                  {editableFields.content.isEditing ? (
                    <Box>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        mb: 2 
                      }}>
                        <Typography sx={{ color: '#05073C', fontWeight: 600 }}>
                          Nội dung
                        </Typography>
                      </Box>

                      <Box sx={{ 
                        '& .ql-container': {
                          minHeight: '200px',
                          fontSize: '1.1rem'
                        },
                        '& .ql-editor': {
                          minHeight: '200px',
                          fontSize: '1.1rem'
                        }
                      }}>
                        <ReactQuill
                          value={editableFields.content.value}
                          onChange={(value) => setEditableFields(prev => ({
                            ...prev,
                            content: { ...prev.content, value }
                          }))}
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
                        
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'flex-end', 
                          width: '100%', 
                          mt: 2 
                        }}>
                          <Button
                            variant="contained"
                            onClick={() => handleFieldSubmit('content')}
                            disabled={!editableFields.content.value.trim()}
                            sx={{ minWidth: '40px', padding: '8px' }}
                          >
                            <CheckIcon />
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  ) : (
                    <Box>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mb: 2 
                      }}>
                        <Typography sx={{ color: '#05073C', fontWeight: 600 }}>
                          Nội dung
                        </Typography>
                        <IconButton onClick={() => handleFieldEdit('content')}>
                          <EditIcon />
                        </IconButton>
                      </Box>

                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        maxWidth: '80vw', 
                        overflow: 'auto' 
                      }}>
                        <div dangerouslySetInnerHTML={{ __html: editablePost.content }} />
                      </Box>
                    </Box>
                  )}
                  <TextField
                    label="Mô tả"
                    value={editablePost.description}
                    onChange={(e) =>
                      handleFieldChange('description', e.target.value)
                    }
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={4}
                    sx={{ mb: 2, flexGrow: 1 }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                      <Typography sx={{ color: '#05073C', fontWeight: 600, minWidth: '6.5rem' }}>
                        Danh mục:
                      </Typography>
                      <Select
                        value={editablePost.category}
                        onChange={(e) =>
                          handleFieldChange('category', e.target.value)
                        }
                        variant="outlined"
                        fullWidth
                      >
                        <MenuItem value="Văn hóa">Văn hóa</MenuItem>
                        <MenuItem value="Ẩm thực">Ẩm thực</MenuItem>
                        <MenuItem value="Kinh nghiệm du lịch">Kinh nghiệm du lịch</MenuItem>
                        <MenuItem value="Nơi lưu trú">Nơi lưu trú</MenuItem>
                        <MenuItem value="Mua sắm và giải trí">Mua sắm và giải trí</MenuItem>
                        <MenuItem value="Tin tức du lịch">Tin tức du lịch</MenuItem>
                      </Select>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                      <Typography sx={{ color: '#05073C', fontWeight: 600, minWidth: '6.5rem', marginLeft: '1rem' }}>
                        Tỉnh/Thành phố: 
                      </Typography>
                      <ReactSelect
                        closeMenuOnSelect={true}
                        components={animatedComponents}
                        options={provinceOptions}
                        onChange={handleProvinceChange}
                        value={provinceOptions.find(option => option.value === editablePost.provinceId)}
                        isLoading={isLoadingProvinces}
                        styles={{
                          control: (base) => ({
                            ...base,
                            minHeight: 40
                          })
                        }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                      <Typography sx={{ color: '#05073C', fontWeight: 600, minWidth: '6.5rem' }}>
                        Ngày tạo:
                      </Typography>
                      <TextField
                        type="date"
                        value={editablePost.createDate}
                        onChange={(e) =>
                          handleFieldChange('createDate', e.target.value)
                        }
                        variant="outlined"
                        fullWidth
                      />
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Save />}
                      onClick={handleSave}
                    >
                      Lưu thay đổi
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip 
                      label={statusInfo.label}
                      color={statusInfo.color}
                      size="small"
                      sx={{ my: 3 }}
                    />
                  </Box>

                  <Box sx={{ 
                    position: 'relative',
                    width: 'fit-content',
                    height: { xs: '400px', md: '70vh' },
                    overflow: 'hidden',
                    mb: 3,
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '30%',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
                    }
                  }}>
                    <CardMedia
                      component="img"
                      image={post.image}
                      alt={post.title}
                      sx={{
                        width: '76vw',
                        height: 'fit-content',
                        objectFit: 'fill',
                        transform: 'scale(1.1)',
                        transition: 'transform 0.3s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.15)'
                        }
                      }}
                    />
                  </Box>
                  <Typography 
                    variant="h1" 
                    sx={{ 
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      fontWeight: 700,
                      color: '#1A1A1A', 
                      mb: 3,
                      lineHeight: 1.2,
                      letterSpacing: '-0.02em',
                      fontFamily: '"Tinos", serif'
                    }}
                  >
                    {post.title}
                  </Typography>

                  <Box sx={{ 
                    display: 'flex',
                    alignItems: 'center', 
                    gap: 3,
                    mb: 4,
                    flexWrap: 'wrap'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FontAwesomeIcon icon={faTag} style={{ color: '#666' }} />
                      <Chip 
                        label={post.category}
                        sx={{
                          bgcolor: '#f5f5f5',
                          color: '#666',
                          fontWeight: 500,
                          '&:hover': {
                            bgcolor: '#eeeeee'
                          }
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FontAwesomeIcon icon={faCalendarAlt} style={{ color: '#666' }} />
                      <Typography variant="body2" color="text.secondary">
                        {new Date(post.createDate).toLocaleDateString('vi-VN')}
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
                      '& img': {
                        maxWidth: '100%',
                        height: 'auto',
                        borderRadius: '4px',
                        my: 2
                      },
                      '& p': {
                        lineHeight: 1.7,
                        mb: 2
                      },
                      flexGrow: 1
                    }}
                  />
                </Box>
              )}
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PostDetail;
