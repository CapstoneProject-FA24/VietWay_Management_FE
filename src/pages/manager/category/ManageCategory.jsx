import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, TextField, Button, Grid, Paper } from '@mui/material';
import SidebarManager from '@layouts/SidebarManager';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { Helmet } from 'react-helmet';
import CreateCategory from '@components/manager/category/CreateCategory';
import DeleteCategory from '@components/manager/category/DeleteCategory';
import TourDuration from '@components/manager/category/TourDuration';
import TourCategory from '@components/manager/category/TourCategory';
import PostCategory from '@components/manager/category/PostCategory';
import EventCategory from '@components/manager/category/EventCategory';
import AttractionCategory from '@components/manager/category/AttractionCategory';

const ManageCategory = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const tabs = [
    { label: 'Loại Tour', endpoint: 'tour-categories' },
    { label: 'Loại Điểm Du Lịch', endpoint: 'attraction-types' },
    { label: 'Loại Bài Viết', endpoint: 'post-categories' },
    { label: 'Loại Sự Kiện', endpoint: 'event-categories' },
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
  };

  const handleOpenCreate = () => {
    setOpenCreate(true);
  };

  const handleOpenDelete = (category) => {
    setSelectedCategory(category);
    setOpenDelete(true);
  };

  const renderContent = () => {
    if (activeTab === 0) { // Tour Category tab
      return <TourCategory onDelete={handleOpenDelete} />;
    }
    if (activeTab === 1) { // Attraction Type tab
      return <AttractionCategory onDelete={handleOpenDelete} />;
    }
    if (activeTab === 2) { // Post Category tab
      return <PostCategory onDelete={handleOpenDelete} />;
    }
    if (activeTab === 3) { // Event Category tab
      return <EventCategory onDelete={handleOpenDelete} />;
    }
    if (activeTab === 4) { // Tour Duration tab
      return <TourDuration onDelete={handleOpenDelete} />;
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
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreate}
          >
            Thêm mới
          </Button>
        </Box>

        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
        </Tabs>

        <Box sx={{ mb: 2 }}>
          <TextField
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1 }} />
            }}
          />
        </Box>

        {renderContent()}
      </Box>

      <CreateCategory
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSuccess={() => {
          setOpenCreate(false);
          fetchCategories();
        }}
        categoryType={tabs[activeTab].endpoint}
        isTourDuration={activeTab === 4}
      />

      <DeleteCategory
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onSuccess={() => {
          setOpenDelete(false);
          fetchCategories();
        }}
        category={selectedCategory}
        categoryType={tabs[activeTab].endpoint}
      />
    </Box>
  );
};

export default ManageCategory;