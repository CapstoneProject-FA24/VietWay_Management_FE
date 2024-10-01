import React, { useState, useEffect } from "react";
import axios from "axios";
import SidebarStaff from "@layouts/SidebarStaff";
import { Helmet } from "react-helmet";
import {
  Box,
  Grid,
  Typography,
  Button,
  MenuItem,
  Select,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
} from "@mui/material";
import {
  mockTourTemplateCategories,
  mockProvinces,
  mockTourStatus,
} from "@hooks/MockTourTemplate";
import TourTemplateCard from "@components/staff/TourTemplateCard";
import ReactSelect from "react-select";
import makeAnimated from "react-select/animated";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { Link, useLocation } from "react-router-dom";

const ListApprovedTourTemplate = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [tourTemplates, setTourTemplates] = useState([]);
  const [filteredTourTemplates, setFilteredTourTemplates] = useState([]);
  const [sortOrder, setSortOrder] = useState("name");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedProvinces, setSelectedProvinces] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState([]);
  const [statusTab] = useState("all");
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const location = useLocation();
  const currentPage = location.pathname;

  const fetchApprovedTourTemplates = async () => {
    try {
      const response = await axios.get(
        `https://vietwayapi-e7dqcdgef5e2dxgn.southeastasia-01.azurewebsites.net/api/TourTemplate?pageSize=${pageSize}&pageIndex=${pageIndex}`
      );
      if (response.data.statusCode === 200) {
        const approvedTemplates = response.data.data.items.filter(
          (template) => template.status === 2
        );
        setTourTemplates(approvedTemplates);
        setFilteredTourTemplates(approvedTemplates);
        setTotalItems(approvedTemplates.length);
      }
    } catch (error) {
      console.error("Error fetching approved tour templates:", error);
    }
  };

  useEffect(() => {
    fetchApprovedTourTemplates();
  }, [pageSize, pageIndex]);

  useEffect(() => {
    filterAndSortTourTemplates();
  }, [
    searchTerm,
    sortOrder,
    selectedCategories,
    selectedProvinces,
    selectedDuration,
    tourTemplates,
    statusTab,
  ]);

  const filterAndSortTourTemplates = () => {
    let filtered = [...tourTemplates]; // Đã chỉ chứa các template có status = 2

    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.tourName.toLowerCase().includes(searchTermLower) ||
          t.code.toLowerCase().includes(searchTermLower)
      );
    }
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((t) =>
        selectedCategories.some((c) => c.value === t.tourCategoryId)
      );
    }
    if (selectedProvinces.length > 0) {
      filtered = filtered.filter((t) =>
        selectedProvinces.some((p) => t.provinces.includes(p.value))
      );
    }
    if (selectedDuration.length > 0) {
      filtered = filtered.filter((t) =>
        selectedDuration.some((p) => p.value === t.duration)
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      if (sortOrder === "name") {
        return a.tourName.localeCompare(b.tourName);
      } else if (sortOrder === "date") {
        return new Date(b.createdDate) - new Date(a.createdDate);
      }
      return 0;
    });

    setFilteredTourTemplates(filtered);
  };

  const categoryOptions = mockTourTemplateCategories.map((category) => ({
    value: category.CategoryName,
    label: category.CategoryName,
  }));

  const durationOptions = Array.from(
    new Set(tourTemplates.map((t) => t.Duration))
  ).map((duration) => ({
    value: duration,
    label: duration,
  }));

  const provinceOptions = mockProvinces.map((province) => ({
    value: province.ProvinceName,
    label: province.ProvinceName,
  }));

  const animatedComponents = makeAnimated();

  return (
    <Box sx={{ width: "98vw", minHeight: "100vh" }}>
      <Helmet>
        <title>Danh sách Tour mẫu đã duyệt | VietWay</title>
      </Helmet>
      <SidebarStaff
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          transition: "margin-left 0.3s",
          marginLeft: isSidebarOpen ? "260px" : "20px",
        }}
      >
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={8}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              <Box sx={{ flexGrow: 1, minWidth: "200px" }}>
                <Typography sx={{ mb: 1 }}>Tỉnh/Thành phố</Typography>
                <ReactSelect
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  options={provinceOptions}
                  onChange={setSelectedProvinces}
                />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: "200px" }}>
                <Typography sx={{ mb: 1 }}>Thời lượng</Typography>
                <ReactSelect
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  options={durationOptions}
                  onChange={setSelectedDuration}
                />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: "200px" }}>
                <Typography sx={{ mb: 1 }}>Loại Tour</Typography>
                <ReactSelect
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  options={categoryOptions}
                  onChange={setSelectedCategories}
                />
              </Box>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
          </Grid>
          <Grid item xs={12} md={8}>
            <TextField
              variant="outlined"
              placeholder="Tìm kiếm tour mẫu..."
              size="small"
              fullWidth
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
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <Typography sx={{ mr: 2 }}>Sắp xếp theo</Typography>
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              variant="outlined"
              sx={{ minWidth: "150px" }}
            >
              <MenuItem value="name">Tên A-Z</MenuItem>
              <MenuItem value="date">Ngày cập nhật</MenuItem>
            </Select>
          </Grid>
        </Grid>
        <Grid container spacing={2} sx={{ minHeight: "15.2rem" }}>
          {filteredTourTemplates.map((tourTemplate) => (
            <Grid
              item
              xs={isSidebarOpen ? 12 : 6}
              key={tourTemplate.TourTemplateId}
            >
              <TourTemplateCard tour={tourTemplate} isOpen={isSidebarOpen} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ListApprovedTourTemplate;
