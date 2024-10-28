import React, { useState, useEffect, useMemo } from "react";
import { Box, Typography, TextField, Button, Select, MenuItem, Chip, FormControl, Grid, Card, CardContent, CardMedia, CardActions, Pagination } from "@mui/material";
import { mockTours } from "@hooks/MockTour";
import SidebarStaff from "@layouts/SidebarStaff";
import AddIcon from "@mui/icons-material/Add";
import { Link, useNavigate } from "react-router-dom";
import { fetchProvinces } from '@services/ProvinceService';
import ReactSelect from 'react-select';
import makeAnimated from 'react-select/animated';
import { fetchTourCategory } from '@services/TourCategoryService';
import { fetchTourDuration } from '@services/DurationService';

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

  useEffect(() => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    if (!role || !token || role !== 'nhan-vien') { navigate(`/dang-nhap`); }
  }, []);

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
    <Box sx={{ width: "98vw", minHeight: "100vh" }}>
      <SidebarStaff isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <Box sx={{ flexGrow: 1, p: 3, marginLeft: isOpen ? "250px" : 0, transition: "margin-left 0.3s" }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Tour du lịch
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <TextField
            placeholder="Tìm theo tên tour du lịch..."
            variant="outlined"
            sx={{ width: "80%", height: '45px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

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
        </Grid>

        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          Trả về {filteredTours.length} kết quả
        </Typography>

        {currentTours.length > 0 ? (
          <>
            <Grid container spacing={2}>
              {currentTours.map((tour) => (
                <Grid item xs={12} sm={6} md={4} key={tour.tourId}>
                  <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    <CardMedia component="img" height="140" image={tour.images[0].url} alt={tour.tourName} />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="div"> {tour.tourName} </Typography>
                      <Typography variant="body2" color="text.secondary"> Mã tour: {tour.tourId} </Typography>
                      <Typography variant="body2"> Khởi hành: {tour.startDate} </Typography>
                      <Typography variant="body2"> Thời lượng: {tour.duration} </Typography>
                      <Typography variant="body2"> Số chỗ còn nhận: {tour.maxParticipant} </Typography>
                      <Typography variant="h6" color="primary"> {tour.price.adult.toLocaleString()} đ </Typography>
                      <Chip label={tour.status} color={
                        tour.status === "Đang nhận khách"
                          ? "success"
                          : tour.status === "Đã đầy chỗ"
                            ? "warning"
                            : tour.status === "Hoàn thành"
                              ? "info"
                              : tour.status === "Bị Hủy"
                                ? "error"
                                : tour.status === "Đang diễn ra"
                                  ? "primary"
                                  : "default"
                      } size="small" sx={{ mt: 1 }} />
                    </CardContent>
                    <CardActions>
                      {tour.status === "Hoàn thành" && (
                        <Button size="small" color="primary"> Xem đánh giá </Button>
                      )}
                    </CardActions>
                  </Card>
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
          <Typography variant="h6" sx={{ textAlign: "center", mt: 4 }}> Không có kết quả nào </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ManageTour;