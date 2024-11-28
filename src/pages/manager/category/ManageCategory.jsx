import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, TextField, Button, Grid, Paper } from '@mui/material';
import SidebarManager from '@layouts/SidebarManager';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { Helmet } from 'react-helmet';
import CreateCategory from '@components/manager/category/CreateCategory';
import TourDuration from '@components/manager/category/TourDuration';
import TourCategory from '@components/manager/category/TourCategory';
import PostCategory from '@components/manager/category/PostCategory';
import AttractionCategory from '@components/manager/category/AttractionCategory';

const ManageCategory = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [lastCreatedType, setLastCreatedType] = useState(null);
  const [searchTerms, setSearchTerms] = useState({
    'tour-categories': '',
    'attraction-types': '',
    'post-categories': '',
    'tour-durations': ''
  });
  const [appliedSearches, setAppliedSearches] = useState({
    'tour-categories': '',
    'attraction-types': '',
    'post-categories': '',
    'tour-durations': ''
  });

  const tabs = [
    { label: 'Loại Tour', endpoint: 'tour-categories' },
    { label: 'Loại Điểm Du Lịch', endpoint: 'attraction-types' },
    { label: 'Loại Bài Viết', endpoint: 'post-categories' },
    { label: 'Thời Lượng Tour', endpoint: 'tour-durations' }
  ];

  useEffect(() => {
    fetchCategories();
  }, [activeTab]);

  const fetchCategories = async () => {
    try {
      // Implement API call based on active tab
      const endpoint = tabs[activeTab].endpoint;
      // const response = await fetchCategoryByType(endpoint);
      // setCategories(response);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setSearchTerm('');
    setLastCreatedType(null);
  };

  const handleOpenCreate = () => {
    setOpenCreate(true);
  };

  const handleOpenDelete = (category) => {
    setSelectedCategory(category);
    setOpenDelete(true);
  };

  const handleSearch = () => {
    const currentEndpoint = tabs[activeTab].endpoint;
    console.log(`Searching in ${currentEndpoint} with term: ${searchTerm}`);
    setAppliedSearches(prev => ({
      ...prev,
      [currentEndpoint]: searchTerm
    }));
  };

  const handleCreateSuccess = () => {
    setOpenCreate(false);
    setSearchTerm('');
    setAppliedSearch('');
    setLastCreatedType(tabs[activeTab].endpoint);
    setRefreshTrigger(prev => prev + 1);
  };

  const renderContent = () => {
    const currentEndpoint = tabs[activeTab].endpoint;
    
    if (activeTab === 0) {
      return <TourCategory 
        searchTerm={appliedSearches['tour-categories']} 
        refreshTrigger={lastCreatedType === 'tour-categories' ? refreshTrigger : 0} 
      />;
    }
    if (activeTab === 1) {
      return <AttractionCategory 
        searchTerm={appliedSearches['attraction-types']} 
        refreshTrigger={lastCreatedType === 'attraction-types' ? refreshTrigger : 0} 
      />;
    }
    if (activeTab === 2) {
      return <PostCategory 
        searchTerm={appliedSearches['post-categories']} 
        refreshTrigger={lastCreatedType === 'post-categories' ? refreshTrigger : 0}
      />;
    }
    if (activeTab === 3) {
      return <TourDuration 
        searchTerm={appliedSearches['tour-durations']} 
        refreshTrigger={lastCreatedType === 'tour-durations' ? refreshTrigger : 0} 
      />;
    }

    return (
      <Grid container spacing={2}>
        {categories.map((category) => (
          <Grid item xs={12} md={6} key={category.id}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <Box>
                  <Typography variant="h6">{category.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {category.description}
                  </Typography>
                  {activeTab === 4 && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Số ngày: {category.days}
                    </Typography>
                  )}
                </Box>
                <Button
                  startIcon={<DeleteIcon />}
                  color="error"
                  onClick={() => handleOpenDelete(category)}
                >
                  Xóa
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    );
  };

  useEffect(() => {
    const currentEndpoint = tabs[activeTab].endpoint;
    setSearchTerm(searchTerms[currentEndpoint] || '');
  }, [activeTab]);

  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setSearchTerms(prev => ({
      ...prev,
      [tabs[activeTab].endpoint]: newSearchTerm
    }));
  };

  return (
    <Box sx={{ display: 'flex', width: '98vw', minHeight: '100vh' }}>
      <Helmet>
        <title>Quản lý danh mục</title>
      </Helmet>
      <SidebarManager isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <Box sx={{ flexGrow: 1, mt: 1.5, p: 3, marginLeft: isSidebarOpen ? '280px' : '20px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography sx={{ fontSize: '2.7rem', fontWeight: 600, color: 'primary.main' }}>
            Quản lý Danh mục
          </Typography>
        </Box>

        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              placeholder="Tìm kiếm..."
              value={searchTerm}
              onChange={handleSearchChange}
              size="small"
              sx={{ minWidth: '500px' }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1 }} />
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              sx={{ minWidth: '100px' }}
            >
              Tìm kiếm
            </Button>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
          >
            Thêm mới
          </Button>
        </Box>
        {renderContent()}
      </Box>
      
      <CreateCategory
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSuccess={handleCreateSuccess}
        categoryType={tabs[activeTab].endpoint}
        isTourDuration={activeTab === 3}
      />
    </Box>
  );
};

export default ManageCategory;