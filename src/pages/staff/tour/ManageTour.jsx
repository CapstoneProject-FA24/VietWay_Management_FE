import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button,
  Select,
  MenuItem,
  Chip,
  InputLabel,
  FormControl,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { mockTours } from "@hooks/MockTour";
import SidebarStaff from "@layouts/SidebarStaff";
import AddIcon from "@mui/icons-material/Add";
import { Link, useLocation } from "react-router-dom";
const currentPage = location.pathname;

const ManageTour = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [tours, setTours] = useState(mockTours);
  const [filters, setFilters] = useState({
    tourType: [],
    duration: [],
    location: [],
    status: "",
  });

  const [filteredTours, setFilteredTours] = useState(tours);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleFilterChange = (event, filterType) => {
    const { value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: Array.isArray(value) ? value : [value],
    }));
  };

  const handleStatusChange = (event) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      status: event.target.value,
    }));
  };

  const applyFilters = () => {
    let result = tours;

    if (filters.tourType.length > 0) {
      result = result.filter((tour) =>
        tour.tourType.some((type) => filters.tourType.includes(type))
      );
    }

    if (filters.duration.length > 0) {
      result = result.filter((tour) =>
        filters.duration.includes(tour.duration)
      );
    }

    if (filters.location.length > 0) {
      result = result.filter((tour) =>
        filters.location.includes(tour.provinceName)
      );
    }

    if (filters.status) {
      result = result.filter((tour) => tour.status === filters.status);
    }

    setFilteredTours(result);
  };

  const clearFilter = (filterType) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: filterType === "status" ? "" : [],
    }));
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  return (
    <Box sx={{ width: "98vw", minHeight: "100vh" }}>
      <SidebarStaff isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <Box
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: isOpen ? "250px" : 0,
          transition: "margin-left 0.3s",
        }}
      >
        <Typography variant="h4" sx={{ mb: 3 }}>
          Tour du lịch
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <TextField
            placeholder="Tìm theo tên tour du lịch..."
            variant="outlined"
            sx={{ width: "80%" }}
          />
          
          <Button
              component={Link}
              to={currentPage + "/tour-mau-duoc-duyet"}
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              sx={{ height: "55px", borderRadius: 2 }}
            >
            Tạo Tour Mới
          </Button>
        </Box>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Loại tour</InputLabel>
              <Select
                multiple
                value={filters.tourType}
                onChange={(e) => handleFilterChange(e, "tourType")}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value="Du lịch văn hóa">Du lịch văn hóa</MenuItem>
                <MenuItem value="Tìm hiểu làng nghề">
                  Tìm hiểu làng nghề
                </MenuItem>
                <MenuItem value="Du lịch sinh thái">Du lịch sinh thái</MenuItem>
                <MenuItem value="Du lịch nghỉ dưỡng">
                  Du lịch nghỉ dưỡng
                </MenuItem>
              </Select>
              {filters.tourType.length > 0 && (
                <Button
                  onClick={() => clearFilter("tourType")}
                  startIcon={<ClearIcon />}
                >
                  Clear
                </Button>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Thời Lượng</InputLabel>
              <Select
                multiple
                value={filters.duration}
                onChange={(e) => handleFilterChange(e, "duration")}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value="Trong ngày">Trong ngày</MenuItem>
                <MenuItem value="2N1Đ">2 ngày 1 đêm</MenuItem>
                <MenuItem value="3N2Đ">3 ngày 2 đêm</MenuItem>
                <MenuItem value="4N3Đ">4 ngày 3 đêm</MenuItem>
                <MenuItem value="5N4Đ">5 ngày 4 đêm</MenuItem>
              </Select>
              {filters.duration.length > 0 && (
                <Button
                  onClick={() => clearFilter("duration")}
                  startIcon={<ClearIcon />}
                >
                  Clear
                </Button>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Địa điểm</InputLabel>
              <Select
                multiple
                value={filters.location}
                onChange={(e) => handleFilterChange(e, "location")}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value="TP HCM">TP HCM</MenuItem>
                <MenuItem value="Bình Dương">Bình Dương</MenuItem>
                <MenuItem value="Quảng Ninh">Quảng Ninh</MenuItem>
                <MenuItem value="Kiên Giang">Kiên Giang</MenuItem>
                <MenuItem value="Lào Cai">Lào Cai</MenuItem>
                <MenuItem value="Quảng Nam">Quảng Nam</MenuItem>
                <MenuItem value="Khánh Hòa">Khánh Hòa</MenuItem>
              </Select>
              {filters.location.length > 0 && (
                <Button
                  onClick={() => clearFilter("location")}
                  startIcon={<ClearIcon />}
                >
                  Clear
                </Button>
              )}
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

        {filteredTours.length > 0 ? (
          <Grid container spacing={2}>
            {filteredTours.map((tour) => (
              <Grid item xs={12} sm={6} md={4} key={tour.tourId}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={tour.images[0].url}
                    alt={tour.tourName}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div">
                      {tour.tourName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Mã tour: {tour.tourId}
                    </Typography>
                    <Typography variant="body2">
                      Khởi hành: {tour.startDate}
                    </Typography>
                    <Typography variant="body2">
                      Thời lượng: {tour.duration}
                    </Typography>
                    <Typography variant="body2">
                      Số chỗ còn nhận: {tour.maxParticipant}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {tour.price.adult.toLocaleString()} đ
                    </Typography>
                    <Chip
                      label={tour.status}
                      color={
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
                      }
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                  <CardActions>
                    {tour.status === "Hoàn thành" && (
                      <Button size="small" color="primary">
                        Xem đánh giá
                      </Button>
                    )}
                  </CardActions>
                </Card>
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
