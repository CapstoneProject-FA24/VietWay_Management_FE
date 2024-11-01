import React, { useState, useEffect, useMemo } from "react";
import { Box, Typography, TextField, Button, Select, MenuItem, Chip, FormControl, Grid, Card, CardContent, CardMedia, CardActions, Pagination, InputAdornment, Tabs, Tab } from "@mui/material";
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
import SearchIcon from '@mui/icons-material/Search';

const ManageTour = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [tours, setTours] = useState(mockTours);
  const [filters, setFilters] = useState({ tourType: [], duration: [], location: [], status: "" });
  const [filteredTours, setFilteredTours] = useState(tours);
  const [page, setPage] = useState(1);
  const [toursPerPage] = useState(9);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const currentPage = location.pathname;

  const [provinces, setProvinces] = useState([]);
  const [tourCategories, setTourCategories] = useState([]);
  const [tourDurations, setTourDurations] = useState([]);

  const [sortOrder, setSortOrder] = useState('newest');

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
    setPage(1);
  };

  const indexOfLastTour = page * toursPerPage;
  const indexOfFirstTour = indexOfLastTour - toursPerPage;
  const currentTours = filteredTours.slice(indexOfFirstTour, indexOfLastTour);

  const handleChangePage = (event, value) => {
    setPage(value);
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

  return (
    <Box sx={{ display: 'flex', width: '98vw', minHeight: '100vh' }}>
      <Helmet>
        <title>Quản lý Tour</title>
      </Helmet>
      <SidebarStaff isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <Box sx={{ flexGrow: 1, mt: 1.5, p: isOpen ? 3 : 3, transition: 'margin-left 0.3s', marginLeft: isOpen ? '280px' : '20px' }}>
        <Grid container spacing={2}>
          {/* Title and Create Button Row */}
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ fontSize: '2.7rem', fontWeight: 600, color: 'primary.main' }}> 
              Quản lý tour du lịch 
            </Typography>
            <Button 
              component={Link} 
              to={currentPage + "/tour-mau-duoc-duyet"} 
              variant="contained" 
              startIcon={<AddIcon />}
              sx={{ height: '55px', borderRadius: 2 }}
            >
              Tạo Tour Mới
            </Button>
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <FormControl sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 600, mb: 1 }}>Loại tour</Typography>
              <ReactSelect
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                options={tourTypeOptions}
                onChange={(selectedOptions) => handleFilterChange(selectedOptions, "tourType")}
                value={tourTypeOptions.filter(option => filters.tourType.includes(option.value))}
              />
            </FormControl>

            <FormControl sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 600, mb: 1 }}>Thời lượng</Typography>
              <ReactSelect
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                options={durationOptions}
                onChange={(selectedOptions) => handleFilterChange(selectedOptions, "duration")}
                value={durationOptions.filter(option => filters.duration.includes(option.value))}
              />
            </FormControl>

            <FormControl sx={{ flex: 1 }}>
              <Typography sx={{ fontWeight: 600, mb: 1 }}>Địa điểm</Typography>
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

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
              <TextField 
                variant="outlined" 
                placeholder="Tìm kiếm tour..."
                size="small" 
                sx={{ width: '550px' }}
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
              <Button 
                variant="contained" 
                onClick={applyFilters} 
                sx={{ backgroundColor: 'lightGray', color: 'black', minWidth: '7rem' }}
              >
                Tìm kiếm
              </Button>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography sx={{ fontWeight: 600 }}>Sắp xếp theo</Typography>
              <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                variant="outlined"
                sx={{ width: '260px', height: '40px' }}
              >
                <MenuItem value="newest">Mới nhất</MenuItem>
                <MenuItem value="oldest">Cũ nhất</MenuItem>
              </Select>
            </Box>
          </Grid>

          <Grid item xs={12} sx={{ mb: 2 }}>
            <Tabs
              value={filters.status}
              onChange={(e, newValue) => handleStatusChange({ target: { value: newValue } })}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Tất cả" value="" />
              <Tab label="Đang nhận khách" value="Đang nhận khách" />
              <Tab label="Đã đầy chỗ" value="Đã đầy chỗ" />
              <Tab label="Hoàn thành" value="Hoàn thành" />
              <Tab label="Bị Hủy" value="Bị Hủy" />
              <Tab label="Đang diễn ra" value="Đang diễn ra" />
            </Tabs>
          </Grid>

          {/* Tour Cards */}
          <Grid item xs={12}>
            {currentTours.length > 0 ? (
              <>
                <Grid container spacing={2}>
                  {currentTours.map((tour) => (
                    <Grid item xs={12} sm={6} md={4} key={tour.tourId}>
                      <TourCard tour={tour} onViewDetails={() => {
                        console.log('View details for tour:', tour.tourId);
                      }}
                      />
                    </Grid>
                  ))}
                </Grid>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={Math.ceil(filteredTours.length / toursPerPage)}
                    page={page}
                    onChange={handleChangePage}
                    color="primary"
                  />
                </Box>
              </>
            ) : (
              <Typography variant="h6" sx={{ textAlign: "center", mt: 4 }}>
                Không có kết quả nào
              </Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ManageTour;
