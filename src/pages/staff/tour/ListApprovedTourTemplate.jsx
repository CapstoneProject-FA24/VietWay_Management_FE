import React, { useState, useEffect } from "react";
import SidebarStaff from "@layouts/SidebarStaff";
import { Helmet } from "react-helmet";
import { Box, Grid, Typography, Button, MenuItem, Select, TextField, InputAdornment, Pagination } from '@mui/material';
import ApprovedTourTemplateCard from "@components/staff/ApprovedTourTemplateCard";
import ReactSelect from "react-select";
import makeAnimated from "react-select/animated";
import SearchIcon from "@mui/icons-material/Search";
import { fetchTourTemplates } from '@services/TourTemplateService';
import { fetchProvinces } from '@services/ProvinceService';
import { fetchTourDuration } from '@services/DurationService';
import { fetchTourCategory } from '@services/TourCategoryService';
import FilterListIcon from '@mui/icons-material/FilterList';

const ListApprovedTourTemplate = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [tourCategories, setTourCategories] = useState([]);
  const [tourDurations, setTourDurations] = useState([]);
  const [tourTemplates, setTourTemplates] = useState([]);
  const [sortOrder, setSortOrder] = useState("tourNameA-Z");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedProvinces, setSelectedProvinces] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState([]);
  //const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [tempSearchTerm, setTempSearchTerm] = useState('');
  const [tempCategories, setTempCategories] = useState([]);
  const [tempProvinces, setTempProvinces] = useState([]);
  const [tempDuration, setTempDuration] = useState([]);
  const [sortedTourTemplates, setSortedTourTemplates] = useState([]);

  useEffect(() => {
    fetchData();
  }, [page, pageSize, searchTerm, selectedCategories, selectedProvinces, selectedDuration]);

  useEffect(() => {
    sortTourTemplates();
  }, [tourTemplates, sortOrder]);

  useEffect(() => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    if (!role || !token || role !== 'nhan-vien') { navigate(`/dang-nhap`); }
  }, []);

  const fetchData = async () => {
    try {
      const params = {
        pageSize: pageSize,
        pageIndex: page,
        searchTerm: searchTerm,
        templateCategoryIds: selectedCategories.map(c => c.value),
        durationIds: selectedDuration.map(d => d.value),
        provinceIds: selectedProvinces.map(p => p.value),
        status: 2
      };
      const result = await fetchTourTemplates(params);
      setTourTemplates(result.data);
      setTotalPages(Math.ceil(result.total / pageSize));
    } catch (error) {
      console.error('Error fetching tour templates:', error);
    }
  };

  useEffect(() => {
    const fetchProvincesData = async () => {
      try {
        const fetchedProvinces = await fetchProvinces();
        const duration = await fetchTourDuration();
        const categories = await fetchTourCategory();
        setProvinces(fetchedProvinces);
        setTourCategories(categories);
        setTourDurations(duration);
      } catch (error) {
        console.error('Error fetching provinces:', error);
      }
    };
    fetchProvincesData();
  }, []);

  const categoryOptions = tourCategories.map(category => ({
    value: category.tourCategoryId,
    label: category.tourCategoryName
  }));

  const durationOptions = tourDurations.map(duration => ({
    value: duration.durationId,
    label: duration.durationName
  }));

  const provinceOptions = provinces.map(province => ({
    value: province.provinceId,
    label: province.provinceName
  }));

  const animatedComponents = makeAnimated();

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value));
    setPage(1);
  };

  const handleSearch = () => {
    setSearchTerm(tempSearchTerm);
    setPage(1);
  };

  const handleApplyFilter = () => {
    setSelectedCategories(tempCategories);
    setSelectedProvinces(tempProvinces);
    setSelectedDuration(tempDuration);
    setPage(1);
  };

  const sortTourTemplates = () => {
    const sorted = [...tourTemplates].sort((a, b) => {
      switch (sortOrder) {
        case 'tourNameA-Z':
          return a.tourName.localeCompare(b.tourName);
        case 'tourNameZ-A':
          return b.tourName.localeCompare(a.tourName);
        case 'createdDate':
          return new Date(b.createdDate) - new Date(a.createdDate);
        case 'createdDateReverse':
          return new Date(a.createdDate) - new Date(b.createdDate);
        default:
          return 0;
      }
    });
    setSortedTourTemplates(sorted);
  };

  return (
    <Box sx={{ display: 'flex', width: "98vw", minHeight: "100vh" }}>
      <Helmet>
        <title>Danh sách Tour mẫu đã duyệt</title>
      </Helmet>
      <SidebarStaff
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <Box sx={{ flexGrow: 1, p: 3, transition: 'margin-left 0.3s', marginLeft: isSidebarOpen ? '260px' : '20px', width: isSidebarOpen ? 'calc(100vw - 260px)' : 'calc(100vw - 20px)', overflowX: 'hidden' }}>
        <Grid container spacing={3} sx={{ mb: 3, mt: 2 }}>
          <Grid item xs={12} md={12} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Typography sx={{ fontSize: '2.8rem', fontWeight: 600, color: 'primary.main' }}> Danh sách Tour mẫu đã duyệt </Typography>
          </Grid>
          <Grid item xs={12} md={12}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
              <Box sx={{ width: { xs: '100%', md: '50%' }, mr: 1.5 }}>
                <Typography>
                  Tỉnh/Thành phố
                </Typography>
                <ReactSelect
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  options={provinceOptions}
                  onChange={setTempProvinces}
                  value={tempProvinces}
                />
              </Box>
              <Box sx={{ width: { xs: '100%', md: '50%' }, ml: 1.5 }}>
                <Typography>
                  Thời lượng
                </Typography>
                <ReactSelect closeMenuOnSelect={false} components={animatedComponents}
                  isMulti options={durationOptions} onChange={setTempDuration} value={tempDuration} />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={9.3} sx={{ mb: 1, mt: -2 }}>
            <Typography>
              Loại Tour
            </Typography>
            <ReactSelect closeMenuOnSelect={false} components={animatedComponents}
              isMulti options={categoryOptions} onChange={setTempCategories} value={tempCategories} />
          </Grid>
          <Grid item xs={12} md={2.7} sx={{ mb: 5 }}>
            <Button variant="contained" startIcon={<FilterListIcon />} onClick={handleApplyFilter} sx={{ mt: 1, backgroundColor: 'lightGray', color: 'black', width: '100%' }}>
              Áp dụng bộ lọc
            </Button>
          </Grid>
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                variant="outlined"
                placeholder="Tìm kiếm tour mẫu..."
                size="small"
                sx={{ width: '100%', maxWidth: '400px', mr: 1 }}
                value={tempSearchTerm}
                onChange={(e) => setTempSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Button variant="contained" onClick={handleSearch} sx={{ backgroundColor: 'lightGray', color: 'black' }} >
                Tìm kiếm
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={5} sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Typography>
              Sắp xếp theo
            </Typography>
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              variant="outlined"
              sx={{ width: '200px', ml: 2, height: '40px' }}
            >
              <MenuItem value="tourNameA-Z">Tên A-Z</MenuItem>
              <MenuItem value="tourNameZ-A">Tên Z-A</MenuItem>
              <MenuItem value="createdDate">Mới nhất</MenuItem>
              <MenuItem value="createdDateReverse">Cũ nhất</MenuItem>
            </Select>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          {sortedTourTemplates.map(tourTemplate => (
            <Grid item xs={12} sm={6} md={isSidebarOpen ? 12 : 6} key={tourTemplate.tourTemplateId}>
              <ApprovedTourTemplateCard
                tour={tourTemplate}
                isOpen={isSidebarOpen}
              />
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            sx={{ m: '0 auto' }}
          />
          <Select
            value={pageSize}
            onChange={handlePageSizeChange}
            variant="outlined"
            sx={{ height: '40px' }}
          >
            <MenuItem value={5}>5 / trang</MenuItem>
            <MenuItem value={10}>10 / trang</MenuItem>
            <MenuItem value={20}>20 / trang</MenuItem>
          </Select>
        </Box>
      </Box>
    </Box>
  );
};

export default ListApprovedTourTemplate;
