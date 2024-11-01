import React, { useState, useEffect, useMemo } from "react";
import { Box, Typography, TextField, Button, Select, MenuItem, InputAdornment, FormControl, Grid, Card, CardContent, CardMedia, CardActions } from "@mui/material";
import { mockTours } from "@hooks/MockTour";
import SidebarStaff from "@layouts/SidebarStaff";
import AddIcon from "@mui/icons-material/Add";
import { Link, useNavigate } from "react-router-dom";
import { fetchProvinces } from '@services/ProvinceService';
import ReactSelect from 'react-select';
import makeAnimated from 'react-select/animated';
import { fetchTourCategory } from '@services/TourCategoryService';
import { fetchTourDuration } from '@services/DurationService';
import Helmet from 'react-helmet';
import TourCard from '@components/staff/TourCard';
import { fetchTours } from '@services/TourService';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const ManageTour = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [tours, setTours] = useState(mockTours);
  const [filters, setFilters] = useState({ tourType: [], duration: [], location: [], status: "" });
  const [filteredTours, setFilteredTours] = useState(tours);
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

  useEffect(() => {
    const fetchApprovedTourTemplates = async () => {
      try {
        const fetchedProvinces = await fetchProvinces();
        setProvinces(fetchedProvinces);
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
    const fetchToursData = async (params) => {
      try {
        const fetchedTours = await fetchTours();
        setTours(fetchedTours);
      } catch (error) {
        console.error('Error fetching tours:', error);
      }
    };

    const params = {
      searchTerm: searchTerm,
      searchCode: searchCode,
      tourType: filters.tourType,
      duration: filters.duration,
      location: filters.location,
      status: statusTab === 'all' ? null : parseInt(statusTab),
      startDateFrom: dateRange.from ? dayjs(dateRange.from).format('YYYY-MM-DD') : null,
      startDateTo: dateRange.to ? dayjs(dateRange.to).format('YYYY-MM-DD') : null
    };
    fetchToursData(params);
  }, [searchTerm, searchCode, filters, statusTab, dateRange]);

  useEffect(() => {
    applyFilters();
  }, [filters, searchTerm, tours]);

  const toggleSidebar = () => { setIsOpen(!isOpen); };

  const handleFilterChange = (selectedOptions, filterType) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: selectedOptions ? selectedOptions.map(option => option.value) : []
    }));
  };

  const handleStatusChange = (event) => {
    setFilters((prevFilters) => ({ ...prevFilters, status: event.target.value }));
  };

  const applyFilters = () => {
    let result = tours;

    if (searchTerm) {
      result = result.filter((tour) =>
        tour.tourName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.tourType.length > 0) {
      result = result.filter((tour) => 
        tour.tourCategories.some((category) => filters.tourType.includes(category.tourCategoryId))
      );
    }

    if (filters.duration.length > 0) {
      result = result.filter(tour => 
        filters.duration.includes(tour.tourDuration.tourDurationId)
      );
    }

    if (filters.location.length > 0) {
      result = result.filter((tour) => filters.location.includes(tour.provinceName));
    }

    if (filters.status) {
      result = result.filter((tour) => tour.status === filters.status);
    }

    setFilteredTours(result);
  };

  const animatedComponents = makeAnimated();

  const handleLocationChange = (selectedOptions) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      location: selectedOptions.map(option => option.value)
    }));
  };

  const provinceOptions = provinces.map(province => ({
    value: province.provinceName,
    label: province.provinceName
  }));

  const durationOptions = tourDurations.map(duration => ({
    value: duration.durationId,
    label: duration.durationName
  }));

  const tourTypeOptions = useMemo(() => 
    tourCategories.map(category => ({
      value: category.tourCategoryId,
      label: category.tourCategoryName
    })),
    [tourCategories]
  );

  const handleApplyFilter = () => {
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

  return (
    <Box sx={{ display: 'flex', width: '98vw', minHeight: '100vh' }}>
      <Helmet>
        <title>Quản lý Tour</title>
      </Helmet>
      <SidebarStaff 
        isOpen={isOpen} 
        toggleSidebar={() => setIsOpen(!isOpen)}
      />
      <Box sx={{ flexGrow: 1, mt: 1.5, p: isOpen ? 3 : 3, transition: 'margin-left 0.3s', marginLeft: isOpen ? '280px' : '20px' }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography sx={{ fontSize: '2.7rem', fontWeight: 600, color: 'primary.main' }}> Quản lý tour du lịch </Typography>
          <Button component={Link} to={currentPage + "/tour-mau-duoc-duyet"} variant="contained" color="primary" startIcon={<AddIcon />} sx={{ height: "55px", borderRadius: 2 }}>
            Tạo Tour Mới
          </Button>
        </Box>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Typography>Loại tour</Typography>
              <ReactSelect
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                options={tourTypeOptions}
                onChange={(selectedOptions) => handleFilterChange(selectedOptions, "tourType")}
                value={tourTypeOptions.filter(option => filters.tourType.includes(option.value))}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Typography>Thời lượng</Typography>
              <ReactSelect
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                options={durationOptions}
                onChange={(selectedOptions) => handleFilterChange(selectedOptions, "duration")}
                value={durationOptions.filter(option => filters.duration.includes(option.value))}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Typography>Địa điểm</Typography>
              <ReactSelect
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                options={provinceOptions}
                onChange={handleLocationChange}
                value={filters.location.map(location => ({ value: location, label: location }))}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography>Trạng thái</Typography>
            <FormControl fullWidth>
              <Select value={filters.status} onChange={handleStatusChange}  sx={{ height: '38px' }}>
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="Đang nhận khách">Đang nhận khách</MenuItem>
                <MenuItem value="Đã đầy chỗ">Đã đầy chỗ</MenuItem>
                <MenuItem value="Hoàn thành">Hoàn thành</MenuItem>
                <MenuItem value="Bị Hủy">Bị Hủy</MenuItem>
                <MenuItem value="Đang diễn ra">Đang diễn ra</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{
                  width: { xs: '100%', md: '100%' }, 
                  display: 'flex',
                  flexDirection: 'column', 
                  gap: 1
                }}>
                  <Typography>Ngày khởi hành</Typography>
                  <Box sx={{ display: 'flex', gap: 2, mt: -0.5 }}>
                    <DatePicker
                      label="Từ ngày" 
                      value={tempDateRange.from}
                      onChange={(newValue) => {
                        setTempDateRange(prev => ({ ...prev, from: newValue }));
                      }}
                      sx={{ width: '100%' }} 
                      format="DD/MM/YYYY"
                      slotProps={{ textField: { size: "small", error: false } }}
                    />
                    <DatePicker
                      label="Đến ngày" 
                      value={tempDateRange.to}
                      onChange={(newValue) => { 
                        setTempDateRange(prev => ({ ...prev, to: newValue })); 
                      }}
                      sx={{ width: '100%' }} 
                      format="DD/MM/YYYY"
                      slotProps={{ textField: { size: "small", error: false } }}
                      minDate={tempDateRange.from ? dayjs(tempDateRange.from) : undefined}
                    />
                  </Box>
                </Box>
              </LocalizationProvider>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="contained" 
              startIcon={<FilterListIcon />} 
              onClick={handleApplyFilter}
              sx={{ mt: 3.5, backgroundColor: 'lightGray', color: 'black', width: '12rem' }}
            >
              Áp dụng bộ lọc
            </Button>
          </Grid>

          <Grid item xs={12} sm={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 3.5 }}>
              <Box>
                <TextField
                  variant="outlined"
                  placeholder="Tìm kiếm tour..."
                  size="small"
                  sx={{ mr: 1 }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button variant="contained" sx={{ backgroundColor: 'lightGray', color: 'black' }}>
                  Tìm kiếm
                </Button>
              </Box>

              <Box>
                <TextField
                  variant="outlined"
                  placeholder="Tìm kiếm mã tour..."
                  size="small"
                  sx={{ mr: 1 }}
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button variant="contained" sx={{ backgroundColor: 'lightGray', color: 'black' }}>
                  Tìm kiếm
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Trả về {filteredTours.length} kết quả
        </Typography>

        {filteredTours.length > 0 ? (
          <Grid container spacing={2}>
            {filteredTours.map((tour) => (
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
