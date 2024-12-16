import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Tabs, Tab, Button, TextField, Select, MenuItem, InputAdornment, Pagination } from '@mui/material';
import PostsCard from '@components/post/PostsCard';
import SidebarStaff from '@layouts/SidebarStaff';
import { fetchPosts } from '@services/PostService';
import { fetchProvinces } from '@services/ProvinceService';
import ReactSelect from 'react-select';
import makeAnimated from 'react-select/animated';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Link, useLocation } from 'react-router-dom';
import Helmet from 'react-helmet';
import { fetchPostCategory } from '@services/PostCategoryService';

const ManagePost = () => {
  const location = useLocation();
  const currentPage = location.pathname;

  const [posts, setPosts] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [statusTab, setStatusTab] = useState('0');
  const [provinces, setProvinces] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tempSearchTerm, setTempSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedProvinces, setSelectedProvinces] = useState([]);
  const [tempCategories, setTempCategories] = useState([]);
  const [tempProvinces, setTempProvinces] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 12,
    total: 0
  });
  const [categoryOptions, setCategoryOptions] = useState([]);

  const animatedComponents = makeAnimated();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await fetchPostCategory();
        const formattedCategories = categories.map(cat => ({
          value: cat.postCategoryId,
          label: cat.name
        }));
        setCategoryOptions(formattedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const params = {
          pageSize: pagination.pageSize,
          pageIndex: pagination.pageIndex,
          searchTerm: searchTerm,
          postCategoryIds: selectedCategories.map(cat => cat.value),
          provinceIds: selectedProvinces.map(prov => prov.value),
          statuses: statusTab == "all" ? [0, 1, 2, 3] : [parseInt(statusTab)]
        };

        const response = await fetchPosts(params);
        setPosts(response.data);
        setPagination(prev => ({
          ...prev,
          total: response.total
        }));
      } catch (error) {
        console.error('Error loading posts:', error);
      }
    };

    loadPosts();
  }, [pagination.pageIndex, pagination.pageSize, searchTerm, selectedCategories, selectedProvinces, statusTab]);

  // Fetch provinces
  const fetchProvincesData = async () => {
    try {
      const fetchedProvinces = await fetchProvinces({ pageSize: 63, pageIndex: 1 });
      setProvinces(fetchedProvinces.items);
    } catch (error) {
      console.error('Error fetching provinces:', error);
    }
  };
  fetchProvincesData();

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

  const handleShareToSocial = (platform, post) => {
    const url = encodeURIComponent(window.location.origin + '/posts/' + post.id);
    const text = encodeURIComponent(post.title);
    
    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
    }
  };

  return (
    <Box sx={{ display: 'flex', width: '98vw', minHeight: '100vh' }}>
      <Helmet>
        <title>Quản lý bài viết</title>
      </Helmet>
      <SidebarStaff isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Box sx={{ flexGrow: 1, mt: 1.5, p: 5, transition: 'margin-left 0.3s', marginLeft: isSidebarOpen ? '280px' : '20px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ fontSize: '2.7rem', fontWeight: 600, color: 'primary.main' }}>Quản lý bài viết</Typography>
            <Button component={Link} to={`${currentPage}/them`} variant="contained" color="primary" startIcon={<AddIcon />} sx={{ height: '55px', borderRadius: 2 }}>
              Tạo bài viết mới
            </Button>
          </Grid>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={4.5}>
              <Typography sx={{ fontWeight: 600 }}>
                Danh mục
              </Typography>
              <ReactSelect closeMenuOnSelect={false} components={animatedComponents} isMulti options={categoryOptions} onChange={(selectedOptions) => setTempCategories(selectedOptions)} value={tempCategories} placeholder="Chọn danh mục" />
            </Grid>

            <Grid item xs={12} md={4.5}>
              <Typography sx={{ fontWeight: 600 }}>
                Tỉnh thành
              </Typography>
              <ReactSelect closeMenuOnSelect={false} components={animatedComponents} isMulti options={provinces.map(province => ({ value: province.provinceId, label: province.provinceName }))} onChange={setTempProvinces} value={tempProvinces} placeholder="Chọn tỉnh thành" />
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
              {/* <Tab label="Tất cả" value="all" /> */}
              <Tab label="Bản nháp" value="0" />
              <Tab label="Chờ duyệt" value="1" />
              <Tab label="Đã duyệt" value="2" />
              <Tab label="Từ chối" value="3" />
              <Tab label="Tất cả" value="all" />
            </Tabs>
          </Grid>

          {posts.length > 0 ? (
            <>
              <Grid container spacing={2}>
                {posts.map((post) => (
                  <Grid item xs={12} sm={6} md={isSidebarOpen ? 4 : 3} key={post.id}>
                    <PostsCard post={post} />
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, width: '100%' }}>
                <Box sx={{ width: '10%' }}/>
                <Pagination
                  count={Math.ceil(pagination.total / pagination.pageSize)}
                  page={pagination.pageIndex}
                  onChange={(e, newPage) => setPagination(prev => ({ ...prev, pageIndex: newPage }))}
                  color="primary"
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Select
                    value={pagination.pageSize} size="small" sx={{ minWidth: 80 }}
                    onChange={(e) => { setPagination(prev => ({ ...prev, pageSize: e.target.value, pageIndex: 1 })); }}
                  >
                    <MenuItem value={12}>12</MenuItem>
                    <MenuItem value={24}>24</MenuItem>
                    <MenuItem value={48}>48</MenuItem>
                  </Select>
                  <Typography>/trang</Typography>
                </Box>
              </Box>
            </>
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
