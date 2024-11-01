import React, { useState, useEffect, useMemo } from "react";
import { Box, Typography, TextField, Button, Select, MenuItem, InputAdornment, FormControl, Grid, Card, CardContent, CardMedia, CardActions, Pagination } from "@mui/material";
import SidebarManager from "@layouts/SidebarManager";
import { Link, useNavigate } from "react-router-dom";
import { fetchProvinces } from '@services/ProvinceService';
import ReactSelect from 'react-select';
import makeAnimated from 'react-select/animated';
import { fetchTours } from '@services/TourService';
import { fetchTourCategory } from '@services/TourCategoryService';
import { fetchTourDuration } from '@services/DurationService';
import Helmet from 'react-helmet';
import TourCard from '@components/manager/tour/TourCard';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const ManagerManageTour = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [tours, setTours] = useState();
  const [filters, setFilters] = useState({ tourType: [], duration: [], location: [], status: "" });
  const [searchTerm, setSearchTerm] = useState("");
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

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchCode, setSearchCode] = useState("");
  const [statusTab, setStatusTab] = useState("all");
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchToursData = async (params) => {
      try {
        const fetchedTours = await fetchTours();
        setTours(fetchedTours);
        setTotalPages(Math.ceil(fetchedTours.total / pageSize));
      } catch (error) {
        console.error('Error fetching tours:', error);
        // You might want to add error handling here (e.g., showing a snackbar)
      }
    };

    const params = {
      pageSize: pageSize,
      pageIndex: page,
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
  }, [page, pageSize, searchTerm, searchCode, filters, statusTab, dateRange]);

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const fetchedProvinces = await fetchProvinces();
        const categories = await fetchTourCategory();
        const duration = await fetchTourDuration();
        setProvinces(fetchedProvinces);
        setTourCategories(categories);
        setTourDurations(duration);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchFilterData();
  }, []);

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

    if (dateRange.from && dateRange.to) {
      result = result.filter((tour) => {
        const tourDate = dayjs(tour.startDate);
        return tourDate.isAfter(dateRange.from) && tourDate.isBefore(dateRange.to);
      });
    }
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
    // Apply all temporary filters to the actual filter states
    setFilters({
      tourType: tempFilters.tourType,
      duration: tempFilters.duration,
      location: tempFilters.location,
      status: tempFilters.status
    });

    // Apply date range
    setDateRange({
      from: tempDateRange.from,
      to: tempDateRange.to
    });

    setPage(1);
    fetchToursData(/* {
      pageSize: pageSize,
      pageIndex: 1,
      searchTerm: searchTerm,
      searchCode: searchCode,
      tourType: tempFilters.tourType,
      duration: tempFilters.duration,
      location: tempFilters.location,
      status: statusTab === 'all' ? null : parseInt(statusTab),
      startDateFrom: tempDateRange.from ? dayjs(tempDateRange.from).format('YYYY-MM-DD') : null,
      startDateTo: tempDateRange.to ? dayjs(tempDateRange.to).format('YYYY-MM-DD') : null
    } */);
  };

  return (
    <Box sx={{ display: 'flex', width: '98vw', minHeight: '100vh' }}>
      <Helmet>
        <title>Quản lý Tour</title>
      </Helmet>
      <SidebarManager isOpen={isOpen} toggleSidebar={() => setIsOpen(!isOpen)} />
      <Box sx={{ flexGrow: 1, mt: 1.5, p: isOpen ? 3 : 3, transition: 'margin-left 0.3s', marginLeft: isOpen ? '280px' : '20px' }}>
        <Grid item xs={12} md={9} sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
          <Typography sx={{ fontSize: '2.7rem', fontWeight: 600, color: 'primary.main' }}> Quản lý tour du lịch </Typography>
        </Grid>

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
              <Select value={filters.status} onChange={handleStatusChange} sx={{ height: '38px' }}>
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
                  width: { xs: '100%', md: '100%' }, display: 'flex',
                  flexDirection: 'column', gap: 1
                }}>
                  <Typography>Ngày khởi hành</Typography>
                  <Box sx={{ display: 'flex', gap: 2, mt: -0.5 }}>
                    <DatePicker
                      label="Từ ngày" value={tempDateRange.from}
                      onChange={(newValue) => {
                        setTempDateRange(prev => ({ ...prev, from: newValue }));
                      }}
                      sx={{ width: '100%' }} format="DD/MM/YYYY"
                      slotProps={{ textField: { size: "small", error: false } }}
                    />
                    <DatePicker
                      label="Đến ngày" value={tempDateRange.to}
                      onChange={(newValue) => { setTempDateRange(prev => ({ ...prev, to: newValue })); }}
                      sx={{ width: '100%' }} format="DD/MM/YYYY"
                      slotProps={{ textField: { size: "small", error: false } }}
                      minDate={tempDateRange.from ? dayjs(tempDateRange.from) : undefined}
                    />
                  </Box>
                </Box>
              </LocalizationProvider>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" startIcon={<FilterListIcon />} onClick={handleApplyFilter} sx={{ mt: 3.5, backgroundColor: 'lightGray', color: 'black', width: '12rem' }}>
              Áp dụng bộ lọc
            </Button>
          </Grid>

          <Grid item xs={12} sm={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 3.5 }}>
              <Box>
                <TextField
                  variant="outlined"
                  placeholder="Tìm kiếm tour mẫu..."
                  size="small"
                  sx={{ mr: 1 }}
                  value={searchTerm}
                  onChange={(e) => setTempSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button variant="contained" sx={{ backgroundColor: 'lightGray', color: 'black' }} >
                  Tìm kiếm
                </Button>
              </Box>

              <Box>
                <TextField
                  variant="outlined"
                  placeholder="Tìm kiếm tour mẫu..."
                  size="small"
                  sx={{ mr: 1 }}
                  value={searchTerm}
                  onChange={(e) => setTempSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button variant="contained" sx={{ backgroundColor: 'lightGray', color: 'black' }} >
                  Tìm kiếm
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>


        {tours ? (
          <>
            <Grid container spacing={2}>
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

export default ManagerManageTour;