import React, { useState, useEffect, useMemo } from "react";
import { Box, Typography, TextField, Button, Select, MenuItem, InputAdornment, FormControl, Grid } from "@mui/material";
import SidebarStaff from "@layouts/SidebarStaff";
import AddIcon from "@mui/icons-material/Add";
import { Link, useNavigate } from "react-router-dom";
import { fetchProvinces } from '@services/ProvinceService';
import ReactSelect from 'react-select';
import makeAnimated from 'react-select/animated';
import { fetchTourCategory } from '@services/TourCategoryService';
import { fetchTourDuration } from '@services/DurationService';
import Helmet from 'react-helmet';
import TourCard from '@components/tour/TourCard';
import { fetchTours } from '@services/TourService';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { TourStatus } from "@hooks/Statuses";
import { getTourStatusInfo } from "@services/StatusService";
import { Tabs, Tab } from "@mui/material";
import Pagination from '@mui/material/Pagination';

const ManageTour = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [tours, setTours] = useState([]);
  const [filters, setFilters] = useState({ tourType: [], duration: [], location: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const currentPage = location.pathname;

  const [provinces, setProvinces] = useState([]);
  const [tourCategories, setTourCategories] = useState([]);
  const [tourDurations, setTourDurations] = useState([]);

  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [tempDateRange, setTempDateRange] = useState({ from: null, to: null });
  const [tempFilters, setTempFilters] = useState({
    tourType: [],
    duration: [],
    location: [],
    status: ''
  });
  const [searchCode, setSearchCode] = useState("");
  const [statusTab, setStatusTab] = useState("all");

  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 9,
    total: 0
  });

  const [tempSearchTerm, setTempSearchTerm] = useState("");
  const [tempSearchCode, setTempSearchCode] = useState("");

  const handleSearchByName = () => {
    setPagination(prev => ({
      ...prev,
      pageIndex: 1
    }));
    setSearchTerm(tempSearchTerm);
  };

  const handleSearchByCode = () => {
    setPagination(prev => ({
      ...prev,
      pageIndex: 1
    }));
    setSearchCode(tempSearchCode);
  };

  const handleKeyPress = (event, searchType) => {
    if (event.key === 'Enter') {
      if (searchType === 'name') {
        handleSearchByName();
      } else if (searchType === 'code') {
        handleSearchByCode();
      }
    }
  };

  useEffect(() => {
    const fetchApprovedTourTemplates = async () => {
      try {
        const fetchedProvinces = await fetchProvinces({ pageSize: 63, pageIndex: 1 });
        setProvinces(fetchedProvinces.items);
      } catch (error) {
        console.error('Error fetching tour templates:', error);
      }
    };
    fetchApprovedTourTemplates();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await fetchTourCategory();
        const duration = await fetchTourDuration();
        setTourCategories(categories);
        setTourDurations(duration);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchToursData = async () => {
      try {
        const params = {
          pageSize: pagination.pageSize,
          pageIndex: pagination.pageIndex,
          searchTerm: searchTerm,
          searchCodeTerm: searchCode,
          templateCategoryIds: filters.tourType,
          durationIds: filters.duration,
          provinceIds: filters.location,
          status: statusTab === 'all' ? null : parseInt(statusTab),
          startDateFrom: dateRange.from ? dayjs(dateRange.from).format('YYYY-MM-DD') : null,
          startDateTo: dateRange.to ? dayjs(dateRange.to).format('YYYY-MM-DD') : null
        };

        const response = await fetchTours({ params });
        setTours(response.data);
        setPagination(prev => ({
          ...prev,
          total: response.total
        }));
      } catch (error) {
        console.error('Error fetching tours:', error);
      }
    };

    fetchToursData();
  }, [
    searchTerm, 
    searchCode, 
    filters, 
    statusTab, 
    dateRange, 
    pagination.pageIndex, 
    pagination.pageSize
  ]);

  const animatedComponents = makeAnimated();

  const provinceOptions = provinces.map(province => ({
    value: province.provinceId,
    label: province.provinceName
  }));

  const durationOptions = tourDurations.map(duration => ({
    value: duration.durationId,
    label: duration.durationName
  }));

  const tourTypeOptions = tourCategories.map(category => ({
    value: category.tourCategoryId,
      label: category.tourCategoryName
  }));

  const handleTempFilterChange = (selectedOptions, filterType) => {
    setTempFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: selectedOptions ? selectedOptions.map(option => option.value) : []
    }));
  };

  const handleTempLocationChange = (selectedOptions) => {
    setTempFilters(prevFilters => ({
      ...prevFilters,
      location: selectedOptions.map(option => option.value)
    }));
  };

  const handleApplyFilter = () => {
    setPagination(prev => ({
      ...prev,
      pageIndex: 1
    }));
    
    setFilters({
      tourType: tempFilters.tourType,
      duration: tempFilters.duration,
      location: tempFilters.location,
      status: tempFilters.status
    });
    setDateRange({
      from: tempDateRange.from,
      to: tempDateRange.to
    });
  };

  const handleStatusTabChange = (event, newValue) => {
    setStatusTab(newValue);
  };

  const handlePageChange = (event, newPage) => {
    setPagination(prev => ({
      ...prev,
      pageIndex: newPage + 1
    }));
  };

  const handlePageSizeChange = (event) => {
    setPagination(prev => ({
      ...prev,
      pageSize: parseInt(event.target.value, 10),
      pageIndex: 1
    }));
  };

  return (
    <Box sx={{ display: 'flex', width: '98vw', minHeight: '100vh' }}>
      <Helmet>
        <title>Quản lý Tour</title>
      </Helmet>
      <SidebarStaff isOpen={isOpen} toggleSidebar={() => setIsOpen(!isOpen)} />
      <Box sx={{ flexGrow: 1, mt: 1.5, p: isOpen ? 3 : 3, transition: 'margin-left 0.3s', marginLeft: isOpen ? '280px' : '20px' }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography sx={{ fontSize: '2.7rem', fontWeight: 600, color: 'primary.main' }}> Quản lý tour du lịch </Typography>
          <Button component={Link} to={currentPage + "/tour-mau-duoc-duyet"} variant="contained" color="primary" startIcon={<AddIcon />} sx={{ height: "55px", borderRadius: 2 }}>
            Tạo Tour Mới
          </Button>
        </Box>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <Typography sx={{ fontWeight: 600 }}>Loại tour</Typography>
              <ReactSelect closeMenuOnSelect={false} components={animatedComponents} isMulti options={tourTypeOptions} onChange={(selectedOptions) => handleTempFilterChange(selectedOptions, "tourType")} value={tourTypeOptions.filter(option => tempFilters.tourType.includes(option.value))} />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <Typography sx={{ fontWeight: 600 }}>Thời lượng</Typography>
              <ReactSelect closeMenuOnSelect={false} components={animatedComponents} isMulti options={durationOptions} onChange={(selectedOptions) => handleTempFilterChange(selectedOptions, "duration")} value={durationOptions.filter(option => tempFilters.duration.includes(option.value))} />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <Typography sx={{ fontWeight: 600 }}>Địa điểm</Typography>
              <ReactSelect closeMenuOnSelect={false} components={animatedComponents} isMulti options={provinceOptions} onChange={(selectedOptions) => handleTempFilterChange(selectedOptions, "location")} value={provinceOptions.filter(option => tempFilters.location.includes(option.value))} />
            </FormControl>
          </Grid>

          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ width: { xs: '100%', md: '100%' }, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography sx={{ fontWeight: 600 }}>Ngày khởi hành</Typography>
                  <Box sx={{ display: 'flex', gap: 2, mt: -0.5 }}>
                    <DatePicker label="Từ ngày" value={tempDateRange.from} onChange={(newValue) => { setTempDateRange(prev => ({ ...prev, from: newValue })); }} sx={{ width: '100%' }} format="DD/MM/YYYY" slotProps={{ textField: { size: "small", error: false } }} />
                    <DatePicker label="Đến ngày" value={tempDateRange.to} onChange={(newValue) => { setTempDateRange(prev => ({ ...prev, to: newValue })); }} sx={{ width: '100%' }} format="DD/MM/YYYY" slotProps={{ textField: { size: "small", error: false } }} />
                  </Box>
                </Box>
              </LocalizationProvider>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" startIcon={<FilterListIcon />} onClick={handleApplyFilter} sx={{ mt: 3.5, backgroundColor: 'lightGray', color: 'black', width: '12rem' }}>
              Áp dụng bộ lọc
            </Button>
          </Grid>

          <Grid item xs={12} sm={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 3.5 }}>
              <Box sx={{ display: 'flex', width: '50%' }}>
                <TextField variant="outlined" placeholder="Tìm kiếm tour theo tên..." size="small" sx={{ mr: 1, width: '70%' }}
                  value={tempSearchTerm} onChange={(e) => setTempSearchTerm(e.target.value)} onKeyPress={(e) => handleKeyPress(e, 'name')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />

                <Button variant="contained" onClick={handleSearchByName} sx={{ backgroundColor: 'lightGray', color: 'black', minWidth: 'fit-content' }}>
                  Tìm kiếm
                </Button>
              </Box>

              <Box sx={{ display: 'flex', width: '50%' }}>
                <TextField variant="outlined" placeholder="Tìm kiếm tour theo mã tour..." size="small" sx={{ mr: 1, width: '70%' }} value={tempSearchCode} onChange={(e) => setTempSearchCode(e.target.value)} onKeyPress={(e) => handleKeyPress(e, 'code')} InputProps={{ startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                />
                <Button variant="contained" onClick={handleSearchByCode} sx={{ backgroundColor: 'lightGray', color: 'black', minWidth: 'fit-content' }}>
                  Tìm kiếm
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Tabs 
          value={statusTab}
          onChange={handleStatusTabChange}
          aria-label="tour status tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Tất cả" value="all" />
          {Object.entries(TourStatus).map(([key, value]) => (
            <Tab 
              key={value}
              label={getTourStatusInfo(value).text}
              value={value.toString()}
            />
          ))}
        </Tabs>

        {tours.length > 0 ? (
          <>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {tours.map((tour) => (
                <Grid item xs={12} sm={6} md={4} key={tour.tourId}>
                  <TourCard 
                    tour={tour}
                    onViewDetails={() => {
                      console.log('View details for tour:', tour.tourId);
                    }}
                  />
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
                  value={pagination.pageSize}
                  size="small"
                  sx={{ minWidth: 80 }}
                  onChange={(e) => {
                    setPagination(prev => ({
                      ...prev,
                      pageSize: parseInt(e.target.value, 10),
                      pageIndex: 1
                    }));
                  }}
                >
                  <MenuItem value={9}>9</MenuItem>
                  <MenuItem value={18}>18</MenuItem>
                  <MenuItem value={27}>27</MenuItem>
                </Select>
                <Typography>/trang</Typography>
              </Box>
            </Box>
          </>
        ) : (
          <Typography variant="h6" sx={{ textAlign: "center", mt: 4 }}>
            Không có kết quả nào
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ManageTour;
