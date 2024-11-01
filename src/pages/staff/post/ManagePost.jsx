import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Tabs, Tab, Button, TextField, Select, MenuItem, InputAdornment } from '@mui/material';
import PostsCard from '@components/staff/posts/PostsCard';
import SidebarStaff from '@layouts/SidebarStaff';
import { fetchPosts } from '@hooks/MockPost';
import { fetchProvinces } from '@services/ProvinceService';
import ReactSelect from 'react-select';
import makeAnimated from 'react-select/animated';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Link, useLocation } from 'react-router-dom';
import Helmet from 'react-helmet';

const ManagePost = () => {
  const location = useLocation();
  const currentPage = location.pathname;

  const [posts, setPosts] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [statusTab, setStatusTab] = useState('all');
  const [provinces, setProvinces] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tempSearchTerm, setTempSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedProvinces, setSelectedProvinces] = useState([]);
  const [tempCategories, setTempCategories] = useState([]);
  const [tempProvinces, setTempProvinces] = useState([]);

  const animatedComponents = makeAnimated();

  const categoryOptions = [
    { value: 'am-thuc', label: 'Ẩm thực' },
    { value: 'tin-tuc-du-lich', label: 'Tin tức du lịch' },
    { value: 'noi-luu-tru', label: 'Nơi lưu trú' },
    { value: 'diem-den-du-lich', label: 'Điểm đến du lịch' },
    { value: 'kinh-nghiem-du-lich', label: 'Kinh nghiệm du lịch' },
    { value: 'van-hoa', label: 'Văn hóa' },
    { value: 'hoat-dong-vui-choi', label: 'Hoạt động vui chơi' },
    { value: 'mua-sam-giai-tri', label: 'Mua sắm và giải trí' },
  ];

  useEffect(() => {
    fetchPosts().then((data) => {
      setPosts(data);
    });
    
    // Fetch provinces
    const fetchProvincesData = async () => {
      try {
        const fetchedProvinces = await fetchProvinces();
        setProvinces(fetchedProvinces);
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };
    fetchProvincesData();
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleViewDetails = (postId) => {
    console.log('View details for post:', postId);
  };

  const handleStatusTabChange = (event, newValue) => {
    setStatusTab(newValue);
  };

  const handleSearch = () => {
    setSearchTerm(tempSearchTerm);
  };

  const handleApplyFilter = () => {
    setSelectedCategories(tempCategories);
    setSelectedProvinces(tempProvinces);
  };

  return (
    <Box sx={{ display: 'flex', width: '98vw', minHeight: '100vh' }}>
      <Helmet>
        <title>Manage Posts</title>
      </Helmet>
      <SidebarStaff isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Box sx={{ 
        flexGrow: 1, 
        mt: 1.5,
        p: isSidebarOpen ? 3 : 3, 
        transition: 'margin-left 0.3s', 
        marginLeft: isSidebarOpen ? '280px' : '20px'
      }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ fontSize: '2.7rem', fontWeight: 600, color: 'primary.main' }}> 
              Quản lý bài viết 
            </Typography>
            <Button 
              component={Link} 
              to={`${currentPage}/them`}
              variant="contained" 
              color="primary" 
              startIcon={<AddIcon />} 
              sx={{ height: '55px', borderRadius: 2 }}
            >
              Tạo bài viết mới
            </Button>
          </Grid>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={4.5}>
              <Typography sx={{ fontWeight: 600 }}>
                Danh mục
              </Typography>
              <ReactSelect
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                options={categoryOptions}
                onChange={setTempCategories}
                value={tempCategories}
                placeholder="Chọn danh mục"
              />
            </Grid>

            <Grid item xs={12} md={4.5}>
              <Typography sx={{ fontWeight: 600 }}>
                Tỉnh thành
              </Typography>
              <ReactSelect
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                options={provinces.map(province => ({
                  value: province.provinceId,
                  label: province.provinceName
                }))}
                onChange={setTempProvinces}
                value={tempProvinces}
                placeholder="Chọn tỉnh thành"
              />
            </Grid>

            <Grid item xs={12} md={3} sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <Button
                variant="contained" 
                startIcon={<FilterListIcon />} 
                onClick={handleApplyFilter}
                sx={{
                  backgroundColor: 'lightGray', 
                  color: 'black', 
                  width: '80%',
                  float: 'right',
                  display: 'flex',
                  marginLeft: 'auto'
                }}
              >
                Áp dụng bộ lọc
              </Button>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ my: 0.05 }}>
            <Grid item xs={7} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <TextField variant="outlined" placeholder="Tìm kiếm bài viết..."
                size="small" sx={{ width: '100%', mr: 1 }}
                value={tempSearchTerm} onChange={(e) => setTempSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Button variant="contained" onClick={handleSearch} sx={{ backgroundColor: 'lightGray', color: 'black', minWidth: '7rem' }} >
                Tìm kiếm
              </Button>
            </Grid>

            <Grid item xs={5} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Typography sx={{ fontWeight: 600 }}>
                Sắp xếp theo
              </Typography>
              <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                variant="outlined"
                sx={{ width: '227px', ml: 2, height: '40px' }}
              >
                <MenuItem value="newest">Mới nhất</MenuItem>
                <MenuItem value="oldest">Cũ nhất</MenuItem>
              </Select>
            </Grid>
          </Grid>

          <Grid item xs={12} sx={{ mb: 2 }}>
            <Tabs value={statusTab} onChange={handleStatusTabChange} aria-label="post status tabs">
              <Tab label="Tất cả" value="all" />
              <Tab label="Bản nháp" value="0" />
              <Tab label="Chờ duyệt" value="1" />
              <Tab label="Đã duyệt" value="2" />
              <Tab label="Từ chối" value="3" />
            </Tabs>
          </Grid>

          {posts.length > 0 ? (
            <Grid container spacing={2}>
              {posts.map((post) => (
                <Grid item xs={12} sm={6} md={isSidebarOpen ? 4 : 3} key={post.id}>
                  <PostsCard
                    post={post}
                    onViewDetails={() => handleViewDetails(post.id)}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', width: '100%' }}>
              <Typography variant="h5" sx={{ color: 'text.secondary' }}>
                Không có bài viết nào
              </Typography>
            </Box>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default ManagePost;
