import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Chip, Button, Divider, TextField, Select, MenuItem, CardMedia } from '@mui/material';
import { ArrowBack, Edit, Delete, Save, Send, LocationOn } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faTag, faMapLocation } from '@fortawesome/free-solid-svg-icons';
import SidebarStaff from '@layouts/SidebarStaff';
import { fetchPostById } from '@hooks/MockPost';
import { getStatusColor } from '@services/StatusService';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editablePost, setEditablePost] = useState(null);

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

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleEditPost = () => {
    setIsEditMode(true);
  };

  const handleSaveChanges = async () => {
    try {
      // Update the post with the new data
      console.log('Saving changes:', editablePost);
      setIsEditMode(false);
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleFieldChange = (field, value) => {
    setEditablePost((prev) => ({
      ...prev,
      [field]: value,
    }));
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
            >
              Xóa
            </Button>
            <Button
              variant="contained"
              color="success"
              startIcon={<Send />}
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
            >
              Xóa
            </Button>
          </Box>
        );
      case '3':
        return (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Save />}
            >
              Lưu nháp
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
          marginLeft: isSidebarOpen ? '280px' : '20px'
        }}>
          <Box maxWidth="100vw">
            <Paper elevation={2} sx={{ p: 3, mb: 3, height: '100%' }}>
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
                  <Box sx={{ mb: 2, flexGrow: 1 }}>
                    <Typography variant="subtitle1">Ảnh</Typography>
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
                    <Button variant="contained" component="label" sx={{ mt: 2 }}>
                      Thay đổi ảnh
                      <input
                        type="file"
                        hidden
                        onChange={(e) =>
                          handleFieldChange('image', e.target.files[0])
                        }
                      />
                    </Button>
                  </Box>
                  <TextField
                    label="Nội dung"
                    value={editablePost.content}
                    onChange={(e) => handleFieldChange('content', e.target.value)}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={8}
                    sx={{ mb: 2, flexGrow: 1 }}
                  />
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography sx={{ color: '#05073C', fontWeight: 600, minWidth: '6.5rem' }}>
                      Tỉnh/Thành phố:
                    </Typography>
                    <Select
                      value={editablePost.provinceId}
                      onChange={(e) =>
                        handleFieldChange('provinceId', e.target.value)
                      }
                      variant="outlined"
                      fullWidth
                    >
                      <MenuItem value="1">Hà Nội</MenuItem>
                      <MenuItem value="2">Lâm Đồng</MenuItem>
                      <MenuItem value="3">Lào Cai</MenuItem>
                      <MenuItem value="4">Sơn La</MenuItem>
                      <MenuItem value="5">Kiên Giang</MenuItem>
                      <MenuItem value="6">Bà Rịa - Vũng Tàu</MenuItem>
                    </Select>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
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
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 'auto' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Save />}
                      onClick={handleSaveChanges}
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
                        width: 'fit-content',
                        height: 'fit-content',
                        objectFit: 'cover',
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
