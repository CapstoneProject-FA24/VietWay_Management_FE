import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Select, MenuItem, Chip, InputLabel, FormControl, Grid, Card, CardContent, CardMedia, CardActions, Pagination } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { mockTours } from "@hooks/MockTour";
import SidebarStaff from "@layouts/SidebarStaff";
import AddIcon from "@mui/icons-material/Add";
import { Link, useLocation } from "react-router-dom";
import CloseIcon from '@mui/icons-material/Close';
import { fetchProvinces } from '@services/ProvinceService';
import ReactSelect from 'react-select';
import makeAnimated from 'react-select/animated';

const ManageTour = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [tours, setTours] = useState(mockTours);
  const [filters, setFilters] = useState({ tourType: [], duration: [], location: [], status: "" });

  const [filteredTours, setFilteredTours] = useState(tours);
  const [page, setPage] = useState(1);
  const [toursPerPage] = useState(9);

  const currentPage = location.pathname;

  const [provinces, setProvinces] = useState([]);

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

  const toggleSidebar = () => { setIsOpen(!isOpen); };

  const handleFilterChange = (selectedOptions, filterType) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: selectedOptions ? selectedOptions.map(option => option.value) : []
    }));
  };

  const handleStatusChange = (event) => {
    setFilters((prevFilters) => ({ ...prevFilters, status: event.target.value }));
  };

  const applyFilters = () => { let result = tours;

    if (filters.tourType.length > 0) {
      result = result.filter((tour) => tour.tourType.some((type) => filters.tourType.includes(type)));
    }

    if (filters.duration.length > 0) {
      result = result.filter((tour) => filters.duration.includes(tour.duration));
    }

    if (filters.location.length > 0) {
      result = result.filter((tour) => filters.location.includes(tour.provinceName));
    }

    if (filters.status) {
      result = result.filter((tour) => tour.status === filters.status);
    }

    setFilteredTours(result);
  };

  const clearFilter = (filterType) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterType]: filterType === "status" ? "" : [] }));
  };

  const handleDeleteChip = (filterType, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: prevFilters[filterType].filter(item => item !== value)
    }));
  };

  const handleDelete = (chipToDelete) => () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [chipToDelete.filterType]: prevFilters[chipToDelete.filterType].filter(
        (chip) => chip !== chipToDelete.value
      ),
    }));
  };

  useEffect(() => { applyFilters(); }, [filters]);

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

  // Prepare options for ReactSelect components
  const tourTypeOptions = [...new Set(tours.flatMap(tour => tour.tourType))].map(type => ({ value: type, label: type }));
  const durationOptions = [...new Set(tours.map(tour => tour.duration))].map(duration => ({ value: duration, label: duration }));

  return (
    <Box sx={{ width: "98vw", minHeight: "100vh" }}>
      <SidebarStaff isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <Box sx={{ flexGrow: 1, p: 3, marginLeft: isOpen ? "250px" : 0, transition: "margin-left 0.3s" }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Tour du lịch
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <TextField placeholder="Tìm theo tên tour du lịch..." variant="outlined" sx={{ width: "80%" }} />

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
              <Typography>Thời Lượng</Typography>
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
                options={provinces.map(province => ({ value: province.provinceName, label: province.provinceName }))}
                onChange={handleLocationChange}
                value={filters.location.map(location => ({ value: location, label: location }))}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select value={filters.status} onChange={handleStatusChange}>
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